import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

/**
 * Aura Service: Manages the "Value Intent" reputation system.
 * Rules:
 * - Consistency & Commitment: Aura isn't bought, it's harvested through value.
 * - Reformation: Bad streaks can be redeemed through consistent good performance.
 * - Decay: Inactivity cools down old reputation to keep the ecosystem fresh.
 */

export const AURA_CONFIG = {
    DECAY_DAYS: 14, // Days of inactivity before decay starts
    DECAY_RATE: 0.05, // 5% reduction per inactive period
    REFORM_MULTIPLIER: 1.5, // Faster recovery for "reforming" users
    MIN_SUCCESS_STREAK: 5, // Tasks needed to trigger reform
};

export async function processAuraDecay() {
    console.log('🔄 Processing Aura Decay for inactive users...');

    // Reduce aura for users inactive for more than DECAY_DAYS
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - AURA_CONFIG.DECAY_DAYS);

    // This is a simplified logic that should run in a daily cron
    await db.update(users)
        .set({
            auraPoints: sql`floor(${users.auraPoints} * (1 - ${AURA_CONFIG.DECAY_RATE}))`
        })
        .where(sql`${users.lastCommentAt} < ${cutoffDate} AND ${users.auraPoints} > 100`);
}

export async function addAuraWithValueIntent(userId: string, points: number, isReforming = false) {
    const finalPoints = isReforming ? Math.round(points * AURA_CONFIG.REFORM_MULTIPLIER) : points;

    await db.update(users)
        .set({
            auraPoints: sql`${users.auraPoints} + ${finalPoints}`,
            // We could also track high-intent streaks here in a metrics table
        })
        .where(eq(users.id, userId));
}

/**
 * Reset Aura for serious breaches, but leave a path for reform.
 */
export async function penalizeAura(userId: string, amount: number) {
    await db.update(users)
        .set({
            auraPoints: sql`greatest(0, ${users.auraPoints} - ${amount})`
        })
        .where(eq(users.id, userId));
}
