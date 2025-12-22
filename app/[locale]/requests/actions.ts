'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { users } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { initializeRequest } from '@/lib/services/request-service'

export async function createRequest(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Mock user for dev testing if not logged in
    let userId = user?.id
    if (!userId && process.env.NODE_ENV === 'development') {
        // Use a consistent dev user ID
        const DEV_USER_ID = '00000000-0000-0000-0000-000000000001'

        try {
            // Try to create dev user if it doesn't exist (will fail silently if exists)
            await db.insert(users).values({
                id: DEV_USER_ID,
                email: 'dev@umarel.org',
                fullName: 'Dev User',
                role: 'user',
            }).onConflictDoNothing()
        } catch (error) {
            // User might already exist, that's fine
        }

        userId = DEV_USER_ID
    }

    if (!userId) {
        redirect('/login')
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const location = formData.get('location') as string

    // TODO: Handle file uploads for photos
    // const photos = formData.getAll('photos')

    let redirectPath: string | null = null;

    // Create request
    try {
        const { initialSliceId } = await initializeRequest({
            userId,
            title,
            description,
            location
        });

        revalidatePath('/requests')
        redirectPath = `/wizard/${initialSliceId}`;

    } catch (error) {
        console.error('Service error:', error)

        // In development, if DB fails (e.g. no connection), log it
        if (process.env.NODE_ENV === 'development') {
            console.error('⚠️ Database failed during request creation:', error);
        }

        throw new Error(`Failed to create request: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    if (redirectPath) {
        redirect(redirectPath);
    }
}
