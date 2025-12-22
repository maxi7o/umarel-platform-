import { db } from '@/lib/db';
import { serviceRatings, users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

interface SubmitRatingParams {
    sliceId: string;
    requestId: string;
    providerId: string;
    clientId: string;
    qualityRating: number;
    communicationRating: number;
    timelinessRating: number;
    professionalismRating: number;
    valueRating: number;
    comment?: string;
}

export async function submitRating(params: SubmitRatingParams) {
    const {
        sliceId, requestId, providerId, clientId,
        qualityRating, communicationRating, timelinessRating, professionalismRating, valueRating,
        comment
    } = params;

    // Calculate Overall Rating
    const overallRating = (qualityRating + communicationRating + timelinessRating + professionalismRating + valueRating) / 5;

    // Calculate Aura Impact (Simple rule: Rating * 10)
    const auraImpact = Math.round(overallRating * 10);

    await db.transaction(async (tx) => {
        // 1. Insert Rating
        await tx.insert(serviceRatings).values({
            sliceId,
            requestId,
            providerId,
            clientId,
            qualityRating,
            communicationRating,
            timelinessRating,
            professionalismRating,
            valueRating,
            overallRating: overallRating.toFixed(2),
            feedback: comment,
            auraImpact
        });

        // 2. Update Provider Aura
        await tx.update(users)
            .set({
                auraPoints: sql`${users.auraPoints} + ${auraImpact}`
            })
            .where(eq(users.id, providerId));
    });
}
