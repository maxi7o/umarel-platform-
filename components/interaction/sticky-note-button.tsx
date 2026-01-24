"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { StickyNote, AlertTriangle, CheckCircle2, Mic } from 'lucide-react';
import { toast } from 'sonner';

interface StickyNoteProps {
    targetId: string; // The ID of the item being commented on (Quote ID or Slice ID)
    targetType: 'quote' | 'slice' | 'quote_item';
    initialCount?: number;
    onFeedbackSubmitted?: () => void;
}

export function StickyNoteButton({ targetId, targetType, initialCount = 0, onFeedbackSubmitted }: StickyNoteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Simulate audio recording state (UI only for now)
    const [isRecording, setIsRecording] = useState(false);

    const handleSubmit = async () => {
        if (!feedback.trim()) return;
        setIsSubmitting(true);

        try {
            // Call the API endpoint that uses the Consensus Filter
            const res = await fetch('/api/entendido/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetId,
                    targetType,
                    content: feedback,
                }),
            });

            const data = await res.json();

            if (data.status === 'approved') {
                toast.success("Feedback Attached!", {
                    description: "Your advice is now visible to the client."
                });
                setFeedback('');
                setIsOpen(false);
                if (onFeedbackSubmitted) onFeedbackSubmitted();
            } else if (data.status === 'rejected') {
                toast.error("Feedback Rejected", {
                    description: "Our safety system flagged this content. Please be constructive."
                });
            } else {
                toast.info("Under Review", {
                    description: "Your feedback is being analyzed by our verification team."
                });
                setIsOpen(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit feedback");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-stone-500 hover:text-yellow-600 hover:bg-yellow-50 relative group"
                >
                    <StickyNote className="w-4 h-4" />
                    <span className="text-xs font-medium">Opinar</span>
                    {initialCount > 0 && (
                        <Badge variant="secondary" className="ml-1 h-5 min-w-[1.25rem] px-1 text-[10px] bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200">
                            {initialCount}
                        </Badge>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <StickyNote className="w-5 h-5 text-yellow-500" />
                        Agregar Opinión Experta
                    </DialogTitle>
                    <DialogDescription>
                        Tu consejo ayuda a la comunidad. Si es aceptado, ganás Aura.
                        <br />
                        <span className="text-xs text-stone-400 mt-1 block">
                            * Tu opinión pasará por validación automática.
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="E.g., Este precio de materiales está un 20% arriba del mercado..."
                        className="min-h-[100px] border-yellow-200 focus-visible:ring-yellow-500 bg-yellow-50/30"
                    />

                    <div className="flex justify-between items-center text-xs text-stone-500">
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className={`h-8 gap-2 ${isRecording ? 'items-center border-red-500 text-red-500 bg-red-50' : ''}`}
                                onClick={() => setIsRecording(!isRecording)}
                            >
                                <Mic className={`w-3 h-3 ${isRecording ? 'animate-pulse' : ''}`} />
                                {isRecording ? 'Grabando...' : 'Audio Nota'}
                            </Button>
                        </div>
                        <span>min 10 chars</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting || feedback.length < 10}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                        {isSubmitting ? 'Analizando...' : 'Publicar Opinión'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
