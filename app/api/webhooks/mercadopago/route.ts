
import { NextRequest, NextResponse } from 'next/server';
import { payment } from '@/lib/mercadopago';
import { escrowService } from '@/lib/services/escrow-service';

export async function POST(req: NextRequest) {
    try {
        // Mercado Pago sends the event details in the query or body depending on config
        // Typically: POST with body { type: 'payment', data: { id: '...' } }
        const body = await req.json();

        console.log('[MP Webhook] Received:', body);

        // Check if it's a payment notification
        const isPayment = body.type === 'payment' || body.topic === 'payment';
        const paymentId = body.data?.id || body.id;

        if (isPayment && paymentId) {
            // Verify the payment status with Mercado Pago API to prevent spoofing
            const paymentData = await payment.get({ id: paymentId });

            // The external_reference should contain our escrowId
            const escrowId = paymentData.external_reference;

            if (escrowId) {
                if (paymentData.status === 'approved') {
                    await escrowService.updateStatusByEscrowId(escrowId, 'in_escrow');
                } else if (paymentData.status === 'rejected' || paymentData.status === 'cancelled') {
                    await escrowService.updateStatusByEscrowId(escrowId, 'failed');
                }
            } else {
                console.warn('[MP Webhook] Payment missing external_reference (escrowId)');
            }
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('[MP Webhook] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
