import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { dailyPayouts, users, userWallets, communityRewards, escrowPayments, comments, wizardMessages } from '@/lib/db/schema';
import { distributeDailyPool, calculateAuraScore } from '@/lib/aura/calculations';
import { sql, and, eq, gte, lt, desc } from 'drizzle-orm';

/**
 * Daily Payout Cron Job
 * Run at 00:00 UTC daily
 * Distributes 3% community pool to top Aura users
 */
export async function GET(request: NextRequest) {
    try {
        // Verify cron secret
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Check if already processed today
        const existingPayout = await db.query.dailyPayouts.findFirst({
            where: sql`DATE(${dailyPayouts.date}) = DATE(${today})`,
        });

        if (existingPayout?.distributed) {
            return NextResponse.json({ message: 'Already processed today' });
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

        if (yesterdayPool === 0) {
            return NextResponse.json({ message: 'No pool to distribute today' });
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
            return NextResponse.json({ message: 'No eligible contributors today' });
        }

        // 3. Calculate distribution
        const totalDailySavings = topContributors.reduce((sum, c) => sum + Number(c.dailySavings), 0);

        const distribution = topContributors.map(c => {
            const share = Number(c.dailySavings) / totalDailySavings;
            const amount = Math.floor(share * yesterdayPool);
            return {
                userId: c.userId,
                amount,
                auraScore: Number(c.dailySavings) // Using daily savings as the score for this distribution
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

        return NextResponse.json({
            success: true,
            payoutId: payout.id,
            totalDistributed: yesterdayPool,
            recipientCount: distribution.length,
        });
    } catch (error) {
        console.error('Daily payout error:', error);
        return NextResponse.json(
            { error: 'Failed to process daily payout' },
            { status: 500 }
        );
    }
}
