
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, DollarSign, Send } from 'lucide-react';

interface GuestBidDialogProps {
    sliceId: string;
    sliceTitle: string;
    onBidSubmitted: () => void;
}

export function GuestBidDialog({ sliceId, sliceTitle, onBidSubmitted }: GuestBidDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [price, setPrice] = useState('');
    const [contact, setContact] = useState(''); // WhatsApp/Phone
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!price || !contact) {
            toast.error("Precio y contacto obligatorios");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/slices/${sliceId}/bids`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    price: parseFloat(price) * 100, // Convert to cents if needed, assuming backend expects cents or handling logic
                    contactInfo: contact,
                    description: note,
                    isGuest: true
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to submit bid');
            }

            toast.success("¡Presupuesto enviado!");
            setIsOpen(false);
            onBidSubmitted();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md font-bold text-lg px-8 py-6 h-auto w-full md:w-auto mt-4 md:mt-0 animate-pulse">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Pasar Presupuesto Ahora
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Enviar Presupuesto Rápido</DialogTitle>
                    <DialogDescription>
                        Para: <strong>{sliceTitle}</strong>
                        <br />
                        El cliente recibirá tu propuesta por WhatsApp/Notificación.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Tu Precio Estimado (ARS)</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input
                                id="price"
                                type="number"
                                placeholder="Ej: 50000"
                                className="pl-10 text-lg font-semibold"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact">Tu WhatsApp / Teléfono</Label>
                        <Input
                            id="contact"
                            placeholder="Ej: 11 1234 5678"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Te contactarán a este número si les interesa.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">Notas (Opcional)</Label>
                        <Textarea
                            id="note"
                            placeholder="Incluye materiales? Cuándo podés empezar?"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 text-lg">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                        Enviar Propuesta
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
