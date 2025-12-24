
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateExperiencePrice } from '../../lib/services/pricing-engine';

describe('Experience Pricing Engine', () => {

    const baseConfig = {
        strategy: 'standard' as const,
        basePrice: 10000 // 100 ARS in cents
    };

    it('should return base price for standard strategy', () => {
        expect(calculateExperiencePrice(baseConfig, 0)).toBe(10000);
        expect(calculateExperiencePrice(baseConfig, 10)).toBe(10000);
    });

    const earlyBirdConfig = {
        strategy: 'early_bird' as const,
        basePrice: 10000,
        tiers: [{ count: 5, discount: 0.2 }] // 20% off for first 5
    };

    it('should apply discount for first 5 users (0-4)', () => {
        // First user (index 0) -> Discounted
        expect(calculateExperiencePrice(earlyBirdConfig, 0)).toBe(8000);
        // 4th user (index 3) -> Discounted
        expect(calculateExperiencePrice(earlyBirdConfig, 3)).toBe(8000);
        // 5th user (index 4) -> Discounted
        expect(calculateExperiencePrice(earlyBirdConfig, 4)).toBe(8000);
    });

    it('should charge full price for 6th user (index 5) onwards', () => {
        expect(calculateExperiencePrice(earlyBirdConfig, 5)).toBe(10000);
        expect(calculateExperiencePrice(earlyBirdConfig, 10)).toBe(10000);
    });

    const viralConfig = {
        strategy: 'viral' as const,
        basePrice: 10000,
        // Viral implies potential refund later, but join price is full
    };

    it('should charge base price initially for viral strategy', () => {
        expect(calculateExperiencePrice(viralConfig, 0)).toBe(10000);
        expect(calculateExperiencePrice(viralConfig, 10)).toBe(10000);
    });
});
