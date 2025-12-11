/**
 * Aura System - Community Reputation & Rewards
 */

export type AuraLevel = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface AuraThresholds {
    bronze: number;
    silver: number;
    gold: number;
    diamond: number;
}

// Thresholds in cents (ARS)
export const AURA_THRESHOLDS: AuraThresholds = {
    bronze: 0,           // 0 ARS
    silver: 1000000,     // 10,000 ARS saved
    gold: 5000000,       // 50,000 ARS saved
    diamond: 20000000,   // 200,000 ARS saved
};

/**
 * Calculate Aura level based on total savings generated
 */
export function calculateAuraLevel(totalSavings: number): AuraLevel {
    if (totalSavings >= AURA_THRESHOLDS.diamond) return 'diamond';
    if (totalSavings >= AURA_THRESHOLDS.gold) return 'gold';
    if (totalSavings >= AURA_THRESHOLDS.silver) return 'silver';
    return 'bronze';
}

/**
 * Calculate Aura score (for daily payout distribution)
 * Higher level = higher multiplier
 */
export function calculateAuraScore(totalSavings: number, auraLevel: AuraLevel): number {
    const levelMultiplier = {
        bronze: 1,
        silver: 2,
        gold: 4,
        diamond: 8,
    };

    return totalSavings * levelMultiplier[auraLevel];
}

/**
 * Calculate savings generated from a helpful comment
 * Based on original price vs optimized price
 */
export function calculateSavings(originalPrice: number, optimizedPrice: number): number {
    return Math.max(0, originalPrice - optimizedPrice);
}

/**
 * Distribute daily 3% pool to top Aura users
 */
export function distributeDailyPool(
    totalPool: number,
    users: Array<{ userId: string; auraScore: number }>
): Array<{ userId: string; amount: number; auraScore: number }> {
    const totalScore = users.reduce((sum, u) => sum + u.auraScore, 0);

    if (totalScore === 0) {
        // Equal distribution if no scores
        const amountPerUser = Math.floor(totalPool / users.length);
        return users.map(u => ({
            userId: u.userId,
            amount: amountPerUser,
            auraScore: u.auraScore,
        }));
    }

    // Proportional distribution based on Aura score
    return users.map(u => ({
        userId: u.userId,
        amount: Math.floor((u.auraScore / totalScore) * totalPool),
        auraScore: u.auraScore,
    }));
}

/**
 * Get Aura badge color
 */
export function getAuraBadgeColor(level: AuraLevel): string {
    const colors = {
        bronze: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
        silver: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        gold: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
        diamond: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    };
    return colors[level];
}
