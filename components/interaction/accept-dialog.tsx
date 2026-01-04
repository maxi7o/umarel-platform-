'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldCheck, Scale } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AcceptDialogProps {
    slice: any;
    children: React.ReactNode;
}

export function AcceptDialog({ slice, children }: AcceptDialogProps) {
    const [open, setOpen] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAccept = async () => {
        if (!accepted) {
            toast.error("You must accept the arbitration terms.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/slices/${slice.id}/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bidAmount: slice.price || 0, // Fallback, purely for demo if price missing
                    providerId: slice.assignedProviderId, // Must be set if accepting? Or passed from somewhere?
                    // If SliceKanban implies acceptance of a specific provider, slice must have one proposed.
                    // For now, assume slice.assignedProviderId is populated via Proposal logic previously.
                    arbitrationAccepted: true
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to accept");
            }

            const data = await res.json();
            toast.success("AGREEMENT SECURED", { description: "Redirecting to escrow..." });

            if (data.redirectUrl) {
                router.push(data.redirectUrl);
            } else {
                setOpen(false);
                window.location.reload();
            }

        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                        Secure Agreement
                    </DialogTitle>
                    <DialogDescription>
                        You are about to enter a binding contract for <strong>{slice.title}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="bg-stone-50 p-3 rounded border text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Agreed Price:</span>
                            <span className="font-bold">${slice.price}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Provider:</span>
                            {/* In real app, name needed */}
                            <span className="font-semibold">{slice.assignedProviderId ? 'Selected Provider' : 'Open Pool'}</span>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex items-start gap-2">
                            <Checkbox
                                id="terms"
                                checked={accepted}
                                onCheckedChange={(c) => setAccepted(c === true)}
                                className="mt-1"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    I agree to the <span className="underline">Contract Terms</span> and accept the **Umarel Jury Protocol** as the final, binding arbitration for any disputes.
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    By checking this, you waive the right to sue in public court for this transaction.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                    <Button onClick={handleAccept} disabled={!accepted || loading} className="bg-green-600 hover:bg-green-700">
                        {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Scale className="h-4 w-4 mr-2" />}
                        Confirm & Fund
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
