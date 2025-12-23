import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { serviceOfferings, users, providerMetrics } from '@/lib/db/schema';
import { eq, and, or, ilike, desc } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            providerId,
            title,
            description,
            category,
            location,
            locationDetails,
            isVirtual = false,
            hourlyRate,
            fixedRate,
            availability,
            skills = [],
            portfolioImages = []
        } = body;

        if (!providerId || !title || !description || !category) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate that either location is provided or service is virtual
        if (!isVirtual && !location) {
            return NextResponse.json(
                { error: 'Location required for non-virtual services' },
                { status: 400 }
            );
        }

        // Create service offering
        const [offering] = await db.insert(serviceOfferings).values({
            providerId,
            title,
            description,
            category,
            location: isVirtual ? null : location,
            locationDetails: isVirtual ? null : locationDetails,
            isVirtual,
            hourlyRate,
            fixedRate,
            availability,
            skills,
            portfolioImages,
            status: 'active',
        }).returning();

        return NextResponse.json(offering);
    } catch (error) {
        console.error('Error creating service offering:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const location = searchParams.get('location');
        const category = searchParams.get('category');
        const isVirtual = searchParams.get('isVirtual') === 'true';
        const providerId = searchParams.get('providerId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        // Build query conditions
        const conditions = [];

        if (providerId) {
            conditions.push(eq(serviceOfferings.providerId, providerId));
        }

        if (category) {
            conditions.push(eq(serviceOfferings.category, category));
        }

        // Location filtering: show virtual services + services in specified location
        if (location && !isVirtual) {
            conditions.push(
                or(
                    eq(serviceOfferings.isVirtual, true),
                    ilike(serviceOfferings.location, `%${location}%`)
                )
            );
        } else if (isVirtual) {
            conditions.push(eq(serviceOfferings.isVirtual, true));
        }

        // Only show active offerings
        conditions.push(eq(serviceOfferings.status, 'active'));

        // Fetch offerings
        const offerings = await db
            .select()
            .from(serviceOfferings)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(serviceOfferings.featured), desc(serviceOfferings.createdAt))
            .limit(limit)
            .offset(offset);

        // Fetch provider info and metrics for each offering
        const offeringsWithProviders = await Promise.all(
            offerings.map(async (offering) => {
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
                    provider: {
                        id: provider.id,
                        fullName: provider.fullName,
                        avatarUrl: provider.avatarUrl,
                        auraPoints: provider.auraPoints,
                    },
                    metrics: metrics ? {
                        completionRate: (metrics.totalSlicesCompleted ?? 0) > 0
                            ? Math.round(((metrics.totalSlicesCompleted ?? 0) / ((metrics.totalSlicesCompleted ?? 0) + 1)) * 100)
                            : 0,
                        onTimeRate: (metrics.totalSlicesCompleted ?? 0) > 0
                            ? Math.round(((metrics.totalSlicesOnTime ?? 0) / (metrics.totalSlicesCompleted ?? 0)) * 100)
                            : 0,
                        rating: metrics.rating ?? 0,
                    } : null
                };
            })
        );

        return NextResponse.json({
            offerings: offeringsWithProviders,
            page,
            limit,
            total: offerings.length,
        });
    } catch (error) {
        console.error('Error fetching service offerings:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
