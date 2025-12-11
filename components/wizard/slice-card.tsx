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
        <Card className="sticky top-0">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{t('version', { version: sliceCard.version })}</CardTitle>
                    {isLocked ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Title */}
                <div>
                    <label className="text-sm font-semibold text-muted-foreground">{t('titleLabel')}</label>
                    {isEditing ? (
                        <Input
                            value={editedCard.title}
                            onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
                            className="mt-1"
                        />
                    ) : (
                        <p className="mt-1 font-semibold">{sliceCard.title}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="text-sm font-semibold text-muted-foreground">{t('descriptionLabel')}</label>
                    {isEditing ? (
                        <Textarea
                            value={editedCard.description}
                            onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
                            className="mt-1"
                            rows={4}
                        />
                    ) : (
                        <p className="mt-1 text-sm">{sliceCard.description}</p>
                    )}
                </div>

                {/* Location */}
                {sliceCard.location && (
                    <div>
                        <label className="text-sm font-semibold text-muted-foreground">{t('locationLabel')}</label>
                        <p className="mt-1 text-sm">{sliceCard.location}</p>
                    </div>
                )}

                {/* Price */}
                <div>
                    <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        {t('finalPriceLabel')}
                    </label>
                    {isEditing ? (
                        <Input
                            type="number"
                            value={editedCard.finalPrice || ''}
                            onChange={(e) => setEditedCard({ ...editedCard, finalPrice: parseInt(e.target.value) * 100 })}
                            className="mt-1"
                            placeholder="Enter amount"
                        />
                    ) : (
                        <p className="mt-1 text-2xl font-bold text-primary">
                            {formatCurrency(sliceCard.finalPrice, sliceCard.currency)}
                        </p>
                    )}
                </div>

                {/* Skills */}
                <div>
                    <label className="text-sm font-semibold text-muted-foreground">{t('requiredSkillsLabel')}</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {sliceCard.skills?.map((skill, i) => (
                            <Badge key={i} variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                </div>

                {/* Estimated Time */}
                {sliceCard.estimatedTime && (
                    <div>
                        <label className="text-sm font-semibold text-muted-foreground">{t('estimatedTimeLabel')}</label>
                        <p className="mt-1 text-sm">{sliceCard.estimatedTime}</p>
                    </div>
                )}

                {/* Dependencies */}
                {sliceCard.dependencies && sliceCard.dependencies.length > 0 && (
                    <div>
                        <label className="text-sm font-semibold text-muted-foreground">{t('dependenciesLabel')}</label>
                        <ul className="mt-2 space-y-1">
                            {sliceCard.dependencies.map((dep, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                    <span className="text-muted-foreground">•</span>
                                    {dep}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Acceptance Criteria */}
                {sliceCard.acceptanceCriteria && sliceCard.acceptanceCriteria.length > 0 && (
                    <div>
                        <label className="text-sm font-semibold text-muted-foreground">{t('acceptanceCriteriaLabel')}</label>
                        <ul className="mt-2 space-y-1">
                            {sliceCard.acceptanceCriteria.map((criteria, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                    <span className="text-green-600">✓</span>
                                    {criteria}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {isEditing && (
                    <Button onClick={handleSave} className="w-full">
                        {t('saveChanges')}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
