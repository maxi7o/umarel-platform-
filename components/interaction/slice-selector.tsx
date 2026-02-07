"use client"

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Shovel, Paintbrush, Truck, Zap } from 'lucide-react';

interface Slice {
    id: string;
    title: string;
    description: string;
    skills: string[];
    status: string;
    estimatedTime?: string;
    ambiguityScore?: number;
}

interface SliceSelectorProps {
    slices: Slice[];
    selectedSliceIds: string[];
    onSelectionChange: (ids: string[]) => void;
}

export function SliceSelector({ slices, selectedSliceIds, onSelectionChange }: SliceSelectorProps) {

    const toggleSlice = (id: string) => {
        if (selectedSliceIds.includes(id)) {
            onSelectionChange(selectedSliceIds.filter(s => s !== id));
        } else {
            onSelectionChange([...selectedSliceIds, id]);
        }
    };

    const getIcon = (skills: string[]) => {
        if (skills.some(s => s.includes('electr'))) return <Zap className="h-4 w-4" />;
        if (skills.some(s => s.includes('paint') || s.includes('pint'))) return <Paintbrush className="h-4 w-4" />;
        if (skills.some(s => s.includes('mov') || s.includes('mud'))) return <Truck className="h-4 w-4" />;
        return <Shovel className="h-4 w-4" />;
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-stone-700 dark:text-stone-300">
                Seleccioná qué partes vas a hacer:
            </h3>
            <div className="grid gap-3">
                {slices.map((slice) => {
                    const isSelected = selectedSliceIds.includes(slice.id);
                    const isAmbiguous = (slice.ambiguityScore || 0) > 50;

                    return (
                        <div
                            key={slice.id}
                            className={cn(
                                "flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer",
                                isSelected
                                    ? "bg-orange-50/50 border-orange-300 dark:bg-orange-950/20 dark:border-orange-800"
                                    : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800",
                                isAmbiguous && !isSelected && "border-orange-200 bg-orange-50/20"
                            )}
                            onClick={() => toggleSlice(slice.id)}
                        >
                            <Checkbox
                                id={slice.id}
                                checked={isSelected}
                                onCheckedChange={() => toggleSlice(slice.id)}
                                className="mt-1 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <label htmlFor={slice.id} className="font-medium cursor-pointer flex items-center gap-2">
                                        {getIcon(slice.skills)}
                                        {slice.title}
                                        {isAmbiguous && (
                                            <Badge variant="outline" className="ml-2 text-[10px] text-orange-600 bg-orange-50 border-orange-200">
                                                High Ambiguity ⚠️
                                            </Badge>
                                        )}
                                    </label>
                                    {/* Status Badge if needed */}
                                </div>
                                <p className="text-sm text-stone-500 mt-1 line-clamp-2">
                                    {slice.description}
                                </p>
                                <div className="flex gap-2 mt-2">
                                    {slice.skills.map(skill => (
                                        <Badge key={skill} variant="outline" className="text-xs bg-stone-100 text-stone-600 border-stone-200">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {slice.estimatedTime && (
                                        <Badge variant="secondary" className="text-xs">
                                            ⏱ {slice.estimatedTime}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {slices.length === 0 && (
                <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                    Este proyecto no tiene divisiones definidas aún.
                    <br />
                    ¡Sé el Umarel y dividilo vos!
                </div>
            )}
        </div>
    );
}
