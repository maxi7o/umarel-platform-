'use client';

import { useState } from 'react';
import { overrideDispute } from '@/app/actions/admin-dispute-actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Gavel, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function AdminDisputeControls({ disputeId, status }: { disputeId: string, status: string }) {
    const [reason, setReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleOverride = async (decision: 'release' | 'refund') => {
        if (!reason || reason.length < 10) {
            toast.error("Please provide a detailed legal reason for this override.");
            return;
        }

        if (!confirm(`CONFIRM SUPREME COURT OVERRIDE:\n\nForce ${decision.toUpperCase()}?\nThis is irreversible.`)) return;

        setIsProcessing(true);
        try {
            await overrideDispute(disputeId, decision, reason);
            toast.success(`Override Executed: ${decision.toUpperCase()}`);
            setReason('');
        } catch (e: any) {
            toast.error(e.message || "Override failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const isResolved = status.startsWith('resolved');

    if (isResolved) {
        return (
            <Card className="border-green-200 bg-green-50">
                <CardHeader className="flex flex-row items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                        <CardTitle className="text-green-800">Case Closed</CardTitle>
                        <CardDescription>This dispute has been resolved.</CardDescription>
                    </div>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
            <CardHeader>
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <Gavel className="h-5 w-5" />
                    <CardTitle>Supreme Court Override</CardTitle>
                </div>
                <CardDescription className="text-red-600/80">
                    Emergency Power: Force a binding logic bypass. This action overrides AI and Jury.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="Legal Reasoning / Justification (Required)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="bg-white dark:bg-black"
                />

                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="destructive"
                        onClick={() => handleOverride('refund')}
                        disabled={isProcessing}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Force REFUND (Client Wins)
                    </Button>
                    <Button
                        variant="default" // Using default (primary) for Release usually implies success/completion? Or Blue?
                        onClick={() => handleOverride('release')}
                        disabled={isProcessing}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Force RELEASE (Provider Wins)
                    </Button>
                </div>

                <div className="flex items-center gap-2 text-xs text-red-600 mt-2">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Warning: Executes immediate ledger entry and Reputation penalty.</span>
                </div>
            </CardContent>
        </Card>
    );
}
