
import { PaymentStrategy } from './strategy';

export class MockPaymentAdapter implements PaymentStrategy {
    async createEscrow(sliceId: string, amountCents: number, currency: string, payerId: string, payeeId: string, escrowId: string) {
        console.log(`[MockPayment] Creating Escrow: ${amountCents} ${currency} for Slice ${sliceId}`);
        // Return a mock transaction ID and a redirect to our mock success handler
        const txId = `mock_tx_${Date.now()}`;
        return {
            transactionId: txId,
            status: 'pending_escrow',
            redirectUrl: `/api/mock/payment-success?sliceId=${sliceId}&txId=${txId}`
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
