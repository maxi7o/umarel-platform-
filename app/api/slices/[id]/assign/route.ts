import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slices, sliceBids } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: sliceId } = await params;
        const body = await request.json();
        const { providerId, bidId } = body;

        if (!providerId) {
            return NextResponse.json(
                { error: 'Missing providerId' },
                { status: 400 }
            );
        }

        // Check if slice exists
        const [slice] = await db
            .select()
            .from(slices)
            .where(eq(slices.id, sliceId));

        if (!slice) {
            return NextResponse.json(
                { error: 'Slice not found' },
                { status: 404 }
            );
        }

        // If bidId provided, accept that specific bid
        if (bidId) {
            // Update bid status to accepted
            await db
                .update(sliceBids)
                .set({ status: 'accepted' })
                .where(eq(sliceBids.id, bidId));

            // Reject all other bids for this slice
            await db
                .update(sliceBids)
                .set({ status: 'rejected' })
                .where(and(eq(sliceBids.sliceId, sliceId), eq(sliceBids.status, 'pending')));
        }

        // Assign slice to provider
        const [updatedSlice] = await db
            .update(slices)
            .set({
                assignedProviderId: providerId,
                status: 'accepted'
            })
            .where(eq(slices.id, sliceId))
            .returning();

        return NextResponse.json(updatedSlice);
    } catch (error) {
        console.error('Error assigning slice:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
