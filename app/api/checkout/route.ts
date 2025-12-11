import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { serviceOfferings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getMarketById } from '@/lib/markets';
import { SmartPaymentRouter, PaymentContext, PaymentProvider } from '@/lib/payments/smart-router';

// Helper to guess country from headers (Mock implementation)
function getCountryFromRequest(request: NextRequest): string {
    // In production: request.geo?.country || request.headers.get('x-vercel-ip-country')
    const mockCountryHeader = request.headers.get('x-mock-country');
    return mockCountryHeader || 'US';
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { offeringId, marketId } = body;

        if (!offeringId) {
            return NextResponse.json({ error: 'Offering ID is required' }, { status: 400 });
        }

        // Get market config
        const market = marketId ? getMarketById(marketId) : null;
        const currency = market?.currency.toLowerCase() || 'eur';

        // Fetch offering details
        const [offering] = await db.select()
            .from(serviceOfferings)
            .where(eq(serviceOfferings.id, offeringId));

        if (!offering) {
            return NextResponse.json({ error: 'Offering not found' }, { status: 404 });
        }

        // 1. Prepare Payment Context
        const buyerCountry = getCountryFromRequest(request);
        const amountCents = 999; // Feature fee fixed at 9.99 for now

        const context: PaymentContext = {
            amountCents,
            currency: currency.toUpperCase(),
            buyerCountryCode: buyerCountry,
            buyerId: 'user_session_id', // Should come from Auth
            isCryptoPreferred: false,
        };

        // 2. Get Best Option
        const options = SmartPaymentRouter.getOptions(context);
        const bestOption = options[0];
        console.log(`Smart Router selected: ${bestOption.provider} for ${buyerCountry}`);

        // 3. route based on Provider
        switch (bestOption.provider) {
            case PaymentProvider.MERCADO_PAGO:
                // SIMULATION MODE
                console.log('Simulating Mercado Pago Checkout creation...');
                return NextResponse.json({
                    url: `${process.env.NEXT_PUBLIC_APP_URL}/simulate-payment?provider=mercado_pago&amount=${amountCents}&ref=${offeringId}`
                });

            case PaymentProvider.DLOCAL:
                // SIMULATION MODE
                console.log('Simulating dLocal Checkout creation...');
                return NextResponse.json({
                    url: `${process.env.NEXT_PUBLIC_APP_URL}/simulate-payment?provider=dlocal&amount=${amountCents}&ref=${offeringId}`
                });

            case PaymentProvider.STRIPE_MX:
            case PaymentProvider.STRIPE_US:
            default:
                // Create Stripe Checkout Session
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [
                        {
                            price_data: {
                                currency: currency,
                                product_data: {
                                    name: `Feature Offering: ${offering.title}`,
                                    description: `Boost your visibility for 7 days in ${market?.city || 'your area'}`,
                                },
                                unit_amount: amountCents,
                            },
                            quantity: 1,
                        },
                    ],
                    mode: 'payment',
                    success_url: `${request.nextUrl.origin}/offerings/${offeringId}?success=true`,
                    cancel_url: `${request.nextUrl.origin}/offerings/${offeringId}?canceled=true`,
                    metadata: {
                        offeringId: offeringId,
                        type: 'feature_listing',
                        marketId: marketId || 'unknown',
                        provider: bestOption.provider,
                    },
                    automatic_tax: {
                        enabled: true,
                    },
                });

                return NextResponse.json({ url: session.url });
        }

    } catch (error) {
        console.error('Checkout Error:', error);
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }
}
