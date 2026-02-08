'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { PayoutService } from '@/lib/services/payout-service';

const ADMIN_EMAILS = ['admin@elentendido.ar', 'mhamu@umarel.org'];

export async function triggerDailyPayout() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }

        // Check Admin Role
        const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));

        const isSuperAdmin = user.email && ADMIN_EMAILS.includes(user.email);

        if (!dbUser || (dbUser.role !== 'admin' && !isSuperAdmin)) {
            return { success: false, error: 'Forbidden' };
        }

        const result = await PayoutService.processDailyPayout(undefined, true); // Force execution for testing


        return result;

    } catch (error) {
        console.error('Trigger Daily Payout Error:', error);
        return { success: false, error: 'Internal Server Error' };
    }
}

export async function getDailyPayoutPreview() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }

        // Check Admin Role
        const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));

        const isSuperAdmin = user.email && ADMIN_EMAILS.includes(user.email);

        if (!dbUser || (dbUser.role !== 'admin' && !isSuperAdmin)) {
            return { success: false, error: 'Forbidden' };
        }

        const preview = await PayoutService.getPreview();
        return { success: true, data: preview };

    } catch (error) {
        console.error('Preview Error:', error);
        return { success: false, error: 'Internal Server Error' };
    }
}
