"use client";

import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PriceBreakdownProps {
    totalAmount: number; // in cents
    role: 'client' | 'provider';
    currency?: string;
}

export function PriceBreakdown({ totalAmount, role, currency = 'ARS' }: PriceBreakdownProps) {
    const formatMoney = (amount: number) => {
        return (amount / 100).toLocaleString('es-AR', { style: 'currency', currency });
    };

    const platformFee = Math.round(totalAmount * 0.12);
    const communityPool = Math.round(totalAmount * 0.03);
    const providerNet = totalAmount - platformFee - communityPool;

    if (role === 'client') {
        return (
            <div className="space-y-1">
                <div className="flex items-center justify-between font-bold text-lg">
                    <span>Total Price</span>
                    <span>{formatMoney(totalAmount)}</span>
                </div>

                <TooltipProvider>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5 text-xs text-stone-500 cursor-help hover:text-stone-700 transition-colors w-max">
                                <Info className="w-3 h-3" />
                                <span>Includes 15% Platform & Community Fee</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="p-3 max-w-[250px] space-y-2 bg-stone-900 text-stone-100 border-stone-800">
                            <p className="font-bold border-b border-stone-700 pb-1 mb-1">Fee Breakdown</p>
                            <div className="flex justify-between text-xs">
                                <span>Provider Gets (85%)</span>
                                <span className="font-mono">{formatMoney(providerNet)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-blue-300">
                                <span>Umarel Platform (12%)</span>
                                <span className="font-mono">{formatMoney(platformFee)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-orange-300">
                                <span>Community Pool (3%)</span>
                                <span className="font-mono">{formatMoney(communityPool)}</span>
                            </div>
                            <p className="text-[10px] text-stone-400 pt-1 italic">
                                3% goes directly to pay the "Umarels" who audit requests.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        );
    }

    // Provider View
    return (
        <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 text-sm space-y-3">
            <h4 className="font-bold text-stone-700 mb-2">Earnings Breakdown</h4>

            <div className="flex justify-between items-center opacity-60">
                <span>Client Pays</span>
                <span className="font-mono">{formatMoney(totalAmount)}</span>
            </div>

            <div className="flex justify-between items-center text-red-500">
                <div className="flex items-center gap-1">
                    <span>Fees (15%)</span>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger><Info className="w-3 h-3" /></TooltipTrigger>
                            <TooltipContent>12% Platform + 3% Umarel Payroll</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <span className="font-mono">-{formatMoney(platformFee + communityPool)}</span>
            </div>

            <div className="flex justify-between items-center font-bold text-green-600 text-base pt-2 border-t border-stone-200">
                <span>You Receive (85%)</span>
                <span className="font-mono">{formatMoney(providerNet)}</span>
            </div>
        </div>
    );
}
