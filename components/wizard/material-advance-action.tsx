"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Coins, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function MaterialAdvanceAction({
    sliceId,
    amount,
    currency = 'ARS'
}: {
    sliceId: string,
    amount: number,
    currency?: string
}) {
    const [status, setStatus] = useState<'idle' | 'requesting' | 'uploading' | 'pending' | 'approved'>('idle');
    const [evidence, setEvidence] = useState<{ photos: string[], receipts: string[] }>({ photos: [], receipts: [] });
    const [isRequesting, setIsRequesting] = useState(false);
    const router = useRouter();

    const handleSendRequest = async () => {
        setIsRequesting(true);
        try {
            const response = await fetch(`/api/slices/${sliceId}/advance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Math.round(amount * 0.40),
                    evidence: evidence
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to request advance');
            }

            setStatus('pending');
            toast.success("Solicitud de acopio enviada con éxito");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsRequesting(false);
        }
    };

    // Typical Acopio is 30%-50%
    const advanceAmount = amount * 0.40;

    if (status === 'approved') {
        return (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">Acopio de Materiales Liberado ({currency} {advanceAmount.toLocaleString()})</span>
            </div>
        );
    }

    if (status === 'pending') {
        return (
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <Coins size={18} />
                <span className="text-sm font-medium">Solicitud de Acopio enviada. Esperando aprobación del cliente.</span>
            </div>
        );
    }

    return (
        <div className="mt-4">
            {status === 'idle' && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStatus('uploading')}
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                >
                    <Coins className="mr-2 h-4 w-4" />
                    Solicitar Acopio de Materiales (40%)
                </Button>
            )}

            {status === 'uploading' && (
                <Card className="p-4 border-dashed border-2 border-blue-200 bg-blue-50/50">
                    <h4 className="text-sm font-bold text-blue-900 mb-2">Verificar Materiales en Obra</h4>
                    <p className="text-xs text-blue-700 mb-4">
                        Para liberar el 40% ({currency} {advanceAmount.toLocaleString()}) por adelantado, subí una foto de los materiales comprados y el ticket.
                    </p>

                    <div className="space-y-3">
                        <Button
                            variant="secondary"
                            className="w-full bg-white text-blue-700 border border-blue-100 shadow-sm"
                            onClick={() => {
                                toast.success("Foto simulada subida");
                                // Mock evidence additions
                                const newEvidence = [...(evidence?.photos || []), "https://picsum.photos/200/300"];
                                setEvidence(prev => ({ ...prev, photos: newEvidence }));
                            }}
                        >
                            <Camera className="mr-2 h-4 w-4" />
                            {evidence?.photos?.length ? `Subir Otra Foto (${evidence.photos.length})` : 'Subir Foto de Materiales'}
                        </Button>
                        <Button
                            variant="secondary"
                            className="w-full bg-white text-blue-700 border border-blue-100 shadow-sm"
                            onClick={() => {
                                toast.success("Ticket simulado subido");
                                const newEvidence = [...(evidence?.receipts || []), "https://picsum.photos/200/300"];
                                setEvidence(prev => ({ ...prev, receipts: newEvidence }));
                            }}
                        >
                            <Camera className="mr-2 h-4 w-4" />
                            {evidence?.receipts?.length ? `Subir Otro Ticket (${evidence.receipts.length})` : 'Subir Ticket/Factura'}
                        </Button>

                        <div className="flex gap-2 pt-2">
                            <Button variant="ghost" size="sm" onClick={() => setStatus('idle')} className="flex-1 text-slate-500">
                                Cancelar
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSendRequest}
                                className="flex-1 bg-blue-600 text-white"
                                disabled={isRequesting || (!evidence?.photos?.length && !evidence?.receipts?.length)}
                            >
                                {isRequesting ? 'Enviando...' : 'Enviar Solicitud'}
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
