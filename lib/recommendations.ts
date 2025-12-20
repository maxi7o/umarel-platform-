import { db } from '@/lib/db';
import { users, serviceRatings, slices } from '@/lib/db/schema';
import { eq, and, sql, desc } from 'drizzle-orm';

/**
 * Calculate provider recommendation score based on:
 * - Average rating
 * - Number of ratings (credibility)
 * - Aura points
 * - Recommendation rate
 */
export async function calculateProviderScore(providerId: string): Promise<number> {
    // Get provider's ratings
    const ratings = await db.query.serviceRatings.findMany({
        where: eq(serviceRatings.providerId, providerId),
    });

    if (ratings.length === 0) {
        // New provider - base score on Aura only
        const provider = await db.query.users.findFirst({
            where: eq(users.id, providerId),
        });
        return provider?.auraPoints || 0;
    }

    // Calculate average overall rating
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const avgRating = ratings.reduce((sum, r) => sum + parseFloat(r.overallRating as any), 0) / ratings.length;

    // Calculate recommendation rate
    const recommendCount = ratings.filter(r => r.wouldRecommend).length;
    const recommendRate = recommendCount / ratings.length;

    // Credibility factor (more ratings = more credible, caps at 50 ratings)
    const credibilityFactor = Math.min(ratings.length / 50, 1);

    // Get provider's Aura points
    const provider = await db.query.users.findFirst({
        where: eq(users.id, providerId),
    });
    const auraPoints = provider?.auraPoints || 0;

    // Combined score formula:
    // (avgRating * 200) + (recommendRate * 100) + (auraPoints * 0.5) + (credibilityFactor * 50)
    const score =
        (avgRating * 200) +           // Max 1000 points from ratings
        (recommendRate * 100) +       // Max 100 points from recommendations
        (auraPoints * 0.5) +          // Aura contribution (scaled down)
        (credibilityFactor * 50);     // Max 50 points for credibility

    return Math.round(score);
}

/**
 * Get top-rated providers for a specific service category
 */
export async function getTopProviders(category?: string, limit: number = 10) {
    // Get all providers with ratings
    const providersWithRatings = await db
        .select({
            providerId: serviceRatings.providerId,
            avgRating: sql<number>`AVG(CAST(${serviceRatings.overallRating} AS DECIMAL))`,
            ratingCount: sql<number>`COUNT(*)`,
            recommendRate: sql<number>`AVG(CASE WHEN ${serviceRatings.wouldRecommend} THEN 1.0 ELSE 0.0 END)`,
        })
        .from(serviceRatings)
        .groupBy(serviceRatings.providerId);

    // Calculate scores for each provider
    const scoredProviders = await Promise.all(
        providersWithRatings.map(async (p) => ({
            ...p,
            score: await calculateProviderScore(p.providerId),
        }))
    );

    // Sort by score and return top providers
    return scoredProviders
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

/**
 * Get provider's rating statistics
 */
export async function getProviderStats(providerId: string) {
    const ratings = await db.query.serviceRatings.findMany({
        where: eq(serviceRatings.providerId, providerId),
    });

    if (ratings.length === 0) {
        return {
            avgRating: 0,
            totalRatings: 0,
            recommendRate: 0,
            categoryBreakdown: {
                quality: 0,
                communication: 0,
                timeliness: 0,
                professionalism: 0,
                value: 0,
            },
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const avgRating = ratings.reduce((sum, r) => sum + parseFloat(r.overallRating as any), 0) / ratings.length;
    const recommendCount = ratings.filter(r => r.wouldRecommend).length;

    return {
        avgRating: parseFloat(avgRating.toFixed(2)),
        totalRatings: ratings.length,
        recommendRate: parseFloat((recommendCount / ratings.length * 100).toFixed(1)),
        categoryBreakdown: {
            quality: ratings.reduce((sum, r) => sum + r.qualityRating, 0) / ratings.length,
            communication: ratings.reduce((sum, r) => sum + r.communicationRating, 0) / ratings.length,
            timeliness: ratings.reduce((sum, r) => sum + r.timelinessRating, 0) / ratings.length,
            professionalism: ratings.reduce((sum, r) => sum + r.professionalismRating, 0) / ratings.length,
            value: ratings.reduce((sum, r) => sum + r.valueRating, 0) / ratings.length,
        },
    };
}
