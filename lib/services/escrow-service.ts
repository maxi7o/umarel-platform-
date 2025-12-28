
import { db } from '@/lib/db';
import { escrowPayments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getPaymentStrategy } from '@/lib/payments/factory';

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

    async updateStatusByEscrowId(escrowId: string, status: EscrowStatus, paymentId?: string) {
        await db.update(escrowPayments)
            .set({
                status: status,
                ...(paymentId ? { mercadoPagoPaymentId: paymentId } : {}),
                ...(status === 'in_escrow' ? { createdAt: new Date() } : {}),
                ...(status === 'released' ? { releasedAt: new Date() } : {}),
                ...(status === 'refunded' ? { refundedAt: new Date() } : {})
            })
            .where(eq(escrowPayments.id, escrowId));

        console.log(`[EscrowService] Escrow ${escrowId} updated to ${status} (Payment ID: ${paymentId || 'N/A'})`);
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
        // 1. Get the payment record to find the Transaction ID
        const paymentRecord = await db.query.escrowPayments.findFirst({
            where: eq(escrowPayments.id, escrowId)
        });

        if (!paymentRecord) throw new Error('Escrow payment not found');

        // 2. Process Refund if applicable
        if (resolution === 'refund') {
            if (paymentRecord.paymentMethod === 'mercado_pago' && paymentRecord.mercadoPagoPaymentId) {
                const strategy = getPaymentStrategy({ provider: 'mercadopago' });
                await strategy.refund(paymentRecord.mercadoPagoPaymentId);
            }
            // Add Stripe logic here when needed
        }

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
