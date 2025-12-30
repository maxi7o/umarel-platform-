
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
export { AI_USER_ID, GUEST_USER_ID, GUEST_COOKIE_NAME } from '@/lib/auth-constants';
import { AI_USER_ID, GUEST_USER_ID, GUEST_COOKIE_NAME } from '@/lib/auth-constants';
import { eq } from 'drizzle-orm';

export async function ensureSpecialUsers() {
    // 1. Ensure AI User
    await db.insert(users).values({
        id: AI_USER_ID,
        email: 'ai@umarel.org',
        fullName: 'Umarel AI',
        role: 'admin',
        auraPoints: 999999
    }).onConflictDoNothing();

    // 2. Ensure Guest User
    await db.insert(users).values({
        id: GUEST_USER_ID,
        email: 'guest@umarel.org',
        fullName: 'Guest User',
        role: 'user',
        auraPoints: 0
    }).onConflictDoNothing();
}

export async function getEffectiveUserId(authenticatedUserId?: string | null): Promise<string> {
    if (authenticatedUserId) return authenticatedUserId;

    // Ensure guest user exists before returning its ID
    await ensureSpecialUsers();
    return GUEST_USER_ID;
}
