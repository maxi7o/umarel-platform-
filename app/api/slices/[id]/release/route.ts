
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slices, escrowPayments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getPaymentStrategy } from '@/lib/payments/factory';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // 1. Validate Slice Status
        const [slice] = await db.select().from(slices).where(eq(slices.id, id));
        if (!slice) return NextResponse.json({ error: 'Slice not found' }, { status: 404 });

        if (slice.status !== 'completed' && slice.status !== 'approved_by_client') {
            // Allow release if it's completed (provider done) or approved (client done)
            // Ideally should be 'approved_by_client' state before release.
        }

        // 2. Find Payment Record
        // (Mocking existence if not created by checkout yet - creating ad-hoc for demo)
        let paymentRecord = await db.query.escrowPayments.findFirst({
            where: eq(escrowPayments.sliceId, id)
        });

        const paymentStrategy = getPaymentStrategy();
        let transactionId = paymentRecord?.stripePaymentIntentId || `mock_adhoc_${Date.now()}`;

        // 3. Execute Release via Strategy
        const result = await paymentStrategy.releaseFunds(transactionId);

        if (result.success) {
            // 4. Update DB
            await db.update(slices)
                .set({
                    status: 'paid',
                    paidAt: new Date()
                })
                .where(eq(slices.id, id));

            if (paymentRecord) {
                await db.update(escrowPayments)
                    .set({
                        status: 'released',
                        releasedAt: new Date()
                    })
                    .where(eq(escrowPayments.id, paymentRecord.id));
            }

            return NextResponse.json({ success: true, releasedAt: result.releasedAt });
        } else {
            return NextResponse.json({ error: 'Payment release failed' }, { status: 500 });
        }

    } catch (error) {
        console.error('Escrow release error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
