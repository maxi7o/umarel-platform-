
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Camera, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';

interface StartJobDialogProps {
    sliceId: string;
    onStarted: () => void;
}

export function StartJobDialog({ sliceId, onStarted }: StartJobDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [evidenceType, setEvidenceType] = useState<'photo' | 'location' | null>(null);

    const handleStart = async () => {
        if (!evidenceType) return;
        setIsLoading(true);

        try {
            // Mock evidence data
            const body = {
                evidenceUrl: evidenceType === 'photo' ? 'https://mock.url/checkin.jpg' : null,
                location: evidenceType === 'location' ? 'Lat: -34.6037, Lng: -58.3816 (Obelisco)' : null,
                description: 'Provider Check-in initiated'
            };

            const res = await fetch(`/api/slices/${sliceId}/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to start job');
            }

            const data = await res.json();
            toast.success(data.message || 'Job Started! 🔨');
            setIsOpen(false);
            onStarted();
            window.location.reload(); // Hard refresh to update UI state for now
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Job
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Proof of Arrival</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                    <p className="text-sm text-stone-600">
                        To start the timer and earn **+50 Aura**, please verify you are on site.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div
                            className={`border-2 rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2 hover:bg-stone-50 transition-colors ${evidenceType === 'photo' ? 'border-orange-500 bg-orange-50' : 'border-stone-200'}`}
                            onClick={() => setEvidenceType('photo')}
                        >
                            <Camera className={evidenceType === 'photo' ? 'text-orange-600' : 'text-stone-400'} />
                            <span className="text-xs font-semibold">Take Photo</span>
                        </div>
                        <div
                            className={`border-2 rounded-lg p-4 cursor-pointer flex flex-col items-center gap-2 hover:bg-stone-50 transition-colors ${evidenceType === 'location' ? 'border-blue-500 bg-blue-50' : 'border-stone-200'}`}
                            onClick={() => setEvidenceType('location')}
                        >
                            <MapPin className={evidenceType === 'location' ? 'text-blue-600' : 'text-stone-400'} />
                            <span className="text-xs font-semibold">GPS Check-in</span>
                        </div>
                    </div>

                    <Button
                        disabled={!evidenceType || isLoading}
                        onClick={handleStart}
                        className="w-full bg-green-600 hover:bg-green-700"
                    >
                        {isLoading ? 'Verifying...' : 'Confirm Arrival & Start'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
