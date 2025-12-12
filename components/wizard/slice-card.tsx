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

export function SliceCard({ sliceCard, onUpdate, isLocked }: SliceCardProps) {
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
        // Use user's locale ideally, but for now hardcoded es-AR based on context is risky if used elsewhere.
        // Let's stick to standard formatting or what was there.
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: currency || 'ARS',
            minimumFractionDigits: 0,
        }).format(amount / 100);
    };

    return (
        <div className="relative group">
            {/* Pizza Slice Shape Background */}
            <div className="absolute inset-0 bg-yellow-50 border-2 border-orange-200 rounded-xl transform rotate-1 group-hover:rotate-0 transition-all duration-300 shadow-lg"
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 50% 100%, 0% 85%)' }} // Subtle wedge shape at bottom
            />
            <div className="absolute -top-4 -right-4 text-4xl transform rotate-12 z-20">
                🍕
            </div>

            <Card className="relative bg-white/95 backdrop-blur-sm border-0 shadow-none z-10" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 88%, 50% 100%, 0% 88%)' }}>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-hand text-orange-800 rotate-[-1deg]">{sliceCard.title || t('titleLabel')}</CardTitle>
                        {isLocked ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditing(!isEditing)}
                                className="bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full"
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pb-12"> {/* Extra padding for the point */}
                    {/* Description */}
                    <div>
                        {!isEditing && <p className="text-stone-600 text-sm italic">{sliceCard.description}</p>}
                        {isEditing && (
                            <>
                                <label className="text-xs font-bold text-orange-800 uppercase tracking-widest mb-1 block">Toppings (Details)</label>
                                <Textarea
                                    value={editedCard.description}
                                    onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
                                    className="bg-white/50 border-orange-200 focus:border-orange-500"
                                    rows={3}
                                />
                            </>
                        )}
                    </div>

                    {/* Price - The "Bill" */}
                    <div className="flex items-center justify-between border-t border-dashed border-orange-200 pt-2">
                        <span className="font-hand text-lg text-stone-500">{t('finalPriceLabel')}:</span>
                        {isEditing ? (
                            <Input
                                type="number"
                                value={editedCard.finalPrice ? editedCard.finalPrice / 100 : ''}
                                onChange={(e) => setEditedCard({ ...editedCard, finalPrice: parseInt(e.target.value) * 100 })}
                                className="w-24 text-right font-mono"
                            />
                        ) : (
                            <span className="text-2xl font-bold text-trattoria-red font-mono">
                                {formatCurrency(sliceCard.finalPrice, sliceCard.currency)}
                            </span>
                        )}
                    </div>

                    {/* Skills as "Ingredients" */}
                    <div>
                        <div className="flex flex-wrap gap-1 mt-1 justify-center">
                            {sliceCard.skills?.map((skill, i) => (
                                <Badge key={i} variant="outline" className="bg-white border-orange-200 text-orange-800 text-xs">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    {isEditing && (
                        <Button onClick={handleSave} className="w-full bg-trattoria-red hover:bg-red-700 text-white font-hand text-lg">
                            Save Slice 🧀
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
