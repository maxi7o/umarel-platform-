import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const sliceId = params.id;

        // TODO: Get current user from session and verify they are the provider
        const providerId = 'current-user-id'; // Replace with actual auth

        // Validate slice exists and provider is assigned
        const slice = await db.query.slices.findFirst({
            where: eq(slices.id, sliceId),
        });

        if (!slice) {
            return NextResponse.json({ error: 'Slice not found' }, { status: 404 });
        }

        if (slice.assignedProviderId !== providerId) {
            return NextResponse.json(
                { error: 'You are not assigned to this slice' },
                { status: 403 }
            );
        }

        if (slice.status !== 'in_progress' && slice.status !== 'accepted') {
            return NextResponse.json(
                { error: 'Slice is not in progress' },
                { status: 400 }
            );
        }

        // Update slice status to completed
        await db
            .update(slices)
            .set({
                status: 'completed',
            })
            .where(eq(slices.id, sliceId));

        // TODO: Send notification to client to approve

        return NextResponse.json({
            success: true,
            message: 'Slice marked as completed. Waiting for client approval.',
        });
    } catch (error) {
        console.error('Error completing slice:', error);
        return NextResponse.json(
            { error: 'Failed to complete slice' },
            { status: 500 }
        );
    }
}
