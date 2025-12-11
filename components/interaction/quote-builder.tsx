"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SliceSelector } from './slice-selector';
import { Loader2, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface QuoteBuilderProps {
    requestId: string;
    requestTitle: string;
    slices: any[];
    userId: string;
}

export function QuoteBuilder({ requestId, requestTitle, slices, userId }: QuoteBuilderProps) {
    const router = useRouter();
    const [selectedSlices, setSelectedSlices] = useState<string[]>([]);
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [estimatedDays, setEstimatedDays] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filter only open/proposed slices? Or allows re-quoting?
    // For MVP assume all listed slices are quotable.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedSlices.length === 0) {
            toast.error("Seleccioná al menos una parte del trabajo.");
            return;
        }

        if (!amount || isNaN(Number(amount))) {
            toast.error("Ingresá un monto válido.");
            return;
        }

        setIsSubmitting(true);

        // Convert Price to Cents
        const amountCents = Math.round(parseFloat(amount) * 100);

        try {
            const res = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId,
                    providerId: userId, // Send the user ID
                    sliceIds: selectedSlices,
                    amount: amountCents, // Total amount for ALL selected slices
                    message,
                    estimatedDeliveryDate: new Date(Date.now() + (parseInt(estimatedDays) || 1) * 86400000).toISOString()
                })
            });

            if (!res.ok) throw new Error("Error submitting quote");

            toast.success("¡Cotización enviada!");
            router.push(`/requests/${requestId}`); // Go back to request
            router.refresh();

        } catch (error) {
            console.error(error);
            toast.error("Hubo un error al enviar la cotización.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
            <Card className="border-stone-200 dark:border-stone-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Cotizar: {requestTitle}</CardTitle>
                    <p className="text-muted-foreground">
                        Elegí las tareas que querés realizar y poné tu precio total.
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* 1. Selector */}
                    <SliceSelector
                        slices={slices}
                        selectedSliceIds={selectedSlices}
                        onSelectionChange={setSelectedSlices}
                    />

                    <div className="h-px bg-stone-200 dark:bg-stone-800 my-4" />

                    {/* 2. Price & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Precio Total (ARS)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="amount"
                                    placeholder="0.00"
                                    className="pl-9 text-lg font-semibold"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    type="number"
                                    min="0"
                                    required
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Incluye tu mano de obra y materiales si corresponde.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="days">Tiempo Estimado (Días)</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="days"
                                    placeholder="ej. 3"
                                    className="pl-9"
                                    value={estimatedDays}
                                    onChange={(e) => setEstimatedDays(e.target.value)}
                                    type="number"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Message */}
                    <div className="space-y-2">
                        <Label htmlFor="message">Mensaje para el Cliente</Label>
                        <Textarea
                            id="message"
                            placeholder="Hola, soy experto en esto. Puedo empezar mañana..."
                            className="min-h-[100px]"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>

                </CardContent>
                <CardFooter className="bg-stone-50 dark:bg-stone-900 border-t p-6 flex justify-between items-center">
                    <div className="text-sm">
                        <span className="font-medium">{selectedSlices.length}</span> partes seleccionadas
                    </div>
                    <Button
                        type="submit"
                        size="lg"
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                        disabled={isSubmitting || selectedSlices.length === 0}
                    >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Enviar Cotización
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
