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
        if (!confirm('¿Estás seguro de que querés distribuir estos fondos a las billeteras de los usuarios? Esta acción no se puede deshacer.')) return;

        setIsExecuting(true);
        setResult(null);

        try {
            const res = await fetch('/api/admin/payouts/execute', {
                method: 'POST',
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Falló la ejecución de pagos');

            setResult({ success: true, message: `Se distribuyeron con éxito $${(data.totalDistributed / 100).toFixed(2)} a ${data.count} usuarios.` });
            router.refresh();

        } catch (error: any) {
            setResult({ success: false, message: error.message });
        } finally {
            setIsExecuting(false);
        }
    };

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(cents / 100);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pozo Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(initialData.totalPool)}</div>
                        <p className="text-xs text-muted-foreground">Disponible de garantías liberadas (3%)</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Contribución Total</CardTitle>
                        <div className="h-4 w-4 text-muted-foreground">⚡️</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{initialData.totalScore} pts</div>
                        <p className="text-xs text-muted-foreground">Puntaje comunitario agregado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Destinatarios</CardTitle>
                        <div className="h-4 w-4 text-muted-foreground">👥</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{initialData.payouts.length}</div>
                        <p className="text-xs text-muted-foreground">Contribuyentes activos</p>
                    </CardContent>
                </Card>
            </div>

            {result && (
                <div className={`p-4 rounded-md flex items-center gap-2 ${result.success ? 'bg-stone-50 text-stone-900' : 'bg-stone-50 text-red-700'}`}>
                    {result.success ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <p>{result.message}</p>
                </div>
            )}

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Vista Previa de Distribución</CardTitle>
                            <CardDescription>Revisá las asignaciones antes de ejecutar.</CardDescription>
                        </div>
                        <Button
                            onClick={handleExecute}
                            disabled={isExecuting || initialData.payouts.length === 0}
                            className="bg-stone-900 hover:bg-stone-800 text-white"
                        >
                            {isExecuting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                'Ejecutar Distribución'
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Puntaje</TableHead>
                                <TableHead>Cuota (%)</TableHead>
                                <TableHead className="text-right">Monto</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialData.payouts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                        No se encontraron contribuyentes activos para este período.
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
                                        <TableCell className="text-right font-bold text-stone-900">
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
