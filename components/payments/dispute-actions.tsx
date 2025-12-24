
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

interface DisputeActionsProps {
    escrowId: string;
    currentStatus: string;
    isAdmin?: boolean;
}

export function DisputeActions({ escrowId, currentStatus, isAdmin }: DisputeActionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');


    const handleRaiseDispute = async () => {
        try {
            const res = await fetch(`/api/escrow/${escrowId}/dispute`, {
                method: 'POST',
                body: JSON.stringify({ reason, userId: 'current-user-id' }) // Mock user
            });
            if (!res.ok) throw new Error();

            toast.success('Dispute Raised', { description: 'Admin will review shortly.' });
            setIsOpen(false);
            window.location.reload(); // Quick refresh
        } catch {
            toast.error('Error raising dispute');
        }
    };

    const handleResolve = async (resolution: 'release' | 'refund') => {
        try {
            const res = await fetch(`/api/escrow/${escrowId}/resolve`, {
                method: 'POST',
                body: JSON.stringify({ resolution, notes, adminId: 'mock-admin-id' })
            });
            if (!res.ok) throw new Error();

            toast.success('Resolved', { description: `Outcome: ${resolution}` });
            window.location.reload();
        } catch {
            toast.error('Error resolving dispute');
        }
    };

    if (currentStatus === 'disputed' && isAdmin) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-4">
                <div className="flex items-center gap-2 text-red-700 font-bold">
                    <ShieldAlert className="w-5 h-5" />
                    <span>Dispute Active</span>
                </div>
                <p className="text-sm text-red-600">Review evidence and decide outcome.</p>
                <Textarea
                    placeholder="Resolution notes..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="bg-white"
                />
                <div className="flex gap-2">
                    <Button onClick={() => handleResolve('release')} variant="outline" className="w-full border-green-500 text-green-700 hover:bg-green-50">
                        Release to Provider
                    </Button>
                    <Button onClick={() => handleResolve('refund')} variant="destructive" className="w-full">
                        Refund Client
                    </Button>
                </div>
            </div>
        );
    }

    if (currentStatus === 'in_escrow') {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Report a Problem
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Raise a Dispute</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Funds will be frozen while an Umarel Admin reviews the case.
                        </p>
                        <Textarea
                            placeholder="Describe the issue..."
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        />
                        <Button onClick={handleRaiseDispute} className="w-full" variant="destructive">
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Submit Dispute
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    const handleAppeal = async () => {
        try {
            const res = await fetch(`/api/escrow/${escrowId}/appeal`, {
                method: 'POST',
                body: JSON.stringify({ reason })
            });
            if (!res.ok) throw new Error();
            toast.success('Appeal Submitted');
            window.location.reload();
        } catch {
            toast.error('Failed to submit appeal');
        }
    };

    if ((currentStatus === 'released' || currentStatus === 'refunded') && !isAdmin) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-orange-500">
                        <ShieldAlert className="w-4 h-4 mr-1" />
                        Appeal Decision
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Appeal Decision</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            If you believe the decision was unfair, you can appeal. An Admin will review it again.
                        </p>
                        <Textarea
                            placeholder="Why are you appealing?"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        />
                        <Button onClick={handleAppeal} className="w-full" variant="default">
                            Submit Appeal
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return null;
}
