/**
 * Payment Calculation Utilities
 * Handles all pricing calculations for the 15% fee model
 */

export const PLATFORM_FEE_PERCENTAGE = 0.12; // 12% Total Commission
export const COMMUNITY_REWARD_PERCENTAGE = 0.03; // 3% of Project Value (Remains 3%)
export const SHAREHOLDER_PERCENTAGE = 0.09; // 9% of Project Value (12% - 3%)
// Taxes are estimated but NOT deducted from the defined split in this model (User Requirement)
export const TAXES_AND_FEES_PERCENTAGE = 0.055;

// 8.5% Buffer for MercadoPago (approx 7% + VAT)
export const PAYMENT_PROCESSING_PERCENTAGE = 0.085;

/**
 * Calculate total payment breakdown for a slice
 * @param slicePrice - The agreed slice price in cents
 * @returns Object with all payment amounts
 */
export function calculatePaymentBreakdown(slicePrice: number) {
    const platformFee = Math.round(slicePrice * PLATFORM_FEE_PERCENTAGE);
    const subtotal = slicePrice + platformFee;

    // Calculate Total Amount such that after MP takes its %, we are left with the Subtotal
    // Formula: Total = Subtotal / (1 - ProcessingRate)
    const totalAmount = Math.ceil(subtotal / (1 - PAYMENT_PROCESSING_PERCENTAGE));
    const processingFee = totalAmount - subtotal;

    // Split the Platform Fee 75/25 (approx, based on 3% of BASE price)
    // Note: Community Reward is calculated on the BASE Slice Price as promised
    const communityRewardPool = Math.round(slicePrice * COMMUNITY_REWARD_PERCENTAGE);
    const platformRevenue = Math.round(slicePrice * SHAREHOLDER_PERCENTAGE);

    // Taxes are calculated for reference but don't eat into the split logic requested
    const taxesAndFees = Math.round(slicePrice * TAXES_AND_FEES_PERCENTAGE);

    return {
        slicePrice, // Amount provider receives
        platformFee, // Total 12% fee
        communityRewardPool, // 3% for community
        taxesAndFees,
        platformRevenue, // 9% for shareholders
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
