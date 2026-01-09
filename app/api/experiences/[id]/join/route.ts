import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import {
    experiences,
    experienceParticipants,
    escrowPayments,
    userWallets,
    users
} from '@/lib/db/schema';
import { calculateDynamicPrice } from '@/lib/services/pricing-engine';
import { eq, count } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // 1. Fetch Experience and Current Participant Count
        const [experience] = await db
            .select()
            .from(experiences)
            .where(eq(experiences.id, id))
            .limit(1);

        if (!experience) {
            return new NextResponse('Experience not found', { status: 404 });
        }

        // Logic Check: Is it full?
        const participants = await db
            .select({ count: count() })
            .from(experienceParticipants)
            .where(eq(experienceParticipants.experienceId, id));

        const currentCount = participants[0].count;

        if (experience.maxParticipants && currentCount >= experience.maxParticipants) {
            return new NextResponse('Experience is full', { status: 400 });
        }

        // Logic Check: Does Provider have capacity for ACTIVE jobs?
        // We import dynamically to avoid circular deps if any
        const { checkProviderCapacity } = await import('@/lib/services/capacity-service');
        const capacityCheck = await checkProviderCapacity(experience.providerId);

        if (!capacityCheck.allowed) {
            return new NextResponse(
                `Provider at Capacity: ${capacityCheck.reason}. Cannot book until they complete active jobs.`,
                { status: 429 } // Too Many Requests (conceptually)
            );
        }

        // 2. Calculate Price
        const pricingConfig = experience.pricingConfig as any;
        const strategy = pricingConfig?.strategy || 'standard';
        const basePrice = pricingConfig?.basePrice || 0;

        const priceResult = calculateDynamicPrice({
            basePrice,
            strategy,
            eventDate: experience.date, // Use the experience date
            bookingDate: new Date(),
        });

        const priceInCents = priceResult.finalPrice;

        // 3. Create Escrow Payment (Individual for this user)
        // Need to fetch Provider to get their ID (already have it in experience.providerId)

        // Fee Calculation (15% Model)
        const platformFee = Math.round(priceInCents * 0.15);
        const communityRewardPool = Math.round(priceInCents * 0.03);
        const totalAmount = priceInCents + platformFee;

        // Insert Escrow
        const [escrow] = await db.insert(escrowPayments).values({
            experienceId: experience.id,
            clientId: user.id,
            providerId: experience.providerId,
            totalAmount: totalAmount,
            sliceAmount: priceInCents,
            platformFee: platformFee,
            communityRewardPool: communityRewardPool,
            paymentMethod: 'mercado_pago', // Default for now
            status: 'pending_escrow'
        }).returning();

        // 4. Create Participant Record
        // We set status to 'joined' but really it's 'pending_payment' until webhook confirms. 
        // For MVP, we assume user proceeds to pay immediately.
        await db.insert(experienceParticipants).values({
            experienceId: experience.id,
            userId: user.id,
            pricePaid: totalAmount, // Or should this be just slice price? Let's store Total.
            escrowPaymentId: escrow.id,
            status: 'joined'
        });

        // 5. Respond with Payment ID (Frontend will redirect to checkout)
        return NextResponse.json({
            paymentId: escrow.id,
            totalAmount: totalAmount,
            priceBreakdown: {
                slicePrice: priceInCents,
                platformFee: platformFee
            }
        });

    } catch (error) {
        console.error('[EXPERIENCE_JOIN]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
