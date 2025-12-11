import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Mock email sender for now
async function sendEmail(to: string, subject: string, body: string) {
    console.log(`[EMAIL MOCK] To: ${to}, Subject: ${subject}, Body: ${body}`);
    // In production, integrate with Resend/SendGrid here
}

export async function createNotification(userId: string, title: string, message: string, link?: string) {
    try {
        // 1. Save to Database
        await db.insert(notifications).values({
            userId,
            title,
            message,
            link,
            read: 0,
        });

        // 2. Send Email (Traditional strategy: don't spam, maybe batch? For now, direct send)
        // Fetch user email (mock)
        const userEmail = "user@example.com";
        await sendEmail(userEmail, `Umarel: ${title}`, message);

    } catch (error) {
        console.error('Failed to create notification:', error);
    }
}

export async function markAsRead(notificationId: string) {
    await db.update(notifications)
        .set({ read: 1 })
        .where(eq(notifications.id, notificationId));
}
