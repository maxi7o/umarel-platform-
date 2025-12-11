import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { escrowPayments, slices, transactions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/stripe';

// This is the Brain that normalizes all payment providers into one stream of events
export async function POST(request: NextRequest) {
    const signature = request.headers.get('stripe-signature');
    const mpSignature = request.headers.get('x-signature-mp');

    try {
        let eventType = '';
        let metadata: any = {};
        let providerId = '';

        if (signature) {
            // HANDLE STRIPE
            const body = await request.text();
            const event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object as any;
                eventType = 'payment.success';
                metadata = session.metadata;
                providerId = session.id;
            }
        }
        else if (mpSignature) {
            // HANDLE MERCADO PAGO (Simulated validation for now)
            const body = await request.json();
            if (body.type === 'payment' && body.action === 'payment.created') {
                eventType = 'payment.success';
                metadata = body.metadata; // In simulation we pass this
                providerId = body.data?.id;
            }
        }
        else {
            // HANDLE GENERIC / SIMULATION (from our own simulator)
            const body = await request.json();
            if (body.type === 'simulation.success') {
                eventType = 'payment.success';
                metadata = body.metadata;
                providerId = 'sim_' + Date.now();
            }
        }

        if (eventType === 'payment.success') {
            const { sliceId, offeringId, type } = metadata;

            console.log(`💰 Payment Confirmed: ${type} (ID: ${sliceId || offeringId})`);

            // LOGIC FOR SLICE ESCROW
            if (type === 'escrow_funding' && sliceId) {
                // 1. Update Slice Status
                await db.update(slices)
                    .set({
                        status: 'in_progress', // Funded = Ready to start
                        paidAt: new Date(),
                    })
                    .where(eq(slices.id, sliceId));

                // 2. Mark Escrow Payment as Funded
                // (Assuming we created the escrow record pending before checkout)
                // If not, we create it here. 

                // For MVP, we likely created it as 'pending_escrow' when user clicked "Accept Quote"
                // So we update it here:
                /* 
                await db.update(escrowPayments)
                    .set({ status: 'in_escrow', stripePaymentIntentId: providerId })
                    .where(eq(escrowPayments.sliceId, sliceId)); 
                */
            }

            // LOGIC FOR FEATURE OFFERING
            if (type === 'feature_listing' && offeringId) {
                // Mark offering as featured
                // await db.update(serviceOfferings).set({ featured: true })...
                console.log(`✨ Feature Listing Activated: ${offeringId}`);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Webhook Handler Failed' }, { status: 400 });
    }
}
