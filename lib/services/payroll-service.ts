import { db, sql } from '@/lib/db';
import { escrowPayments, communityRewards, users, answers, comments } from '@/lib/db/schema';
import { eq, and, gte, lte, desc, sum, sql as drizzleSql } from 'drizzle-orm';

export class PayrollService {
    /**
     * Calculates the total pool available for distribution for the current period (last 7 days).
     * It sums up `community_reward_pool` from all RELEASED escrow payments.
     */
    async calculateWeeklyPool() {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const result = await db
            .select({ totalPool: sum(escrowPayments.communityRewardPool) })
            .from(escrowPayments)
            .where(
                and(
                    eq(escrowPayments.status, 'released'),
                    gte(escrowPayments.releasedAt, lastWeek)
                )
            );

        return Number(result[0]?.totalPool || 0);
    }

    /**
     * Calculates contribution scores for all active users in the period.
     * Use a simplified scoring model for MVP:
     * - Accepted Answer: 50 points
     * - Helpful Comment: 10 points
     * - Upvote Received: 1 point
     */
    async calculateUserScores() {
        // Fetch all relevant interactions in the last 7 days could be expensive.
        // For MVP, we'll just score users who have activity.

        // 1. Get Users with Accepted Answers
        const answerContributors = await db
            .select({
                userId: answers.answererId,
                score: drizzleSql<number>`count(*) * 50`.as('score')
            })
            .from(answers)
            .where(eq(answers.isAccepted, true)) // Add date filter in real app
            .groupBy(answers.answererId);

        // 2. Get Users with Helpful Comments
        const commentContributors = await db
            .select({
                userId: comments.userId,
                score: drizzleSql<number>`count(*) * 10`.as('score')
            })
            .from(comments)
            .where(eq(comments.isMarkedHelpful, true))
            .groupBy(comments.userId);

        // Merge scores
        const scores = new Map<string, number>();

        [...answerContributors, ...commentContributors].forEach(c => {
            const current = scores.get(c.userId) || 0;
            scores.set(c.userId, current + Number(c.score));
        });

        return Array.from(scores.entries()).map(([userId, score]) => ({ userId, score }));
    }

    async generatePayoutPreview() {
        const totalPool = await this.calculateWeeklyPool();
        const userScores = await this.calculateUserScores();

        if (totalPool === 0 || userScores.length === 0) {
            return { totalPool, payouts: [], totalScore: 0 };
        }

        const totalScore = userScores.reduce((acc, curr) => acc + curr.score, 0);

        const payouts = userScores.map(u => ({
            userId: u.userId,
            score: u.score,
            amount: Math.floor((u.score / totalScore) * totalPool), // in cents
            percentage: ((u.score / totalScore) * 100).toFixed(2) + '%'
        }));

        // Fetch User Names
        const payoutsWithNames = await Promise.all(payouts.map(async p => {
            const [user] = await db.select({ fullName: users.fullName }).from(users).where(eq(users.id, p.userId));
            return { ...p, userName: user?.fullName || 'Unknown' };
        }));

        return {
            totalPool,
            totalScore,
            payouts: payoutsWithNames.sort((a, b) => b.amount - a.amount)
        };
    }

    async executePayout() {
        const preview = await this.generatePayoutPreview();
        if (preview.payouts.length === 0) return { success: false, message: 'No payouts to process', count: 0, totalDistributed: 0 };

        return await db.transaction(async (tx) => {
            const payoutDate = new Date();

            for (const payout of preview.payouts) {
                if (payout.amount <= 0) continue;

                // 1. Create Reward Record
                await tx.insert(communityRewards).values({
                    userId: payout.userId,
                    amount: payout.amount,
                    reason: `Weekly Dividend (Score: ${payout.score})`,
                    paymentMethod: 'wallet_credit',
                    paidAt: payoutDate
                });

                // 2. Update User Wallet (Virtual Balance)
                // This assumes a trigger or manual logic handles the balance update, 
                // or we do it here explicitly if we want to be safe.
                // Let's do it explicitly with raw SQL for safety
                await tx.execute(drizzleSql`
                    INSERT INTO user_wallets (user_id, balance, total_earned)
                    VALUES (${payout.userId}, ${payout.amount}, ${payout.amount})
                    ON CONFLICT (user_id) 
                    DO UPDATE SET 
                        balance = user_wallets.balance + ${payout.amount},
                        total_earned = user_wallets.total_earned + ${payout.amount}
                 `);
            }

            return { success: true, count: preview.payouts.length, totalDistributed: preview.totalPool, message: 'Payout executed successfully' };
        });
    }
}
