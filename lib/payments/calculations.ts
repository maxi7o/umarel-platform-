/**
 * Payment Calculation Utilities
 * Handles all pricing calculations for the 15% fee model
 */

export const PLATFORM_FEE_PERCENTAGE = 0.15; // 15% Total Commission
export const COMMUNITY_REWARD_PERCENTAGE = 0.03; // 3% of Project Value (Agreed "Solid" Rate)
export const SHAREHOLDER_PERCENTAGE = 0.12; // 12% of Project Value (15% - 3%)
// Taxes are estimated but NOT deducted from the defined split in this model (User Requirement)
export const TAXES_AND_FEES_PERCENTAGE = 0.055;

/**
 * Calculate total payment breakdown for a slice
 * @param slicePrice - The agreed slice price in cents
 * @returns Object with all payment amounts
 */
export function calculatePaymentBreakdown(slicePrice: number) {
    const platformFee = Math.round(slicePrice * PLATFORM_FEE_PERCENTAGE);

    // Split the Fee 70/30
    const communityRewardPool = Math.round(slicePrice * COMMUNITY_REWARD_PERCENTAGE);
    const platformRevenue = Math.round(slicePrice * SHAREHOLDER_PERCENTAGE);

    // Taxes are calculated for reference but don't eat into the split logic requested
    const taxesAndFees = Math.round(slicePrice * TAXES_AND_FEES_PERCENTAGE);

    const totalAmount = slicePrice + platformFee;

    return {
        slicePrice, // Amount provider receives
        platformFee, // Total 15% fee
        communityRewardPool, // 3% for community
        taxesAndFees, // Estimated taxes (not part of fee split equation here)
        platformRevenue, // 12% for shareholders
        totalAmount, // What client pays
    };
}

/**
 * Format currency for Argentina (ARS)
 */
export function formatARS(cents: number): string {
    const amount = cents / 100;
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Distribute community rewards based on hearts
 * @param totalPool - Total reward pool in cents (3% of slice price)
 * @param helpfulComments - Array of {commentId, userId, hearts}
 * @returns Array of {userId, amount, commentId}
 */
export function distributeRewards(
    totalPool: number,
    helpfulComments: Array<{ commentId: string; userId: string; hearts: number }>
) {
    const totalHearts = helpfulComments.reduce((sum, c) => sum + c.hearts, 0);

    if (totalHearts === 0) {
        // If no hearts, distribute equally
        const amountPerComment = Math.floor(totalPool / helpfulComments.length);
        return helpfulComments.map(c => ({
            userId: c.userId,
            commentId: c.commentId,
            amount: amountPerComment,
        }));
    }

    // Distribute proportionally to hearts
    return helpfulComments.map(c => ({
        userId: c.userId,
        commentId: c.commentId,
        amount: Math.floor((c.hearts / totalHearts) * totalPool),
    }));
}

/**
 * Validate payment amount matches expected calculation
 */
export function validatePaymentAmount(slicePrice: number, totalPaid: number): boolean {
    const expected = calculatePaymentBreakdown(slicePrice);
    // Allow 1 cent tolerance for rounding
    return Math.abs(totalPaid - expected.totalAmount) <= 1;
}

/**
 * Calculate minimum withdrawal amount (500 ARS = 50000 cents)
 */
export const MIN_WITHDRAWAL_AMOUNT = 50000; // 500 ARS in cents

/**
 * Check if user can withdraw from wallet
 */
export function canWithdraw(balance: number): boolean {
    return balance >= MIN_WITHDRAWAL_AMOUNT;
}
