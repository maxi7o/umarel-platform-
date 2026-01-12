'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DisputeActions } from '@/components/payments/dispute-actions';
import { StartJobDialog } from '@/components/interaction/start-job-dialog';
import { SubmitEvidenceDialog } from '@/components/interaction/submit-evidence-dialog';
import { AcceptDialog } from '@/components/interaction/accept-dialog';
import { AlertCircle, CheckCircle2, CircleDashed, GripHorizontal, Hammer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { MaterialAdvanceAction } from '@/components/wizard/material-advance-action';
import { ApproveAdvanceDialog } from '@/components/interaction/approve-advance-dialog';

interface Slice {
    id: string;
    title: string;
    description: string;
    estimatedEffort: string;
    status: 'proposed' | 'accepted' | 'in_progress' | 'completed';
    isAiGenerated: boolean;
    requiredSkills?: string[];
    escrow?: any;
    price?: number;
    assignedProviderId?: string;
    creatorId?: string;
    acceptanceCriteria?: any[];
    ambiguityScore?: number;
    materialAdvanceStatus?: 'none' | 'requested' | 'approved' | 'released' | 'rejected';
    materialAdvanceAmount?: number;
    materialAdvanceEvidence?: any;
    finalPrice?: number;
    currency?: string;
}

interface SliceKanbanProps {
    slices: Slice[];
    requestId: string;
    isOwner: boolean;
    currentUserId?: string;
    onSliceUpdated: (slice: Slice) => void;
}

export function SliceKanban({ slices, requestId, isOwner, currentUserId, onSliceUpdated }: SliceKanbanProps) {
    const t = useTranslations('kanban');

    const COLUMNS = [
        { id: 'proposed', title: t('columns.proposed'), icon: CircleDashed, color: 'text-blue-500' },
        { id: 'accepted', title: t('columns.accepted'), icon: GripHorizontal, color: 'text-orange-500' },
        { id: 'completed', title: t('columns.completed'), icon: CheckCircle2, color: 'text-green-500' }
    ];

    const handleMove = async (sliceId: string, newStatus: Slice['status']) => {
        // Optimistic update
        const slice = slices.find(s => s.id === sliceId);
        if (!slice) return;

        const updatedSlice = { ...slice, status: newStatus };
        onSliceUpdated(updatedSlice);

        // API Call
        try {
            const res = await fetch(`/api/slices/${sliceId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) {
                // Revert on failure
                onSliceUpdated(slice);
                toast.error(t('errors.updateFailed'));
            } else {
                toast.success(t('errors.movedTo', { status: t(`columns.${newStatus}`) }));
            }
        } catch (error) {
            onSliceUpdated(slice);
            toast.error(t('errors.updateFailed'));
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
            {COLUMNS.map(col => {
                const colSlices = slices.filter(s => {
                    if (col.id === 'accepted') return s.status === 'accepted' || s.status === 'in_progress';
                    return s.status === col.id;
                });
                const Icon = col.icon;

                return (
                    <div key={col.id} className="flex flex-col h-full bg-stone-50/50 rounded-xl border border-stone-200 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 font-bold text-stone-700">
                                <Icon className={cn("w-5 h-5", col.color)} />
                                {col.title}
                            </div>
                            <Badge variant="secondary" className="bg-white border-stone-200 text-stone-500 rounded-lg px-2 shadow-sm font-mono">
                                {colSlices.length}
                            </Badge>
                        </div>

                        <ScrollArea className="flex-1 -mx-2 px-2">
                            <div className="space-y-4">
                                {colSlices.map(slice => {
                                    // Ambiguity Visuals
                                    const ambiguity = slice.ambiguityScore || 0;
                                    const isVague = ambiguity > 50;
                                    const isClear = ambiguity < 30 && ambiguity > 0;

                                    const cardBorderColor = isVague ? "border-orange-200 hover:border-orange-300" :
                                        isClear ? "border-green-200 hover:border-green-300" :
                                            "border-stone-200 hover:border-stone-300";

                                    return (
                                        <Card key={slice.id} className={cn(
                                            "bg-white transition-all duration-200 group relative overflow-hidden ring-1 ring-transparent hover:ring-2 hover:ring-stone-100",
                                            cardBorderColor,
                                            isVague && "bg-orange-50/30"
                                        )}>
                                            {/* Status Stripe */}
                                            <div className={cn("absolute left-0 top-0 bottom-0 w-1",
                                                isVague ? "bg-orange-400" : isClear ? "bg-green-400" : "bg-stone-300"
                                            )} />

                                            <CardHeader className="p-4 pb-3 pl-5">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="space-y-1">
                                                        <CardTitle className="text-sm font-bold font-outfit leading-tight text-stone-900">
                                                            {slice.title}
                                                        </CardTitle>
                                                        {slice.isAiGenerated && (
                                                            <div className="flex items-center gap-1.5 text-[10px] text-purple-600 font-medium">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                                                                AI Generated
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Price Tag */}
                                                    {slice.price ? (
                                                        <Badge variant="outline" className="bg-stone-900 text-white border-stone-900 font-mono text-xs">
                                                            ${slice.price}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-[10px] text-stone-400 font-mono uppercase">
                                                            Est
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardHeader>

                                            <CardContent className="p-4 pt-0 pl-5">
                                                <CardDescription className="text-xs text-stone-500 mb-4 line-clamp-2 leading-relaxed">
                                                    {slice.description}
                                                </CardDescription>

                                                {/* Acceptance Criteria Checklist (Mini) */}
                                                {slice.acceptanceCriteria && slice.acceptanceCriteria.length > 0 && (
                                                    <div className="space-y-2 mb-4 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                                                        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                                                            <span>Deliverables</span>
                                                            <span className="text-stone-300">{slice.acceptanceCriteria.length} items</span>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            {slice.acceptanceCriteria.slice(0, 3).map((criterion: any, i: number) => (
                                                                <div key={i} className="flex items-start gap-2 text-xs text-stone-600">
                                                                    <div className="mt-0.5 w-3 h-3 border border-stone-300 rounded-[3px] shrink-0" />
                                                                    <span className="line-clamp-1">{criterion.description || criterion}</span>
                                                                </div>
                                                            ))}
                                                            {slice.acceptanceCriteria.length > 3 && (
                                                                <div className="text-[10px] text-stone-400 pl-5">
                                                                    +{slice.acceptanceCriteria.length - 3} more
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 border-t pt-3 border-stone-100">
                                                    <div className="flex items-center gap-1.5">
                                                        <CircleDashed className="w-3.5 h-3.5 text-stone-400" />
                                                        <span>{slice.estimatedEffort}</span>
                                                    </div>
                                                    {/* Evidence Hint */}
                                                    <div className="flex items-center gap-1 text-stone-400" title="Strict Evidence Required">
                                                        <AlertCircle className="w-3.5 h-3.5" />
                                                        <span className="text-[10px] uppercase font-medium">Strict</span>
                                                    </div>
                                                </div>

                                                {/* Dispute Actions for active escrows */}
                                                {slice.status === 'completed' && (
                                                    <div className="w-full flex justify-end mt-3 pt-2">
                                                        <DisputeActions
                                                            sliceId={slice.id}
                                                            refundStatus={(slice as any).refundStatus} // Type cast until Slice interface is fully updated
                                                            sliceStatus={slice.status}
                                                            isClient={isOwner} // Assuming isOwner means Request Owner (Client)
                                                            isProvider={currentUserId === (slice as any).assignedProviderId || (slice as any).creatorId === currentUserId} // Check if current user is provider
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex justify-end gap-1 pt-3 mt-1">
                                                    {col.id === 'proposed' && isOwner && (
                                                        <AcceptDialog slice={slice}>
                                                            <Button
                                                                size="sm"
                                                                className="h-7 text-xs w-full bg-stone-900 hover:bg-stone-800 text-white font-medium"
                                                            >
                                                                {t('actions.accept')}
                                                            </Button>
                                                        </AcceptDialog>
                                                    )}
                                                    {/* Material Advance Logic */}
                                                    {col.id === 'accepted' && slice.status !== 'completed' && (
                                                        <div className="w-full mb-2">
                                                            {/* Provider: Request Advance */}
                                                            {currentUserId === slice.assignedProviderId && slice.materialAdvanceStatus === 'none' && (slice.finalPrice || slice.price) && (
                                                                <MaterialAdvanceAction
                                                                    sliceId={slice.id}
                                                                    amount={slice.finalPrice || slice.price || 0}
                                                                    currency={slice.currency || 'ARS'} // default
                                                                />
                                                            )}

                                                            {/* Client: Approve Advance */}
                                                            {isOwner && slice.materialAdvanceStatus === 'requested' && (
                                                                <ApproveAdvanceDialog
                                                                    sliceId={slice.id}
                                                                    amount={slice.materialAdvanceAmount || 0}
                                                                    evidence={slice.materialAdvanceEvidence || {}}
                                                                    onApproved={() => handleMove(slice.id, slice.status)} // Refresh
                                                                />
                                                            )}

                                                            {/* Status Badges */}
                                                            {slice.materialAdvanceStatus === 'requested' && currentUserId === slice.assignedProviderId && (
                                                                <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 text-center">
                                                                    Advance Requested... Waiting for Client
                                                                </div>
                                                            )}
                                                            {(slice.materialAdvanceStatus === 'released' || slice.materialAdvanceStatus === 'approved') && (
                                                                <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-100 text-center">
                                                                    ✓ Material Advance Released
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {col.id === 'accepted' && (
                                                        <>
                                                            {slice.status === 'in_progress' ? (
                                                                <div className="w-full">
                                                                    <SubmitEvidenceDialog
                                                                        sliceId={slice.id}
                                                                        sliceTitle={slice.title}
                                                                        onSubmitted={() => handleMove(slice.id, 'completed')}
                                                                    >
                                                                        <Button
                                                                            size="sm"
                                                                            className="h-8 text-xs w-full bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all"
                                                                        >
                                                                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                                                            Verify & Completed
                                                                        </Button>
                                                                    </SubmitEvidenceDialog>
                                                                </div>
                                                            ) : (
                                                                <div className="w-full">
                                                                    {/* Only Provider can Start */}
                                                                    {currentUserId === slice.assignedProviderId && (
                                                                        <StartJobDialog
                                                                            sliceId={slice.id}
                                                                            onStarted={() => { }} // Reload handles update
                                                                        />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                    {/* Fund Release Button */}
                                                    {col.id === 'completed' && isOwner && (slice.escrow?.status !== 'released') && (
                                                        <Button
                                                            size="sm"
                                                            className="h-8 text-xs w-full bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                                            onClick={async () => {
                                                                if (!confirm('Release funds to provider? This is final.')) return;
                                                                try {
                                                                    const res = await fetch(`/api/slices/${slice.id}/approve`, { method: 'POST' });
                                                                    if (!res.ok) throw new Error('Release failed');
                                                                    toast.success('Funds Released! 💸');
                                                                    window.location.reload();
                                                                } catch (e) {
                                                                    toast.error('Error releasing funds');
                                                                }
                                                            }}
                                                        >
                                                            Release Funds 🤝
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                                {colSlices.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/50">
                                        <div className="text-stone-300 mb-2">
                                            <Icon className="w-8 h-8 opacity-20" />
                                        </div>
                                        <p className="text-sm font-medium text-stone-500">{t('labels.noSlices')}</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                );
            })}
        </div>
    );
}
