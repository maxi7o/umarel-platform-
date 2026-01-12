import { PaymentStrategy } from './strategy';
import { preference as defaultPreference, payment } from '@/lib/mercadopago';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { db } from '@/lib/db';
import { userWallets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export class MercadoPagoAdapter implements PaymentStrategy {
    async createEscrow(sliceId: string, amountCents: number, currency: string, payerId: string, payeeId: string, escrowId: string) {
        console.log(`[MercadoPagoAdapter] Creating Preference for Slice ${sliceId}`);

        try {
            // Fetch Provider's Access Token
            const [wallet] = await db.select().from(userWallets).where(eq(userWallets.userId, payeeId));
            const providerAccessToken = wallet?.mercadoPagoAccessToken;

            let preferenceClient = defaultPreference;

            if (providerAccessToken) {
                const client = new MercadoPagoConfig({ accessToken: providerAccessToken });
                preferenceClient = new Preference(client);
            } else {
                console.warn(`[MercadoPagoAdapter] Warning: Provider ${payeeId} has not connected MercadoPago. Using Platform account (funds will stay in Platform).`);
            }

            const result = await preferenceClient.create({
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
                    external_reference: escrowId,
                    metadata: {
                        payee_id: payeeId,
                        payer_id: payerId
                    },
                    // MARKETPLACE SPLIT PAYMENT CONFIGURATION
                    // When creating with Seller Token:
                    // - Money goes to Seller
                    // - 'marketplace_fee' is transferred to Platform
                    marketplace_fee: amountCents * 0.15 / 100, // 15% Fee
                    notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,

                    // FINANCIAL FLEXIBILITY CONFIGURATION
                    payment_methods: {
                        excluded_payment_methods: [], // Allow all (Visa, Mastercard, Amex, etc.)
                        excluded_payment_types: [], // Allow all (Credit Card, Debit Card, Ticket, ATM)
                        installments: 12, // Allow up to 12 installments
                        default_installments: undefined // User chooses
                    },

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
        console.log(`[MercadoPagoAdapter] Checking Release Status for: ${transactionId}`);

        try {
            // Get payment info to verify it's approved/accredited
            // Note: In MP SDK v2, get is a method on the Payment class
            const paymentInfo = await (payment as any).get({ id: transactionId });

            if (paymentInfo && (paymentInfo.status === 'approved' || paymentInfo.status === 'accredited')) {
                return {
                    success: true,
                    releasedAt: new Date(paymentInfo.date_approved || Date.now())
                };
            }

            console.warn(`[MercadoPagoAdapter] Payment not ready for release. Status: ${paymentInfo?.status}`);
            return {
                success: false,
                releasedAt: new Date() // TODO: Should this be null/undefined on failure? Interface says Date.
            };

        } catch (error) {
            console.error('[MercadoPagoAdapter] Error checking release status', error);
            throw error;
        }
    }

    async refund(transactionId: string, amount?: number) {
        console.log(`[MercadoPagoAdapter] Refunding payment: ${transactionId}, Amount: ${amount || 'Full'}`);

        try {
            // Note: In MP SDK v2, refund is a method on the Payment class
            // Casting to any because the type definition might be incomplete in the local environment
            const refundOptions: any = { payment_id: transactionId };
            if (amount) {
                refundOptions.amount = amount;
            }

            const refundResult = await (payment as any).refund(refundOptions);

            if (refundResult.status === 'approved' || refundResult.status === 'refunded') {
                return {
                    success: true,
                    refundedAt: new Date()
                };
            } else {
                throw new Error(`Refund status: ${refundResult.status}`);
            }
        } catch (error) {
            console.error('[MercadoPagoAdapter] Refund failed', error);
            // Re-throw to satisfy interface requirement (or we must modify interface to allow null)
            throw error;
        }
    }
}
