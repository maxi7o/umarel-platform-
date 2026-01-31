'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocationCache } from '@/lib/location-cache';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"


interface LocationInputProps {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string, structuredData?: any) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    name?: string;
}

export interface NominatimResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
}

// Exported for testing
export function processLocationResults(features: any[]): NominatimResult[] {
    // Priority areas in CABA and GBA (most populated neighborhoods/municipalities)
    const priorityAreas = [
        // CABA neighborhoods
        'palermo', 'recoleta', 'belgrano', 'caballito', 'villa crespo', 'almagro',
        'flores', 'villa urquiza', 'núñez', 'colegiales', 'san telmo', 'puerto madero',
        'retiro', 'once', 'balvanera', 'boedo', 'parque patricios', 'villa devoto',
        // GBA municipalities (most populated)
        'la matanza', 'lomas de zamora', 'quilmes', 'lanús', 'san martín',
        'tres de febrero', 'san isidro', 'vicente lópez', 'avellaneda', 'morón',
        'san miguel', 'tigre', 'malvinas argentinas', 'hurlingham', 'ituzaingó',
        'josé c. paz', 'san fernando', 'esteban echeverría', 'florencio varela',
        'berazategui', 'almirante brown', 'merlo', 'moreno', 'general san martín'
    ];

    return features
        .map((f: any) => {
            const displayName = [
                f.properties.name,
                f.properties.street,
                f.properties.city,
                f.properties.state,
                f.properties.country
            ].filter(Boolean).join(', ');

            // Calculate relevance score
            let score = 0;
            const lowerDisplay = displayName.toLowerCase();

            // Boost if it's in priority areas
            for (const area of priorityAreas) {
                if (lowerDisplay.includes(area)) {
                    score += 100;
                    break;
                }
            }

            // Boost CABA results
            if (lowerDisplay.includes('ciudad autónoma de buenos aires') ||
                lowerDisplay.includes('caba') ||
                lowerDisplay.includes('capital federal')) {
                score += 50;
            }

            // Boost GBA results
            if (lowerDisplay.includes('buenos aires') && !lowerDisplay.includes('ciudad')) {
                score += 30;
            }

            // Boost by OSM type (city > town > suburb > street)
            const osmType = f.properties.type || '';
            if (osmType === 'city') score += 40;
            else if (osmType === 'town') score += 30;
            else if (osmType === 'suburb' || osmType === 'neighbourhood') score += 20;
            else if (osmType === 'residential') score += 10;

            // Distance penalty (further from center = lower score)
            const lat = f.geometry.coordinates[1];
            const lon = f.geometry.coordinates[0];
            const distance = Math.sqrt(
                Math.pow(lat - (-34.6037), 2) +
                Math.pow(lon - (-58.3816), 2)
            );
            score -= distance * 10;

            return {
                place_id: f.properties.osm_id,
                lat: lat.toString(),
                lon: lon.toString(),
                display_name: displayName,
                score
            };
        })
        .filter((v: any, i: number, a: any[]) =>
            a.findIndex((t: any) => t.display_name === v.display_name) === i
        )
        .sort((a: any, b: any) => b.score - a.score) // Sort by score descending
        .slice(0, 8) // Take top 8 results
        .map(({ score, ...rest }) => rest); // Remove score from final results
}

export function LocationInput({
    value,
    defaultValue,
    onChange,
    placeholder = 'Search address...',
    className,
    required,
    name
}: LocationInputProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(value || defaultValue || '');
    const [results, setResults] = useState<NominatimResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [popularSearches, setPopularSearches] = useState<NominatimResult[]>([]);

    // Sync query with value prop if controlled
    useEffect(() => {
        if (value !== undefined) {
            setQuery(value);
        }
    }, [value]);

    // Ref to track the timeout and prevent heavy fetches
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    // Load popular searches on mount
    useEffect(() => {
        const popular = LocationCache.getPopular(5);
        setPopularSearches(popular.map(p => p.result));
    }, []);

    const handleSearch = async (term: string) => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (term.length < 3) {
            setResults([]);
            setLoading(false);
            return;
        }

        // Check cache first
        const cached = LocationCache.get(term);
        if (cached) {
            console.log('📦 Cache hit for:', term);
            setResults([cached]);
            return;
        }

        setLoading(true);
        searchTimeout.current = setTimeout(async () => {
            try {
                // Try Photon first (primary, faster)
                let validResults = await fetchFromPhoton(term);

                // Fallback to Nominatim if Photon fails or returns no results
                if (validResults.length === 0) {
                    console.log('🔄 Falling back to Nominatim...');
                    validResults = await fetchFromNominatim(term);
                }

                setResults(validResults);

                // Cache the first result if we got any
                if (validResults.length > 0) {
                    LocationCache.set(term, validResults[0]);
                }
            } catch (e) {
                console.error("Location search failed on all endpoints", e);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    // Fetch from Photon (Komoot) - Primary endpoint
    const fetchFromPhoton = async (term: string): Promise<NominatimResult[]> => {
        try {
            const params = new URLSearchParams({
                q: term,
                limit: '50',
                lang: 'es',
                lat: '-34.6037', // Bias to Buenos Aires
                lon: '-58.3816'
            });

            const res = await fetch(`https://photon.komoot.io/api/?${params.toString()}`);
            if (!res.ok) throw new Error('Photon request failed');

            const data = await res.json();
            return processLocationResults(data.features);
        } catch (e) {
            console.error('Photon fetch error:', e);
            return [];
        }
    };

    // Fetch from Nominatim (OSM) - Fallback endpoint
    const fetchFromNominatim = async (term: string): Promise<NominatimResult[]> => {
        try {
            const params = new URLSearchParams({
                q: term,
                format: 'json',
                limit: '5',
                countrycodes: 'ar', // Argentina only
                'accept-language': 'es'
            });

            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?${params.toString()}`,
                {
                    headers: {
                        'User-Agent': 'ElEntendido/1.0' // Required by Nominatim usage policy
                    }
                }
            );

            if (!res.ok) throw new Error('Nominatim request failed');

            const data = await res.json();

            return data.map((item: any) => ({
                place_id: item.place_id,
                lat: item.lat,
                lon: item.lon,
                display_name: item.display_name
            }));
        } catch (e) {
            console.error('Nominatim fetch error:', e);
            return [];
        }
    };

    const handleSelect = (result: NominatimResult) => {
        const structured = {
            address: result.display_name,
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            raw: result
        };

        const shortName = result.display_name.split(',')[0];
        setQuery(result.display_name); // Show full address or just short? Full is safer for now.
        if (onChange) onChange(result.display_name, structured);
        setOpen(false);
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        if (onChange) onChange('', null);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className={cn("relative w-full", className)}>
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                    <Input
                        name={name}
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => {
                            const val = e.target.value;
                            setQuery(val);
                            handleSearch(val);
                            if (!open && val.length >= 3) setOpen(true);
                            if (val === '') handleClear();
                        }}
                        onFocus={() => {
                            if (query.length >= 3) setOpen(true);
                        }}
                        required={required}
                        className="pl-9 pr-9 h-11 bg-white border-stone-200"
                        autoComplete="off"
                    />
                    {query && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-9 w-9 p-0 hover:bg-stone-100 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClear();
                            }}
                        >
                            <X className="h-4 w-4 text-stone-400" />
                        </Button>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[300px]" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
                <Command shouldFilter={false} className="border-none">
                    <CommandList>
                        {loading && (
                            <CommandItem disabled className='flex justify-center py-4 bg-stone-50'>
                                <Loader2 className="h-4 w-4 animate-spin mr-2 text-orange-500" />
                                <span className="text-stone-500">Buscando en Argentina...</span>
                            </CommandItem>
                        )}
                        {!loading && results.length === 0 && query.length >= 3 && (
                            <CommandEmpty className='py-4 text-center text-sm text-stone-500'>
                                No hay resultados en Argentina.
                            </CommandEmpty>
                        )}
                        {!loading && query.length < 3 && popularSearches.length > 0 && (
                            <CommandGroup heading="Búsquedas populares">
                                {popularSearches.map((result) => (
                                    <CommandItem
                                        key={result.place_id}
                                        value={result.place_id.toString()}
                                        onSelect={() => handleSelect(result)}
                                        className="cursor-pointer py-3 px-4 aria-selected:bg-orange-50 aria-selected:text-orange-900 data-[disabled]:pointer-events-auto data-[disabled]:opacity-100"
                                    >
                                        <Clock className="mr-3 h-4 w-4 shrink-0 text-stone-400 mt-0.5" />
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="truncate font-medium text-stone-800">{result.display_name.split(',')[0]}</span>
                                            <span className="truncate text-xs text-stone-500 mt-0.5">
                                                {result.display_name.split(',').slice(1).join(',').trim()}
                                            </span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                        {!loading && results.map((result) => (
                            <CommandItem
                                key={result.place_id}
                                value={result.place_id.toString()}
                                onSelect={() => handleSelect(result)}
                                className="cursor-pointer py-3 px-4 aria-selected:bg-orange-50 aria-selected:text-orange-900 data-[disabled]:pointer-events-auto data-[disabled]:opacity-100"
                            >
                                <MapPin className="mr-3 h-4 w-4 shrink-0 text-orange-500/70 mt-0.5" />
                                <div className="flex flex-col overflow-hidden">
                                    <span className="truncate font-medium text-stone-800">{result.display_name.split(',')[0]}</span>
                                    <span className="truncate text-xs text-stone-500 mt-0.5">
                                        {result.display_name.split(',').slice(1).join(',').trim()}
                                    </span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
