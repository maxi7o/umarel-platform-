import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slices, escrowPayments, contracts } from '@/lib/db/schema';
import { createHash } from 'crypto';
import { eq } from 'drizzle-orm';
import { calculatePaymentBreakdown } from '@/lib/payments/calculations';

import { createClient } from '@/lib/supabase/server';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { bidAmount, providerId, quoteId } = await request.json();
        const { id: sliceId } = await params;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const clientId = user.id;

        // Validate slice exists and is in correct status
        const slice = await db.query.slices.findFirst({
            where: eq(slices.id, sliceId),
        });

        if (!slice) {
            return NextResponse.json({ error: 'Slice not found' }, { status: 404 });
        }

        if (slice.status !== 'proposed') {
            return NextResponse.json(
                { error: 'Slice is not available for acceptance' },
                { status: 400 }
            );
        }

        // Calculate payment breakdown
        const breakdown = calculatePaymentBreakdown(bidAmount);

        // Update slice status and set final price
        await db
            .update(slices)
            .set({
                status: 'accepted',
                finalPrice: bidAmount,
                assignedProviderId: providerId,
            })
            .where(eq(slices.id, sliceId));

        // ==========================================
        // SMART CONTRACT CREATION
        // ==========================================

        const contractSnapshot = {
            sliceId,
            sliceTitle: slice.title,
            sliceDescription: slice.description,
            agreedPrice: bidAmount,
            providerId,
            clientId,
            acceptedAt: new Date().toISOString(),
            termsVersion: 'v1.0-ricardian'
        };

        // Generate SHA-256 Hash of the Agreement (Immutable Anchor)
        const contractHash = createHash('sha256').update(JSON.stringify(contractSnapshot)).digest('hex');

        // Store Contract Record
        await db.insert(contracts).values({
            sliceId,
            quoteId: quoteId || null,
            providerId,
            clientId,
            snapshotJson: contractSnapshot,
            contractHash: contractHash,
            createdAt: new Date(),
        });

        // ==========================================

        // Create escrow payment record
        const [escrowPayment] = await db
            .insert(escrowPayments)
            .values({
                sliceId,
                clientId,
                providerId,
                totalAmount: breakdown.totalAmount,
                sliceAmount: breakdown.slicePrice,
                platformFee: breakdown.platformFee,
                communityRewardPool: breakdown.communityRewardPool,
                paymentMethod: 'stripe', // Default, will be updated on actual payment
                status: 'pending_escrow',
            })
            .returning();

        // Update slice with escrow payment reference
        await db
            .update(slices)
            .set({
                escrowPaymentId: escrowPayment.id,
            })
            .where(eq(slices.id, sliceId));

        return NextResponse.json({
            success: true,
            escrowPaymentId: escrowPayment.id,
            breakdown,
            redirectUrl: `/checkout/${sliceId}`,
        });
    } catch (error) {
        console.error('Error accepting slice:', error);
        return NextResponse.json(
            { error: 'Failed to accept slice' },
            { status: 500 }
        );
    }
}
