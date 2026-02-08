'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, DollarSign, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { useFormatter } from 'next-intl';
import { getDailyPayoutPreview, triggerDailyPayout } from '@/app/actions/cron-actions';

interface PayoutPreview {
    userId: string;
    userName: string;
    score: number;
    amount: number;
    percentage: string;
}

interface DashboardData {
    totalPool: number;
    totalScore: number;
    payouts: PayoutPreview[];
}

export function OverviewPanel() {
    const format = useFormatter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [executing, setExecuting] = useState(false);

    const fetchPreview = async () => {
        setLoading(true);
        try {
            const result = await getDailyPayoutPreview();
            if (result.success && result.data) {
                setData(result.data);
            } else {
                toast.error(result.error || 'Could not load payout preview');
                // Fallback empty data to show UI
                setData({ totalPool: 0, totalScore: 0, payouts: [] });
            }
        } catch (error) {
            toast.error('Could not load payout preview');
            setData({ totalPool: 0, totalScore: 0, payouts: [] });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPreview();
    }, []);

    const handleExecute = async () => {
        if (!confirm('Are you sure you want to distribute these funds? This action cannot be undone.')) return;

        setExecuting(true);
        try {
            const result = await triggerDailyPayout();

            if (result.success) {
                const successResult = result as any;
                toast.success(`Successfully distributed ${format.number((successResult.totalDistributed || 0) / 100, { style: 'currency', currency: 'ARS' })} to ${successResult.recipientCount} users! 💸`);
                fetchPreview();
            } else {
                const errorResult = result as any;
                toast.error(errorResult.message || errorResult.error || 'Payout failed');
            }
        } catch (error) {
            toast.error('Payout failed');
        } finally {
            setExecuting(false);
        }
    };

    if (loading) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-orange-500" /></div>;
    }

    if (!data) return <div>Error cargando el panel</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={fetchPreview}>Actualizar Datos</Button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-orange-50 to-white border-stone-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-stone-900">Pozo Acumulado (3%)</CardTitle>
                        <DollarSign className="h-4 w-4 text-stone-900" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-900">
                            {format.number(data.totalPool / 100, { style: 'currency', currency: 'ARS' })}
                        </div>
                        <p className="text-xs text-stone-900/80 mt-1">Listo para distribuir / Ayer</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Contribuyentes Activos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{data.payouts.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Usuarios con aportes útiles (24h)</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Impacto Total (Ahorro)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{data.totalScore}</div>
                        <p className="text-xs text-muted-foreground mt-1">Valor agregado en 24h</p>
                    </CardContent>
                </Card>
            </div>

            {/* Payout Table */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Previsualización de Pago Diario</CardTitle>
                            <CardDescription>Revisá la distribución antes de ejecutar.</CardDescription>
                        </div>
                        {data.totalPool > 0 ? (
                            <Button
                                onClick={handleExecute}
                                disabled={executing}
                                className="bg-stone-900 hover:bg-stone-800 text-white font-bold"
                            >
                                {executing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : '💸'}
                                Ejecutar Pago Diario
                            </Button>
                        ) : (
                            <Button disabled variant="secondary">
                                Sin Fondos para Distribuir
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead className="text-right">Puntaje Impacto</TableHead>
                                <TableHead className="text-right">% Participación</TableHead>
                                <TableHead className="text-right">Monto</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.payouts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No se encontraron contribuyentes activos en este período.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.payouts.map((payout) => (
                                    <TableRow key={payout.userId}>
                                        <TableCell className="font-medium">{payout.userName}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline" className="bg-stone-50 text-stone-900 border-stone-300">
                                                {payout.score} pts
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">{payout.percentage}</TableCell>
                                        <TableCell className="text-right font-bold text-stone-900">
                                            {format.number(payout.amount / 100, { style: 'currency', currency: 'ARS' })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Warning / Notes */}
            <div className="bg-stone-50 border border-stone-300 p-4 rounded-lg flex items-start gap-4">
                <AlertTriangle className="h-5 w-5 text-stone-900 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-yellow-800 text-sm">¿Cómo funciona esto?</h4>
                    <p className="text-stone-900 text-sm mt-1">
                        El "Pozo Acumulado" viene del 3% de tarifa comunitaria sobre todos los hitos <strong>liberados</strong> en las últimas 24 horas.
                        <br />
                        Al hacer clic en "Ejecutar Pago Diario", este monto se distribuye entre los 50 mejores contribuyentes listados arriba como <strong>Crédito en Billetera</strong>.
                        <br />
                        Nota: Este proceso suele correr automáticamente a las 00:00 UTC. Este botón permite dispararlo manualmente si fuese necesario.
                    </p>
                </div>
            </div>
        </div>
    );
}
