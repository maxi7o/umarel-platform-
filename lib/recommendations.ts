import { db } from '@/lib/db';
import { users, serviceRatings, slices } from '@/lib/db/schema';
import { eq, and, sql, desc, count } from 'drizzle-orm';

const IMPLIED_RATING = 4.8;

/**
 * Calculate provider recommendation score based on:
 * - Average rating (Real + Implied)
 * - Number of ratings (credibility)
 * - Aura points
 * - Recommendation rate
 */
export async function calculateProviderScore(providerId: string): Promise<number> {
    // 1. Get explicit ratings
    const ratings = await db.query.serviceRatings.findMany({
        where: eq(serviceRatings.providerId, providerId),
    });

    // 2. Get total completed slices (Verified Work)
    const [completedSlices] = await db
        .select({ count: count() })
        .from(slices)
        .where(and(
            eq(slices.assignedProviderId, providerId),
            eq(slices.status, 'completed')
        ));

    const totalCompleted = completedSlices?.count || 0;
    const ratedCount = ratings.length;

    // 3. Calculate Implied (Silent) Ratings
    // If a job is completed but not rated, we assume it went well (4.8/5.0)
    const unreviewedCount = Math.max(0, totalCompleted - ratedCount);

    if (totalCompleted === 0 && ratedCount === 0) {
        // New provider - base score on Aura only
        const provider = await db.query.users.findFirst({
            where: eq(users.id, providerId),
        });
        return provider?.auraPoints || 0;
    }

    // 4. Calculate Weighted Average
    // Real Ratings Sum
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const realSum = ratings.reduce((sum, r) => sum + parseFloat(r.overallRating as any), 0);

    // Implied Ratings Sum
    const impliedSum = unreviewedCount * IMPLIED_RATING;

    const totalSum = realSum + impliedSum;
    const effectiveCount = ratedCount + unreviewedCount;

    const avgRating = totalSum / effectiveCount;

    // Calculate recommendation rate
    // For implied ratings, we assume they WOULD recommend (100% rate for unreviewed)
    const realRecommendCount = ratings.filter(r => r.wouldRecommend).length;
    const totalRecommendCount = realRecommendCount + unreviewedCount;
    const recommendRate = totalRecommendCount / effectiveCount;

    // Credibility factor (more jobs = more credible, caps at 50 jobs)
    const credibilityFactor = Math.min(effectiveCount / 50, 1);

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
 * Get provider's rating statistics with Implied Reputation
 */
export async function getProviderStats(providerId: string) {
    // 1. Explicit Ratings
    const ratings = await db.query.serviceRatings.findMany({
        where: eq(serviceRatings.providerId, providerId),
    });

    // 2. Completed Jobs
    const [completedSlices] = await db
        .select({ count: count() })
        .from(slices)
        .where(and(
            eq(slices.assignedProviderId, providerId),
            eq(slices.status, 'completed')
        ));

    const totalCompleted = completedSlices?.count || 0;
    const ratedCount = ratings.length;
    const unreviewedCount = Math.max(0, totalCompleted - ratedCount);

    if (totalCompleted === 0 && ratedCount === 0) {
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

    // 3. Averages
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const realSum = ratings.reduce((sum, r) => sum + parseFloat(r.overallRating as any), 0);
    const impliedSum = unreviewedCount * IMPLIED_RATING;

    const totalSum = realSum + impliedSum;
    const effectiveCount = ratedCount + unreviewedCount;
    const avgRating = totalSum / effectiveCount;

    // Recommendation Rate
    const realRecommendCount = ratings.filter(r => r.wouldRecommend).length;
    const recommendRate = (realRecommendCount + unreviewedCount) / effectiveCount;

    // Categories
    // For categories, we also assume IMPLIED_RATING for unreviewed
    const calcCategoryAvg = (extractor: (r: typeof ratings[0]) => number) => {
        const realCatSum = ratings.reduce((sum, r) => sum + extractor(r), 0);
        const impliedCatSum = unreviewedCount * IMPLIED_RATING; // Assume consistent high quality
        return (realCatSum + impliedCatSum) / effectiveCount;
    };

    return {
        avgRating: parseFloat(avgRating.toFixed(2)),
        totalRatings: effectiveCount,
        recommendRate: parseFloat((recommendRate * 100).toFixed(1)),
        categoryBreakdown: {
            quality: calcCategoryAvg(r => r.qualityRating),
            communication: calcCategoryAvg(r => r.communicationRating),
            timeliness: calcCategoryAvg(r => r.timelinessRating),
            professionalism: calcCategoryAvg(r => r.professionalismRating),
            value: calcCategoryAvg(r => r.valueRating),
        },
    };
}
