
import { db } from '@/lib/db';
import { escrowPayments, comments, dailyPayouts } from '@/lib/db/schema';
import { sql, and, eq, gte, lt, desc } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminLaunchPage() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // 1. Get Today's Pool (from yesterday's released payments)
    const poolResult = await db
        .select({ total: sql<number>`sum(${escrowPayments.communityRewardPool})` })
        .from(escrowPayments)
        .where(and(
            eq(escrowPayments.status, 'released'),
            gte(escrowPayments.releasedAt, yesterday),
            lt(escrowPayments.releasedAt, today)
        ));
    const todaysPool = Number(poolResult[0]?.total) || 0;

    // 2. Get Top Umarels (Potential Recipients)
    const topContributors = await db
        .select({
            userId: comments.userId,
            dailySavings: sql<number>`sum(${comments.savingsGenerated})`
        })
        .from(comments)
        .where(and(
            eq(comments.isMarkedHelpful, true),
            gte(comments.createdAt, yesterday),
            lt(comments.createdAt, today)
        ))
        .groupBy(comments.userId)
        .orderBy(desc(sql`sum(${comments.savingsGenerated})`))
        .limit(10);

    const todayStr = today.toISOString().split('T')[0];

    // 3. Check if Payout Run
    const payoutRecord = await db.query.dailyPayouts.findFirst({
        where: sql`DATE(${dailyPayouts.date}) = ${todayStr}`,
    });

    async function triggerPayout() {
        'use server';
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cron/daily-payout`, {
                headers: {
                    'Authorization': `Bearer ${process.env.CRON_SECRET}`
                }
            });
            const data = await response.json();
            console.log('Payout triggered:', data);
            revalidatePath('/admin/umarel-launch');
        } catch (error) {
            console.error('Failed to trigger payout:', error);
        }
    }

    return (
        <div className="container mx-auto py-10 px-6">
            <h1 className="text-3xl font-bold mb-8">Umarel Launch Admin</h1>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Pool (3%)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-orange-600">
                            ${(todaysPool / 100).toLocaleString('es-AR')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            From released slices yesterday
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Contributors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-blue-600">
                            {topContributors.length}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Eligible for payout
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payout Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-2xl font-bold ${payoutRecord?.distributed ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {payoutRecord?.distributed ? 'Distributed' : 'Pending'}
                                </p>
                                {payoutRecord && (
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(payoutRecord.processedAt!).toLocaleTimeString()}
                                    </p>
                                )}
                            </div>
                            {!payoutRecord?.distributed && (
                                <form action={triggerPayout}>
                                    <Button type="submit" variant="destructive">
                                        Trigger Now
                                    </Button>
                                </form>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Top 10 Potential Recipients</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {topContributors.map((c, i) => (
                            <div key={c.userId} className="flex justify-between items-center border-b pb-2">
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-gray-500">#{i + 1}</span>
                                    <span className="font-mono text-sm">{c.userId}</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">${(Number(c.dailySavings) / 100).toLocaleString('es-AR')}</p>
                                    <p className="text-xs text-muted-foreground">Savings Generated</p>
                                </div>
                            </div>
                        ))}
                        {topContributors.length === 0 && (
                            <p className="text-muted-foreground text-center py-4">No contributors found for yesterday.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
