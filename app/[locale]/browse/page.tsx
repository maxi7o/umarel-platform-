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

// Note: SEO metadata is handled in layout.tsx for client components
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

        <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
            {/* 🌌 Futuristic Command Center Header */}
            <div className="relative bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 pb-12 pt-16 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-noise.png')] opacity-[0.03]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container mx-auto max-w-7xl px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 mb-4 font-archivo">
                            {t('title') || "Explore the Ecosystem"}
                        </h1>
                        <p className="text-lg text-stone-500 dark:text-stone-400 font-light">
                            {t('subtitle') || "Connect with talent, requests, and opportunities in real-time."}
                        </p>
                    </div>

                    {/* Universal Search Bar */}
                    <div className="max-w-4xl mx-auto w-full px-4 md:px-0">
                        <div className="bg-white dark:bg-stone-950 rounded-2xl shadow-2xl shadow-stone-200/50 dark:shadow-black/50 border border-stone-100 dark:border-stone-800 p-2 flex flex-col md:flex-row gap-2 items-center">
                            <div className="flex-1 relative w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                                <input
                                    placeholder={t('searchPlaceholder') || "What are you looking for?"}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-14 pl-12 pr-4 bg-transparent outline-none text-lg text-stone-900 dark:text-stone-50 placeholder:text-stone-400"
                                />
                            </div>
                            <div className="h-8 w-[1px] bg-stone-200 dark:bg-stone-800 hidden md:block" />
                            <div className="w-full md:w-auto min-w-[200px]">
                                <LocationSelector
                                    currentLocation={location}
                                    onLocationChange={setLocation}
                                />
                            </div>
                            <div className="w-full md:w-auto">
                                <Button className="h-14 w-full md:w-auto px-8 rounded-xl bg-stone-900 hover:bg-stone-800 text-white shadow-lg font-medium transition-all hover:scale-105">
                                    {t('search') || "Search"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Filters / Pills */}
                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                        {['all', 'requests', 'offerings'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type as any)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedType === type
                                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-md'
                                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
                                    }`}
                            >
                                {t(type === 'all' ? 'allListings' : type === 'requests' ? 'requestsOnly' : 'offeringsOnly') || type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Filters Sidebar - Clean & Sticky */}
                    {/* Filters Sidebar - Clean & Sticky */}
                    <aside className="lg:col-span-4 xl:col-span-3">
                        <div className="sticky top-24">
                            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-6 shadow-sm">
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
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <main className="lg:col-span-8 xl:col-span-9">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                                {isLoading ? t('loading') : `${allItems.length} ${t('results')}`}
                            </h2>
                            <div className="flex gap-2">
                                <Link href="/requests/create">
                                    <Button variant="outline" className="rounded-full border-stone-200 dark:border-stone-700">
                                        + {t('postRequest')}
                                    </Button>
                                </Link>
                                <Link href="/create-offering">
                                    <Button className="rounded-full bg-stone-900 text-white hover:bg-stone-800 dark:bg-white dark:text-stone-900">
                                        + {t('offerServices')}
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Pathways Section - Show when no filters active */}
                        {selectedType === 'all' && !selectedCategory && !locationData && !debouncedQuery && (
                            <div className="mb-12">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                                        {t('pathways.title')}
                                    </h2>
                                    <p className="text-stone-500 dark:text-stone-400">
                                        {t('pathways.subtitle')}
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Iniciativas Card */}
                                    <div
                                        onClick={() => setSelectedType('requests')}
                                        className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-8 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                                    >
                                        <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                                            🏗️
                                        </div>
                                        <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                                            {t('pathways.requests.title')}
                                        </h3>
                                        <p className="text-blue-700 dark:text-blue-300 mb-6 text-sm">
                                            {t('pathways.requests.subtitle')}
                                        </p>

                                        <div className="space-y-4 mb-6">
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                                                        {t('pathways.requests.forProviders')}
                                                    </p>
                                                    <p className="text-blue-600 dark:text-blue-400 text-xs">
                                                        {t('pathways.requests.forProvidersDesc')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                                                        {t('pathways.requests.forUmarels')}
                                                    </p>
                                                    <p className="text-blue-600 dark:text-blue-400 text-xs">
                                                        {t('pathways.requests.forUmarelsDesc')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:shadow-lg transition-all">
                                            {t('pathways.requests.cta')} →
                                        </Button>
                                    </div>

                                    {/* Talentos Card */}
                                    <div
                                        onClick={() => setSelectedType('offerings')}
                                        className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                                    >
                                        <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                                            🎨
                                        </div>
                                        <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                                            {t('pathways.offerings.title')}
                                        </h3>
                                        <p className="text-emerald-700 dark:text-emerald-300 mb-6 text-sm">
                                            {t('pathways.offerings.subtitle')}
                                        </p>

                                        <div className="space-y-4 mb-6">
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm">
                                                        {t('pathways.offerings.forClients')}
                                                    </p>
                                                    <p className="text-emerald-600 dark:text-emerald-400 text-xs">
                                                        {t('pathways.offerings.forClientsDesc')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm">
                                                        {t('pathways.offerings.forUmarels')}
                                                    </p>
                                                    <p className="text-emerald-600 dark:text-emerald-400 text-xs">
                                                        {t('pathways.offerings.forUmarelsDesc')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white group-hover:shadow-lg transition-all">
                                            {t('pathways.offerings.cta')} →
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-32">
                                <Loader2 className="h-10 w-10 animate-spin text-stone-300" />
                                <p className="text-stone-400 mt-4 animate-pulse">Scanning ecosystem...</p>
                            </div>
                        ) : allItems.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                {allItems.map((item: any) => (
                                    <UnifiedCard
                                        key={`${item.type}-${item.id}`}
                                        item={item}
                                        type={item.type}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800">
                                <div className="w-16 h-16 bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-6 h-6 text-stone-400" />
                                </div>
                                <h3 className="text-xl font-bold font-heading text-stone-900 dark:text-stone-100 mb-2">
                                    {t('noResultsTitle') || "No signals found"}
                                </h3>
                                <p className="text-stone-500 dark:text-stone-400 mb-8 max-w-md mx-auto">
                                    {t('noResultsDesc') || "Be the signal in the noise. Start the first project in this frequency."}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button variant="ghost" onClick={() => setSelectedCategory(undefined)}>
                                        {t('clearFilters')}
                                    </Button>
                                    <Link href="/requests/create">
                                        <Button className="bg-stone-900 text-white hover:bg-stone-800 px-8 rounded-full">{t('beFirstToOffer') || "Create Signal"}</Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
