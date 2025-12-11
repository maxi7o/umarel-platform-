'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Slice {
    id: string;
    title: string;
    description: string;
    estimatedEffort: string;
    status: 'proposed' | 'accepted' | 'completed'; // Simplified for demo, can map to more
    isAiGenerated: boolean;
    requiredSkills?: string[];
}

interface SliceKanbanProps {
    slices: Slice[];
    requestId: string;
    isOwner: boolean; // Only owner can accept
    onSliceUpdated?: (slice: Slice) => void;
}

const COLUMNS = [
    { id: 'proposed', title: 'Proposed', color: 'bg-gray-100' },
    { id: 'accepted', title: 'Accepted', color: 'bg-blue-50' },
    { id: 'completed', title: 'Completed', color: 'bg-green-50' }
];

export function SliceKanban({ slices: initialSlices, requestId, isOwner, onSliceUpdated }: SliceKanbanProps) {
    // Use props directly for fully controlled state
    const slices = initialSlices;

    const handleMove = async (sliceId: string, newStatus: string) => {
        const slice = slices.find(s => s.id === sliceId);
        if (!slice) return;

        const updatedSlice = { ...slice, status: newStatus as any };

        // Optimistic update via callback
        if (onSliceUpdated) onSliceUpdated(updatedSlice);

        try {
            const res = await fetch(`/api/slices/${sliceId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) {
                throw new Error('Failed to update status');
            }

            const confirmedSlice = await res.json();
            // Update with confirmed data from server
            if (onSliceUpdated) onSliceUpdated(confirmedSlice);
        } catch (error) {
            console.error("Failed to update slice status", error);
            // Revert to old state on error
            if (onSliceUpdated) onSliceUpdated(slice);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full min-h-[500px]">
            {COLUMNS.map(col => (
                <div key={col.id} className={cn("rounded-lg p-4 flex flex-col gap-4", col.color)}>
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500">
                            {col.title}
                        </h3>
                        <Badge variant="secondary" className="bg-white">
                            {slices.filter(s => s.status === col.id).length}
                        </Badge>
                    </div>

                    <div className="flex-1 space-y-3">
                        {slices
                            .filter(s => s.status === col.id)
                            .map(slice => (
                                <Card key={slice.id} className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                                    <CardHeader className="p-4 pb-2 space-y-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <CardTitle className="text-sm font-medium leading-tight">
                                                {slice.title}
                                            </CardTitle>
                                            {slice.isAiGenerated && (
                                                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-blue-200 text-blue-600">
                                                    AI
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2 space-y-3">
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {slice.description}
                                        </p>

                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock size={12} />
                                            <span>{slice.estimatedEffort}</span>
                                        </div>

                                        {/* Simple controls to move items for demo */}
                                        <div className="flex justify-end gap-1 pt-2 border-t mt-2">
                                            {col.id === 'proposed' && isOwner && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-6 text-xs"
                                                    onClick={() => handleMove(slice.id, 'accepted')}
                                                >
                                                    Accept
                                                </Button>
                                            )}
                                            {col.id === 'accepted' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-6 text-xs"
                                                    onClick={() => handleMove(slice.id, 'completed')}
                                                >
                                                    Complete
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
