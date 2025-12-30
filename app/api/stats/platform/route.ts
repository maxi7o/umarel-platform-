
import { NextResponse } from 'next/server';
import { getPlatformStats } from '@/lib/services/stats-service';

export async function GET() {
    const stats = await getPlatformStats();

    // Cache for 1 hour to reduce DB load
    return NextResponse.json(stats, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
        },
    });
}
