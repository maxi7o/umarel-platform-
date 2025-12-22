import { db } from '@/lib/db';
import { requests } from '@/lib/db/schema';

interface CreateRequestParams {
    userId: string;
    title: string;
    description: string;
    category?: string;
    location?: string;
}

export async function createRequest(params: CreateRequestParams) {
    const { userId, title, description, category, location } = params;

    const [newRequest] = await db.insert(requests).values({
        userId,
        title,
        description,
        category,
        location,
        status: 'open',
    }).returning();

    return newRequest;
}
