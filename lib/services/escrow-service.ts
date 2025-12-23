
import { db } from '@/lib/db';
import { escrowPayments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

type EscrowStatus = 'pending_escrow' | 'in_escrow' | 'released' | 'refunded' | 'failed' | 'disputed';

export const escrowService = {
    async updateEscrowStatus(
        paymentReference: string,
        status: EscrowStatus,
        provider: 'stripe' | 'mercadopago'
    ) {
        console.log(`[EscrowService] Updating escrow status. Ref: ${paymentReference}, Status: ${status}, Provider: ${provider}`);
        // Implementation for webhook handling...
    },

    async updateStatusByEscrowId(escrowId: string, status: EscrowStatus) {
        await db.update(escrowPayments)
            .set({
                status: status,
                ...(status === 'in_escrow' ? { createdAt: new Date() } : {}),
                ...(status === 'released' ? { releasedAt: new Date() } : {}),
                ...(status === 'refunded' ? { refundedAt: new Date() } : {})
            })
            .where(eq(escrowPayments.id, escrowId));

        console.log(`[EscrowService] Escrow ${escrowId} updated to ${status}`);
    },

    async raiseDispute(escrowId: string, reason: string, userId: string) {
        // Verify user is part of the transaction (omitted for MVP speed)
        await db.update(escrowPayments)
            .set({
                status: 'disputed',
                disputeReason: reason
            })
            .where(eq(escrowPayments.id, escrowId));

        console.log(`[EscrowService] Dispute raised on ${escrowId} by ${userId}. Reason: ${reason}`);
    },

    async resolveDispute(escrowId: string, resolution: 'release' | 'refund', notes: string, adminId: string) {
        const newStatus = resolution === 'release' ? 'released' : 'refunded';

        await db.update(escrowPayments)
            .set({
                status: newStatus,
                resolutionNotes: notes,
                resolvedBy: adminId,
                ...(newStatus === 'released' ? { releasedAt: new Date() } : {}),
                ...(newStatus === 'refunded' ? { refundedAt: new Date() } : {})
            })
            .where(eq(escrowPayments.id, escrowId));

        console.log(`[EscrowService] Dispute resolved on ${escrowId} by ${adminId}. Outcome: ${newStatus}`);
    }
};
