"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { formatARS } from '@/lib/payments/calculations';

interface ApproveSliceButtonProps {
    sliceId: string;
    sliceTitle: string;
    providerAmount: number;
    communityRewards: number;
    onSuccess?: () => void;
}

export function ApproveSliceButton({
    sliceId,
    sliceTitle,
    providerAmount,
    communityRewards,
    onSuccess,
}: ApproveSliceButtonProps) {
    const [showDialog, setShowDialog] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleApprove = async () => {
        setIsApproving(true);
        setError(null);

        try {
            const response = await fetch(`/api/slices/${sliceId}/approve`, {
                method: 'POST',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to approve slice');
            }

            setShowDialog(false);
            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsApproving(false);
        }
    };

    return (
        <>
            <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setShowDialog(true)}
            >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Approve & Release Payment
            </Button>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Approve Completed Work?</DialogTitle>
                        <DialogDescription>
                            You're about to release payment for: <strong>{sliceTitle}</strong>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <p className="text-sm font-semibold mb-2">Payment Distribution:</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">→ Provider receives</span>
                                    <span className="font-semibold">{formatARS(providerAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">→ Community helpers</span>
                                    <span className="font-semibold text-orange-600">
                                        {formatARS(communityRewards)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                                <div className="text-sm">
                                    <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                                        This action is final
                                    </p>
                                    <p className="text-yellow-800 dark:text-yellow-200">
                                        Once you approve, the payment will be released immediately and cannot be
                                        reversed. Only approve if you're satisfied with the work.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowDialog(false)}
                            disabled={isApproving}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApprove}
                            disabled={isApproving}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isApproving ? 'Approving...' : 'Yes, Approve & Release Payment'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
