
export interface PaymentStrategy {
    /**
     * Creates a payment intent or escrow hold for a specific slice.
     * Returns a transaction ID and optionally a redirect URL(for providers like Mercado Pago).
     */
    createEscrow(sliceId: string, amountCents: number, currency: string, payerId: string, payeeId: string): Promise<{ transactionId: string, status: string, redirectUrl?: string, clientSecret?: string }>;

    /**
     * Releases funds held in escrow to the provider.
     */
    releaseFunds(transactionId: string): Promise<{ success: boolean, releasedAt: Date }>;

    /**
     * Refunds the payer.
     */
    refund(transactionId: string): Promise<{ success: boolean, refundedAt: Date }>;
}
