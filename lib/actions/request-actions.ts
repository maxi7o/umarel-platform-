'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { requests } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function createDraftRequest() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // Create a new request in 'open' state for now, but really it acts as a container
    const [newRequest] = await db.insert(requests).values({
        userId: user.id,
        title: 'New Request',
        description: 'Describe your needs to the AI...',
        status: 'open',
        location: 'TBD', // Placeholder
        isVirtual: false,
    }).returning();

    return newRequest;
}

export async function getRequest(requestId: string) {
    const request = await db.query.requests.findFirst({
        where: eq(requests.id, requestId),
    });
    return request;
}
