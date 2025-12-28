import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { escrowPayments, slices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const escrowId = searchParams.get('escrowId');

        if (!escrowId) {
            return NextResponse.json({ error: 'Escrow ID required' }, { status: 400 });
        }

        // Get escrow payment details
        const escrow = await db.query.escrowPayments.findFirst({
            where: eq(escrowPayments.id, escrowId),
        });

        if (!escrow) {
            return NextResponse.json({ error: 'Escrow payment not found' }, { status: 404 });
        }

        if (escrow.status !== 'pending_escrow') {
            return NextResponse.json(
                { error: 'Payment already processed' },
                { status: 400 }
            );
        }

        if (!escrow.sliceId) {
            return NextResponse.json({ error: 'Slice ID missing in escrow' }, { status: 400 });
        }

        // Get slice details for description
        const slice = await db.query.slices.findFirst({
            where: eq(slices.id, escrow.sliceId),
        });

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'ars',
                        product_data: {
                            name: slice?.title || 'Umarel Service Slice',
                            description: `Escrow payment for slice: ${escrow.sliceId}`,
                        },
                        unit_amount: escrow.totalAmount, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            payment_intent_data: {
                capture_method: 'manual', // CRITICAL: Holds funds (Escrow)
                metadata: {
                    escrowId: escrow.id,
                    sliceId: escrow.sliceId,
                    clientId: escrow.clientId,
                    providerId: escrow.providerId,
                    type: 'slice_payment',
                },
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?escrowId=${escrowId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/${escrow.sliceId}`,
            metadata: {
                escrowId: escrow.id,
                sliceId: escrow.sliceId,
            },
        });

        if (!session.url) {
            throw new Error('Failed to create checkout session URL');
        }

        // Update escrow with Stripe Session ID (optional, but good for tracking)
        // We might not have a payment intent ID yet until the webhook fires or session completes
        // But we can store the session ID if we had a column, or just wait for webhook.
        // For now, let's leave the status as pending_escrow until the webhook confirms 'payment_intent.amount_capturable_updated'

        return NextResponse.redirect(session.url);
    } catch (error) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
