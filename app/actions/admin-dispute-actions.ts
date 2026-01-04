'use server'

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { disputes, slices, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { finalizeDispute } from '@/lib/services/dispute-service';
import { revalidatePath } from 'next/cache';

export async function overrideDispute(disputeId: string, decision: 'release' | 'refund', reason: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // 1. Admin Verification
    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.id)
    });

    if (!dbUser || dbUser.role !== 'admin') {
        throw new Error("Access Denied: Supreme Court access requires Admin role.");
    }

    // 2. Fetch Context to determine Loser
    const dispute = await db.query.disputes.findFirst({
        where: eq(disputes.id, disputeId),
        with: {
            slice: true
        }
    });

    if (!dispute) throw new Error("Dispute not found");

    const clientId = dispute.slice.creatorId;
    const providerId = dispute.slice.assignedProviderId;

    if (!providerId) throw new Error("Provider ID missing, cannot determine parties.");

    let loserId = '';
    if (decision === 'release') {
        // Funds released to Provider -> Client lost
        loserId = clientId;
    } else {
        // Funds refunded to Client -> Provider lost
        loserId = providerId;
    }

    // 3. Execute
    await finalizeDispute(disputeId, decision, loserId);

    // 4. Log Admin Reason (Append to finalRuling)
    await db.update(disputes)
        .set({ finalRuling: `SUPREME COURT OVERRIDE by ${user.email}: ${decision.toUpperCase()}. Reason: ${reason}` })
        .where(eq(disputes.id, disputeId));

    revalidatePath(`/admin/disputes/${disputeId}`);
    revalidatePath(`/disputes/${disputeId}`);

    return { success: true };
}
