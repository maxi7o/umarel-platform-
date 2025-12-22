"use client"

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

interface LocationInputProps {
    name: string;
    placeholder: string;
    required?: boolean;
    value?: string;
    onChange?: (value: string) => void;
}

import { useMarket } from '@/lib/market-context';

import { useLocationDetection } from '@/components/landing/location-detection';

export function LocationInput({ name, placeholder, required, value, onChange }: LocationInputProps) {
    const [internalQuery, setInternalQuery] = useState('');

    // Controlled vs Uncontrolled
    const isControlled = value !== undefined;
    const query = isControlled ? value : internalQuery;

    const setQuery = (newVal: string) => {
        if (!isControlled) {
            setInternalQuery(newVal);
        }
        onChange?.(newVal);
    };

    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    // Remove separate selectedLocation state as it's redundant with query/value for this use case
    // const [selectedLocation, setSelectedLocation] = useState('');
    const { market } = useMarket();
    const { location } = useLocationDetection(); // Get detected location (lat/lon)

    const [userCountry, setUserCountry] = useState<string>('');

    useEffect(() => {
        // ... (existing country logic)
        if (market?.countryCode) {
            setUserCountry(market.countryCode.toLowerCase());
            return;
        }
        // ...
    }, [market]);

    useEffect(() => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const userLang = (market?.locale || navigator.language || 'en').split('-')[0];
                const photonLang = ['en', 'de', 'fr', 'it'].includes(userLang) ? userLang : 'default';

                const params = new URLSearchParams({
                    q: query,
                    limit: '15',
                });

                if (photonLang !== 'default') {
                    params.append('lang', photonLang);
                }

                // --- LOCATION BIAS ---
                // If we have detected coordinates, assume user wants results nearby first.
                // Photon uses 'lat' and 'lon' to prioritize proximity.
                if (location?.lat && location?.lon) {
                    params.append('lat', location.lat.toString());
                    params.append('lon', location.lon.toString());
                    // Optional: params.append('zoom', '10'); to tune local vs global
                } else if (userCountry === 'ar') {
                    // Fallback for Argentina if no GPS but country detected
                    params.append('lat', '-34.6');
                    params.append('lon', '-58.4');
                }


                // Filter by OSM Tags (Server-side filtering!)
                // We want places (cities, towns), boundaries (states), and highways (streets)
                params.append('osm_tag', 'place');
                params.append('osm_tag', 'boundary');
                params.append('osm_tag', 'highway');

                const response = await fetch(
                    `https://photon.komoot.io/api/?${params.toString()}`
                );
                const data = await response.json();

                // Transform Photon GeoJSON to our format
                const mappedSuggestions = (data.features || []).map((feature: any) => {
                    const props = feature.properties;

                    // Synthesize a display_name
                    const parts = [
                        props.name,
                        props.street,
                        props.district,
                        props.city,
                        props.state,
                        props.country
                    ].filter(Boolean);

                    // Deduplicate adjacent parts
                    const uniqueParts = parts.filter((item: any, pos: number, arr: any[]) => !pos || item !== arr[pos - 1]);
                    const displayName = uniqueParts.join(', ');

                    return {
                        display_name: displayName,
                        importance: 0,
                        ...props
                    };
                });

                setSuggestions(mappedSuggestions);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Failed to fetch location suggestions:', error);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, userCountry, market]);

    const handleSelect = (location: any) => {
        const displayName = location.display_name;
        // setSelectedLocation(displayName);
        setQuery(displayName);
        setShowSuggestions(false);
    };

    return (
        <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
                id={name}
                name={name}
                placeholder={placeholder}
                className="pl-9"
                required={required}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border rounded-md shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            type="button"
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => handleSelect(suggestion)}
                        >
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 text-orange-600 flex-shrink-0" />
                                <div className="text-sm">
                                    <div className="font-medium">{suggestion.display_name.split(',')[0]}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {suggestion.display_name}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
