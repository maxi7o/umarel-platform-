
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DisputeActionsProps {
    escrowId: string;
    currentStatus: string;
    isAdmin?: boolean;
}

export function DisputeActions({ escrowId, currentStatus, isAdmin }: DisputeActionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');
    const { toast } = useToast();

    const handleRaiseDispute = async () => {
        try {
            const res = await fetch(`/api/escrow/${escrowId}/dispute`, {
                method: 'POST',
                body: JSON.stringify({ reason, userId: 'current-user-id' }) // Mock user
            });
            if (!res.ok) throw new Error();

            toast({ title: 'Dispute Raised', description: 'Admin will review shortly.' });
            setIsOpen(false);
            window.location.reload(); // Quick refresh
        } catch {
            toast({ title: 'Error', variant: 'destructive' });
        }
    };

    const handleResolve = async (resolution: 'release' | 'refund') => {
        try {
            const res = await fetch(`/api/escrow/${escrowId}/resolve`, {
                method: 'POST',
                body: JSON.stringify({ resolution, notes, adminId: 'mock-admin-id' })
            });
            if (!res.ok) throw new Error();

            toast({ title: 'Resolved', description: `Outcome: ${resolution}` });
            window.location.reload();
        } catch {
            toast({ title: 'Error', variant: 'destructive' });
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

    return null;
}
