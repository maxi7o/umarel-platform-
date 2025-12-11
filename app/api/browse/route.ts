import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requests, serviceOfferings, users, providerMetrics } from '@/lib/db/schema';
import { eq, and, or, ilike, desc } from 'drizzle-orm';

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

            if (location) {
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
                .limit(limit);

            // Fetch user info for each request
            results.requests = await Promise.all(
                fetchedRequests.map(async (req) => {
                    const [user] = await db
                        .select()
                        .from(users)
                        .where(eq(users.id, req.userId));

                    return {
                        ...req,
                        type: 'request',
                        user: {
                            id: user.id,
                            fullName: user.fullName,
                        }
                    };
                })
            );
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

            if (location) {
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
            results.offerings = await Promise.all(
                fetchedOfferings.map(async (offering) => {
                    const [provider] = await db
                        .select()
                        .from(users)
                        .where(eq(users.id, offering.providerId));

                    const [metrics] = await db
                        .select()
                        .from(providerMetrics)
                        .where(eq(providerMetrics.providerId, offering.providerId));

                    return {
                        ...offering,
                        type: 'offering',
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
        }

        results.total = results.requests.length + results.offerings.length;

        return NextResponse.json(results);
    } catch (error) {
        console.error('Error fetching browse results:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
