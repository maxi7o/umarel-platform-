
import { describe, it, expect } from 'vitest';
import { processLocationResults } from '@/components/forms/location-input';

describe('Location Logic scoring', () => {

    it('prioritizes CABA neighborhoods correctly', () => {
        const mockFeatures = [
            {
                properties: {
                    osm_id: 1,
                    name: 'Palermo',
                    city: 'Buenos Aires',
                    state: 'Ciudad Autónoma de Buenos Aires',
                    country: 'Argentina',
                    type: 'suburb'
                },
                geometry: { coordinates: [-58.4173, -34.5875] }
            },
            {
                properties: {
                    osm_id: 2,
                    name: 'Random Place',
                    city: 'Some City',
                    state: 'Buenos Aires',
                    country: 'Argentina',
                    type: 'village'
                },
                // Far away coordinate
                geometry: { coordinates: [-60.0, -38.0] }
            }
        ];

        const results = processLocationResults(mockFeatures);

        expect(results.length).toBe(2);
        // Palermo should be first because of higher score (CABA + Priority Area + Proximity)
        expect(results[0].display_name).toContain('Palermo');
    });

    it('prioritizes GBA priority areas', () => {
        const mockFeatures = [
            {
                properties: {
                    osm_id: 1,
                    name: 'La Matanza',
                    city: 'La Matanza',
                    state: 'Buenos Aires',
                    country: 'Argentina',
                    type: 'city'
                },
                geometry: { coordinates: [-58.54, -34.69] }
            },
            {
                properties: {
                    osm_id: 2,
                    name: 'Unknown Place',
                    city: 'Unknown',
                    state: 'Buenos Aires',
                    country: 'Argentina',
                    type: 'hamlet'
                },
                geometry: { coordinates: [-59.0, -35.0] }
            }
        ];

        const results = processLocationResults(mockFeatures);

        expect(results[0].display_name).toContain('La Matanza');
    });

    it('sorts by relevance when multiple priority areas match', () => {
        const mockFeatures = [
            // Less relevant (farther, smaller type)
            {
                properties: {
                    osm_id: 2,
                    name: 'San Martín',
                    city: 'Mendoza', // Different province, same name
                    state: 'Mendoza',
                    country: 'Argentina',
                    type: 'town'
                },
                geometry: { coordinates: [-68.0, -32.0] }
            },
            // More relevant (GBA, priority area, closer)
            {
                properties: {
                    osm_id: 1,
                    name: 'San Martín',
                    city: 'San Martín',
                    state: 'Buenos Aires',
                    country: 'Argentina',
                    type: 'city'
                },
                // Near CABA
                geometry: { coordinates: [-58.5, -34.6] }
            }
        ];

        const results = processLocationResults(mockFeatures);

        // The GBA San Martín should be first
        expect(results[0].display_name).toContain('Buenos Aires');
    });

    it('limits results to top 8', () => {
        const mockFeatures = Array(20).fill(null).map((_, i) => ({
            properties: {
                osm_id: i,
                name: `Place ${i}`,
                city: 'Buenos Aires',
                state: 'CABA',
                type: 'street'
            },
            geometry: { coordinates: [-58.38, -34.60] }
        }));

        const results = processLocationResults(mockFeatures);
        expect(results.length).toBe(8);
    });

    it('deduplicates results by display name', () => {
        const mockFeatures = [
            {
                properties: {
                    osm_id: 1,
                    name: 'Palermo',
                    city: 'Buenos Aires'
                },
                geometry: { coordinates: [-58.0, -34.0] }
            },
            {
                properties: {
                    osm_id: 2,
                    name: 'Palermo',
                    city: 'Buenos Aires'
                },
                geometry: { coordinates: [-58.0, -34.0] }
            }
        ];

        const results = processLocationResults(mockFeatures);
        expect(results.length).toBe(1);
    });
});
