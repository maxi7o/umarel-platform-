
import { addHours, differenceInHours, differenceInDays } from 'date-fns';

export type PricingStrategy = 'standard' | 'distressed' | 'early_bird' | 'viral';

export interface PricingContext {
    basePrice: number; // in cents
    strategy: PricingStrategy;
    eventDate?: Date; // When the service/experience happens (Required for distressed/early_bird)
    bookingDate: Date; // Now
    occupancyRate?: number; // 0.0 to 1.0 (Optional)
    currentParticipantsCount?: number;
}

export interface PricingResult {
    finalPrice: number; // in cents
    discountAmount: number; // in cents
    discountPercentage: number; // 0-100
    appliedStrategy: PricingStrategy;
    reason: string;
}

/**
 * Calculates the price for an experience based on the selected strategy and time factors.
 * This is the core logic for the "Distressed Inventory" and "Early Bird" models.
 */
export function calculateDynamicPrice(ctx: PricingContext): PricingResult {
    const { basePrice, strategy, eventDate, bookingDate } = ctx;

    // Default result (Standard)
    let finalPrice = basePrice;
    let discountAmount = 0;
    let discountPercentage = 0;
    let reason = "Standard pricing applied.";

    if (strategy === 'distressed' && eventDate) {
        const hoursUntilEvent = differenceInHours(eventDate, bookingDate);

        // If it's very close (e.g. < 24 hours)
        if (hoursUntilEvent <= 6 && hoursUntilEvent > 0) {
            // FIRE SALE: Last 6 hours
            discountPercentage = 40;
            reason = "Last minute 'Fire Sale' discount applied.";
        } else if (hoursUntilEvent <= 24 && hoursUntilEvent > 0) {
            // 24 Hour Warning
            discountPercentage = 20;
            reason = "24h remaining discount applied.";
        } else if (hoursUntilEvent <= 48 && hoursUntilEvent > 0) {
            // 48 Hour
            discountPercentage = 10;
            reason = "48h remaining discount applied.";
        }
    } else if (strategy === 'early_bird' && eventDate) {
        const daysUntilEvent = differenceInDays(eventDate, bookingDate);

        if (daysUntilEvent >= 30) {
            discountPercentage = 25;
            reason = "Super Early Bird discount (30+ days).";
        } else if (daysUntilEvent >= 14) {
            discountPercentage = 15;
            reason = "Early Bird discount (14+ days).";
        }
    }

    // A/B Testing Hook (Placeholder)
    // We could randomly adjust discountPercentage slightly to test elasticity
    // if (process.env.ENABLE_PRICING_EXPERIMENTS) { ... }

    if (discountPercentage > 0) {
        discountAmount = Math.round(basePrice * (discountPercentage / 100));
        finalPrice = basePrice - discountAmount;
    }

    return {
        finalPrice,
        discountAmount,
        discountPercentage,
        appliedStrategy: strategy,
        reason
    };
}
