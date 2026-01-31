'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface LocationMapProps {
    latitude: number;
    longitude: number;
    zoom?: number;
    className?: string;
    interactive?: boolean;
    onLocationChange?: (lat: number, lng: number) => void;
}

export function LocationMap({
    latitude,
    longitude,
    zoom = 14,
    className = '',
    interactive = false,
    onLocationChange
}: LocationMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const marker = useRef<maplibregl.Marker | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;
        if (map.current) return; // Initialize map only once

        // Initialize map with OpenStreetMap tiles (free)
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: [
                            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        ],
                        tileSize: 256,
                        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }
                },
                layers: [
                    {
                        id: 'osm',
                        type: 'raster',
                        source: 'osm',
                        minzoom: 0,
                        maxzoom: 19
                    }
                ]
            },
            center: [longitude, latitude],
            zoom: zoom,
            interactive: interactive
        });

        // Add navigation controls if interactive
        if (interactive) {
            map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        }

        // Add marker
        marker.current = new maplibregl.Marker({
            color: '#ea580c', // Orange color matching your brand
            draggable: interactive
        })
            .setLngLat([longitude, latitude])
            .addTo(map.current);

        // Handle marker drag if interactive
        if (interactive && onLocationChange) {
            marker.current.on('dragend', () => {
                const lngLat = marker.current!.getLngLat();
                onLocationChange(lngLat.lat, lngLat.lng);
            });
        }

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []); // Empty dependency array - only initialize once

    // Update marker position when props change
    useEffect(() => {
        if (marker.current && map.current) {
            marker.current.setLngLat([longitude, latitude]);
            map.current.setCenter([longitude, latitude]);
        }
    }, [latitude, longitude]);

    return (
        <div
            ref={mapContainer}
            className={`w-full h-full rounded-lg overflow-hidden ${className}`}
            style={{ minHeight: '300px' }}
        />
    );
}
