"use client"

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowRight } from 'lucide-react';
import { WithdrawButton } from './withdraw-button';
import { MIN_WITHDRAWAL_AMOUNT } from '@/lib/payments/calculations';

interface TheStashProps {
    balance: number; // in cents
    currency: string;
}

export function TheStash({ balance, currency }: TheStashProps) {
    const t = useTranslations('wallet');

    const formattedBalance = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: currency,
    }).format(balance / 100);

    return (
        <Card className="border-stone-200 dark:border-stone-700 shadow-sm h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-stone-700 dark:text-stone-300">
                    <Wallet className="h-5 w-5 text-green-600" />
                    {t('stash')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="p-4 bg-stone-100 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 relative overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#a8a29e_1px,transparent_1px)] [background-size:16px_16px]" />

                        <div className="relative z-10">
                            <div className="text-3xl font-mono font-bold text-stone-900 dark:text-stone-100">
                                {formattedBalance}
                            </div>
                            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 uppercase tracking-wider">
                                Disponible para retirar
                            </div>
                        </div>
                    </div>

                    <WithdrawButton
                        balance={balance}
                        canWithdraw={balance >= MIN_WITHDRAWAL_AMOUNT}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
