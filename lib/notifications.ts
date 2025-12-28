
import { db } from './db';
import { eq } from 'drizzle-orm';
import { users, notifications } from './db/schema';

type AlertType = 'DISPUTE_RAISED' | 'HIGH_VALUE_SLICE' | 'ERROR_500' | 'PAYMENT_FAILED';

interface AlertData {
    title: string;
    description: string;
    metadata?: Record<string, any>;
    url?: string;
}

export async function sendAlert(type: AlertType, data: AlertData) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn(`[Notifications] DISCORD_WEBHOOK_URL not set. Alert skipped: ${type}`);
        return;
    }

    const payload = {
        username: "Umarel Ops Bot 🤖",
        avatar_url: "https://umarel.org/bot-avatar.png",
        embeds: [{
            title: `${getEmoji(type)} ${data.title}`,
            description: data.description,
            color: getColor(type),
            fields: data.metadata ? Object.entries(data.metadata).map(([key, value]) => ({
                name: key,
                value: String(value),
                inline: true
            })) : [],
            url: data.url,
            timestamp: new Date().toISOString()
        }]
    };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error(`[Notifications] Failed to send Discord alert:`, error);
    }
}

function getEmoji(type: AlertType): string {
    switch (type) {
        case 'DISPUTE_RAISED': return '🚨';
        case 'HIGH_VALUE_SLICE': return '💰';
        case 'ERROR_500': return '🔥';
        case 'PAYMENT_FAILED': return '❌';
        default: return '📢';
    }
}

function getColor(type: AlertType): number {
    switch (type) {
        case 'DISPUTE_RAISED': return 0xFF4500; // Orange Red
        case 'HIGH_VALUE_SLICE': return 0xFFD700; // Gold
        case 'ERROR_500': return 0xFF0000; // Red
        case 'PAYMENT_FAILED': return 0x8B0000; // Dark Red
        default: return 0x3498DB; // Blue
    }
}


export async function createNotification(userId: string, title: string, message: string, link?: string) {
    try {
        await db.insert(notifications).values({
            userId,
            title,
            message,
            link: link || null,
            read: 0, // Unread
        });
    } catch (error) {
        console.error('[Notifications] Failed to create notification:', error);
    }
}

export async function markAsRead(notificationId: string) {
    try {
        await db.update(notifications)
            .set({ read: 1 })
            .where(eq(notifications.id, notificationId));
    } catch (error) {
        console.error('[Notifications] Failed to mark as read:', error);
    }
}
