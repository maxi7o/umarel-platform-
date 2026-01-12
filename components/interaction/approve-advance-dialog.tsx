
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
import { toast } from 'sonner';
import { Loader2, CheckCircle2, FileText, Image as ImageIcon } from 'lucide-react';

interface ApproveAdvanceDialogProps {
    sliceId: string;
    amount: number;
    evidence: { photos: string[], receipts: string[] };
    onApproved: () => void;
}

export function ApproveAdvanceDialog({ sliceId, amount, evidence, onApproved }: ApproveAdvanceDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/slices/${sliceId}/advance/approve`, {
                method: 'POST',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to approve');
            }

            toast.success("Material Advance Released!");
            setIsOpen(false);
            onApproved();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="secondary" className="w-full bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200">
                    <FileText className="w-4 h-4 mr-2" />
                    Review Advance Request (${amount})
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Approve Material Advance</DialogTitle>
                    <DialogDescription>
                        The provider has requested ${amount} for materials. Verify the evidence below.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold mb-2">Evidence Submitted:</h4>

                        {(evidence.photos?.length === 0 && evidence.receipts?.length === 0) && (
                            <p className="text-sm text-muted-foreground italic">No files uploaded (Warning!)</p>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                            {evidence.photos?.map((url, i) => (
                                <a key={`p-${i}`} href={url} target="_blank" className="block relative aspect-square bg-gray-100 rounded overflow-hidden border">
                                    <img src={url} alt="Material" className="object-cover w-full h-full" />
                                    <div className="absolute bottom-0 text-[10px] bg-black/50 text-white w-full text-center py-1">Photo {i + 1}</div>
                                </a>
                            ))}
                            {evidence.receipts?.map((url, i) => (
                                <a key={`r-${i}`} href={url} target="_blank" className="flex items-center justify-center aspect-square bg-white border rounded hover:bg-gray-50">
                                    <div className="text-center">
                                        <FileText className="mx-auto h-8 w-8 text-gray-400" />
                                        <span className="text-xs text-blue-600 underline mt-1 block">Receipt {i + 1}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded border border-yellow-100">
                        ⚠ By approving, you release ${amount} from escrow immediately to the provider. This cannot be undone.
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleApprove} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                        Approve & Release Funds
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
