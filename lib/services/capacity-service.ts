import { db } from '@/lib/db';
import { slices, users } from '@/lib/db/schema';
import { eq, and, or, count } from 'drizzle-orm';

// Capacity Limits by Aura Level
const AURA_CAPACITY = {
    bronze: 2,
    silver: 5,
    gold: 999, // Unlimited
    diamond: 999 // Unlimited
};

export async function checkProviderCapacity(providerId: string) {
    // 1. Get Provider Aura Level
    const provider = await db.query.users.findFirst({
        where: eq(users.id, providerId),
        columns: {
            auraLevel: true
        }
    });

    if (!provider) {
        return { allowed: false, reason: 'Provider not found' };
    }

    const level = provider.auraLevel || 'bronze';
    const limit = AURA_CAPACITY[level];

    // 2. Count Active Jobs
    // Active = 'pending_start' or 'in_progress' or 'disputed'
    const [activeSlices] = await db
        .select({ count: count() })
        .from(slices)
        .where(and(
            eq(slices.assignedProviderId, providerId),
            or(
                // eq(slices.status, 'pending_start'), // Removed as it was invalid
                // Valid Active Statuses:
                eq(slices.status, 'accepted'),
                eq(slices.status, 'disputed')
            )
        ));

    const currentActive = activeSlices?.count || 0;

    // 3. Check Limit
    if (currentActive >= limit) {
        return {
            allowed: false,
            reason: `Capacity reached for ${level} tier (${currentActive}/${limit} active jobs). Increase Aura to accept more.`
        };
    }

    return { allowed: true, currentActive, limit };
}
