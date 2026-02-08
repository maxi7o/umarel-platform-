/**
 * Payment Calculation Utilities
 * Handles all pricing calculations for the 15% fee model
 */

export const SITE_COMMISSION_PERCENTAGE = 0.12; // 12% for El Entendido operation
export const CONTRIBUTORS_REWARD_PERCENTAGE = 0.03; // 3% for Umarel value providers
export const TOTAL_ECOSYSTEM_FEE = 0.15; // Total 15% added to project net value

// Processing fees are added ON TOP, not deducted from the 15%
export const PAYMENT_PROCESSING_PERCENTAGE = 0.085; // 8.5% Buffer for MercadoPago/Gateway

/**
 * Calculate total payment breakdown for a slice
 * @param slicePrice - The agreed slice price in cents
 * @returns Object with all payment amounts
 */
export function calculatePaymentBreakdown(slicePrice: number) {
    const ecosystemFee = Math.round(slicePrice * TOTAL_ECOSYSTEM_FEE);
    const subtotal = slicePrice + ecosystemFee;

    // Calculate Total Amount such that after MP takes its %, we are left with the Subtotal
    const totalAmount = Math.ceil(subtotal / (1 - PAYMENT_PROCESSING_PERCENTAGE));
    const processingFee = totalAmount - subtotal;

    // Split the Fee: 12% Site, 3% Contributors
    const communityRewardPool = Math.round(slicePrice * CONTRIBUTORS_REWARD_PERCENTAGE);
    const platformRevenue = Math.round(slicePrice * SITE_COMMISSION_PERCENTAGE);

    return {
        slicePrice, // Amount provider receives
        ecosystemFee, // Total 15% fee
        communityRewardPool, // 3% for community
        platformRevenue, // 12% for shareholders
        processingFee, // ~8.5% Buffer for Gateway
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
