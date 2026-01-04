import { db } from '@/lib/db';
import { disputes, disputeEvidence, slices, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
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

    // 3. Update Dispute with Verdict
    await db.update(disputes)
        .set({
            aiVerdict: councilVerdict,
            status: councilVerdict.consensus === 'split_decision' || councilVerdict.consensus === 'appealed'
                ? 'appealed'
                : 'analyzing' // Ready for confirmation
        })
        .where(eq(disputes.id, disputeId));

    return councilVerdict;
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
            finalRuling: `Admin Ruled: ${adminDecision}`,
            resolvedAt: new Date()
        })
        .where(eq(disputes.id, disputeId));

    // 2. Punish Loser (Aura Drop)
    await awardAura(loserId, 'DISPUTE_LOST');

    // 3. Execute Funds (Mock)
    // if (adminDecision === 'refund') ... call stripeRefund ...
}
