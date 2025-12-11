import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requests } from '@/lib/db/schema';

// Mock user ID for seeding
const SEED_USER_ID = '00000000-0000-0000-0000-000000000001';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { requests: seedRequests } = body;

        if (!Array.isArray(seedRequests) || seedRequests.length === 0) {
            return NextResponse.json({ error: 'Invalid requests data' }, { status: 400 });
        }

        // Transform and insert requests
        const requestsToInsert = seedRequests.map((req: any) => ({
            userId: SEED_USER_ID,
            title: req.title,
            description: req.description,
            category: req.category,
            location: req.location,
            isVirtual: false,
            featured: false,
            status: 'open' as const,
            createdAt: new Date(req.createdAt),
        }));

        // Insert in batches of 50 to avoid overwhelming the DB
        const batchSize = 50;
        let totalInserted = 0;

        for (let i = 0; i < requestsToInsert.length; i += batchSize) {
            const batch = requestsToInsert.slice(i, i + batchSize);
            await db.insert(requests).values(batch);
            totalInserted += batch.length;
        }

        return NextResponse.json({
            success: true,
            count: totalInserted,
            message: `Successfully seeded ${totalInserted} requests`
        });

    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({
            error: 'Failed to seed database',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
