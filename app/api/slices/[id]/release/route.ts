
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { slices, escrowPayments, requests, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getPaymentStrategy } from '@/lib/payments/factory';
import { NotificationService } from '@/lib/services/notification-service';

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
                escrowPaymentId: slices.escrowPaymentId, // This is the UUID of escrow_payments table
                requestId: slices.requestId,
                price: slices.finalPrice
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
            return NextResponse.json({ error: 'No escrow payment found for this slice' }, { status: 400 });
        }

        // 2. Fetch the Escrow Payment Record
        const [escrow] = await db
            .select() // Select all columns
            .from(escrowPayments)
            .where(eq(escrowPayments.id, slice.escrowPaymentId));

        if (!escrow) {
            return NextResponse.json({ error: 'Escrow record not found' }, { status: 404 });
        }

        // Determine correct provider ID
        // Note: For MP, we need the Payment ID (not the Preference ID/UUID).
        // This MUST be populated by the Webhook when the user pays.
        const providerTransactionId = escrow.mercadoPagoPaymentId || escrow.stripePaymentIntentId;

        if (!providerTransactionId) {
            return NextResponse.json({ error: 'Payment has not been confirmed by provider yet' }, { status: 400 });
        }

        // 3. Call Adapter to Verify/Release
        const currency = 'ARS'; // TODO: Store currency in escrowPayments
        const strategy = getPaymentStrategy({ countryCode: 'AR' }); // Assuming ARS/MP

        // The adapter expects the Provider's Transaction ID (e.g. MP Payment ID)
        const releaseResult = await strategy.releaseFunds(providerTransactionId);

        if (!releaseResult.success) {
            return NextResponse.json({ error: 'Payment provider blocked release (status not approved)' }, { status: 400 });
        }

        // 4. Update DB State
        const [updatedEscrow] = await db.update(escrowPayments)
            .set({
                status: 'released',
                releasedAt: new Date()
            })
            .where(eq(escrowPayments.id, escrow.id))
            .returning();

        // NOTIFICATION: Funds Released
        if (escrow.providerId) {
            const [provider] = await db.select().from(users).where(eq(users.id, escrow.providerId));
            if (provider?.email) {
                await NotificationService.notifyFundsReleased(
                    provider.email,
                    provider.fullName || 'Provider',
                    `Slice #${sliceId.slice(0, 8)}`,
                    escrow.sliceAmount
                );
            }
        }

        return NextResponse.json({ success: true, releasedAt: updatedEscrow.releasedAt });

    } catch (error) {
        console.error('Release Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
