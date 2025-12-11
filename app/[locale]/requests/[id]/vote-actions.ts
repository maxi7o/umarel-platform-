'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { users, slices } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function voteSlice(sliceId: string, direction: 'up' | 'down') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // In a real app, we would track votes in a separate table to prevent double voting
    // and to allow changing votes. For MVP, we'll just increment/decrement aura points
    // of the slice creator.

    // 1. Get the slice to find the creator
    const sliceResult = await db.select().from(slices).where(eq(slices.id, sliceId))
    const slice = sliceResult[0]

    if (!slice) return

    // 2. Update creator's aura points
    const points = direction === 'up' ? 10 : -5

    await db.update(users)
        .set({ auraPoints: sql`${users.auraPoints} + ${points}` })
        .where(eq(users.id, slice.creatorId))

    revalidatePath(`/requests/${slice.requestId}`)
}
