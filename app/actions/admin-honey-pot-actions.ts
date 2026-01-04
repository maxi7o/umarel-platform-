'use server'

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users, slices, disputes, disputeEvidence, requests } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { triggerJuryProtocol } from '@/lib/services/dispute-service';

export async function createHoneyPot(
    title: string,
    description: string,
    evidenceUrl: string,
    correctVerdict: 'resolved_release' | 'resolved_refund'
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Check Admin
    const dbUser = await db.query.users.findFirst({ where: eq(users.id, user.id) });
    if (dbUser?.role !== 'admin') throw new Error("Unauthorized: Admin Only");

    // 0. Create Fake Audit Request (Container)
    const [request] = await db.insert(requests).values({
        userId: user.id,
        title: `AUDIT CONTAINER: ${title}`,
        description: "System generated audit container.",
        status: 'completed'
    }).returning();

    // 1. Create Fake Slice
    const [slice] = await db.insert(slices).values({
        requestId: request.id,
        creatorId: user.id, // Admin owns it
        title: `[AUDIT] ${title}`,
        description: description,
        status: 'disputed', // Immediately disputed
        estimatedEffort: '1 day',
        assignedProviderId: user.id // Admin is also provider for simplicity
    }).returning();

    // 2. Create Dispute
    const [dispute] = await db.insert(disputes).values({
        sliceId: slice.id,
        initiatorId: user.id,
        reason: "Quality Control Audit Case",
        status: 'jury_deliberation',
        juryStatus: 'selecting',
        isHoneyPot: true,
        correctVerdict: correctVerdict
    }).returning();

    // 3. Add Evidence
    await db.insert(disputeEvidence).values({
        disputeId: dispute.id,
        uploaderId: user.id,
        mediaUrl: evidenceUrl,
        description: "Audit Evidence"
    });

    // 4. Trigger Jury (Selects jurors and sets them to pending)
    await triggerJuryProtocol(dispute.id);

    return { success: true, disputeId: dispute.id };
}
