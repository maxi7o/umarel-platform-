'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { PayoutService } from '@/lib/services/payout-service';

const ADMIN_EMAILS = ['admin@elentendido.ar'];

async function checkAdminAccess() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { authorized: false, error: 'Unauthorized' };
    }

    // Check if email is in SuperAdmin allowlist (bypass DB check)
    const isSuperAdmin = user.email && ADMIN_EMAILS.includes(user.email);

    if (isSuperAdmin) {
        return { authorized: true, user };
    }

    // If not superadmin, check DB role
    try {
        const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));
        if (dbUser && dbUser.role === 'admin') {
            return { authorized: true, user };
        }
    } catch (e) {
        console.error("Admin DB Check Error:", e);
        // If DB check fails, relying solely on SuperAdmin list (already checked above)
    }

    return { authorized: false, error: 'Forbidden' };
}

export async function triggerDailyPayout() {
    try {
        const { authorized, error } = await checkAdminAccess();
        if (!authorized) return { success: false, error };

        const result = await PayoutService.processDailyPayout(undefined, true); // Force execution for testing
        return result;

    } catch (error) {
        console.error('Trigger Daily Payout Error:', error);
        return { success: false, error: 'Internal Server Error' };
    }
}

export async function getDailyPayoutPreview() {
    try {
        const { authorized, error } = await checkAdminAccess();
        if (!authorized) return { success: false, error };

        try {
            const preview = await PayoutService.getPreview();
            return { success: true, data: preview };
        } catch (serviceError) {
            console.error('PayoutService Preview Error:', serviceError);
            // Return empty data instead of error to allow UI to load
            return { success: true, data: { totalPool: 0, totalScore: 0, payouts: [] } };
        }

    } catch (error) {
        console.error('Preview Error:', error);
        return { success: false, error: 'Internal Server Error' };
    }
}
