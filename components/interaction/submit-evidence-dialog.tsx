'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Camera, CheckCircle2, ShieldCheck, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AcceptanceCriterion {
    id: string;
    description: string;
    requiredEvidenceType: 'photo' | 'video' | 'file';
    isFulfilled?: boolean;
    evidenceUrl?: string; // URL of uploaded proof
}

interface SubmitEvidenceDialogProps {
    sliceId: string;
    sliceTitle: string;
    acceptanceCriteria?: AcceptanceCriterion[];
    onSubmitted: () => void;
    children?: React.ReactNode;
}

// Mock criteria for demo if none passed (Legacy Slices)
const MOCK_CRITERIA: AcceptanceCriterion[] = [
    { id: 'c1', description: 'Area successfully cleared of debris', requiredEvidenceType: 'photo' },
    { id: 'c2', description: 'Surfaces wiped clean', requiredEvidenceType: 'photo' },
    { id: 'c3', description: 'No damage to surrounding walls', requiredEvidenceType: 'video' }
];

export function SubmitEvidenceDialog({ sliceId, sliceTitle, acceptanceCriteria = MOCK_CRITERIA, onSubmitted, children }: SubmitEvidenceDialogProps) {
    const t = useTranslations('submitEvidence');
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [criteria, setCriteria] = useState<AcceptanceCriterion[]>(acceptanceCriteria);
    const [activeCriteriaId, setActiveCriteriaId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mock File Upload (Strict Validation Simulation)
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, criterionId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Simulate reading metadata
        const isFromCamera = true; // In real app, check EXIF or HTML input capture
        const hasGeotag = true; // Mock

        if (!isFromCamera) {
            toast.error("Strict Mode: Must use camera directly!", { duration: 4000 });
            return;
        }

        // Optimistic UI update
        const fakeUrl = URL.createObjectURL(file);

        setCriteria(prev => prev.map(c =>
            c.id === criterionId ? { ...c, isFulfilled: true, evidenceUrl: fakeUrl } : c
        ));
        toast.success("Evidence accepted (Geotag Verified) ✅");
    };

    const handleSubmit = async () => {
        const allFulfilled = criteria.every(c => c.isFulfilled);
        if (!allFulfilled) {
            toast.error("You must satisfy ALL acceptance criteria!");
            return;
        }

        setSubmitting(true);
        try {
            // Transform criteria to API payload
            const evidenceItems = criteria.map(c => ({
                criterionId: c.id,
                url: c.evidenceUrl || 'https://mock-s3-evidence.com/blob-placeholder.jpg',
                description: c.description,
                metadata: {
                    lat: -34.6037, // Mock Buenos Aires Center
                    lng: -58.3816,
                    altitude: 25,
                    accuracy: 5,
                    timestamp: Date.now(),
                    deviceId: 'mock-device-id-browser'
                }
            }));

            const response = await fetch(`/api/slices/${sliceId}/evidence`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ evidenceItems })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Submission failed");
            }

            const data = await response.json();

            // Uses translated success message with dynamic guardian name
            toast.success(t('successApproved', { guardianName: t('guardianName') }));

            setIsOpen(false);
            onSubmitted();
        } catch (e: any) {
            toast.error(e.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    const completedCount = criteria.filter(c => c.isFulfilled).length;
    const progress = (completedCount / criteria.length) * 100;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || <Button>{t('actionSubmit')}</Button>}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldCheck className="text-green-600" />
                        {t('title')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('description', { sliceTitle })}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Progress Bar */}
                    <div className="w-full bg-stone-100 rounded-full h-2">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {/* Criteria List */}
                    <div className="space-y-4">
                        {criteria.map((criterion, index) => (
                            <div
                                key={criterion.id}
                                className={cn(
                                    "border rounded-lg p-4 transition-colors",
                                    criterion.isFulfilled ? "border-green-200 bg-green-50" : "border-stone-200"
                                )}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                                                {index + 1}
                                            </Badge>
                                            <Label className={cn("text-base font-medium", criterion.isFulfilled && "text-green-800")}>
                                                {criterion.description}
                                            </Label>
                                        </div>
                                        <p className="text-xs text-muted-foreground pl-7">
                                            {t('uploadRequired', { type: criterion.requiredEvidenceType })}
                                        </p>
                                    </div>

                                    <div className="shrink-0">
                                        {criterion.isFulfilled ? (
                                            <div className="flex items-center gap-2">
                                                {criterion.evidenceUrl && (
                                                    <img src={criterion.evidenceUrl} alt="Proof" className="w-10 h-10 rounded object-cover border border-green-200" />
                                                )}
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100">
                                                    <CheckCircle2 size={18} />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    capture="environment" // Forces camera on mobile
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    onChange={(e) => handleFileUpload(e, criterion.id)}
                                                />
                                                <Button size="sm" variant="outline" className="gap-2 border-stone-300">
                                                    <Camera size={16} />
                                                    Capture
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* AI Advisory */}
                    <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs flex gap-2 items-start border border-blue-100">
                        <AlertCircle className="shrink-0 w-4 h-4 mt-0.5" />
                        <div>
                            {t.rich('guardianWarning', {
                                guardianName: t('guardianName'),
                                strong: (chunks) => <strong>{chunks}</strong>
                            })}
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={progress < 100 || submitting}
                        className={cn("w-full sm:w-auto", progress < 100 ? "opacity-50" : "bg-green-600 hover:bg-green-700")}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('btnSigning')}
                            </>
                        ) : (
                            t('btnVerify')
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
