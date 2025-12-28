
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { slices, escrowPayments, requests } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getPaymentStrategy } from '@/lib/payments/factory';
import { NotificationService } from '@/lib/services/notification-service';
import { users } from '@/lib/db/schema';

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
            .select({
                id: slices.id,
                status: slices.status,
                escrowPaymentId: slices.escrowPaymentId,
                requestId: slices.requestId,
                price: slices.price
            })
            .from(slices)
            .where(eq(slices.id, sliceId));

        if (!slice) return NextResponse.json({ error: 'Slice not found' }, { status: 404 });

        // Check ownership (Only client can release)
        const [request] = await db
            .select({ userId: requests.userId })
            .from(requests)
            .where(eq(requests.id, slice.requestId));

        if (request.userId !== user.id) {
            return NextResponse.json({ error: 'Only the client can release funds' }, { status: 403 });
        }

        if (slice.status !== 'completed') {
            return NextResponse.json({ error: 'Slice must be completed before releasing' }, { status: 400 });
        }

        if (!slice.escrowPaymentId) {
            return NextResponse.json({ error: 'No escrow payment found' }, { status: 400 });
        }

        // 2. Call Adapter to Verify/Release
        // For MP Split Payment, this confirms payment is 'approved' 
        const strategy = getPaymentStrategy({ provider: 'mercadopago' }); // Defaulting to MP for MVP
        const releaseResult = await strategy.releaseFunds(slice.escrowPaymentId);

        if (!releaseResult.success) {
            return NextResponse.json({ error: 'Payment provider could not verify release eligibility' }, { status: 400 });
        }

        // 3. Update DB State
        // Mark Escrow as Released
        // This is THE trigger for the Dividend Engine
        const [updatedEscrow] = await db.update(escrowPayments)
            .set({
                status: 'released',
                releasedAt: new Date()
            })
            .where(eq(escrowPayments.transactionId, slice.escrowPaymentId))
            .returning();

        // NOTIFICATION: Funds Released
        if (updatedEscrow?.providerId) {
            const [provider] = await db.select().from(users).where(eq(users.id, updatedEscrow.providerId));
            if (provider?.email) {
                await NotificationService.notifyFundsReleased(
                    provider.email,
                    provider.fullName || 'Provider',
                    `Slice #${sliceId.slice(0, 8)}`, // Fallback title
                    updatedEscrow.sliceAmount
                );
            }
        }

        return NextResponse.json({ success: true, releasedAt: updatedEscrow.releasedAt });

    } catch (error) {
        console.error('Release Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
