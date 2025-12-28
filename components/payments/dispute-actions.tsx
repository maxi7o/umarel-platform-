
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, ShieldCheck, ShieldAlert, CircleDashed } from 'lucide-react';
import { toast } from 'sonner';

export function DisputeActions({ sliceId, refundStatus, isClient, isProvider, sliceStatus }: {
    sliceId: string;
    refundStatus: string;
    isClient: boolean;
    isProvider: boolean;
    sliceStatus: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [evidence, setEvidence] = useState('');

    const handleSubmitDispute = async () => {
        try {
            const res = await fetch(`/api/slices/${sliceId}/dispute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reason,
                    description,
                    evidenceDescription: evidence
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to submit dispute');
            }

            toast.success('Dispute Submitted', { description: 'Auto-release stopped. AI Judge reviewing.' });
            setIsOpen(false);
            window.location.reload();
        } catch (e: any) {
            toast.error(e.message || 'Error submitting dispute');
        }
    };

    const handleRespond = async (action: 'accept' | 'reject') => {
        try {
            const res = await fetch(`/api/slices/${sliceId}/refund`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, evidence: reason }) // Start using reason as evidence link or text for now
            });

            if (!res.ok) throw new Error('Failed');

            toast.success(action === 'accept' ? 'Refund Processed' : 'Dispute Started');
            setIsOpen(false);
            window.location.reload();
        } catch {
            toast.error('Error processing response');
        }
    }

    // 1. Client Views
    if (isClient) {
        if (sliceStatus === 'completed' && (!refundStatus || refundStatus === 'none')) {
            return (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Stop Release (Dispute)
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Stop Release & Open Dispute</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <p className="text-sm text-stone-600">
                                This will <strong>immediately pause</strong> the auto-release timer.
                                "The Judge" (AI) will review your claim.
                            </p>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold">Reason</label>
                                <Textarea
                                    placeholder="Brief summary (e.g. Wrong color, Incomplete work)"
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold">Detailed Description</label>
                                <Textarea
                                    placeholder="Describe exactly what went wrong..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold">Evidence (Links or Description)</label>
                                <Textarea
                                    placeholder="Paste links to photos/videos or describe where to find evidence..."
                                    value={evidence}
                                    onChange={e => setEvidence(e.target.value)}
                                />
                            </div>

                            <Button onClick={handleSubmitDispute} className="w-full bg-red-600 hover:bg-red-700">
                                <ShieldAlert className="w-4 h-4 mr-2" />
                                Submit Claim
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            );
        }

        if (refundStatus === 'requested') {
            return (
                <div className="flex items-center gap-2 text-orange-600 text-sm font-medium">
                    <CircleDashed className="w-4 h-4 animate-spin" />
                    Refund Requested
                </div>
            );
        }
    }

    // 2. Provider Views
    if (isProvider) {
        if (refundStatus === 'requested') {
            return (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="border-orange-500 text-orange-600">
                            Respond to Refund
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Respond to Refund Request</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-stone-600">The client is requesting a refund.</p>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <Button onClick={() => handleRespond('accept')} variant="outline" className="border-green-500 text-green-700 hover:bg-green-50">
                                Accept (Refund)
                            </Button>
                            <div className="space-y-2">
                                <Button onClick={() => handleRespond('reject')} variant="destructive" className="w-full">
                                    Reject (Dispute)
                                </Button>
                                <p className="text-[10px] text-stone-400 text-center">Requires evidence upload</p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )
        }
    }

    // Common Status Badges
    if (refundStatus === 'approved') {
        return <span className="text-green-600 text-xs font-bold flex items-center gap-1"><ShieldCheck size={12} /> Refunded</span>;
    }
    if (refundStatus === 'disputed' || refundStatus === 'open' || sliceStatus === 'disputed') {
        return <span className="text-red-600 text-xs font-bold flex items-center gap-1"><ShieldAlert size={12} /> Disputed</span>;
    }

    return null;
}
