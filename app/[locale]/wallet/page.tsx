import { db } from '@/lib/db';
import { userWallets, communityRewards, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, DollarSign, Award } from 'lucide-react';
import { formatARS, canWithdraw, MIN_WITHDRAWAL_AMOUNT } from '@/lib/payments/calculations';
import { WithdrawButton } from '@/components/wallet/withdraw-button';
import { AuraLeaderboard } from '@/components/wallet/aura-leaderboard';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function WalletPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const userId = user.id;

    // Get user details (Aura level)
    const currentUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    // Get or create wallet
    let wallet = await db.query.userWallets.findFirst({
        where: eq(userWallets.userId, userId),
    });

    if (!wallet) {
        [wallet] = await db
            .insert(userWallets)
            .values({ userId })
            .returning();
    }

    // Get recent rewards
    const recentRewards = await db.query.communityRewards.findMany({
        where: eq(communityRewards.userId, userId),
        orderBy: (rewards, { desc }) => [desc(rewards.createdAt)],
        limit: 10,
    });

    // Get leaderboard data
    const topUsers = await db.query.users.findMany({
        orderBy: [desc(users.totalSavingsGenerated)],
        limit: 10,
    });

    const leaderboardUsers = topUsers.map((u, index) => ({
        id: u.id,
        name: u.fullName || 'Anonymous Umarel',
        avatarUrl: u.avatarUrl,
        auraLevel: u.auraLevel || 'bronze',
        totalSavings: u.totalSavingsGenerated || 0,
        rank: index + 1,
    }));

    const canWithdrawNow = canWithdraw(wallet.balance || 0);

    return (
        <div className="container mx-auto max-w-6xl px-6 py-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Your Wallet</h1>
                    <p className="text-muted-foreground">
                        Community rewards earned from helping others optimize their projects
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full border border-purple-200 dark:border-purple-800">
                    <Award className="h-5 w-5 text-purple-600" />
                    <span className="font-bold text-purple-900 dark:text-purple-100">
                        {currentUser?.auraLevel?.toUpperCase() || 'BRONZE'} LEVEL
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Balance Card */}
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-orange-600 rounded-full">
                                        <Wallet className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Available Balance</p>
                                        <p className="text-4xl font-bold text-orange-600">
                                            {formatARS(wallet.balance || 0)}
                                        </p>
                                    </div>
                                </div>
                                <WithdrawButton
                                    balance={wallet.balance || 0}
                                    canWithdraw={canWithdrawNow}
                                />
                            </div>

                            {!canWithdrawNow && (
                                <p className="text-sm text-muted-foreground">
                                    Minimum withdrawal: {formatARS(MIN_WITHDRAWAL_AMOUNT)}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                    Total Earned
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{formatARS(wallet.totalEarned || 0)}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    From {recentRewards.length} helpful contributions
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                    Total Withdrawn
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{formatARS(wallet.totalWithdrawn || 0)}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Transferred to your account
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Rewards */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Rewards</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentRewards.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No rewards yet</p>
                                    <p className="text-sm mt-2">
                                        Help others optimize their projects to earn community rewards!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentRewards.map((reward) => (
                                        <div
                                            key={reward.id}
                                            className="flex items-center justify-between p-3 rounded-lg border"
                                        >
                                            <div>
                                                <p className="font-semibold">{formatARS(reward.amount)}</p>
                                                <p className="text-sm text-muted-foreground">{reward.reason}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {reward.createdAt ? new Date(reward.createdAt).toLocaleDateString() : '-'}
                                                </p>
                                            </div>
                                            {reward.paidAt && (
                                                <div className="text-green-600 text-sm font-semibold">Paid</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <AuraLeaderboard users={leaderboardUsers} />
                </div>
            </div>
        </div>
    );
}
