import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { InAppNotificationService } from '@/lib/services/in-app-notification-service';

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '20');

        const notifications = await InAppNotificationService.getForUser(user.id, limit);
        const unreadCount = await InAppNotificationService.getUnreadCount(user.id);

        return NextResponse.json({
            notifications,
            unreadCount
        });
    } catch (error) {
        console.error('Failed to fetch notifications:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, markAllRead } = body;

        if (markAllRead) {
            await InAppNotificationService.markAllAsRead(user.id);
            return NextResponse.json({ success: true });
        }

        if (id) {
            await InAppNotificationService.markAsRead(id, user.id);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    } catch (error) {
        console.error('Failed to update notification:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
