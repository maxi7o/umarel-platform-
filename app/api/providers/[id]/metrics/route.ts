import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { providerMetrics, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: providerId } = await params;

        // Get provider info
        const [provider] = await db
            .select()
            .from(users)
            .where(eq(users.id, providerId));

        if (!provider) {
            return NextResponse.json(
                { error: 'Provider not found' },
                { status: 404 }
            );
        }

        // Get provider metrics
        const [metrics] = await db
            .select()
            .from(providerMetrics)
            .where(eq(providerMetrics.providerId, providerId));

        // Calculate derived metrics
        const completionRate = metrics?.totalSlicesCompleted
            ? Math.round((metrics.totalSlicesCompleted / (metrics.totalSlicesCompleted + 1)) * 100)
            : 0;

        const onTimeRate = metrics?.totalSlicesCompleted && metrics.totalSlicesCompleted > 0
            ? Math.round(((metrics.totalSlicesOnTime || 0) / metrics.totalSlicesCompleted) * 100)
            : 0;

        return NextResponse.json({
            provider: {
                id: provider.id,
                fullName: provider.fullName,
                email: provider.email,
                avatarUrl: provider.avatarUrl,
                auraPoints: provider.auraPoints,
            },
            metrics: {
                totalSlicesCompleted: metrics?.totalSlicesCompleted || 0,
                totalSlicesOnTime: metrics?.totalSlicesOnTime || 0,
                averageCompletionHours: metrics?.averageCompletionHours || 0,
                totalEarnings: metrics?.totalEarnings || 0,
                rating: metrics?.rating || 0,
                umarelEndorsements: metrics?.umarelEndorsements || 0,
                completionRate,
                onTimeRate,
            }
        });
    } catch (error) {
        console.error('Error fetching provider metrics:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
