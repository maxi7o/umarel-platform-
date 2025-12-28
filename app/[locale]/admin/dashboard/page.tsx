
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, DollarSign, Users, Trophy } from 'lucide-react';
import { CurrencyDisplay } from '@/components/currency-display';

export default function AdminPayoutDashboard() {
    const [preview, setPreview] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    const fetchPreview = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/payouts/preview');
            if (!res.ok) {
                if (res.status === 403) throw new Error('Unauthorized');
                throw new Error('Failed to fetch preview');
            }
            const data = await res.json();
            setPreview(data);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExecute = async () => {
        if (!confirm('Are you sure you want to distribute these funds? This cannot be undone.')) return;

        setProcessing(true);
        try {
            const res = await fetch('/api/admin/payouts/execute', { method: 'POST' });
            if (!res.ok) throw new Error('Payout failed');

            const data = await res.json();
            toast.success(`Payout Executed! Run ID: ${data.runId}`);
            setPreview(null); // Clear preview to force refresh or show empty state
        } catch (error) {
            toast.error('Failed to execute payout');
        } finally {
            setProcessing(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchPreview();
    }, []);

    if (loading) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-stone-400" /></div>;
    }

    if (!preview) {
        return (
            <div className="p-8 text-center bg-stone-50 rounded-lg">
                <h2 className="text-xl font-bold text-stone-700">Access Denied or Error</h2>
                <p className="text-stone-500">You must be an Admin to view this page.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-8 max-w-5xl space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-stone-900">Weekly Dividend Engine</h1>
                    <p className="text-stone-500">Review and distribute the 3% Community Share.</p>
                </div>
                <Button onClick={fetchPreview} variant="outline" className="gap-2">
                    Refresh Preview 🔄
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-800 uppercase tracking-widest">Total Pool</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-green-700 font-mono flex items-center gap-2">
                            <DollarSign className="w-8 h-8 opacity-50" />
                            <CurrencyDisplay amount={preview.poolTotal} currency="ARS" />
                        </div>
                        <p className="text-xs text-green-600 mt-2">Aggregated from completed slices (last 7 days)</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-stone-500 uppercase tracking-widest">Contributors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-stone-700 font-mono flex items-center gap-2">
                            <Users className="w-8 h-8 opacity-20" />
                            {preview.payouts?.length || 0}
                        </div>
                        <p className="text-xs text-stone-400 mt-2">Users with positive impact score</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-stone-500 uppercase tracking-widest">Total Impact Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-orange-600 font-mono flex items-center gap-2">
                            <Trophy className="w-8 h-8 opacity-20" />
                            {preview.totalScore}
                        </div>
                        <p className="text-xs text-stone-400 mt-2">Sum of helpful comments & answers</p>
                    </CardContent>
                </Card>
            </div>

            {/* Payout Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Payout Distribution Preview</CardTitle>
                    <CardDescription>
                        Calculated based on: <strong>(User Score / Total Score) * Pool</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {preview.payouts?.length === 0 ? (
                        <div className="text-center py-12 text-stone-400">
                            No eligible contributors found for this period.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {preview.payouts.map((p: any) => (
                                <div key={p.userId} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs border border-orange-200">
                                            {p.score}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-stone-900">{p.fullName}</div>
                                            <div className="text-xs text-stone-500">{p.email}</div>
                                        </div>
                                    </div>
                                    <div className="font-mono font-bold text-green-600">
                                        <CurrencyDisplay amount={p.amount} currency="ARS" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Execute Button - The "Big Red Button" */}
            <div className="flex justify-end pt-4 pb-12">
                <Button
                    onClick={handleExecute}
                    disabled={processing || preview.payouts?.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-6 h-auto shadow-xl shadow-green-200"
                >
                    {processing ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing Payout...
                        </>
                    ) : (
                        <>
                            <DollarSign className="w-6 h-6 mr-2" />
                            Execute Weekly Payout 💸
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
