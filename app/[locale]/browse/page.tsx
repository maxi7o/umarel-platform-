'use client';

import { useState, useEffect } from 'react';
import { LocationSelector } from '@/components/browse/location-selector';
import { BrowseFilters } from '@/components/browse/browse-filters';
import { UnifiedCard } from '@/components/browse/unified-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { useMarket } from '@/lib/market-context';
import { useTranslations } from 'next-intl';

export default function BrowsePage() {
    const { market } = useMarket();
    const t = useTranslations('browse');
    const [location, setLocation] = useState('');
    const [selectedType, setSelectedType] = useState<'all' | 'requests' | 'offerings'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
    const [includeVirtual, setIncludeVirtual] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [results, setResults] = useState<any>({ requests: [], offerings: [], total: 0 });
    const [isLoading, setIsLoading] = useState(false);

    // New State for Location/Radius
    const [radius, setRadius] = useState(50);
    const [locationData, setLocationData] = useState<any>(null);

    // Sync location with market initially
    useEffect(() => {
        if (market && !location && !locationData) {
            setLocation(`${market.city}, ${market.country}`);
        }
    }, [market]);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchResults();
    }, [location, locationData, radius, selectedType, selectedCategory, includeVirtual, debouncedQuery]);

    const fetchResults = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                location: locationData ? locationData.address : (location === 'Virtual' ? '' : location),
                type: selectedType,
                includeVirtual: includeVirtual.toString(),
            });

            if (locationData && locationData.lat) {
                params.append('lat', locationData.lat.toString());
                params.append('lng', locationData.lng.toString());
                params.append('radius', radius.toString());
            }

            if (selectedCategory) {
                params.append('category', selectedCategory);
            }

            if (debouncedQuery) {
                params.append('q', debouncedQuery);
            }

            const res = await fetch(`/api/browse?${params}`);
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error('Error fetching browse results:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const allItems = [
        ...(results.requests || []).map((r: any) => ({ ...r, type: 'request' })),
        ...(results.offerings || []).map((o: any) => ({ ...o, type: 'offering' })),
    ].sort((a, b) => {
        // If sorting by distance is needed, relies on API order or we can re-sort here
        // For now, let's keep the existing logic (Featured > Date) but maybe API returns distance

        // Featured first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;

        // If distance available, use it?
        if (a.distance !== undefined && b.distance !== undefined && a.distance !== b.distance) {
            return a.distance - b.distance;
        }

        // Then by date
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="container mx-auto max-w-7xl w-full px-6 md:px-8 lg:px-12 py-10">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold font-outfit mb-2">
                            {t('title')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('subtitle')}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t('searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <LocationSelector
                            currentLocation={location}
                            onLocationChange={setLocation}
                        />
                        <Link href="/post-request">
                            <Button variant="outline">{t('postRequest')}</Button>
                        </Link>
                        <Link href="/create-offering">
                            <Button>{t('offerServices')}</Button>
                        </Link>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                        {t('showing')} {allItems.length} {t('results')}
                    </span>
                    {location && location !== 'Virtual' && (
                        <>
                            <span>•</span>
                            <span>{t('in')} {location}</span>
                        </>
                    )}
                    {selectedCategory && (
                        <>
                            <span>•</span>
                            <span className="capitalize">{selectedCategory}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-1">
                    <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                        <BrowseFilters
                            selectedType={selectedType}
                            selectedCategory={selectedCategory}
                            includeVirtual={includeVirtual}
                            locationData={locationData}
                            radius={radius}
                            onTypeChange={setSelectedType}
                            onCategoryChange={setSelectedCategory}
                            onVirtualToggle={setIncludeVirtual}
                            onLocationChange={(data) => {
                                setLocationData(data);
                                if (data) setLocation(data.address);
                                else setLocation('');
                            }}
                            onRadiusChange={setRadius}
                        />
                    </div>
                </aside>

                {/* Results Grid */}
                <main className="lg:col-span-3">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : allItems.length > 0 ? (
                        <div className="space-y-4">
                            {allItems.map((item: any) => (
                                <UnifiedCard
                                    key={`${item.type}-${item.id}`}
                                    item={item}
                                    type={item.type}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-lg text-muted-foreground mb-4">
                                {t('noResults')} {location}
                            </p>
                            <p className="text-sm text-muted-foreground mb-6">
                                {t('tryAdjusting')}
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <Button variant="outline" onClick={() => setSelectedCategory(undefined)}>
                                    {t('clearFilters')}
                                </Button>
                                <Link href="/create-offering">
                                    <Button>{t('beFirstToOffer')}</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
