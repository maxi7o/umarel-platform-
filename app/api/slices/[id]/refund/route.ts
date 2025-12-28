
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { MercadoPagoAdapter } from '@/lib/payments/mercadopago-adapter';

// Initialize Payment Adapter
const paymentAdapter = new MercadoPagoAdapter();

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: sliceId } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { reason } = body;

        // 1. Fetch Slice and Request (Raw SQL)
        const [slice] = await sql`
            SELECT id, status, request_id as "requestId", assigned_provider_id as "assignedProviderId", title
            FROM slices WHERE id = ${sliceId}
        `;

        if (!slice) {
            return NextResponse.json({ error: 'Slice not found' }, { status: 404 });
        }

        const [reqData] = await sql`
            SELECT user_id as "userId" FROM requests WHERE id = ${slice.requestId}
        `;

        // 2. Verify Requester (Client)
        if (reqData.userId !== user.id) {
            return NextResponse.json({ error: 'Only the client can request a refund' }, { status: 403 });
        }

        // 3. Verify Status
        if (slice.status !== 'completed') {
            return NextResponse.json({ error: 'Refund can only be requested for completed slices waiting for approval' }, { status: 400 });
        }

        // 4. Update Refund Status (Raw SQL - Bypass Schema Issues)
        await sql`
            UPDATE slices SET
                refund_status = 'requested',
                refund_reason = ${reason},
                refund_requested_at = NOW()
            WHERE id = ${sliceId}
        `;

        // 5. Notify Provider
        if (slice.assignedProviderId) {
            await sql`
                INSERT INTO notifications (user_id, title, message, link)
                VALUES (${slice.assignedProviderId}, 'Refund Requested', ${`Client has requested a refund for slice "${slice.title}": ${reason}`}, '/wallet')
            `;
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Refund Request Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: sliceId } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { action, evidence } = body;

        // 1. Fetch Slice (Raw SQL)
        const [slice] = await sql`
            SELECT id, status, refund_status as "refundStatus", request_id as "requestId", 
                   assigned_provider_id as "assignedProviderId", escrow_payment_id as "escrowPaymentId", title
            FROM slices WHERE id = ${sliceId}
        `;

        if (!slice) return NextResponse.json({ error: 'Slice not found' }, { status: 404 });

        // 2. Verify Provider
        if (slice.assignedProviderId !== user.id) {
            return NextResponse.json({ error: 'Only the provider can respond to refund request' }, { status: 403 });
        }

        // 3. Verify active request
        if (slice.refundStatus !== 'requested') {
            return NextResponse.json({ error: 'No active refund request' }, { status: 400 });
        }

        if (action === 'accept') {
            if (!slice.escrowPaymentId) {
                return NextResponse.json({ error: 'No escrow payment found for this slice' }, { status: 400 });
            }

            // We assume full refund for now
            await paymentAdapter.refund(slice.escrowPaymentId);

            // Update Slice Status
            await sql`
                UPDATE slices SET
                    refund_status = 'approved',
                    refund_decided_at = NOW()
                WHERE id = ${sliceId}
            `;

            // Update Payment Status
            await sql`UPDATE escrow_payments SET status = 'refunded', refunded_at = NOW() WHERE mercado_pago_payment_id = ${slice.escrowPaymentId}`;

            // Notify Client
            const [reqData] = await sql`SELECT user_id as "userId" FROM requests WHERE id = ${slice.requestId}`;

            await sql`
                INSERT INTO notifications (user_id, title, message, link)
                VALUES (${reqData.userId}, 'Refund Approved', ${`Provider accepted your refund request for slice "${slice.title}". Funds are returning.`}, '/wallet')
            `;

            return NextResponse.json({ success: true, status: 'approved' });

        } else if (action === 'reject') {
            // Dispute
            await sql`
                UPDATE slices SET
                    refund_status = 'disputed',
                    status = 'disputed',
                    dispute_evidence = ${evidence ? JSON.stringify([evidence]) : '[]'},
                    refund_decided_at = NOW(),
                    disputed_at = NOW()
                WHERE id = ${sliceId}
            `;

            // Notify Client
            const [reqData] = await sql`SELECT user_id as "userId" FROM requests WHERE id = ${slice.requestId}`;

            await sql`
                INSERT INTO notifications (user_id, title, message, link)
                VALUES (${reqData.userId}, 'Refund Rejected - Dispute Started', 'Provider rejected your refund request. Umarel Admin will review within 24h.', '/wallet')
             `;

            return NextResponse.json({ success: true, status: 'disputed' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Refund Response Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
