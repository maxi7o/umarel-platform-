
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

        // Platform Fee is 12%
        expect(breakdown.platformFee).toBe(120000);
        // Community Reward is 3%
        expect(breakdown.communityRewardPool).toBe(30000);
        // Revenue is 9%
        expect(breakdown.platformRevenue).toBe(90000);

        // Total Amount: (1M + 120k) / (1 - 0.085) = 1,224,044
        expect(breakdown.totalAmount).toBe(1224044);
    });

    // Test Case 2: Reward Distribution
    it('distributes rewards proportionally based on hearts', () => {
        const rewards = distributeRewards(30000, [
            { commentId: '1', userId: 'user1', hearts: 10 },
            { commentId: '2', userId: 'user2', hearts: 5 },
            { commentId: '3', userId: 'user3', hearts: 5 },
        ]);

        // Total hearts = 20. 
        // User 1: 10/20 = 50% = 15000
        // User 2: 5/20 = 25% = 7500
        // User 3: 5/20 = 25% = 7500
        expect(rewards[0].amount).toBe(15000);
        expect(rewards[1].amount).toBe(7500);
        expect(rewards[2].amount).toBe(7500);
    });

    it('distributes rewards equally if no hearts', () => {
        const rewards = distributeRewards(30000, [
            { commentId: '1', userId: 'user1', hearts: 0 },
            { commentId: '2', userId: 'user2', hearts: 0 },
            { commentId: '3', userId: 'user3', hearts: 0 },
        ]);

        expect(rewards[0].amount).toBe(10000);
        expect(rewards[1].amount).toBe(10000);
        expect(rewards[2].amount).toBe(10000);
    });

    // Test Case 3: Withdrawal Eligibility
    it('validates withdrawal eligibility', () => {
        expect(canWithdraw(MIN_WITHDRAWAL_AMOUNT)).toBe(true);
        expect(canWithdraw(MIN_WITHDRAWAL_AMOUNT + 100)).toBe(true);
        expect(canWithdraw(MIN_WITHDRAWAL_AMOUNT - 1)).toBe(false);
        expect(canWithdraw(0)).toBe(false);
    });

    // Test Case 8: Currency Formatting
    it('formats ARS correctly', () => {
        // 100000 cents = $1,000
        // Check for presence of symbol and correct digits. 
        // Exact string might vary by locale implementation but normally "$ 1.000" or similar in es-AR
        const formatted = formatARS(100000);
        expect(formatted).toContain('1.000');
    });

    // Test Case 9: Payment Validation
    it('validates payment amounts correctly', () => {
        expect(validatePaymentAmount(1000000, 1224044)).toBe(true);
        expect(validatePaymentAmount(1000000, 1000000)).toBe(false); // Too low (missing fee)
    });
});
