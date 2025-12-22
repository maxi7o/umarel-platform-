
import { db } from '@/lib/db';
import { requests, slices, sliceCards } from '@/lib/db/schema';

interface CreateRequestParams {
    userId: string;
    title: string;
    description: string;
    category?: string;
    location?: string;
}

export async function createRequest(params: CreateRequestParams) {
    // Basic creation - kept for backward compatibility or simple use cases
    const [newRequest] = await db.insert(requests).values({
        userId: params.userId,
        title: params.title,
        description: params.description,
        category: params.category,
        location: params.location,
        status: 'open',
    }).returning();

    return newRequest;
}

export async function initializeRequest(params: CreateRequestParams) {
    const { userId, title, description, category, location } = params;

    return await db.transaction(async (tx) => {
        // 1. Create Request
        const [newRequest] = await tx.insert(requests).values({
            userId,
            title,
            description,
            category,
            location,
            status: 'open',
        }).returning();

        // 2. Create Initial Slice (for Wizard context)
        const [initialSlice] = await tx.insert(slices).values({
            requestId: newRequest.id,
            creatorId: userId,
            title,
            description,
            status: 'proposed',
        }).returning();

        // 3. Create Initial Slice Card
        await tx.insert(sliceCards).values({
            sliceId: initialSlice.id,
            requestId: newRequest.id,
            title,
            description,
            version: 1,
            currency: 'ARS', // Default for now, TODO: dynamic
        });

        return {
            request: newRequest,
            initialSliceId: initialSlice.id
        };
    });
}
