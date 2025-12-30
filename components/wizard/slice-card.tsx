"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Edit2, DollarSign } from 'lucide-react';
import { useState } from 'react';

interface SliceCardProps {
    sliceCard: {
        title: string;
        description: string;
        location?: string;
        finalPrice: number | null;
        currency: string;
        skills: string[];
        estimatedTime: string | null;
        dependencies: string[];
        acceptanceCriteria: string[];
        version: number;
        isLocked: boolean;
    };
    onUpdate: (updated: any) => void;
    isLocked: boolean;
}

import { useTranslations } from 'next-intl';

// ... (existing imports, but removed useState from here to add it below systematically or keep it if it was safely outside)
// Actually, it's safer to just partial replace or be very careful.
// Let's replace the whole function body content to be safe and clean.

export function SliceCard({ sliceCard, onUpdate, isLocked, isGuest = false }: SliceCardProps & { isGuest?: boolean }) {
    const t = useTranslations('sliceCard');
    const [isEditing, setIsEditing] = useState(false);
    const [editedCard, setEditedCard] = useState(sliceCard);

    const handleSave = async () => {
        // TODO: Save to API
        onUpdate(editedCard);
        setIsEditing(false);
    };

    const formatCurrency = (amount: number | null, currency: string) => {
        if (!amount) return '-';
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: currency || 'ARS',
            minimumFractionDigits: 0,
        }).format(amount / 100);
    };

    return (
        <Card className="h-full border border-border shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">{sliceCard.title || t('titleLabel')}</CardTitle>
                    {isLocked ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                            className="h-8 w-8 p-0"
                            disabled={isGuest} // Disable editing for guests
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Description */}
                <div>
                    {!isEditing && <p className="text-muted-foreground text-sm">{sliceCard.description}</p>}
                    {isEditing && (
                        <>
                            <label className="text-xs font-medium uppercase tracking-wider mb-1 block text-muted-foreground">Details</label>
                            <Textarea
                                value={editedCard.description}
                                onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
                                className="resize-none"
                                rows={3}
                            />
                        </>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between border-t pt-4 relative group">
                    <span className="text-sm font-medium text-muted-foreground">{t('finalPriceLabel')}:</span>

                    {isGuest ? (
                        <div className="relative">
                            <span className="text-lg font-bold blur-sm select-none opacity-50">
                                $XX,XXX
                            </span>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-black/80 text-[10px] font-bold uppercase tracking-wider text-center">
                                Login to view
                            </div>
                        </div>
                    ) : isEditing ? (
                        <Input
                            type="number"
                            value={editedCard.finalPrice ? editedCard.finalPrice / 100 : ''}
                            onChange={(e) => setEditedCard({ ...editedCard, finalPrice: parseInt(e.target.value) * 100 })}
                            className="w-24 text-right"
                        />
                    ) : (
                        <span className="text-lg font-bold">
                            {formatCurrency(sliceCard.finalPrice, sliceCard.currency)}
                        </span>
                    )}
                </div>

                {/* Skills */}
                <div>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {sliceCard.skills?.map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                    <Button onClick={handleSave} className="w-full">
                        Save Changes
                    </Button>
                )}

                {isGuest && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded-md text-center">
                        Sign up to unlock prices & hiring
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
