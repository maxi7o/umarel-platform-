'use server';

import { createClient } from '@/lib/supabase/server';
import { slices, sliceBookings } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export type CreateSliceInput = {
    requestId?: string;
    experienceId?: string;
    title: string;
    description: string;
    sliceType?: 'standard' | 'optional' | 'premium';
    status?: 'draft' | 'proposed' | 'active';
};

export async function getSlicesForContext(contextId: string, contextType: 'request' | 'experience') {
    if (contextType === 'request') {
        return await db.query.slices.findMany({
            where: eq(slices.requestId, contextId),
            orderBy: (slices, { asc }) => [asc(slices.createdAt)],
        });
    } else {
        return await db.query.slices.findMany({
            where: eq(slices.experienceId, contextId),
            orderBy: (slices, { asc }) => [asc(slices.activationTime)],
        });
    }
}

export async function createSlice(data: CreateSliceInput) {
    const supabase = await createClient(); // Fixed: await createClient
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const [newSlice] = await db.insert(slices).values({
        creatorId: user.id,
        requestId: data.requestId,
        experienceId: data.experienceId,
        title: data.title,
        description: data.description,
        sliceType: data.sliceType || 'standard',
        status: data.status || 'draft',
        createdAt: new Date(),
    }).returning();

    revalidatePath(data.requestId ? `/requests/${data.requestId}` : `/experiences/${data.experienceId}`);
    return newSlice;
}

export async function deleteSlice(sliceId: string) {
    const supabase = await createClient(); // Fixed: await createClient
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    await db.delete(slices).where(and(
        eq(slices.id, sliceId),
        eq(slices.creatorId, user.id) // Security check
    ));

    return { success: true };
}
