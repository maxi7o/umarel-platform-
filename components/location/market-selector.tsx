"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MARKETS, COUNTRIES, getMarketsByCountry } from '@/lib/markets';
import { Search, MapPin } from 'lucide-react';

interface MarketSelectorProps {
    onSelectMarket: (marketId: string) => void;
}

export function MarketSelector({ onSelectMarket }: MarketSelectorProps) {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleMarketSelect = (marketId: string) => {
        onSelectMarket(marketId);
        router.push(`/browse?market=${marketId}`);
    };

    const filteredMarkets = selectedCountry
        ? getMarketsByCountry(selectedCountry)
        : Object.values(MARKETS).filter(m =>
            m.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.country.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Choose Your City
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Select your location to browse local services
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search for your city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 text-lg"
                        />
                    </div>
                </div>

                {/* Country Selector */}
                {!selectedCountry && !searchQuery && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Select Country</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {COUNTRIES.map((country) => (
                                <Card
                                    key={country.code}
                                    className="cursor-pointer hover:shadow-lg transition-shadow hover:border-primary"
                                    onClick={() => setSelectedCountry(country.code)}
                                >
                                    <CardContent className="p-6 text-center">
                                        <div className="text-5xl mb-2">{country.flag}</div>
                                        <div className="font-semibold">{country.name}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* City Grid */}
                {(selectedCountry || searchQuery) && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">
                                {selectedCountry
                                    ? `Cities in ${COUNTRIES.find(c => c.code === selectedCountry)?.name}`
                                    : 'Search Results'}
                            </h2>
                            {selectedCountry && (
                                <Button variant="ghost" onClick={() => setSelectedCountry(null)}>
                                    ← Back to Countries
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredMarkets.map((market) => (
                                <Card
                                    key={market.id}
                                    className="cursor-pointer hover:shadow-lg transition-all hover:border-primary hover:scale-105"
                                    onClick={() => handleMarketSelect(market.id)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-6 w-6 text-primary mt-1" />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg">{market.city}</h3>
                                                <p className="text-sm text-muted-foreground">{market.country}</p>
                                                <div className="mt-2 text-xs text-muted-foreground">
                                                    {market.currency} • {market.timezone.split('/')[1]}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        {filteredMarkets.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                No cities found. Try a different search.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
