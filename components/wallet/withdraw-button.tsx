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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, AlertCircle } from 'lucide-react';
import { formatARS, MIN_WITHDRAWAL_AMOUNT } from '@/lib/payments/calculations';

interface WithdrawButtonProps {
    balance: number;
    canWithdraw: boolean;
    onSuccess?: () => void;
}

export function WithdrawButton({ balance, canWithdraw, onSuccess }: WithdrawButtonProps) {
    const [showDialog, setShowDialog] = useState(false);
    const [amount, setAmount] = useState('');
    const [email, setEmail] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleWithdraw = async () => {
        setIsProcessing(true);
        setError(null);

        const amountCents = Math.round(parseFloat(amount) * 100);

        if (isNaN(amountCents) || amountCents <= 0) {
            setError('Please enter a valid amount');
            setIsProcessing(false);
            return;
        }

        if (amountCents > balance) {
            setError('Amount exceeds available balance');
            setIsProcessing(false);
            return;
        }

        if (!email || !email.includes('@')) {
            setError('Please enter a valid Mercado Pago email');
            setIsProcessing(false);
            return;
        }

        try {
            const response = await fetch('/api/wallet/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: amountCents,
                    mercadoPagoEmail: email,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Withdrawal failed');
            }

            setShowDialog(false);
            setAmount('');
            setEmail('');
            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Button
                size="lg"
                disabled={!canWithdraw}
                onClick={() => setShowDialog(true)}
                className="bg-orange-600 hover:bg-orange-700"
            >
                <Download className="mr-2 h-5 w-5" />
                Withdraw
            </Button>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Withdraw to Mercado Pago</DialogTitle>
                        <DialogDescription>
                            Transfer your earnings to your Mercado Pago account
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <p className="text-sm">
                                <strong>Available Balance:</strong> {formatARS(balance)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Minimum withdrawal: {formatARS(MIN_WITHDRAWAL_AMOUNT)}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (ARS)</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="1000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min={MIN_WITHDRAWAL_AMOUNT / 100}
                                max={balance / 100}
                                step="100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Mercado Pago Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                The email associated with your Mercado Pago account
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowDialog(false)}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleWithdraw}
                            disabled={isProcessing}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            {isProcessing ? 'Processing...' : 'Withdraw'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
