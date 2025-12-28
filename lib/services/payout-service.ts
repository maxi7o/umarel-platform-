
import { db } from '@/lib/db';
import { dailyPayouts, users, userWallets, communityRewards, escrowPayments, wizardMessages, slices } from '@/lib/db/schema';
import { sql, and, eq, gte, lt, desc } from 'drizzle-orm';
import { NotificationService } from './notification-service';


export class PayoutService {
    /**
     * Process the daily payout distribution.
     * @param date The date to process payout for (defaults to today).
     * @param force If true, bypasses the "already processed" check.
     */
    static async processDailyPayout(date: Date = new Date(), force: boolean = false) {
        const today = new Date(date);
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Check if already processed today
        if (!force) {
            const existingPayout = await db.query.dailyPayouts.findFirst({
                where: sql`DATE(${dailyPayouts.date}) = DATE(${today})`,
            });

            if (existingPayout?.distributed) {
                return { success: false, message: 'Already processed today' };
            }
        }

        // 1. Calculate yesterday's 3% pool from released escrow payments
        const poolResult = await db
            .select({ total: sql<number>`sum(${escrowPayments.communityRewardPool})` })
            .from(escrowPayments)
            .where(and(
                eq(escrowPayments.status, 'released'),
                gte(escrowPayments.releasedAt, yesterday),
                lt(escrowPayments.releasedAt, today)
            ));

        const yesterdayPool = Number(poolResult[0]?.total) || 0;

        // If no pool, we still want to log that we checked, or maybe just return early.
        // The original logic returned message.
        if (yesterdayPool === 0) {
            return { success: false, message: 'No pool to distribute today' };
        }

        // 2. Get top 50 contributors of the day (based on helpful wizard messages)
        const topContributors = await db
            .select({
                userId: wizardMessages.userId,
                dailySavings: sql<number>`sum(${wizardMessages.savingsGenerated})`
            })
            .from(wizardMessages)
            .where(and(
                eq(wizardMessages.isMarkedHelpful, true),
                gte(wizardMessages.createdAt, yesterday),
                lt(wizardMessages.createdAt, today)
            ))
            .groupBy(wizardMessages.userId)
            .orderBy(desc(sql`sum(${wizardMessages.savingsGenerated})`))
            .limit(50);

        if (topContributors.length === 0) {
            return { success: false, message: 'No eligible contributors today' };
        }

        // 3. Calculate distribution
        const totalDailySavings = topContributors.reduce((sum, c) => sum + Number(c.dailySavings), 0);

        const distribution = topContributors.map(c => {
            const share = Number(c.dailySavings) / totalDailySavings;
            const amount = Math.floor(share * yesterdayPool);
            return {
                userId: c.userId,
                amount,
                auraScore: Number(c.dailySavings)
            };
        });

        // 4. Create payout record
        const [payout] = await db
            .insert(dailyPayouts)
            .values({
                date: today,
                totalPool: yesterdayPool,
                distributed: true,
                recipients: distribution,
                processedAt: new Date(),
            })
            .returning();

        // 5. Credit wallets and create reward records
        for (const recipient of distribution) {
            if (recipient.amount <= 0) continue;

            // Get or create wallet
            let wallet = await db.query.userWallets.findFirst({
                where: eq(userWallets.userId, recipient.userId),
            });

            if (wallet) {
                await db
                    .update(userWallets)
                    .set({
                        balance: (wallet.balance || 0) + recipient.amount,
                        totalEarned: (wallet.totalEarned || 0) + recipient.amount,
                        updatedAt: new Date(),
                    })
                    .where(eq(userWallets.userId, recipient.userId));
            } else {
                await db.insert(userWallets).values({
                    userId: recipient.userId,
                    balance: recipient.amount,
                    totalEarned: recipient.amount,
                });
            }

            // Create reward record
            await db.insert(communityRewards).values({
                userId: recipient.userId,
                sliceId: null, // Daily payout
                amount: recipient.amount,
                reason: `Daily Aura payout for ${new Date(yesterday).toLocaleDateString()}`,
                paidAt: new Date(),
                paymentMethod: 'wallet_credit',
            });
        }

        return {
            success: true,
            payoutId: payout.id,
            totalDistributed: yesterdayPool,
            recipientCount: distribution.length,
        };
    }

    /**
     * Get preview of the daily payout distribution.
     * @param date The date to process payout for (defaults to today).
     */
    static async getPreview(date: Date = new Date()) {
        const today = new Date(date);
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // 1. Calculate yesterday's 3% pool
        const poolResult = await db
            .select({ total: sql<number>`sum(${escrowPayments.communityRewardPool})` })
            .from(escrowPayments)
            .where(and(
                eq(escrowPayments.status, 'released'),
                gte(escrowPayments.releasedAt, yesterday),
                lt(escrowPayments.releasedAt, today)
            ));

        const yesterdayPool = Number(poolResult[0]?.total) || 0;

        // 2. Get top 50 contributors
        const topContributors = await db
            .select({
                userId: wizardMessages.userId,
                userName: users.fullName,
                dailySavings: sql<number>`sum(${wizardMessages.savingsGenerated})`
            })
            .from(wizardMessages)
            .leftJoin(users, eq(users.id, wizardMessages.userId))
            .where(and(
                eq(wizardMessages.isMarkedHelpful, true),
                gte(wizardMessages.createdAt, yesterday),
                lt(wizardMessages.createdAt, today)
            ))
            .groupBy(wizardMessages.userId, users.fullName)
            .orderBy(desc(sql`sum(${wizardMessages.savingsGenerated})`))
            .limit(50);

        // 3. Calculate distribution
        const totalDailySavings = topContributors.reduce((sum, c) => sum + Number(c.dailySavings), 0);

        const payouts = topContributors.map(c => {
            const share = Number(c.dailySavings) / (totalDailySavings || 1);
            const amount = Math.floor(share * yesterdayPool);
            return {
                userId: c.userId,
                userName: c.userName || 'Messages User',
                score: Number(c.dailySavings),
                percentage: (share * 100).toFixed(1) + '%',
                amount
            };
        });

        return {
            totalPool: yesterdayPool,
            totalScore: totalDailySavings,
            payouts
        };
    }

    /**
     * Process auto-release of funds for slices past their dispute window.
     */
    static async processAutoReleases() {
        const now = new Date();

        // 1. Find eligible slices
        const eligibleSlices = await db
            .select()
            .from(slices)
            .where(and(
                eq(slices.status, 'completed'),
                lt(slices.autoReleaseAt, now),
                // Ensure not already released or disputed
                // We check escrow status via join or by simple logic that release hasn't happened.
                // Best is to check if escrow is still 'in_escrow'
            ));

        const results = {
            processed: 0,
            failed: 0,
            details: [] as any[]
        };

        const { getPaymentStrategy } = await import('../payments/factory');

        for (const slice of eligibleSlices) {
            if (!slice.escrowPaymentId) continue;

            // Double check escrow status
            const escrow = await db.query.escrowPayments.findFirst({
                where: eq(escrowPayments.id, slice.escrowPaymentId) // escrowPaymentId is the UUID of the escrow record
            });

            if (!escrow || escrow.status !== 'in_escrow') continue;

            try {
                // Execute Release
                // Use explicit cast or ensure type safety if paymentMethod is string in DB vs specific union in Factory
                const strategy = getPaymentStrategy({ provider: escrow.paymentMethod as any });
                const releaseResult = await strategy.releaseFunds(slice.escrowPaymentId);

                if (releaseResult.success) {
                    // Update DB
                    await db.update(escrowPayments)
                        .set({
                            status: 'released',
                            releasedAt: new Date()
                        })
                        .where(eq(escrowPayments.id, escrow.id));

                    // NOTIFICATION: Funds Released (Auto)
                    if (escrow.providerId) {
                        const [provider] = await db.select().from(users).where(eq(users.id, escrow.providerId));
                        if (provider?.email) {
                            await NotificationService.notifyFundsReleased(
                                provider.email,
                                provider.fullName || 'Provider',
                                `Slice #${slice.id.slice(0, 8)}`, // Fallback title
                                escrow.sliceAmount
                            );
                        }
                    }

                    results.processed++;
                    results.details.push({ sliceId: slice.id, status: 'released' });
                } else {
                    results.failed++;
                    results.details.push({ sliceId: slice.id, error: 'Payment Provider Failed' });
                }
            } catch (error) {
                console.error(`Auto-release failed for slice ${slice.id}:`, error);
                results.failed++;
            }
        }

        return results;
    }
}
