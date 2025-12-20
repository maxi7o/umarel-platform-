'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface BrowseFiltersProps {
    selectedType: 'all' | 'requests' | 'offerings';
    selectedCategory?: string;
    includeVirtual: boolean;
    onTypeChange: (type: 'all' | 'requests' | 'offerings') => void;
    onCategoryChange: (category: string | undefined) => void;
    onVirtualToggle: (include: boolean) => void;
}

export function BrowseFilters({
    selectedType,
    selectedCategory,
    includeVirtual,
    onTypeChange,
    onCategoryChange,
    onVirtualToggle,
}: BrowseFiltersProps) {
    const t = useTranslations('filters');

    const CATEGORIES = [
        { id: 'plumbing', label: t('categories.plumbing'), icon: '🔧' },
        { id: 'electrical', label: t('categories.electrical'), icon: '⚡' },
        { id: 'carpentry', label: t('categories.carpentry'), icon: '🪚' },
        { id: 'painting', label: t('categories.painting'), icon: '🎨' },
        { id: 'cleaning', label: t('categories.cleaning'), icon: '🧹' },
        { id: 'gardening', label: t('categories.gardening'), icon: '🌱' },
        { id: 'moving', label: t('categories.moving'), icon: '📦' },
        { id: 'other', label: t('categories.other'), icon: '🔨' },
    ];

    return (
        <div className="space-y-6">
            {/* Type Filter */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{t('show')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={selectedType} onValueChange={onTypeChange}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all" />
                            <Label htmlFor="all" className="cursor-pointer">
                                {t('allListings')}
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="requests" id="requests" />
                            <Label htmlFor="requests" className="cursor-pointer">
                                {t('requestsOnly')}
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="offerings" id="offerings" />
                            <Label htmlFor="offerings" className="cursor-pointer">
                                {t('offeringsOnly')}
                            </Label>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Category Filter */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{t('category')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <button
                            onClick={() => onCategoryChange(undefined)}
                            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${!selectedCategory ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                                }`}
                        >
                            {t('allCategories')}
                        </button>
                        {CATEGORIES.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => onCategoryChange(category.id)}
                                className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${selectedCategory === category.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-accent'
                                    }`}
                            >
                                <span>{category.icon}</span>
                                <span>{category.label}</span>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Virtual Services Toggle */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{t('location')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="virtual"
                            checked={includeVirtual}
                            onCheckedChange={(checked) => onVirtualToggle(checked as boolean)}
                        />
                        <Label htmlFor="virtual" className="cursor-pointer flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-500" />
                            {t('includeVirtual')}
                        </Label>
                    </div>
                </CardContent>
            </Card>


            {/* Active Filters Summary */}
            {(selectedCategory || !includeVirtual) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{t('activeFilters')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {selectedCategory && (
                                <Badge variant="secondary" className="gap-1">
                                    {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                                    <button
                                        onClick={() => onCategoryChange(undefined)}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
                            {!includeVirtual && (
                                <Badge variant="secondary" className="gap-1">
                                    {t('localOnly')}
                                    <button
                                        onClick={() => onVirtualToggle(true)}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
