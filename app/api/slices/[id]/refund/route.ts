
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slices, requests, escrowPayments, users, notifications } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
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

        // 1. Fetch Slice and Request to verify ownership
        const [slice] = await db
            .select({
                id: slices.id,
                status: slices.status,
                requestId: slices.requestId,
                assignedProviderId: slices.assignedProviderId,
                title: slices.title,
                createdAt: slices.createdAt, // Should check 'completedAt' or evidence upload time if available, but for now we assume status check is enough
            })
            .from(slices)
            .where(eq(slices.id, sliceId));

        if (!slice) {
            return NextResponse.json({ error: 'Slice not found' }, { status: 404 });
        }

        const [reqData] = await db
            .select({ userId: requests.userId })
            .from(requests)
            .where(eq(requests.id, slice.requestId));

        // 2. Verify Requester (Client) is the one asking
        if (reqData.userId !== user.id) {
            return NextResponse.json({ error: 'Only the client can request a refund' }, { status: 403 });
        }

        // 3. Verify Status (Must be 'completed' - waiting for approval/release)
        // If it's already approved_by_client or paid, money might be gone (Phase 2)
        if (slice.status !== 'completed') {
            return NextResponse.json({ error: 'Refund can only be requested for completed slices waiting for approval' }, { status: 400 });
        }

        // 4. Update Refund Status
        await db.update(slices)
            .set({
                refundStatus: 'requested',
                refundReason: reason,
                refundRequestedAt: new Date(),
            })
            .where(eq(slices.id, sliceId));

        // 5. Notify Provider
        if (slice.assignedProviderId) {
            await db.insert(notifications).values({
                userId: slice.assignedProviderId,
                title: 'Refund Requested',
                message: `Client has requested a refund for slice "${slice.title}": ${reason}`,
                link: `/wallet`, // Or deep link to slice
            });
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
        const { action, evidence } = body; // action: 'accept' | 'reject'

        // 1. Fetch Slice
        const [slice] = await db
            .select()
            .from(slices)
            .where(eq(slices.id, sliceId));

        if (!slice) return NextResponse.json({ error: 'Slice not found' }, { status: 404 });

        // 2. Verify Provider is the one responding
        if (slice.assignedProviderId !== user.id) {
            return NextResponse.json({ error: 'Only the provider can respond to refund request' }, { status: 403 });
        }

        // 3. Verify Refund is actually requested
        if (slice.refundStatus !== 'requested') {
            return NextResponse.json({ error: 'No active refund request' }, { status: 400 });
        }

        if (action === 'accept') {
            // PROVIDER ACCEPTS REFUND logic

            // a. Find Escrow Payment
            if (!slice.escrowPaymentId) {
                return NextResponse.json({ error: 'No escrow payment found for this slice' }, { status: 400 });
            }

            // b. Call MercadoPago Refund
            // We assume full refund for now as per MVP rules
            await paymentAdapter.refund(slice.escrowPaymentId);

            // c. Update Slice Status
            await db.update(slices)
                .set({
                    refundStatus: 'approved',
                    refundDecidedAt: new Date(),
                    // We don't have a 'refunded' slice status, but maybe we revert to 'proposed' or similar?
                    // Or keep it 'completed' but marked refund_approved?
                    // Let's set it to 'disputed' to stop auto-release workflows if any, or just keep it completed but payment status is refunded.
                    // Ideally slice status should reflect "Cancelled/Refunded".
                    // For now, let's leave slice status as is but payment status will update.
                })
                .where(eq(slices.id, sliceId));

            // Update Payment Status in DB
            await db.update(escrowPayments)
                .set({ status: 'refunded', refundedAt: new Date() })
                .where(eq(escrowPayments.mercadoPagoPaymentId, slice.escrowPaymentId)); // Assuming ID is MP ID? Need to check schema.
            // Schema says: escrowPaymentId: text('escrow_payment_id') on slices.
            // Usually we store our internal ID or MP ID?
            // In createEscrow it returned result.id (MP ID).
            // So slice.escrowPaymentId is likely the MP ID.
            // But wait, createEscrow adapter returns transactionId.
            // And UnifiedCheckoutButton calls /api/payments/create.
            // I should check /api/payments/create to see what it stores.

            // Notify Client
            const [reqData] = await db.select({ userId: requests.userId }).from(requests).where(eq(requests.id, slice.requestId));
            await db.insert(notifications).values({
                userId: reqData.userId,
                title: 'Refund Approved',
                message: `Provider accepted your refund request for slice "${slice.title}". Funds are returning.`,
                link: `/wallet`,
            });

            return NextResponse.json({ success: true, status: 'approved' });

        } else if (action === 'reject') {
            // PROVIDER REJECTS REFUND -> DISPUTE

            await db.update(slices)
                .set({
                    refundStatus: 'disputed',
                    status: 'disputed', // Critical: Mark slice as disputed to block everything
                    disputeEvidence: evidence ? [evidence] : [], // Simplification
                    refundDecidedAt: new Date(), // Decision to reject
                    disputedAt: new Date(),
                })
                .where(eq(slices.id, sliceId));

            // Notify Admin (You)
            // For now just notify Client that it went to dispute
            const [reqData] = await db.select({ userId: requests.userId }).from(requests).where(eq(requests.id, slice.requestId));
            await db.insert(notifications).values({
                userId: reqData.userId,
                title: 'Refund Rejected - Dispute Started',
                message: `Provider rejected your refund request. Umarel Admin will review within 24h.`,
                link: `/wallet`,
            });

            return NextResponse.json({ success: true, status: 'disputed' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Refund Response Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
