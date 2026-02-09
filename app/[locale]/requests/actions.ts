'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { users } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { initializeRequest } from '@/lib/services/request-service'
import { eq } from 'drizzle-orm'

export async function createRequest(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const locale = await getLocale();

    // Mock user for dev testing if not logged in
    let userId = user?.id
    if (!userId && process.env.NODE_ENV === 'development') {
        const DEV_USER_ID = '11111111-1111-1111-1111-111111111111'

        try {
            await db.insert(users).values({
                id: DEV_USER_ID,
                email: 'maria@demo.com',
                fullName: 'María González',
                role: 'user',
            }).onConflictDoNothing()
        } catch (error) {
            // User might already exist, that's fine
        }

        userId = DEV_USER_ID
    }

    if (!userId) {
        redirect(`/${locale}/login`)
    }

    // Ensure user exists in public.users to prevent FK errors
    try {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.id, userId!)
        });

        if (!existingUser) {
            const userEmail = user?.email || 'unknown@example.com';

            const emailUser = await db.query.users.findFirst({
                where: eq(users.email, userEmail)
            });

            if (emailUser) {
                console.log(`User sync: Found existing user by email ${userEmail} (ID: ${emailUser.id}). Using local ID instead of Auth ID ${userId}.`);
                userId = emailUser.id;
            } else {
                await db.insert(users).values({
                    id: userId!,
                    email: userEmail,
                    fullName: user?.user_metadata?.full_name || 'User',
                    role: 'user',
                });
            }
        }
    } catch (e) {
        console.error('Failed to sync user:', e);
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const location = formData.get('location') as string

    let redirectPath: string | null = null;

    try {
        const { initialSliceId } = await initializeRequest({
            userId,
            title,
            description,
            location
        });

        // Revalidate localized paths
        revalidatePath(`/${locale}/iniciativas`)
        revalidatePath('/requests')

        redirectPath = `/wizard/${initialSliceId}`;

    } catch (error) {
        console.error('Service error:', error)
        if (process.env.NODE_ENV === 'development') {
            console.error('⚠️ Database failed during request creation:', error);
        }
        throw new Error(`Failed to create request: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    if (redirectPath) {
        // Manual localization for redirect
        const localizedRedirect = redirectPath.replace('/wizard/', '/asistente/');
        redirect(`/${locale}${localizedRedirect}`);
    }
}
