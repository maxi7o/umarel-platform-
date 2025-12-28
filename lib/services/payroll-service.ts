
import { db } from '@/lib/db';
import {
    escrowPayments,
    slices,
    comments,
    answers,
    users,
    communityRewards,
    dailyPayouts,
    userWallets
} from '@/lib/db/schema';
import { eq, and, gt, gte, lte, sql, sum, desc } from 'drizzle-orm';

/**
 * Weekly Dividend Engine
 * Calculates the 3% Community Pool from completed slices and distributes it 
 * to users who contributed value (Helpful Comments, Accepted Answers).
 */
export class PayrollService {

    // 1. Calculate the Total Pool for a given period
    async calculatePool(startDate: Date, endDate: Date) {
        // Sum 'communityRewardPool' from escrowPayments where status is RELEASED
        // and releasedAt is within the window.
        // NOTE: In strict accounting, we use 'releasedAt'.

        const result = await db
            .select({
                totalPool: sum(escrowPayments.communityRewardPool)
            })
            .from(escrowPayments)
            .where(and(
                eq(escrowPayments.status, 'released'),
                gte(escrowPayments.releasedAt, startDate),
                lte(escrowPayments.releasedAt, endDate)
            ));

        const totalCents = Number(result[0]?.totalPool) || 0;
        return totalCents;
    }

    // 2. Score Contributors
    // Who gets the money?
    // - Accepted Answer: 10 points
    // - Helpful Comment: 2 points
    // - Upvoted Answer: 1 point per upvote
    async calculateUserScores(startDate: Date, endDate: Date) {
        const scores = new Map<string, number>();

        // A. Fetch Accepted Answers in period
        // (Assuming we track 'createdAt' of the answer, or ideally 'acceptedAt' which we might lack, 
        // so we'll use createdAt for MVP or if we added an acceptedAt field. 
        // Let's use createdAt for now to simplify, or assume payout covers all historical unpaid? 
        // Better: "Active in last week". Let's use createdAt for the contribution itself.)
        const acceptedAnswers = await db
            .select({ userId: answers.answererId })
            .from(answers)
            .where(and(
                eq(answers.isAccepted, true),
                gte(answers.createdAt, startDate),
                lte(answers.createdAt, endDate)
            ));

        acceptedAnswers.forEach(a => {
            scores.set(a.userId, (scores.get(a.userId) || 0) + 10);
        });

        // B. Fetch Helpful Comments
        const helpfulComments = await db
            .select({ userId: comments.userId })
            .from(comments)
            .where(and(
                eq(comments.isMarkedHelpful, true),
                gte(comments.createdAt, startDate),
                lte(comments.createdAt, endDate)
            ));

        helpfulComments.forEach(c => {
            scores.set(c.userId, (scores.get(c.userId) || 0) + 2);
        });

        return scores;
    }

    // 3. Generate Preview (Who gets what?)
    async generatePreview() {
        // Default to "Last 7 Days"
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const poolCents = await this.calculatePool(startDate, endDate);
        const userScores = await this.calculateUserScores(startDate, endDate);

        let totalScore = 0;
        userScores.forEach(score => totalScore += score);

        const payouts = [];
        // Iterate users and calc share
        // Share = (UserScore / TotalScore) * Pool

        for (const [userId, score] of userScores.entries()) {
            if (totalScore > 0) {
                const amount = Math.floor((score / totalScore) * poolCents);
                if (amount > 0) {
                    // Fetch user name for UI
                    const [u] = await db.select({ fullName: users.fullName, email: users.email }).from(users).where(eq(users.id, userId));

                    payouts.push({
                        userId,
                        fullName: u?.fullName || 'Unknown',
                        email: u?.email,
                        score,
                        amount // cents
                    });
                }
            }
        }

        // Sort by amount desc
        payouts.sort((a, b) => b.amount - a.amount);

        return {
            period: { start: startDate, end: endDate },
            poolTotal: poolCents,
            totalScore,
            payouts
        };
    }

    // 4. Execute Payout (Commit to DB)
    async executePayout(previewData: any) {
        // A. Record the Daily Payout Run
        const [payoutRun] = await db.insert(dailyPayouts).values({
            date: new Date(),
            totalPool: previewData.poolTotal,
            distributed: true,
            recipients: previewData.payouts.map((p: any) => ({
                userId: p.userId,
                amount: p.amount,
                score: p.score
            })),
            processedAt: new Date()
        }).returning();

        // B. Credit Users (Virtual Wallet Balance)
        // We do NOT send real money yet (manual withdraws later). We just update 'user_wallets.balance'.
        for (const p of previewData.payouts) {

            // 1. Add to Wallet Balance
            // We use a SQL increment to be safe
            await db.update(userWallets)
                .set({
                    balance: sql`${userWallets.balance} + ${p.amount}`,
                    totalEarned: sql`${userWallets.totalEarned} + ${p.amount}`
                })
                .where(eq(userWallets.userId, p.userId));

            // 2. Log in Community Rewards history
            await db.insert(communityRewards).values({
                userId: p.userId,
                amount: p.amount,
                reason: `Weekly Dividend (Score: ${p.score})`,
                paidAt: new Date(),
                paymentMethod: 'wallet_credit'
            });
        }

        return payoutRun;
    }
}
