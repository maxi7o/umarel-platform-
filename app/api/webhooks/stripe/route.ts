
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { escrowService } from '@/lib/services/escrow-service';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature') as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('Missing STRIPE_WEBHOOK_SECRET');
        return NextResponse.json({ error: 'Server Config Error' }, { status: 500 });
    }

    try {
        const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            // Metadata contains our escrowId if we set it during creation
            const escrowId = paymentIntent.metadata.escrowId;

            if (escrowId) {
                await escrowService.updateStatusByEscrowId(escrowId, 'in_escrow');
            } else {
                console.warn('PaymentIntent succeeded but missing escrowId metadata', paymentIntent.id);
            }
        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object;
            const escrowId = paymentIntent.metadata.escrowId;
            if (escrowId) {
                await escrowService.updateStatusByEscrowId(escrowId, 'failed');
            }
        }

        return NextResponse.json({ received: true });

    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }
}
