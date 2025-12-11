import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json(
                { error: 'Missing status field' },
                { status: 400 }
            );
        }

        // Validate status (optional but good practice)
        const validStatuses = ['proposed', 'accepted', 'completed'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const [updatedSlice] = await db
            .update(slices)
            .set({ status })
            .where(eq(slices.id, id))
            .returning();

        if (!updatedSlice) {
            return NextResponse.json(
                { error: 'Slice not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedSlice);
    } catch (error) {
        console.error('Error updating slice:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
