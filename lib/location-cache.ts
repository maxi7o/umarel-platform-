/**
 * Location Search Cache
 * Stores popular searches in localStorage to improve UX and reduce API calls
 */

interface CachedLocation {
    query: string;
    result: {
        place_id: number;
        lat: string;
        lon: string;
        display_name: string;
    };
    timestamp: number;
    hitCount: number;
}

const CACHE_KEY = 'umarel_location_cache';
const MAX_CACHE_SIZE = 50;
const CACHE_EXPIRY_DAYS = 30;

export class LocationCache {
    private static isClient = typeof window !== 'undefined';

    /**
     * Get cached results for a query
     */
    static get(query: string): CachedLocation['result'] | null {
        if (!this.isClient) return null;

        try {
            const cache = this.getCache();
            const normalizedQuery = query.toLowerCase().trim();
            const cached = cache.find(item =>
                item.query.toLowerCase() === normalizedQuery
            );

            if (cached) {
                // Check if expired
                const age = Date.now() - cached.timestamp;
                const maxAge = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

                if (age > maxAge) {
                    this.remove(query);
                    return null;
                }

                // Increment hit count
                cached.hitCount++;
                this.saveCache(cache);

                return cached.result;
            }

            return null;
        } catch (e) {
            console.error('Cache get error:', e);
            return null;
        }
    }

    /**
     * Store a search result in cache
     */
    static set(query: string, result: CachedLocation['result']): void {
        if (!this.isClient) return;

        try {
            let cache = this.getCache();
            const normalizedQuery = query.toLowerCase().trim();

            // Remove existing entry if present
            cache = cache.filter(item => item.query.toLowerCase() !== normalizedQuery);

            // Add new entry
            cache.unshift({
                query: normalizedQuery,
                result,
                timestamp: Date.now(),
                hitCount: 1
            });

            // Trim cache to max size, keeping most popular items
            if (cache.length > MAX_CACHE_SIZE) {
                cache.sort((a, b) => b.hitCount - a.hitCount);
                cache = cache.slice(0, MAX_CACHE_SIZE);
            }

            this.saveCache(cache);
        } catch (e) {
            console.error('Cache set error:', e);
        }
    }

    /**
     * Get popular searches (for autocomplete suggestions)
     */
    static getPopular(limit: number = 5): CachedLocation[] {
        if (!this.isClient) return [];

        try {
            const cache = this.getCache();
            return cache
                .sort((a, b) => b.hitCount - a.hitCount)
                .slice(0, limit);
        } catch (e) {
            console.error('Cache getPopular error:', e);
            return [];
        }
    }

    /**
     * Remove a specific entry
     */
    static remove(query: string): void {
        if (!this.isClient) return;

        try {
            const cache = this.getCache();
            const normalizedQuery = query.toLowerCase().trim();
            const filtered = cache.filter(item =>
                item.query.toLowerCase() !== normalizedQuery
            );
            this.saveCache(filtered);
        } catch (e) {
            console.error('Cache remove error:', e);
        }
    }

    /**
     * Clear entire cache
     */
    static clear(): void {
        if (!this.isClient) return;

        try {
            localStorage.removeItem(CACHE_KEY);
        } catch (e) {
            console.error('Cache clear error:', e);
        }
    }

    /**
     * Get cache statistics
     */
    static getStats() {
        if (!this.isClient) return null;

        try {
            const cache = this.getCache();
            const totalHits = cache.reduce((sum, item) => sum + item.hitCount, 0);
            const avgAge = cache.length > 0
                ? cache.reduce((sum, item) => sum + (Date.now() - item.timestamp), 0) / cache.length
                : 0;

            return {
                size: cache.length,
                totalHits,
                avgHitCount: cache.length > 0 ? totalHits / cache.length : 0,
                avgAgeDays: avgAge / (24 * 60 * 60 * 1000)
            };
        } catch (e) {
            console.error('Cache stats error:', e);
            return null;
        }
    }

    // Private helpers

    private static getCache(): CachedLocation[] {
        try {
            const stored = localStorage.getItem(CACHE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Cache parse error:', e);
            return [];
        }
    }

    private static saveCache(cache: CachedLocation[]): void {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch (e) {
            console.error('Cache save error:', e);
        }
    }
}
