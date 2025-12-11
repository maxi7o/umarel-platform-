'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { slices, quotes } from '@/lib/db/schema'
import { db } from '@/lib/db'

export async function createSlice(requestId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const estimatedEffort = formData.get('estimatedEffort') as string

    await db.insert(slices).values({
        requestId,
        creatorId: user.id,
        title,
        description,
        estimatedEffort,
    })

    revalidatePath(`/requests/${requestId}`)
}

export async function createQuote(sliceId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const amount = parseInt(formData.get('amount') as string) * 100 // convert to cents
    const message = formData.get('message') as string

    await db.insert(quotes).values({
        sliceId,
        providerId: user.id,
        amount,
        message,
    })

    // In a real app we'd revalidate the path where this quote is shown
    // revalidatePath(...)
}
