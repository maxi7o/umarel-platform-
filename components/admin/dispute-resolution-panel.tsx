"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, ShieldCheck, ShieldAlert, XCircle, Gavel } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function DisputeResolutionPanel({ sliceId }: { sliceId: string }) {
    const router = useRouter();
    const [verdict, setVerdict] = useState<'refund_client' | 'release_provider'>('refund_client');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleResolve = async () => {
        if (!notes) {
            toast.error('Please provide a ruling note for the record.');
            return;
        }

        if (!confirm(`Confirm Verdict: ${verdict === 'refund_client' ? 'REFUND CLIENT' : 'PAY PROVIDER'}?\n\nThis will immediately move funds.`)) {
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/admin/disputes/${sliceId}/resolve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resolution: verdict, notes })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to resolve.');

            toast.success('Case Closed', { description: verdict === 'refund_client' ? 'Funds refunded to Client.' : 'Funds released to Provider.' });
            router.refresh(); // Refresh page to show updated status
            router.push('/admin/disputes'); // Go back to list

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <RadioGroup defaultValue="refund_client" onValueChange={(v) => setVerdict(v as any)} className="grid grid-cols-2 gap-4">
                <div>
                    <RadioGroupItem value="refund_client" id="r_client" className="peer sr-only" />
                    <Label
                        htmlFor="r_client"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-red-600 peer-data-[state=checked]:bg-red-50 [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                        <ShieldAlert className="mb-3 h-6 w-6 text-red-600" />
                        <span className="font-bold text-red-900">Refund Client</span>
                        <span className="text-xs text-center text-slate-500 mt-1">Return 100% of escrow to Client's wallet/card.</span>
                    </Label>
                </div>

                <div>
                    <RadioGroupItem value="release_provider" id="r_provider" className="peer sr-only" />
                    <Label
                        htmlFor="r_provider"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                        <ShieldCheck className="mb-3 h-6 w-6 text-green-600" />
                        <span className="font-bold text-green-900">Pay Provider</span>
                        <span className="text-xs text-center text-slate-500 mt-1">Overrule dispute. Release funds to Provider account.</span>
                    </Label>
                </div>
            </RadioGroup>

            <div className="space-y-2">
                <Label>Judge's Ruling (Required)</Label>
                <Textarea
                    placeholder="Explain the decision (e.g., 'Evidence insufficient', 'Work verified via photos'). This will be visible to both parties."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            <Button
                onClick={handleResolve}
                className={`w-full py-6 text-lg font-bold shadow-lg ${verdict === 'refund_client' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                disabled={isSubmitting}
            >
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Gavel className="mr-2" />}
                {verdict === 'refund_client' ? 'EXECUTE REFUND' : 'EXECUTE PAYMENT'}
            </Button>
        </div>
    );
}
