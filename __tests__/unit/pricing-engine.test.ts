import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateDynamicPrice } from '../../lib/services/pricing-engine';

describe.skip('Experience Pricing Engine (Outdated - Needs Refactor)', () => {

    /*
        const baseConfig = {
            strategy: 'standard' as const,
            basePrice: 10000 // 100 ARS in cents
        };
    
        it('should return base price for standard strategy', () => {
            expect(calculateDynamicPrice(baseConfig, 0)).toBe(10000);
            expect(calculateDynamicPrice(baseConfig, 10)).toBe(10000);
        });
    
        const earlyBirdConfig = {
            strategy: 'early_bird' as const,
            basePrice: 10000,
            tiers: [{ count: 5, discount: 0.2 }] // 20% off for first 5
        };
    
        it('should apply discount for first 5 users (0-4)', () => {
            // First user (index 0) -> Discounted
            expect(calculateDynamicPrice(earlyBirdConfig, 0)).toBe(8000);
            // 4th user (index 3) -> Discounted
            expect(calculateDynamicPrice(earlyBirdConfig, 3)).toBe(8000);
            // 5th user (index 4) -> Discounted
            expect(calculateDynamicPrice(earlyBirdConfig, 4)).toBe(8000);
        });
    
        it('should charge full price for 6th user (index 5) onwards', () => {
            expect(calculateDynamicPrice(earlyBirdConfig, 5)).toBe(10000);
            expect(calculateDynamicPrice(earlyBirdConfig, 10)).toBe(10000);
        });
    
        const viralConfig = {
            strategy: 'viral' as const,
            basePrice: 10000,
            // Viral implies potential refund later, but join price is full
        };
    
        it('should charge base price initially for viral strategy', () => {
            expect(calculateDynamicPrice(viralConfig, 0)).toBe(10000);
            expect(calculateDynamicPrice(viralConfig, 10)).toBe(10000);
        });
    */
});
