"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export default function CreateExperiencePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Form State
    const [strategy, setStrategy] = useState('standard');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    async function handleAIMagic() {
        if (!description || description.length < 10) {
            toast.error("Please enter at least a few words in the description first!");
            return;
        }

        setIsGenerating(true);
        try {
            const res = await fetch('/api/experiences/ai-suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: description })
            });

            if (!res.ok) throw new Error("AI failed");

            const data = await res.json();

            setTitle(data.title);
            setDescription(data.description);
            setStrategy(data.strategy);
            setPrice(String(data.estimatedPrice));

            toast.success("✨ AI Magic Applied!");
            toast.info(`Strategy picked: ${data.strategy.toUpperCase()}`, {
                description: data.reasoning
            });

        } catch (e) {
            toast.error("AI could not generate suggestions. Try again.");
        } finally {
            setIsGenerating(false);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: title || formData.get('title'),
            description: description || formData.get('description'),
            location: formData.get('location'),
            date: formData.get('date'),
            duration: formData.get('duration'),
            minParticipants: formData.get('minParticipants'),
            maxParticipants: formData.get('maxParticipants'),
            price: price || formData.get('price'),
            strategy: strategy
        };

        try {
            const response = await fetch('/api/experiences/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to create experience');

            toast.success('Experience created successfully! 🚀');
            router.push('/dashboard'); // or /experiences/manage
        } catch (error) {
            toast.error('Something went wrong.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container max-w-2xl py-10">
            <h1 className="text-3xl font-bold mb-6">Create New Experience 🚲</h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Basic Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>What are you hosting?</CardTitle>
                        <CardDescription>Tell us a bit about it, and let AI help you Polish!</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="description">Description (Draft)</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAIMagic}
                                    disabled={isGenerating}
                                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                                >
                                    {isGenerating ? "✨ Magic..." : "✨ AI Polish"}
                                </Button>
                            </div>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="I want to take people for a bike ride seeing graffiti in Palermo..."
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g. Palermo Graffiti Tour"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" name="location" placeholder="Meeting point" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Date & Time</Label>
                                <Input id="date" name="date" type="datetime-local" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input id="duration" name="duration" type="number" defaultValue="150" required />
                        </div>
                    </CardContent>
                </Card>

                {/* Quorum & Capacity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Capacity</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="minParticipants">Min Participants (Quorum)</Label>
                            <Input id="minParticipants" name="minParticipants" type="number" min="1" defaultValue="5" required />
                            <p className="text-xs text-muted-foreground">Auto-refund if not met.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxParticipants">Max Participants</Label>
                            <Input id="maxParticipants" name="maxParticipants" type="number" min="1" defaultValue="20" required />
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing Strategy */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dynamic Pricing 💸</CardTitle>
                        <CardDescription>Choose how users pay.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select value={strategy} onValueChange={setStrategy}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Strategy" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="standard">Standard (Fixed Price)</SelectItem>
                                <SelectItem value="early_bird">Early Bird (First 5 cheaper)</SelectItem>
                                <SelectItem value="viral">Viral Pool (Discount if full)</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="space-y-2">
                            <Label>Base Price (ARS)</Label>
                            <Input
                                name="price"
                                type="number"
                                placeholder="20000"
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        {strategy === 'early_bird' && (
                            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded text-sm">
                                ℹ️ <strong>Early Bird:</strong> First 30% of tickets will be sold at 20% discount automatically.
                            </div>
                        )}

                        {strategy === 'viral' && (
                            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded text-sm">
                                ℹ️ <strong>Viral Pool:</strong> Everyone pays Base Price. If you reach Max Capacity, everyone gets partial refund!
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Launch Experience'}
                </Button>
            </form>
        </div>
    );
}
