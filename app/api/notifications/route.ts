import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { markAsRead } from '@/lib/notifications';

// Mock user ID
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

export async function GET(request: NextRequest) {
    try {
        const userNotifications = await db.select()
            .from(notifications)
            .where(eq(notifications.userId, MOCK_USER_ID))
            .orderBy(desc(notifications.createdAt))
            .limit(20);

        return NextResponse.json(userNotifications);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;

        if (id) {
            await markAsRead(id);
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'ID required' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
    }
}
