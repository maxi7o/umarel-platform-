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

export function useLocationDetection() {
    const [location, setLocation] = useState<DetectedLocation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { setMarket, marketId } = useMarket();

    useEffect(() => {
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

    const detectLocation = async () => {
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

    return { location, isLoading };
}

export function LocationBadge() {
    const { location, isLoading } = useLocationDetection();

    if (isLoading || !location) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                <MapPin className="h-4 w-4" />
                <span>Detecting...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">
                {location.city}, {location.country}
            </span>
            <span className="text-lg">{location.flag}</span>
        </div>
    );
}
