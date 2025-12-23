import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export class SafetyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SafetyError';
    }
}

const COMMENT_COOLDOWN_MS = 60 * 1000; // 60 seconds

export async function checkSpamCooldown(userId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
            lastCommentAt: true
        }
    });

    if (!user) {
        throw new SafetyError("User not found.");
    }

    if (user.lastCommentAt) {
        const timeSinceLastComment = Date.now() - user.lastCommentAt.getTime();
        if (timeSinceLastComment < COMMENT_COOLDOWN_MS) {
            const remaining = Math.ceil((COMMENT_COOLDOWN_MS - timeSinceLastComment) / 1000);
            throw new SafetyError(`Please wait ${remaining} seconds before commenting again.`);
        }
    }

    // Update lastCommentAt happens AFTER the comment is successfully created in the caller function,
    // OR we can update it here if we want to be strict about "attempting" to comment.
    // For now, let's update it here to enforce the rate limit eagerly.

    await db.update(users)
        .set({ lastCommentAt: new Date() })
        .where(eq(users.id, userId));

    return true;
}
