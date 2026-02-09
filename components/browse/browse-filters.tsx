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

import { LocationInput } from '@/components/forms/location-input';

interface BrowseFiltersProps {
    selectedType: 'all' | 'requests' | 'offerings';
    selectedCategory?: string;
    includeVirtual: boolean;
    locationData?: { address: string; lat: number; lng: number } | null;
    radius?: number;
    onTypeChange: (type: 'all' | 'requests' | 'offerings') => void;
    onCategoryChange: (category: string | undefined) => void;
    onVirtualToggle: (include: boolean) => void;
    onLocationChange: (data: any) => void;
    onRadiusChange: (radius: number) => void;
}

export function BrowseFilters({
    selectedType,
    selectedCategory,
    includeVirtual,
    locationData,
    radius = 50,
    onTypeChange,
    onCategoryChange,
    onVirtualToggle,
    onLocationChange,
    onRadiusChange,
}: BrowseFiltersProps) {
    const t = useTranslations('filters');

    const CATEGORIES = [
        { id: 'experiences', label: t('categories.experiences') || "Experiences", icon: '✨' },
        { id: 'lifestyle', label: t('categories.lifestyle') || "Lifestyle", icon: '🌿' },
        { id: 'education', label: t('categories.education') || "Education", icon: '📚' },
        { id: 'creative', label: t('categories.creative') || "Creative", icon: '🎨' },
        { id: 'tech', label: t('categories.tech') || "Tech", icon: '💻' },
        { id: 'plumbing', label: t('categories.plumbing') || "Plumbing", icon: '🔧' },
        { id: 'electrical', label: t('categories.electrical') || "Electrical", icon: '⚡' },
        { id: 'carpentry', label: t('categories.carpentry') || "Carpentry", icon: '🔨' },
        { id: 'painting', label: t('categories.painting') || "Painting", icon: '🖌️' },
        { id: 'cleaning', label: t('categories.cleaning') || "Cleaning", icon: '🧹' },
        { id: 'gardening', label: t('categories.gardening') || "Gardening", icon: '🌻' },
        { id: 'moving', label: t('categories.moving') || "Moving", icon: '📦' },
        { id: 'custom', label: t('categories.custom') || "Custom", icon: '🌟' },
    ];

    return (
        <div className="space-y-6">
            {/* Location Filter */}
            <Card className="border-stone-100 dark:border-stone-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-stone-500">{t('location')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <LocationInput
                        placeholder={t('locationPlaceholder')}
                        value={locationData?.address}
                        onChange={(val, data) => onLocationChange(data)}
                    />

                    {locationData && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-stone-500">
                                <Label>Radius: {radius}km</Label>
                            </div>
                            <Slider
                                value={[radius]}
                                max={100}
                                step={5}
                                onValueChange={(vals) => onRadiusChange(vals[0])}
                                className="[&>.relative>.absolute]:bg-stone-900"
                            />
                        </div>
                    )}

                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="virtual"
                            checked={includeVirtual}
                            onCheckedChange={(checked) => onVirtualToggle(checked as boolean)}
                            className="data-[state=checked]:bg-stone-900 border-stone-300"
                        />
                        <Label htmlFor="virtual" className="cursor-pointer flex items-center gap-2 text-sm text-stone-600">
                            <Globe className="h-4 w-4 text-stone-400" />
                            {t('includeVirtual')}
                        </Label>
                    </div>
                </CardContent>
            </Card>

            {/* Type Filter */}
            <Card className="border-stone-100 dark:border-stone-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-stone-500">{t('show')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={selectedType} onValueChange={onTypeChange}>
                        {['all', 'requests', 'offerings'].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                                <RadioGroupItem value={type} id={type} className="text-stone-900 border-stone-300" />
                                <Label htmlFor={type} className="cursor-pointer text-stone-600 font-normal whitespace-nowrap">
                                    {t(type === 'all' ? 'allListings' : type === 'requests' ? 'requestsOnly' : 'offeringsOnly')}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Category Filter */}
            <Card className="border-stone-100 dark:border-stone-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-stone-500">{t('category')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        <button
                            onClick={() => onCategoryChange(undefined)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all truncate ${!selectedCategory
                                ? 'bg-stone-900 text-white font-medium shadow-md'
                                : 'text-stone-600 hover:bg-stone-100'
                                }`}
                        >
                            {t('allCategories')}
                        </button>
                        {CATEGORIES.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => onCategoryChange(category.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-3 ${selectedCategory === category.id
                                    ? 'bg-stone-900 text-white font-medium shadow-md'
                                    : 'text-stone-600 hover:bg-stone-100'
                                    }`}
                            >
                                <span className="text-base shrink-0">{category.icon}</span>
                                <span className="truncate">{category.label}</span>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Active Filters Summary */}
            {(selectedCategory || locationData) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{t('activeFilters')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {locationData && (
                                <Badge variant="secondary" className="gap-1">
                                    {locationData.address.split(',')[0]} ({radius}km)
                                    <button
                                        onClick={() => onLocationChange(null)}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
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
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
