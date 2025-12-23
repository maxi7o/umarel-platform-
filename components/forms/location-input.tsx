'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce'; // Assuming we have this or need to create it. I'll implement a simple debounce here if simpler.
import { cn } from '@/lib/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface LocationInputProps {
    value?: string; // Display string
    onChange?: (value: string, structuredData?: any) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    name?: string;
}

interface NominatimResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon?: string;
    address?: any;
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
    const [query, setQuery] = useState(value); // Input value
    const [results, setResults] = useState<NominatimResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(value ? value : null);

    // Debounce query
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500); // 500ms debounce
        return () => clearTimeout(handler);
    }, [query]);

    // Search effect
    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.length < 3 || debouncedQuery === selectedLocation) {
            setResults([]);
            return;
        }

        async function search() {
            setLoading(true);
            try {
                // Nominatim Search
                const params = new URLSearchParams({
                    q: debouncedQuery,
                    format: 'json',
                    addressdetails: '1',
                    limit: '5',
                    'accept-language': 'es-AR,es;q=0.9,en;q=0.8' // Bias to user locale ideally
                });

                const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (e) {
                console.error("Location search failed", e);
            } finally {
                setLoading(false);
            }
        }

        search();
    }, [debouncedQuery, selectedLocation]);

    const handleSelect = (result: NominatimResult) => {
        const structured = {
            address: result.display_name,
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            raw: result
        };

        setQuery(result.display_name);
        setSelectedLocation(result.display_name);
        if (onChange) {
            onChange(result.display_name, structured);
        }
        setOpen(false);
    };

    const handleClear = () => {
        setQuery('');
        setSelectedLocation(null);
        setResults([]);
        if (onChange) {
            onChange('', null);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className={cn("relative w-full", className)}>
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        name={name}
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (!open && e.target.value.length >= 3) setOpen(true);
                            if (e.target.value === '') handleClear();
                        }}
                        required={required}
                        className="pl-9 pr-9 text-left truncate"
                        autoComplete="off"
                        role="combobox"
                        aria-expanded={open}
                    />
                    {query && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClear();
                            }}
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[300px]" align="start">
                <Command shouldFilter={false}>
                    {/* We filter manually via API */}
                    <CommandList>
                        {loading && (
                            <CommandItem disabled className='flex justify-center py-4'>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Searching...
                            </CommandItem>
                        )}
                        {!loading && results.length === 0 && query.length >= 3 && (
                            <CommandEmpty className='py-4 text-center text-sm text-muted-foreground'>
                                No locations found.
                            </CommandEmpty>
                        )}
                        {!loading && results.map((result) => (
                            <CommandItem
                                key={result.place_id}
                                value={result.place_id.toString()} // Value must be string
                                onSelect={() => handleSelect(result)}
                                className="cursor-pointer"
                            >
                                <MapPin className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                                <div className="flex flex-col overflow-hidden">
                                    <span className="truncate font-medium">{result.display_name.split(',')[0]}</span>
                                    <span className="truncate text-xs text-muted-foreground">{result.display_name}</span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
