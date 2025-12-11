"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ApprovalActionsProps {
    sliceId: string;
    amount: number; // in cents
    currency: string;
}

export function ApprovalActions({ sliceId, amount, currency }: ApprovalActionsProps) {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRelease = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch(`/api/slices/${sliceId}/release`, {
                method: 'POST'
            });

            if (!res.ok) throw new Error("Failed to release funds");

            toast.success("¡Pago liberado correctamente!");
            router.refresh();

        } catch (error) {
            console.error(error);
            toast.error("Hubo un error al liberar el pago.");
        } finally {
            setIsProcessing(false);
        }
    };

    const formattedAmount = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: currency
    }).format(amount / 100);

    return (
        <Card className="border-green-200 bg-green-50/30 dark:border-green-900 dark:bg-green-900/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    Aprobar y Liberar Pago
                </CardTitle>
                <CardDescription>
                    Al aprobar, se liberarán <strong>{formattedAmount}</strong> al experto inmediatamente.
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-4">
                <Button
                    onClick={handleRelease}
                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md transition-all hover:scale-[1.02]"
                    disabled={isProcessing}
                    size="lg"
                >
                    {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                    Confirmar Trabajo
                </Button>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
                    Repo​​rtar Problema
                </Button>
            </CardFooter>
        </Card>
    );
}
