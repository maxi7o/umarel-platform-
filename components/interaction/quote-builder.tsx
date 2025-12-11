'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Slice {
    id: string;
    title: string;
    estimatedEffort: string;
    status: string;
}

interface QuoteBuilderProps {
    requestId: string;
    slices: Slice[];
    onQuoteCreated?: (quote: any) => void;
    currentUser?: any;
}

export function QuoteBuilder({ requestId, slices, onQuoteCreated, currentUser }: QuoteBuilderProps) {
    const [selectedSlices, setSelectedSlices] = useState<string[]>([]);
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSliceToggle = (sliceId: string) => {
        setSelectedSlices(prev =>
            prev.includes(sliceId)
                ? prev.filter(id => id !== sliceId)
                : [...prev, sliceId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSlices.length === 0) {
            toast.error("Please select at least one slice");
            return;
        }

        const amountValue = parseFloat(amount);
        if (isNaN(amountValue) || amountValue <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId,
                    providerId: currentUser.id,
                    amount: amountValue * 100, // Convert to cents
                    message,
                    estimatedDeliveryDate: deliveryDate,
                    sliceIds: selectedSlices
                })
            });

            if (!res.ok) throw new Error('Failed to create quote');

            const newQuote = await res.json();

            toast.success("Quote submitted successfully! Check the Quotes tab to see it.");
            // Reset form
            setSelectedSlices([]);
            setAmount('');
            setMessage('');
            setDeliveryDate('');

            if (onQuoteCreated) onQuoteCreated(newQuote);

        } catch (error) {
            console.error("Quote submission error:", error);
            toast.error("Failed to submit quote. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!currentUser) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Create a Quote</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        You must be logged in as a provider to submit a quote.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create a Quote</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <Label>Select Slices to Quote For</Label>
                        <div className="grid gap-3 border rounded-lg p-4 bg-muted/20 max-h-[200px] overflow-y-auto">
                            {slices.map(slice => (
                                <div key={slice.id} className="flex items-start space-x-3">
                                    <Checkbox
                                        id={`slice-${slice.id}`}
                                        checked={selectedSlices.includes(slice.id)}
                                        onChange={() => handleSliceToggle(slice.id)}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label
                                            htmlFor={`slice-${slice.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {slice.title}
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Est: {slice.estimatedEffort}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {slices.length === 0 && (
                                <p className="text-sm text-muted-foreground">No slices available to quote.</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Total Amount ($)</Label>
                            <Input
                                id="amount"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Est. Delivery Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={deliveryDate}
                                onChange={(e) => setDeliveryDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Pitch / Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Why are you the best fit for this job?"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Quote"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
