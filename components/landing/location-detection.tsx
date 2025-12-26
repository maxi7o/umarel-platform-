"use client"

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useMarket } from '@/lib/market-context';
import { getMarketsByCountry } from '@/lib/markets';

interface DetectedLocation {
    city: string;
    country: string;
    countryCode: string;
    flag: string;
    lat?: number;
    lon?: number;
}

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LocationInput } from "@/components/forms/location-input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function useLocationDetection() {
    const [location, setLocation] = useState<DetectedLocation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { setMarket, marketId } = useMarket();

    useEffect(() => {
        // Check for manually saved location first
        const savedLocation = localStorage.getItem('umarel_user_location');
        if (savedLocation) {
            try {
                setLocation(JSON.parse(savedLocation));
                setIsLoading(false);
                return;
            } catch (e) {
                console.error("Failed to parse saved location");
            }
        }
        detectLocation();
    }, []);

    // Sync detected location with Market Context
    useEffect(() => {
        if (location?.countryCode && !marketId) {
            const markets = getMarketsByCountry(location.countryCode);
            if (markets.length > 0) {
                const match = markets.find(m => m.city.toLowerCase() === location.city.toLowerCase()) || markets[0];
                console.log(`Auto-setting market to ${match.id} based on detected location: ${location.country}`);
                setMarket(match.id);
            }
        }
    }, [location, marketId, setMarket]);

    const setManualLocation = (newLocation: DetectedLocation) => {
        setLocation(newLocation);
        localStorage.setItem('umarel_user_location', JSON.stringify(newLocation));

        // Also try to update market if appropriate
        const markets = getMarketsByCountry(newLocation.countryCode);
        if (markets.length > 0) {
            const match = markets.find(m => m.city.toLowerCase() === newLocation.city.toLowerCase()) || markets[0];
            setMarket(match.id);
        }
    };

    const detectLocation = async () => {
        setIsLoading(true);
        try {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        await reverseGeocode(latitude, longitude);
                    },
                    () => {
                        detectByIP();
                    }
                );
            } else {
                detectByIP();
            }
        } catch (error) {
            console.error('Location detection error:', error);
            setDefaultLocation();
        }
    };

    const reverseGeocode = async (lat: number, lon: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const data = await response.json();

            setLocation({
                city: data.address.city || data.address.town || data.address.village || 'Unknown',
                country: data.address.country || 'Unknown',
                countryCode: data.address.country_code?.toUpperCase() || 'XX',
                flag: getFlag(data.address.country_code),
                lat,
                lon
            });
        } catch (error) {
            detectByIP();
        } finally {
            setIsLoading(false);
        }
    };

    const detectByIP = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            setLocation({
                city: data.city || 'Unknown',
                country: data.country_name || 'Unknown',
                countryCode: data.country_code || 'XX',
                flag: getFlag(data.country_code?.toLowerCase()),
                lat: data.latitude,
                lon: data.longitude
            });
        } catch (error) {
            setDefaultLocation();
        } finally {
            setIsLoading(false);
        }
    };

    const setDefaultLocation = () => {
        setLocation({
            city: 'Buenos Aires',
            country: 'Argentina',
            countryCode: 'AR',
            flag: '🇦🇷',
            lat: -34.6037,
            lon: -58.3816
        });
        setIsLoading(false);
    };

    const getFlag = (countryCode: string | undefined): string => {
        if (!countryCode) return '🌍';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map((char) => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    };

    return { location, isLoading, setManualLocation, detectLocation };
}

export function LocationBadge() {
    const { location, isLoading, setManualLocation, detectLocation } = useLocationDetection();
    const [isOpen, setIsOpen] = useState(false);

    const handleLocationChange = (displayName: string, structured: any) => {
        if (!structured) return;

        // Extract country code somewhat reliably if possible, or fallback
        // Nominatim result `structured.raw.address.country_code` is best if available
        // But LocationInput might not return full raw address in all cases or the type check might differ.
        // Let's rely on what we have or infer.

        // Since LocationInput returns `structured.raw` which IS the nominatim result:
        const raw = structured.raw;

        let countryCode = 'XX';
        let city = displayName.split(',')[0];
        let country = 'Unknown';

        // Attempt to parse deeper if raw is available
        // Note: The LocationInput implementation shows it returns `raw`.
        if (raw && raw.address) {
            countryCode = raw.address.country_code?.toUpperCase() || 'XX';
            city = raw.address.city || raw.address.town || raw.address.village || city;
            country = raw.address.country || country;
        } else {
            // Heuristic fallback if raw address is missing
            const parts = displayName.split(',').map(p => p.trim());
            country = parts[parts.length - 1]; // Last part is usually country
        }

        const newLoc: DetectedLocation = {
            city: city,
            country: country,
            countryCode: countryCode,
            flag: isLoading ? '🌍' : (raw?.address?.country_code ? getFlag(raw.address.country_code) : '🌍'), // Helper duplicate or need export
            lat: structured.lat,
            lon: structured.lng
        };

        setManualLocation(newLoc);
        setIsOpen(false);
    };

    // Duplicate helper since it's not exported from hook easily without refactor
    const getFlag = (countryCode: string | undefined): string => {
        if (!countryCode) return '🌍';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map((char) => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    };

    if (isLoading || !location) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                <MapPin className="h-4 w-4" />
                <span>Detecting...</span>
            </div>
        );
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-2 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800"
                    onClick={() => setIsOpen(true)}
                >
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">
                        {location.city}, {location.country}
                    </span>
                    <span className="text-lg">{location.flag}</span>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4" align="center">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm leading-none">Wrong location?</h4>
                        <p className="text-xs text-muted-foreground">
                            Enter your city manually to find local Umarels.
                        </p>
                    </div>
                    <LocationInput
                        placeholder="Search city (e.g. Milan)"
                        onChange={handleLocationChange}
                        className="w-full"
                    />
                    <div className="pt-2 border-t flex justify-end">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-8"
                            onClick={() => {
                                localStorage.removeItem('umarel_user_location');
                                setIsOpen(false);
                                detectLocation();
                            }}
                        >
                            <RefreshCw className="w-3 h-3 mr-2" /> Detect Again
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
