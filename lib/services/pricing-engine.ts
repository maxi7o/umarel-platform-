/**
 * Pricing Engine Service
 * Handles dynamic pricing calculations for experiences.
 */

export interface PricingConfig {
    strategy: 'standard' | 'early_bird' | 'viral';
    basePrice: number; // in cents
    tiers?: Array<{
        count: number; // e.g. "First 5"
        discount: number; // e.g. 0.20 for 20% off
    }>;
}

/**
 * Calculate the price for the NEXT participant.
 * @param config The pricing configuration of the experience.
 * @param currentParticipantsCount How many people have ALREADY joined.
 * @returns The price in cents.
 */
export function calculateExperiencePrice(
    config: PricingConfig,
    currentParticipantsCount: number
): number {
    const { strategy, basePrice, tiers } = config;

    // 1. Standard: Always base price
    if (strategy === 'standard') {
        return basePrice;
    }

    // 2. Early Bird: Checks if the current slot falls within a discounted tier
    if (strategy === 'early_bird' && tiers && tiers.length > 0) {
        // Sort tiers just in case
        const sortedTiers = [...tiers].sort((a, b) => a.count - b.count);

        // Find if we are in a tier
        // Example: Tier 1 is "First 5" (count=5).
        // If currentParticipantsCount is 0, 1, 2, 3, 4 -> It is < 5. Discount applies.
        for (const tier of sortedTiers) {
            if (currentParticipantsCount < tier.count) {
                const discountAmount = Math.round(basePrice * tier.discount);
                return Math.max(0, basePrice - discountAmount);
            }
        }
        // If no tier matches (late comer), full price.
        return basePrice;
    }

    // 3. Viral Pool: EVERYONE pays Base Price initially.
    // The discount is applied as a REFUND later if the goal is met.
    // So for the "Purchase" moment, it is always Base Price.
    if (strategy === 'viral') {
        return basePrice;
    }

    // Fallback
    return basePrice;
}
