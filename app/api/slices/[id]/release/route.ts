import { NextRequest, NextResponse } from 'next/server';
import { db, sql } from '@/lib/db';
import { slices, requests, escrowPayments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { MercadoPagoAdapter } from '@/lib/payments/mercadopago-adapter';

const paymentAdapter = new MercadoPagoAdapter();

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: sliceId } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Fetch Slice and Request (Raw SQL for reliability)
        const [slice] = await sql`
            SELECT id, status, request_id as "requestId", 
                   assigned_provider_id as "assignedProviderId", 
                   escrow_payment_id as "escrowPaymentId", 
                   title
            FROM slices WHERE id = ${sliceId}
        `;

        if (!slice) {
            return NextResponse.json({ error: 'Slice not found' }, { status: 404 });
        }

        const [reqData] = await sql`
            SELECT user_id as "userId" FROM requests WHERE id = ${slice.requestId}
        `;

        // 2. Verify Client is the one releasing
        if (reqData.userId !== user.id) {
            return NextResponse.json({ error: 'Only the client can release funds' }, { status: 403 });
        }

        // 3. Verify Status
        if (slice.status !== 'completed') {
            return NextResponse.json({ error: 'Funds can only be released for completed slices' }, { status: 400 });
        }

        if (!slice.escrowPaymentId) {
            return NextResponse.json({ error: 'No escrow payment associated with this slice' }, { status: 400 });
        }

        // 4. Call Adapter to Release Funds (Verification mainly)
        // In MP "Split Payment", the funds are technically already in the Seller's account but might be "unavailable".
        // Or if using "Binary Mode" checks, we verify it's accredited.
        // For MVP, this step confirms the money exists and is ready.
        const releaseResult = await paymentAdapter.releaseFunds(slice.escrowPaymentId);

        if (!releaseResult.success) {
            return NextResponse.json({ error: 'Payment provider could not verify funds for release' }, { status: 402 });
        }

        // 5. Update Database State (Transaction)
        await sql.begin(async (tx) => {
            // A. Update Slice Status -> 'paid'
            await tx`
                UPDATE slices SET 
                    status = 'paid',
                    paid_at = NOW()
                WHERE id = ${sliceId}
             `;

            // B. Update Escrow Payment -> 'released'
            await tx`
                UPDATE escrow_payments SET
                    status = 'released',
                    released_at = NOW()
                WHERE mercado_pago_payment_id = ${slice.escrowPaymentId}
             `;

            // C. Notify Provider
            if (slice.assignedProviderId) {
                await tx`
                    INSERT INTO notifications (user_id, title, message, link)
                    VALUES (${slice.assignedProviderId}, 'Funds Released 💸', ${`Client released funds for slice "${slice.title}". It's payday!`}, '/wallet')
                `;
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Release Funds Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
