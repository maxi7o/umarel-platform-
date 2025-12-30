
import { db } from '@/lib/db';
import { users, providerMetrics } from '@/lib/db/schema';
import { sum } from 'drizzle-orm';

export async function getPlatformStats() {
    try {
        // Sum total earnings of all providers
        const [earningsResult] = await db.select({
            total: sum(providerMetrics.totalEarnings)
        }).from(providerMetrics);

        // Sum total savings (from users table)
        const [savingsResult] = await db.select({
            total: sum(users.totalSavingsGenerated)
        }).from(users);

        // Fallback to a "seed" number for demo purposes if 0
        // (In a real launch, we might want to start at 0, or import historical data)
        const realEarnings = Number(earningsResult?.total || 0);

        // For "Wow" factor in demo/staging, we can use a floor if it's 0
        // but for production correctness, let's return the real number.
        // The UI can decide to show a static marketing number if API returns 0.

        return {
            totalEarnings: realEarnings,
            totalSavings: Number(savingsResult?.total || 0)
        };
    } catch (error) {
        console.error("Failed to fetch platform stats", error);
        return { totalEarnings: 0, totalSavings: 0 };
    }
}
