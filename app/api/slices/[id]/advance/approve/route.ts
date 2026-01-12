
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { slices, requests, escrowPayments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getPaymentStrategy } from '@/lib/payments/factory';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: sliceId } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Fetch Slice & Request
        const [slice] = await db
            .select()
            .from(slices)
            .where(eq(slices.id, sliceId));

        if (!slice) return NextResponse.json({ error: 'Slice not found' }, { status: 404 });

        const [request] = await db
            .select()
            .from(requests)
            .where(eq(requests.id, slice.requestId));

        // 2. Verify Client Ownership
        if (request.userId !== user.id) {
            return NextResponse.json({ error: 'Only the client can approve acopio' }, { status: 403 });
        }

        // 3. Verify Status
        if (slice.materialAdvanceStatus !== 'requested') {
            return NextResponse.json({ error: 'No pending material advance request' }, { status: 400 });
        }

        // 4. Financial Release Logic (Partial)
        // In a real implementation with Split Payments / Connect:
        // await paymentAdapter.transferFunds(slice.escrowPaymentId, slice.materialAdvanceAmount, slice.assignedProviderId);
        // For MVP, we assume this action *authorizes* the release effectively.

        // 5. Update DB
        await db.update(slices)
            .set({
                materialAdvanceStatus: 'released' // or 'approved' if release is manual
            })
            .where(eq(slices.id, sliceId));

        // Optional: Update escrow_payments to reflect partial release
        // await db.update(escrowPayments).set({ ... }).where(...)

        return NextResponse.json({ success: true, status: 'released' });

    } catch (error) {
        console.error('Advance Approval Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
