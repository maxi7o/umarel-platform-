
import { describe, it, expect } from 'vitest';
import {
    calculatePaymentBreakdown,
    distributeRewards,
    canWithdraw,
    MIN_WITHDRAWAL_AMOUNT,
    formatARS,
    validatePaymentAmount
} from '@/lib/payments/calculations';

describe('Payment Calculations', () => {
    // Test Case 1: Payment Breakdown
    it('calculates correct payment breakdown', () => {
        const breakdown = calculatePaymentBreakdown(1000000); // 10,000 ARS in cents

        // Platform Fee is 15% (Total)
        expect(breakdown.platformFee).toBe(150000);
        // Community Reward is 3%
        expect(breakdown.communityRewardPool).toBe(30000);
        // Revenue is 12%
        expect(breakdown.platformRevenue).toBe(120000);

        // Total Amount: (1M + 150k) / (1 - 0.085) = 1,256,831
        expect(breakdown.totalAmount).toBe(1256831);
    });

    // ... (Reward Distribution tests match)

    // Test Case 9: Payment Validation
    it('validates payment amounts correctly', () => {
        expect(validatePaymentAmount(1000000, 1256831)).toBe(true);
        expect(validatePaymentAmount(1000000, 1000000)).toBe(false); // Too low (missing fee)
    });
});
