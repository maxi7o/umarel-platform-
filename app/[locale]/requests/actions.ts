'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requests, users, slices, sliceCards } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

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
        const insertedRequests = await db.insert(requests).values({
            userId,
            title,
            description,
            location,
        }).returning()

        const newRequest = insertedRequests[0]

        // Create initial slice for the Wizard
        const insertedSlices = await db.insert(slices).values({
            requestId: newRequest.id,
            creatorId: userId,
            title: title,
            description: description,
            status: 'proposed',
        }).returning()

        const initialSlice = insertedSlices[0]

        // Create initial Slice Card
        await db.insert(sliceCards).values({
            sliceId: initialSlice.id,
            requestId: newRequest.id,
            title: title,
            description: description,
            version: 1,
        });

        revalidatePath('/requests')
        redirectPath = `/wizard/${initialSlice.id}`;

    } catch (error) {
        console.error('Database error:', error)

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
