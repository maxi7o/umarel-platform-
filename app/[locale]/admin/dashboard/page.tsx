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

export default function AdminDashboard() {
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
            }
        } catch (error) {
            toast.error('Could not load payout preview');
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
                // Cast result to any to access success properties
                const successResult = result as any;
                toast.success(`Successfully distributed ${format.number((successResult.totalDistributed || 0) / 100, { style: 'currency', currency: 'ARS' })} to ${successResult.recipientCount} users! 💸`);
                fetchPreview(); // Refresh
            } else {
                // Cast result to any to access error properties
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
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-orange-500" /></div>;
    }

    if (!data) return <div>Error loading dashboard</div>;

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Admin Dashboard 🦉</h1>
                    <p className="text-muted-foreground">Manage the Umarel Ecosystem & Dividends</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchPreview}>Refresh</Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-orange-800">Yesterday's Pool (3%)</CardTitle>
                        <DollarSign className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-900">
                            {format.number(data.totalPool / 100, { style: 'currency', currency: 'ARS' })}
                        </div>
                        <p className="text-xs text-orange-600/80 mt-1">Ready for distribution</p>
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
                                className="bg-green-600 hover:bg-green-700 text-white font-bold"
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
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                {payout.score} pts
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">{payout.percentage}</TableCell>
                                        <TableCell className="text-right font-bold text-green-600">
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
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-4">
                <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-yellow-800 text-sm">How this works</h4>
                    <p className="text-yellow-700 text-sm mt-1">
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
