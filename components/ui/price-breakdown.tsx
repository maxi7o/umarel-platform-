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

    if (role === 'client') {
        return (
            <div className="space-y-1">
                <div className="flex items-center justify-between font-bold text-lg">
                    <span>Precio Final</span>
                    <span>{formatMoney(totalAmount)}</span>
                </div>
                <p className="text-xs text-stone-500 italic text-right">
                    Incluye todas las comisiones.
                </p>
            </div>
        );
    }

    // Provider View - Estimating simple 85% roughly for display, 
    // or arguably we should rely on the server passed values if we wanted precision.
    // Given the prompt, I'll simplify the text.
    // Note: totalAmount here seems to be used as "Client Pays".
    // If we want to show exact earnings, we'd need the base price.
    // For now, I'll keep the "Fees" generic.
    const approximateNet = Math.round(totalAmount * 0.78); // Rough estimate after MP + Platform (100 -> 115 + MP -> 125ish. 100/125 ~= 0.78)

    return (
        <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 text-sm space-y-3">
            <h4 className="font-bold text-stone-700 mb-2">Desglose de Ganancias</h4>

            <div className="flex justify-between items-center opacity-60">
                <span>Cliente Paga (Total)</span>
                <span className="font-mono">{formatMoney(totalAmount)}</span>
            </div>

            <div className="flex justify-between items-center font-bold text-green-600 text-base pt-2 border-t border-stone-200">
                <span>Usted Recibe (Aprox)</span>
                <span className="font-mono">{formatMoney(approximateNet)}</span>
            </div>
            <p className="text-[10px] text-stone-400 italic">
                El monto final exacto se calculará al procesar el pago.
            </p>
        </div>
    );
}
