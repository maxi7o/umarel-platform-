'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
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
    onChange?: (value: string, structuredData?: any) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    name?: string;
}

interface NominatimResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
}

export function LocationInput({
    value = '',
    onChange,
    placeholder = 'Search address...',
    className,
    required,
    name
}: LocationInputProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(value);
    const [results, setResults] = useState<NominatimResult[]>([]);
    const [loading, setLoading] = useState(false);

    // Ref to track the timeout and prevent heavy fetches
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = (term: string) => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (term.length < 3) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        searchTimeout.current = setTimeout(async () => {
            try {
                // Switch to Photon (Komoot) for true Autocomplete
                // Fetch 50 results to ensure we catch local ones even if Spain/Mexico results rank higher globally
                const params = new URLSearchParams({
                    q: term,
                    limit: '50',
                    lang: 'es',
                    lat: '-34.6037', // Bias to Buenos Aires
                    lon: '-58.3816'
                });

                const res = await fetch(`https://photon.komoot.io/api/?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();

                    const validResults: NominatimResult[] = data.features
                        // Relaxed Filter: Prioritize Argentina but allow others if close?
                        // Actually, for now let's just accept what Photon returns since we biased with lat/lon.
                        // Or check for "Argentina" string in properties loosely.
                        .map((f: any) => ({
                            place_id: f.properties.osm_id,
                            lat: f.geometry.coordinates[1].toString(),
                            lon: f.geometry.coordinates[0].toString(),
                            display_name: [
                                f.properties.name,
                                f.properties.street,
                                f.properties.city,
                                f.properties.state,
                                f.properties.country
                            ].filter(Boolean).join(', ')
                        }))
                        // Deduplicate by name
                        .filter((v: any, i: number, a: any[]) => a.findIndex((t: any) => t.display_name === v.display_name) === i)
                        .slice(0, 5);

                    setResults(validResults);
                }
            } catch (e) {
                console.error("Location search failed", e);
            } finally {
                setLoading(false);
            }
        }, 300); // 300ms is enough for Photon (it is fast)
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
                        {!loading && results.map((result) => (
                            <CommandItem
                                key={result.place_id}
                                value={result.place_id.toString()}
                                onSelect={() => handleSelect(result)}
                                className="cursor-pointer py-3 px-4 aria-selected:bg-orange-50 aria-selected:text-orange-900"
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
