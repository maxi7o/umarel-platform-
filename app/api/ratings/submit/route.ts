import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { serviceRatings, users, slices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const { sliceId, requestId, providerId, ratings, feedback, wouldRecommend } = await request.json();

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const clientId = user.id;

        // Calculate overall rating (average of all dimensions)
        const overallRating = (
            ratings.quality +
            ratings.communication +
            ratings.timeliness +
            ratings.professionalism +
            ratings.value
        ) / 5;

        // Calculate Aura impact based on rating
        // Formula: (overallRating - 3) * 20
        // 5 stars = +40 Aura, 4 stars = +20, 3 stars = 0, 2 stars = -20, 1 star = -40
        const auraImpact = Math.round((overallRating - 3) * 20);

        // Additional bonus/penalty for recommendation
        const recommendationBonus = wouldRecommend ? 10 : -10;
        const totalAuraImpact = auraImpact + recommendationBonus;

        // Insert rating
        const [rating] = await db.insert(serviceRatings).values({
            sliceId,
            requestId,
            providerId,
            clientId,
            qualityRating: ratings.quality,
            communicationRating: ratings.communication,
            timelinessRating: ratings.timeliness,
            professionalismRating: ratings.professionalism,
            valueRating: ratings.value,
            overallRating: overallRating.toFixed(2),
            feedback,
            wouldRecommend,
            auraImpact: totalAuraImpact,
        }).returning();

        // Update provider's Aura points
        const provider = await db.query.users.findFirst({
            where: eq(users.id, providerId),
        });

        if (provider) {
            const newAuraPoints = (provider.auraPoints || 0) + totalAuraImpact;

            // Determine new Aura level based on points
            let newAuraLevel: 'bronze' | 'silver' | 'gold' | 'diamond' = 'bronze';
            if (newAuraPoints >= 1000) newAuraLevel = 'diamond';
            else if (newAuraPoints >= 500) newAuraLevel = 'gold';
            else if (newAuraPoints >= 200) newAuraLevel = 'silver';

            await db.update(users)
                .set({
                    auraPoints: newAuraPoints,
                    auraLevel: newAuraLevel,
                })
                .where(eq(users.id, providerId));
        }

        // Update slice status to indicate it's been rated
        await db.update(slices)
            .set({ status: 'completed' })
            .where(eq(slices.id, sliceId));

        return NextResponse.json({
            success: true,
            rating,
            auraImpact: totalAuraImpact,
        });

    } catch (error) {
        console.error('Rating submission error:', error);
        return NextResponse.json(
            { error: 'Failed to submit rating' },
            { status: 500 }
        );
    }
}
