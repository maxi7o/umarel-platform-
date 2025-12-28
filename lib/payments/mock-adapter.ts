
import { PaymentStrategy } from './strategy';

export class MockPaymentAdapter implements PaymentStrategy {
    async createEscrow(sliceId: string, amountCents: number, currency: string, payerId: string, payeeId: string) {
        console.log(`[MockPayment] Creating Escrow: ${amountCents} ${currency} for Slice ${sliceId}`);
        return {
            transactionId: `mock_tx_${Date.now()}`,
            status: 'pending_escrow'
        };
    }

    async releaseFunds(transactionId: string) {
        console.log(`[MockPayment] Releasing Funds for TX: ${transactionId}`);
        return {
            success: true,
            releasedAt: new Date()
        };
    }

    async refund(transactionId: string, amount?: number) {
        console.log(`[MockPayment] Refunding TX: ${transactionId}, Amount: ${amount || 'Full'}`);
        return {
            success: true,
            refundedAt: new Date()
        };
    }
}
