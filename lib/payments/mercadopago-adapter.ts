import { PaymentStrategy } from './strategy';
import { preference, payment } from '@/lib/mercadopago';

export class MercadoPagoAdapter implements PaymentStrategy {
    async createEscrow(sliceId: string, amountCents: number, currency: string, payerId: string, payeeId: string) {
        console.log(`[MercadoPagoAdapter] Creating Preference for Slice ${sliceId}`);

        try {
            const result = await preference.create({
                body: {
                    items: [
                        {
                            id: sliceId,
                            title: `Service Slice: ${sliceId}`, // In real app, fetch title
                            quantity: 1,
                            unit_price: amountCents / 100, // MP uses float for currency
                            currency_id: currency, // ARS, BRL, etc.
                        }
                    ],
                    payer: {
                        // In real app, we'd map our user ID to an email or customer ID
                        email: 'test_user_123@test.com'
                    },
                    external_reference: sliceId,
                    metadata: {
                        payee_id: payeeId,
                        payer_id: payerId
                    },
                    // MARKETPLACE SPLIT PAYMENT CONFIGURATION
                    // This ensures only the commission hits the Platform's account.
                    // The rest goes to the content creator (provider).
                    marketplace_fee: amountCents * 0.15 / 100, // 15% Fee
                    notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
                    back_urls: {
                        success: `${process.env.NEXT_PUBLIC_APP_URL}/requests/success`,
                        failure: `${process.env.NEXT_PUBLIC_APP_URL}/requests/failure`,
                        pending: `${process.env.NEXT_PUBLIC_APP_URL}/requests/pending`
                    },
                    auto_return: "approved"
                }
            });

            return {
                transactionId: result.id!,
                status: 'pending_escrow',
                redirectUrl: result.init_point // URL to redirect user to MP checkout
            };
        } catch (error) {
            console.error('[MercadoPagoAdapter] Error creating preference', error);
            throw new Error('Failed to create Mercado Pago preference');
        }
    }

    async releaseFunds(transactionId: string) {
        console.log(`[MercadoPagoAdapter] Release Funds (No-op/Log for MVP): ${transactionId}`);
        // MP Standard Checkout handles capture automatically usually.
        // For distinct "Escrow", we'd need MP Connect "Marketplace" flow which is complex.
        // For this MVP, we assume if the payment is "approved", it's released.
        return {
            success: true,
            releasedAt: new Date()
        };
    }

    async refund(transactionId: string) {
        console.log(`[MercadoPagoAdapter] refunding payment associated with preference: ${transactionId}`);
        // To refund, we actually need the PAYMENT ID, not the PREFERENCE ID.
        // In a real flow, we would have stored the payment ID from the webhook.
        // For now, we mock success.
        return {
            success: true,
            refundedAt: new Date()
        };
    }
}
