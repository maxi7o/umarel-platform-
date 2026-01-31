'use client';

import * as React from 'react';
import { useState } from 'react';
import { LocationInput } from './location-input';
import { LocationMap } from './location-map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LocationPickerProps {
    onLocationSelect?: (data: {
        address: string;
        lat: number;
        lng: number;
    }) => void;
    defaultAddress?: string;
    defaultLat?: number;
    defaultLng?: number;
    className?: string;
}

/**
 * Combined Location Picker with Search and Interactive Map
 * 
 * Features:
 * - Search with autocomplete (Photon + Nominatim fallback)
 * - Visual map preview with OpenStreetMap
 * - Draggable marker for fine-tuning
 * - Cached popular searches
 * 
 * @example
 * ```tsx
 * <LocationPicker
 *   onLocationSelect={(data) => console.log(data)}
 *   defaultLat={-34.6037}
 *   defaultLng={-58.3816}
 * />
 * ```
 */
export function LocationPicker({
    onLocationSelect,
    defaultAddress = '',
    defaultLat = -34.6037, // Buenos Aires
    defaultLng = -58.3816,
    className = ''
}: LocationPickerProps) {
    const [address, setAddress] = useState(defaultAddress);
    const [coordinates, setCoordinates] = useState({
        lat: defaultLat,
        lng: defaultLng
    });
    const [showMap, setShowMap] = useState(!!defaultAddress);

    const handleLocationChange = (value: string, structuredData?: any) => {
        setAddress(value);

        if (structuredData) {
            const newCoords = {
                lat: structuredData.lat,
                lng: structuredData.lng
            };
            setCoordinates(newCoords);
            setShowMap(true);

            if (onLocationSelect) {
                onLocationSelect({
                    address: value,
                    ...newCoords
                });
            }
        } else {
            setShowMap(false);
        }
    };

    const handleMapDrag = (lat: number, lng: number) => {
        setCoordinates({ lat, lng });

        if (onLocationSelect) {
            onLocationSelect({
                address,
                lat,
                lng
            });
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <LocationInput
                value={address}
                onChange={handleLocationChange}
                placeholder="Buscar dirección en Argentina..."
                className="w-full"
            />

            {showMap && (
                <Card className="overflow-hidden">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Ubicación seleccionada</CardTitle>
                        <CardDescription className="text-sm">
                            Arrastrá el marcador para ajustar la ubicación exacta
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <LocationMap
                            latitude={coordinates.lat}
                            longitude={coordinates.lng}
                            zoom={15}
                            interactive={true}
                            onLocationChange={handleMapDrag}
                            className="h-[300px] md:h-[400px]"
                        />
                    </CardContent>
                </Card>
            )}

            {showMap && (
                <div className="text-xs text-stone-500 space-y-1">
                    <p className="flex items-center gap-2">
                        <span className="font-medium">📍 Coordenadas:</span>
                        <code className="bg-stone-100 px-2 py-0.5 rounded">
                            {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                        </code>
                    </p>
                </div>
            )}
        </div>
    );
}
