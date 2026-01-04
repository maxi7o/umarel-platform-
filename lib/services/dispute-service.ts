import { db } from '@/lib/db';
import { disputes, disputeEvidence, disputeJurors, slices, users } from '@/lib/db/schema';
import { eq, ne, and, sql } from 'drizzle-orm';
import { awardAura } from '@/lib/aura/actions';
import { judgeDisputeParallel } from '@/lib/ai/judge';

export async function createDispute(
    sliceId: string,
    initiatorId: string,
    reason: string
) {
    // 1. Economic Barrier (Spam Prevention)
    // Deduct 50 Aura immediately. If they are right, we could refund this via 'DISPUTE_WON' later (optional)
    await awardAura(initiatorId, 'DISPUTE_FEE');

    // 2. Create Dispute Record
    const [dispute] = await db.insert(disputes).values({
        sliceId,
        initiatorId,
        reason,
        status: 'evidence_submission',
    }).returning();

    // 3. Update Slice Status to freeze funds
    await db.update(slices)
        .set({ status: 'disputed' })
        .where(eq(slices.id, sliceId));

    return dispute;
}

export async function triggerJuryProtocol(disputeId: string) {
    // 1. Fetch Dispute details to exclude involved parties
    const dispute = await db.query.disputes.findFirst({
        where: eq(disputes.id, disputeId),
        with: {
            slice: true
        }
    });

    if (!dispute) throw new Error("Dispute not found");

    const participants = [dispute.initiatorId, dispute.slice.creatorId];
    if (dispute.slice.assignedProviderId) participants.push(dispute.slice.assignedProviderId);

    // 2. Select 3 Jurors (High Aura Preferred, Mock: Random for now)
    // In production: where(gt(users.auraPoints, 1000))
    const jurors = await db.select()
        .from(users)
        .where(
            and(
                ne(users.id, participants[0]),
                // sql`id NOT IN ${participants}` // Simplified for demo
            )
        )
        .orderBy(sql`RANDOM()`)
        .limit(3);

    // 3. Assign Jurors
    if (jurors.length > 0) {
        await db.insert(disputeJurors).values(
            jurors.map(juror => ({
                disputeId,
                userId: juror.id,
                status: 'pending'
            }))
        );

        // 4. Update Dispute Status
        await db.update(disputes)
            .set({
                status: 'jury_deliberation',
                juryStatus: 'voting'
            })
            .where(eq(disputes.id, disputeId));

        console.log(`Jury summoned for dispute ${disputeId}. Jurors: ${jurors.map(j => j.id).join(', ')}`);
    } else {
        console.warn("Not enough jurors found. Keeping dispute in appeal.");
    }
}

export async function submitEvidenceAndJudge(
    disputeId: string,
    uploaderId: string,
    mediaUrl: string,
    contractData: any // In real app, fetch from contracts table
) {
    // 1. Save Evidence
    await db.insert(disputeEvidence).values({
        disputeId,
        uploaderId,
        mediaUrl
    });

    // 2. Trigger AI Council
    // Fetch all evidence for this dispute
    const allEvidence = await db.query.disputeEvidence.findMany({
        where: eq(disputeEvidence.disputeId, disputeId)
    });

    // Run Judgment
    const councilVerdict = await judgeDisputeParallel(
        contractData,
        allEvidence.map(e => ({ url: e.mediaUrl, type: 'image' })),
        ['User Precedent 1', 'User Precedent 2'] // Fetch these from DB in real implementation
    );

    const isAppealed = councilVerdict.consensus === 'split_decision' || councilVerdict.consensus === 'appealed';

    // 3. Update Dispute with Verdict
    await db.update(disputes)
        .set({
            aiVerdict: councilVerdict,
            status: isAppealed ? 'appealed' : 'analyzing'
        })
        .where(eq(disputes.id, disputeId));

    // 4. If Appealed, Trigger Jury
    if (isAppealed) {
        await triggerJuryProtocol(disputeId);
    }

    return councilVerdict;
}

export async function recordJuryVote(
    disputeId: string,
    userId: string,
    vote: 'resolved_release' | 'resolved_refund',
    reason: string
) {
    // 0. Fetch Context
    const dispute = await db.query.disputes.findFirst({
        where: eq(disputes.id, disputeId)
    });

    if (!dispute) throw new Error("Dispute not found");

    // HONEY POT AUDIT LOGIC
    if (dispute.isHoneyPot) {
        const isCorrect = vote === dispute.correctVerdict;

        // Audit Result: Immediate Impact
        if (isCorrect) {
            await awardAura(userId, 'AUDIT_SUCCESS'); // Rewarded 50
        } else {
            // MAJOR PENALTY
            await awardAura(userId, 'DISPUTE_LOST');  // Penalized 500
        }

        // Record vote but DO NOT finalize the dispute (it's fake)
        await db.update(disputeJurors)
            .set({
                vote,
                reason,
                status: 'voted',
                votedAt: new Date(),
                rewardDistributed: true // Audit handled immediately
            })
            .where(and(eq(disputeJurors.disputeId, disputeId), eq(disputeJurors.userId, userId)));

        return; // EXIT HONEY POT
    }

    // 1. Record Normal Vote
    await db.update(disputeJurors)
        .set({
            vote,
            reason,
            status: 'voted',
            votedAt: new Date()
        })
        .where(and(eq(disputeJurors.disputeId, disputeId), eq(disputeJurors.userId, userId)));

    // 2. Check if Consensus Reached
    const votes = await db.query.disputeJurors.findMany({
        where: eq(disputeJurors.disputeId, disputeId),
        with: { user: true }
    });

    const votedCount = votes.filter(v => v.status === 'voted').length;
    const required = votes.length; // Usually 3

    if (votedCount === required) {
        // Tally Votes with Weighting
        let releaseScore = 0;
        let refundScore = 0;

        for (const v of votes) {
            if (v.status !== 'voted') continue;

            const weight = getJurorWeight(v.user.auraLevel);

            if (v.vote === 'resolved_release') releaseScore += weight;
            if (v.vote === 'resolved_refund') refundScore += weight;
        }

        const winner = releaseScore > refundScore ? 'release' : 'refund';

        // Finalize
        await finalizeDispute(
            disputeId,
            winner,
            winner === 'release' ? 'client' : 'provider' // Simplified loser logic
        );

        // Distribute Rewards to Majority Jurors
        // (Simplified: Everyone who voted with majority gets paid)
        const majorityVote = winner === 'release' ? 'resolved_release' : 'resolved_refund';
        for (const v of votes) {
            if (v.vote === majorityVote && !v.rewardDistributed) {
                await awardAura(v.userId, 'JURY_DUTY');
                await db.update(disputeJurors).set({ rewardDistributed: true }).where(eq(disputeJurors.id, v.id));
            }
        }
    }
}

export async function finalizeDispute(
    disputeId: string,
    adminDecision: 'release' | 'refund' | 'partial',
    loserId: string // The user who was wrong
) {
    // 1. Close Dispute
    await db.update(disputes)
        .set({
            status: adminDecision === 'release' ? 'resolved_release' : 'resolved_refund', // map correctly
            finalRuling: `Ruled by Jury/Admin: ${adminDecision}`,
            resolvedAt: new Date()
        })
        .where(eq(disputes.id, disputeId));

    // 2. Punish Loser (Aura Drop)
    // NOTE: Need to verify if loserId is correct ID before calling
    if (loserId && loserId !== 'system') {
        await awardAura(loserId, 'DISPUTE_LOST');
    }

    // 3. Execute Funds (Mock)
    // if (adminDecision === 'refund') ... call stripeRefund ...
}

function getJurorWeight(level: string | null): number {
    switch (level) {
        case 'diamond': return 10;
        case 'gold': return 5;
        case 'silver': return 2;
        default: return 1;
    }
}
