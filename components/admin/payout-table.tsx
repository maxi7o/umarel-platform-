"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PayoutItem {
    userId: string;
    userName: string;
    score: number;
    amount: number; // in cents
    percentage: string;
}

interface PayoutPreview {
    totalPool: number;
    totalScore: number;
    payouts: PayoutItem[];
}

export function PayoutTable({ initialData }: { initialData: PayoutPreview }) {
    const router = useRouter();
    const [isExecuting, setIsExecuting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleExecute = async () => {
        if (!confirm('Are you sure you want to distribute these funds to user wallets? This action cannot be undone.')) return;

        setIsExecuting(true);
        setResult(null);

        try {
            const res = await fetch('/api/admin/payouts/execute', {
                method: 'POST',
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to execute payouts');

            setResult({ success: true, message: `Successfully distributed $${(data.totalDistributed / 100).toFixed(2)} to ${data.count} users.` });
            router.refresh(); // Refresh to clear list if logic dictates (though API keeps calculating for last 7 days, so list might remain until window shifts)

        } catch (error: any) {
            setResult({ success: false, message: error.message });
        } finally {
            setIsExecuting(false);
        }
    };

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD', // or ARS
        }).format(cents / 100);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pool</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(initialData.totalPool)}</div>
                        <p className="text-xs text-muted-foreground">Available from released escrows (3%)</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Contribution</CardTitle>
                        <div className="h-4 w-4 text-muted-foreground">⚡️</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{initialData.totalScore} pts</div>
                        <p className="text-xs text-muted-foreground">Aggregate community score</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recipients</CardTitle>
                        <div className="h-4 w-4 text-muted-foreground">👥</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{initialData.payouts.length}</div>
                        <p className="text-xs text-muted-foreground">Active contributors</p>
                    </CardContent>
                </Card>
            </div>

            {result && (
                <div className={`p-4 rounded-md flex items-center gap-2 ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {result.success ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <p>{result.message}</p>
                </div>
            )}

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Distribution Preview</CardTitle>
                            <CardDescription>Review allocations before execution.</CardDescription>
                        </div>
                        <Button
                            onClick={handleExecute}
                            disabled={isExecuting || initialData.payouts.length === 0}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isExecuting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Execute Distribution'
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Share (%)</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialData.payouts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                        No active contributors found for this period.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                initialData.payouts.map((payout) => (
                                    <TableRow key={payout.userId}>
                                        <TableCell className="font-medium">{payout.userName}</TableCell>
                                        <TableCell>{payout.score}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{payout.percentage}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-green-600">
                                            {formatCurrency(payout.amount)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
