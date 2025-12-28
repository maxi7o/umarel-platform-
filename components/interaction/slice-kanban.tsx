'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DisputeActions } from '@/components/payments/dispute-actions';
import { AlertCircle, CheckCircle2, CircleDashed, GripHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Slice {
    id: string;
    title: string;
    description: string;
    estimatedEffort: string;
    status: 'proposed' | 'accepted' | 'completed';
    isAiGenerated: boolean;
    requiredSkills?: string[];
    escrow?: any;
    price?: number;
}

interface SliceKanbanProps {
    slices: Slice[];
    requestId: string;
    isOwner: boolean;
    currentUserId?: string;
    onSliceUpdated: (slice: Slice) => void;
}

import { useTranslations } from 'next-intl';

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
                const colSlices = slices.filter(s => s.status === col.id);
                const Icon = col.icon;

                return (
                    <div key={col.id} className="flex flex-col h-full bg-muted/30 rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 font-semibold">
                                <Icon className={cn("w-5 h-5", col.color)} />
                                {col.title}
                            </div>
                            <Badge variant="secondary" className="rounded-full px-2">
                                {colSlices.length}
                            </Badge>
                        </div>

                        <ScrollArea className="flex-1 -mx-2 px-2">
                            <div className="space-y-3">
                                {colSlices.map(slice => (
                                    <Card key={slice.id} className="bg-card cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                                        <CardHeader className="p-4 pb-2">
                                            <div className="flex justify-between items-start gap-2">
                                                <CardTitle className="text-sm font-medium leading-tight">
                                                    {slice.title}
                                                </CardTitle>
                                                {slice.isAiGenerated && (
                                                    <Badge variant="outline" className="text-[10px] px-1 h-5 shrink-0 bg-purple-500/10 text-purple-600 border-purple-200">
                                                        {t('labels.ai')}
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardDescription className="text-xs line-clamp-2">
                                                {slice.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-2">
                                            {slice.requiredSkills && slice.requiredSkills.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                    {slice.requiredSkills.slice(0, 2).map((skill, i) => (
                                                        <Badge key={i} variant="secondary" className="text-[10px] px-1 h-4">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                    {slice.requiredSkills.length > 2 && (
                                                        <Badge variant="secondary" className="text-[10px] px-1 h-4">
                                                            +{slice.requiredSkills.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                                                <span>{slice.estimatedEffort}</span>
                                                {slice.price && (
                                                    <span className="font-semibold text-orange-600">${slice.price}</span>
                                                )}
                                            </div>

                                            {/* Dispute Actions for active escrows */}
                                            {slice.status === 'completed' && (
                                                <div className="w-full flex justify-end mt-3 border-t pt-2">
                                                    <DisputeActions
                                                        sliceId={slice.id}
                                                        refundStatus={(slice as any).refundStatus} // Type cast until Slice interface is fully updated
                                                        sliceStatus={slice.status}
                                                        isClient={isOwner} // Assuming isOwner means Request Owner (Client)
                                                        isProvider={currentUserId === (slice as any).assignedProviderId || (slice as any).creatorId === currentUserId} // Check if current user is provider
                                                    />
                                                </div>
                                            )}

                                            <div className="flex justify-end gap-1 pt-2 border-t mt-2 flex-wrap">
                                                {col.id === 'proposed' && isOwner && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 text-xs w-full"
                                                        onClick={() => handleMove(slice.id, 'accepted')}
                                                    >
                                                        {t('actions.accept')}
                                                    </Button>
                                                )}
                                                {col.id === 'accepted' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-6 text-xs w-full"
                                                        onClick={() => handleMove(slice.id, 'completed')}
                                                    >
                                                        {t('actions.complete')}
                                                    </Button>
                                                )}
                                                {/* Fund Release Button */}
                                                {col.id === 'completed' && isOwner && (slice.escrow?.status !== 'released') && (
                                                    <Button
                                                        size="sm"
                                                        className="h-7 text-xs w-full bg-green-600 hover:bg-green-700 text-white"
                                                        onClick={async () => {
                                                            if (!confirm('Release funds to provider? This is final.')) return;
                                                            try {
                                                                const res = await fetch(`/api/slices/${slice.id}/release`, { method: 'POST' });
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
                                ))}
                                {colSlices.length === 0 && (
                                    <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                                        {t('labels.noSlices')}
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
