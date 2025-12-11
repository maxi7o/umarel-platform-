import { NextRequest, NextResponse } from 'next/server';
import { payment } from '@/lib/mercadopago';
import { db } from '@/lib/db';
import { escrowPayments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Mercado Pago sends different types of notifications
        const { type, data } = body;

        if (type === 'payment') {
            const paymentId = data.id;

            // Get payment details from Mercado Pago
            const paymentData = await payment.get({ id: paymentId });

            const escrowId = paymentData.external_reference;

            if (!escrowId) {
                console.error('No escrow ID in payment metadata');
                return NextResponse.json({ received: true });
            }

            // Update escrow based on payment status
            switch (paymentData.status) {
                case 'approved':
                    // Payment approved - funds are available
                    await db
                        .update(escrowPayments)
                        .set({
                            status: 'in_escrow',
                            mercadoPagoPreapprovalId: paymentId.toString(),
                        })
                        .where(eq(escrowPayments.id, escrowId));

                    console.log(`Mercado Pago payment ${paymentId} approved`);
                    break;

                case 'pending':
                case 'in_process':
                    // Payment is being processed
                    await db
                        .update(escrowPayments)
                        .set({
                            status: 'pending_escrow',
                        })
                        .where(eq(escrowPayments.id, escrowId));

                    console.log(`Mercado Pago payment ${paymentId} pending`);
                    break;

                case 'rejected':
                case 'cancelled':
                    // Payment failed or was cancelled
                    await db
                        .update(escrowPayments)
                        .set({
                            status: 'failed',
                        })
                        .where(eq(escrowPayments.id, escrowId));

                    console.log(`Mercado Pago payment ${paymentId} failed/cancelled`);
                    break;

                case 'refunded':
                case 'charged_back':
                    // Payment was refunded
                    await db
                        .update(escrowPayments)
                        .set({
                            status: 'refunded',
                            refundedAt: new Date(),
                        })
                        .where(eq(escrowPayments.id, escrowId));

                    console.log(`Mercado Pago payment ${paymentId} refunded`);
                    break;

                default:
                    console.log(`Unhandled Mercado Pago status: ${paymentData.status}`);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Mercado Pago webhook error:', error);
        // Always return 200 to Mercado Pago to avoid retries
        return NextResponse.json({ received: true });
    }
}
