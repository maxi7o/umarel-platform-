import { db } from '@/lib/db';
import { userNotifications, notificationPreferences } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export type NotificationType =
    | 'payment_received'
    | 'payment_released'
    | 'proposal_received'
    | 'proposal_accepted'
    | 'proposal_rejected'
    | 'milestone_completed'
    | 'milestone_approved'
    | 'audit_requested'
    | 'audit_completed'
    | 'verification_approved'
    | 'verification_rejected'
    | 'message_received'
    | 'system_announcement';

interface CreateNotificationParams {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
    relatedEntityId?: string;
    relatedEntityType?: string;
    metadata?: Record<string, any>;
    expiresAt?: Date;
}

export class InAppNotificationService {
    /**
     * Create a new notification for a user
     */
    static async create(params: CreateNotificationParams) {
        const {
            userId,
            type,
            title,
            message,
            actionUrl,
            relatedEntityId,
            relatedEntityType,
            metadata,
            expiresAt
        } = params;

        // Check user preferences
        const [prefs] = await db
            .select()
            .from(notificationPreferences)
            .where(eq(notificationPreferences.userId, userId))
            .limit(1);

        // If user has disabled this type, don't create
        const prefKey = this.getPreferenceKey(type);
        if (prefs && prefKey && !prefs[prefKey as keyof typeof prefs]) {
            console.log(`[InAppNotificationService] User ${userId} has disabled ${type} notifications`);
            return null;
        }

        // Create notification
        const [notification] = await db
            .insert(userNotifications)
            .values({
                userId,
                type,
                title,
                message,
                actionUrl,
                relatedEntityId,
                relatedEntityType,
                metadata,
                expiresAt,
            })
            .returning();

        return notification;
    }

    /**
     * Get all notifications for a user
     */
    static async getForUser(userId: string, limit = 50) {
        return db
            .select()
            .from(userNotifications)
            .where(eq(userNotifications.userId, userId))
            .orderBy(desc(userNotifications.createdAt))
            .limit(limit);
    }

    /**
     * Get unread count for a user
     */
    static async getUnreadCount(userId: string) {
        const result = await db
            .select()
            .from(userNotifications)
            .where(
                and(
                    eq(userNotifications.userId, userId),
                    eq(userNotifications.isRead, false)
                )
            );

        return result.length;
    }

    /**
     * Mark notification as read
     */
    static async markAsRead(notificationId: string, userId: string) {
        const [updated] = await db
            .update(userNotifications)
            .set({
                isRead: true,
                readAt: new Date(),
            })
            .where(
                and(
                    eq(userNotifications.id, notificationId),
                    eq(userNotifications.userId, userId)
                )
            )
            .returning();

        return updated;
    }

    /**
     * Mark all notifications as read for a user
     */
    static async markAllAsRead(userId: string) {
        await db
            .update(userNotifications)
            .set({
                isRead: true,
                readAt: new Date(),
            })
            .where(
                and(
                    eq(userNotifications.userId, userId),
                    eq(userNotifications.isRead, false)
                )
            );
    }

    /**
     * Delete a notification
     */
    static async delete(notificationId: string, userId: string) {
        await db
            .delete(userNotifications)
            .where(
                and(
                    eq(userNotifications.id, notificationId),
                    eq(userNotifications.userId, userId)
                )
            );
    }

    /**
     * Get user preferences
     */
    static async getPreferences(userId: string) {
        const [prefs] = await db
            .select()
            .from(notificationPreferences)
            .where(eq(notificationPreferences.userId, userId))
            .limit(1);

        return prefs;
    }

    /**
     * Update user preferences
     */
    static async updatePreferences(
        userId: string,
        updates: Partial<typeof notificationPreferences.$inferInsert>
    ) {
        const [updated] = await db
            .update(notificationPreferences)
            .set({
                ...updates,
                updatedAt: new Date(),
            })
            .where(eq(notificationPreferences.userId, userId))
            .returning();

        return updated;
    }

    /**
     * Helper: Map notification type to preference key
     */
    private static getPreferenceKey(type: NotificationType): string | null {
        const mapping: Record<string, string> = {
            payment_received: 'inAppPayments',
            payment_released: 'inAppPayments',
            proposal_received: 'inAppProposals',
            proposal_accepted: 'inAppProposals',
            proposal_rejected: 'inAppProposals',
            milestone_completed: 'inAppMilestones',
            milestone_approved: 'inAppMilestones',
            audit_requested: 'inAppAudits',
            audit_completed: 'inAppAudits',
            message_received: 'inAppMessages',
        };

        return mapping[type] || null;
    }

    /**
     * Helper: Create notification for payment events
     */
    static async notifyPaymentReceived(userId: string, amount: number, currency: string, requestTitle: string) {
        return this.create({
            userId,
            type: 'payment_received',
            title: '💰 Pago Recibido',
            message: `Recibiste ${new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount / 100)} por "${requestTitle}"`,
            metadata: { amount, currency, requestTitle },
        });
    }

    static async notifyPaymentReleased(userId: string, amount: number, currency: string, sliceTitle: string) {
        return this.create({
            userId,
            type: 'payment_released',
            title: '✅ Fondos Liberados',
            message: `Se liberaron ${new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount / 100)} del hito "${sliceTitle}"`,
            metadata: { amount, currency, sliceTitle },
        });
    }

    /**
     * Helper: Create notification for proposal events
     */
    static async notifyProposalReceived(userId: string, providerName: string, requestTitle: string, requestId: string) {
        return this.create({
            userId,
            type: 'proposal_received',
            title: '📝 Nueva Propuesta',
            message: `${providerName} envió una propuesta para "${requestTitle}"`,
            actionUrl: `/requests/${requestId}`,
            relatedEntityId: requestId,
            relatedEntityType: 'request',
            metadata: { providerName, requestTitle },
        });
    }

    static async notifyProposalAccepted(userId: string, requestTitle: string, requestId: string) {
        return this.create({
            userId,
            type: 'proposal_accepted',
            title: '🎉 Propuesta Aceptada',
            message: `Tu propuesta para "${requestTitle}" fue aceptada`,
            actionUrl: `/requests/${requestId}`,
            relatedEntityId: requestId,
            relatedEntityType: 'request',
            metadata: { requestTitle },
        });
    }

    /**
     * Helper: Create notification for verification events
     */
    static async notifyVerificationApproved(userId: string) {
        return this.create({
            userId,
            type: 'verification_approved',
            title: '✅ Verificación Aprobada',
            message: 'Tu identidad fue verificada exitosamente. Ya podés ofrecer servicios.',
            actionUrl: '/verify/status',
        });
    }

    static async notifyVerificationRejected(userId: string, reason?: string) {
        return this.create({
            userId,
            type: 'verification_rejected',
            title: '❌ Verificación Rechazada',
            message: reason || 'No pudimos verificar tu identidad. Por favor, intentá nuevamente con documentos más claros.',
            actionUrl: '/verify',
        });
    }
}
