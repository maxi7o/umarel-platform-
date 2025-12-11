import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { savedItems, requests, serviceOfferings } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { createNotification } from '@/lib/notifications';

// Mock user ID for now
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { itemId, type } = body; // type: 'request' | 'offering'

        if (!itemId || !type) {
            return NextResponse.json({ error: 'Item ID and type are required' }, { status: 400 });
        }

        // Check if already saved
        const [existing] = await db.select()
            .from(savedItems)
            .where(
                and(
                    eq(savedItems.userId, MOCK_USER_ID),
                    type === 'request'
                        ? eq(savedItems.requestId, itemId)
                        : eq(savedItems.offeringId, itemId)
                )
            );

        if (existing) {
            // Remove
            await db.delete(savedItems)
                .where(eq(savedItems.id, existing.id));
            return NextResponse.json({ saved: false });
        } else {
            // Add
            await db.insert(savedItems)
                .values({
                    userId: MOCK_USER_ID,
                    type,
                    requestId: type === 'request' ? itemId : null,
                    offeringId: type === 'offering' ? itemId : null,
                });

            // Trigger notification
            await createNotification(
                MOCK_USER_ID,
                'Item Saved',
                `You saved a ${type} to your favorites.`,
                `/favorites` // TODO: Create favorites page
            );

            return NextResponse.json({ saved: true });
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const items = await db.select()
            .from(savedItems)
            .where(eq(savedItems.userId, MOCK_USER_ID));

        // Enrich with details (N+1 but fine for MVP)
        const enrichedItems = await Promise.all(items.map(async (item) => {
            let details = null;
            if (item.type === 'request' && item.requestId) {
                [details] = await db.select().from(requests).where(eq(requests.id, item.requestId));
            } else if (item.type === 'offering' && item.offeringId) {
                [details] = await db.select().from(serviceOfferings).where(eq(serviceOfferings.id, item.offeringId));
            }
            return { ...item, item: details };
        }));

        // Filter out nulls (deleted items)
        return NextResponse.json(enrichedItems.filter(i => i.item));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }
}
