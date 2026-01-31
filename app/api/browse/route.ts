import { NextResponse } from 'next/server';
import { getMockBrowseResults } from '@/lib/mock-data';
import { db } from '@/lib/db';
import { requests, serviceOfferings, users, providerMetrics } from '@/lib/db/schema';
import { eq, and, or, ilike, desc, gte, lte } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const location = searchParams.get('location');
        const category = searchParams.get('category');
        const query = searchParams.get('q'); // Text search query
        const type = searchParams.get('type') || 'all'; // 'all', 'requests', 'offerings'
        const includeVirtual = searchParams.get('includeVirtual') !== 'false';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const lat = parseFloat(searchParams.get('lat') || '0');
        const lng = parseFloat(searchParams.get('lng') || '0');
        const radius = parseInt(searchParams.get('radius') || '0');

        const results: any = {
            requests: [],
            offerings: [],
            total: 0,
            filters: {
                location,
                category,
                query,
                type,
            }
        };

        // Fetch Requests
        if (type === 'all' || type === 'requests') {
            const requestConditions = [];

            if (category) {
                requestConditions.push(eq(requests.category, category));
            }

            if (query) {
                requestConditions.push(
                    or(
                        ilike(requests.title, `%${query}%`),
                        ilike(requests.description, `%${query}%`)
                    )
                );
            }

            if (location && !lat) { // Only text search if no coords
                requestConditions.push(
                    or(
                        includeVirtual ? eq(requests.isVirtual, true) : undefined,
                        ilike(requests.location, `%${location}%`)
                    )
                );
            }

            requestConditions.push(eq(requests.status, 'open'));

            const fetchedRequests = await db
                .select()
                .from(requests)
                .where(requestConditions.length > 0 ? and(...requestConditions) : undefined)
                .orderBy(desc(requests.featured), desc(requests.createdAt))
                .limit(limit); // Pagination might be tricky with in-memory filter, but MVP okay

            // Fetch user info for each request
            const mappedRequests = await Promise.all(
                fetchedRequests.map(async (req) => {
                    const [user] = await db
                        .select()
                        .from(users)
                        .where(eq(users.id, req.userId));

                    let distance = 0;
                    if (lat && lng && req.locationDetails && (req.locationDetails as any).lat) {
                        const dLat = (req.locationDetails as any).lat;
                        const dLng = (req.locationDetails as any).lng;
                        // Haversine
                        const R = 6371;
                        const dLatRad = (dLat - lat) * Math.PI / 180;
                        const dLngRad = (dLng - lng) * Math.PI / 180;
                        const a = Math.sin(dLatRad / 2) * Math.sin(dLatRad / 2) +
                            Math.cos(lat * Math.PI / 180) * Math.cos(dLat * Math.PI / 180) *
                            Math.sin(dLngRad / 2) * Math.sin(dLngRad / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        distance = R * c;
                    }

                    return {
                        ...req,
                        type: 'request',
                        distance,
                        user: {
                            id: user.id,
                            fullName: user.fullName,
                        }
                    };
                })
            );

            if (radius > 0 && lat && lng) {
                results.requests = mappedRequests.filter(r => r.distance <= radius || (includeVirtual && r.isVirtual));
            } else {
                results.requests = mappedRequests;
            }
        }

        // Fetch Service Offerings
        if (type === 'all' || type === 'offerings') {
            const offeringConditions = [];

            if (category) {
                offeringConditions.push(eq(serviceOfferings.category, category));
            }

            if (query) {
                offeringConditions.push(
                    or(
                        ilike(serviceOfferings.title, `%${query}%`),
                        ilike(serviceOfferings.description, `%${query}%`)
                    )
                );
            }

            if (location && !lat) {
                offeringConditions.push(
                    or(
                        includeVirtual ? eq(serviceOfferings.isVirtual, true) : undefined,
                        ilike(serviceOfferings.location, `%${location}%`)
                    )
                );
            }

            offeringConditions.push(eq(serviceOfferings.status, 'active'));

            const fetchedOfferings = await db
                .select()
                .from(serviceOfferings)
                .where(offeringConditions.length > 0 ? and(...offeringConditions) : undefined)
                .orderBy(desc(serviceOfferings.featured), desc(serviceOfferings.createdAt))
                .limit(limit);

            // Fetch provider info and metrics for each offering
            const mappedOfferings = await Promise.all(
                fetchedOfferings.map(async (offering) => {
                    const [provider] = await db
                        .select()
                        .from(users)
                        .where(eq(users.id, offering.providerId));

                    const [metrics] = await db
                        .select()
                        .from(providerMetrics)
                        .where(eq(providerMetrics.providerId, offering.providerId));

                    let distance = 0;
                    if (lat && lng && offering.locationDetails && (offering.locationDetails as any).lat) {
                        const dLat = (offering.locationDetails as any).lat;
                        const dLng = (offering.locationDetails as any).lng;
                        // Haversine
                        const R = 6371;
                        const dLatRad = (dLat - lat) * Math.PI / 180;
                        const dLngRad = (dLng - lng) * Math.PI / 180;
                        const a = Math.sin(dLatRad / 2) * Math.sin(dLatRad / 2) +
                            Math.cos(lat * Math.PI / 180) * Math.cos(dLat * Math.PI / 180) *
                            Math.sin(dLngRad / 2) * Math.sin(dLngRad / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        distance = R * c;
                    }

                    return {
                        ...offering,
                        type: 'offering',
                        distance,
                        provider: {
                            id: provider.id,
                            fullName: provider.fullName,
                            avatarUrl: provider.avatarUrl,
                            auraPoints: provider.auraPoints,
                        },
                        metrics: metrics ? {
                            completionRate: (metrics.totalSlicesCompleted || 0) > 0
                                ? Math.round(((metrics.totalSlicesCompleted || 0) / ((metrics.totalSlicesCompleted || 0) + 1)) * 100)
                                : 0,
                            onTimeRate: (metrics.totalSlicesCompleted || 0) > 0
                                ? Math.round(((metrics.totalSlicesOnTime || 0) / (metrics.totalSlicesCompleted || 0)) * 100)
                                : 0,
                            rating: metrics.rating || 0,
                        } : null
                    };
                })
            );

            if (radius > 0 && lat && lng) {
                results.offerings = mappedOfferings.filter(o => o.distance <= radius || (includeVirtual && o.isVirtual));
            } else {
                results.offerings = mappedOfferings;
            }
        }

        // Sort by distance if location provided
        if (lat && lng) {
            const combined = [...results.requests, ...results.offerings].sort((a: any, b: any) => {
                if (a.isVirtual && !b.isVirtual) return 1; // Virtual last or depends on preference
                if (!a.isVirtual && b.isVirtual) return -1;
                return a.distance - b.distance;
            });
            // Re-slice might be needed if we fetched too many, but for now just returning what we have
        }

        results.total = results.requests.length + results.offerings.length;

        // --- MOCK DATA INJECTION IF EMPTY (FOR TESTING) ---
        if (results.total === 0) {
            const { requests, offerings } = getMockBrowseResults();

            if (type === 'all' || type === 'requests') results.requests = requests;
            if (type === 'all' || type === 'offerings') results.offerings = offerings;
            results.total = (results.requests?.length || 0) + (results.offerings?.length || 0);
        }
        // --------------------------------------------------

        return NextResponse.json(results);
    } catch (error) {
        console.error('Error fetching browse results:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
