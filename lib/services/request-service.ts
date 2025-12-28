
import { db, sql } from '@/lib/db';
// keeping db import if used elsewhere, or just sql
import { requests, slices } from '@/lib/db/schema'; // Keep purely for types if needed

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

    return await sql.begin(async (sql) => {
        // 1. Create Request
        const [newRequest] = await sql`
            INSERT INTO requests (user_id, title, description, category, location, status)
            VALUES (${userId}, ${title}, ${description}, ${category ?? null}, ${location ?? null}, 'open')
            RETURNING *
        `;

        // 2. Create Initial Slice (Manual Insert to bypass Drizzle weirdness with refund_status default)
        // Note: We don't explicitly set refund_status here, we let the DB default ('none') handle it.
        // It seems Drizzle fails when it tries to handle it.
        const [initialSlice] = await sql`
            INSERT INTO slices (
                request_id, creator_id, title, description, status
            ) VALUES (
                ${newRequest.id}, ${userId}, ${title}, ${description}, 'proposed'
            )
            RETURNING *
        `;

        // 3. Create Initial Slice Card
        await sql`
            INSERT INTO slice_cards (
                slice_id, request_id, title, description, version, currency
            ) VALUES (
                ${initialSlice.id}, ${newRequest.id}, ${title}, ${description}, 1, 'ARS'
            )
        `;

        // Map back to camelCase manually for compatibility if needed, using schema types helps but
        // for now we return what the caller expects. 
        // Drizzle return types were camelCase (e.g. userId), but raw returns snake_case (user_id).
        // Since the caller just needs IDs usually, let's verify what `newRequest` structure is needed effectively.
        // The return type of this function is inferred. 
        // Let's coerce simple objects to look somewhat correct or just return IDs.

        return {
            request: {
                ...newRequest,
                id: newRequest.id,
                userId: newRequest.user_id, // Map snake to camel
            },
            initialSliceId: initialSlice.id
        };
    });
}
