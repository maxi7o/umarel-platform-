'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, DollarSign, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { useFormatter } from 'next-intl';
import { getDailyPayoutPreview, triggerDailyPayout } from '@/app/actions/cron-actions';

interface PayoutPreview {
    userId: string;
    userName: string;
    score: number;
    amount: number;
    percentage: string;
}

interface DashboardData {
    totalPool: number;
    totalScore: number;
    payouts: PayoutPreview[];
}

export function OverviewPanel() {
    const format = useFormatter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [executing, setExecuting] = useState(false);

    const fetchPreview = async () => {
        setLoading(true);
        try {
            const result = await getDailyPayoutPreview();
            if (result.success && result.data) {
                setData(result.data);
            } else {
                toast.error(result.error || 'Could not load payout preview');
                // Fallback empty data to show UI
                setData({ totalPool: 0, totalScore: 0, payouts: [] });
            }
        } catch (error) {
            toast.error('Could not load payout preview');
            setData({ totalPool: 0, totalScore: 0, payouts: [] });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPreview();
    }, []);

    const handleExecute = async () => {
        if (!confirm('Are you sure you want to distribute these funds? This action cannot be undone.')) return;

        setExecuting(true);
        try {
            const result = await triggerDailyPayout();

            if (result.success) {
                const successResult = result as any;
                toast.success(`Successfully distributed ${format.number((successResult.totalDistributed || 0) / 100, { style: 'currency', currency: 'ARS' })} to ${successResult.recipientCount} users! 💸`);
                fetchPreview();
            } else {
                const errorResult = result as any;
                toast.error(errorResult.message || errorResult.error || 'Payout failed');
            }
        } catch (error) {
            toast.error('Payout failed');
        } finally {
            setExecuting(false);
        }
    };

    if (loading) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-orange-500" /></div>;
    }

    if (!data) return <div>Error loading dashboard</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={fetchPreview}>Refresh Data</Button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-orange-50 to-white border-stone-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-stone-900">Yesterday's Pool (3%)</CardTitle>
                        <DollarSign className="h-4 w-4 text-stone-900" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-900">
                            {format.number(data.totalPool / 100, { style: 'currency', currency: 'ARS' })}
                        </div>
                        <p className="text-xs text-stone-900/80 mt-1">Ready for distribution</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Contributors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{data.payouts.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Users with helpful comments (24h)</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Savings Impact</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{data.totalScore}</div>
                        <p className="text-xs text-muted-foreground mt-1">Aggregate value created in 24h</p>
                    </CardContent>
                </Card>
            </div>

            {/* Payout Table */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Daily Payout Preview</CardTitle>
                            <CardDescription>Review distribution before executing</CardDescription>
                        </div>
                        {data.totalPool > 0 ? (
                            <Button
                                onClick={handleExecute}
                                disabled={executing}
                                className="bg-stone-900 hover:bg-stone-800 text-white font-bold"
                            >
                                {executing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : '💸'}
                                Run Daily Payout
                            </Button>
                        ) : (
                            <Button disabled variant="secondary">
                                No Funds to Distribute
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Impact Score</TableHead>
                                <TableHead className="text-right">Share %</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.payouts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No active contributors found for this period.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.payouts.map((payout) => (
                                    <TableRow key={payout.userId}>
                                        <TableCell className="font-medium">{payout.userName}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline" className="bg-stone-50 text-stone-900 border-stone-300">
                                                {payout.score} pts
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">{payout.percentage}</TableCell>
                                        <TableCell className="text-right font-bold text-stone-900">
                                            {format.number(payout.amount / 100, { style: 'currency', currency: 'ARS' })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Warning / Notes */}
            <div className="bg-stone-50 border border-stone-300 p-4 rounded-lg flex items-start gap-4">
                <AlertTriangle className="h-5 w-5 text-stone-900 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-yellow-800 text-sm">How this works</h4>
                    <p className="text-stone-900 text-sm mt-1">
                        The "Total Pool" comes from the 3% community fee on all <strong>released</strong> slices in the last 24 hours.
                        <br />
                        When you click "Run Daily Payout", this amount is distributed to the top 50 contributors above as <strong>Wallet Credit</strong>.
                        <br />
                        Note: This cron job usually runs automatically at 00:00 UTC. This button allows manual triggering.
                    </p>
                </div>
            </div>
        </div>
    );
}
