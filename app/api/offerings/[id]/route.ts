import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { serviceOfferings, users, providerMetrics } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Fetch offering
        const [offering] = await db
            .select()
            .from(serviceOfferings)
            .where(eq(serviceOfferings.id, id));

        if (!offering) {
            return NextResponse.json(
                { error: 'Service offering not found' },
                { status: 404 }
            );
        }

        // Fetch provider info
        const [provider] = await db
            .select()
            .from(users)
            .where(eq(users.id, offering.providerId));

        // Fetch provider metrics
        const [metrics] = await db
            .select()
            .from(providerMetrics)
            .where(eq(providerMetrics.providerId, offering.providerId));

        return NextResponse.json({
            ...offering,
            provider: {
                id: provider.id,
                fullName: provider.fullName,
                email: provider.email,
                avatarUrl: provider.avatarUrl,
                auraPoints: provider.auraPoints,
            },
            metrics: metrics ? {
                totalSlicesCompleted: metrics.totalSlicesCompleted,
                completionRate: metrics.totalSlicesCompleted > 0
                    ? Math.round((metrics.totalSlicesCompleted / (metrics.totalSlicesCompleted + 1)) * 100)
                    : 0,
                onTimeRate: metrics.totalSlicesCompleted > 0
                    ? Math.round((metrics.totalSlicesOnTime / metrics.totalSlicesCompleted) * 100)
                    : 0,
                rating: metrics.rating,
                totalEarnings: metrics.totalEarnings,
                umarelEndorsements: metrics.umarelEndorsements,
            } : null
        });
    } catch (error) {
        console.error('Error fetching service offering:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { providerId, ...updates } = body;

        // Verify ownership
        const [offering] = await db
            .select()
            .from(serviceOfferings)
            .where(eq(serviceOfferings.id, id));

        if (!offering) {
            return NextResponse.json(
                { error: 'Service offering not found' },
                { status: 404 }
            );
        }

        if (offering.providerId !== providerId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        // Update offering
        const [updatedOffering] = await db
            .update(serviceOfferings)
            .set({
                ...updates,
                updatedAt: new Date(),
            })
            .where(eq(serviceOfferings.id, id))
            .returning();

        return NextResponse.json(updatedOffering);
    } catch (error) {
        console.error('Error updating service offering:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
