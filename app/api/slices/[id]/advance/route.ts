import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const sliceId = id;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const providerId = user?.id || request.headers.get('x-user-id');

        if (!providerId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { amount, evidence } = body;

        // Validate slice
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

        if (slice.status !== 'in_progress') {
            return NextResponse.json(
                { error: 'Slice must be in progress to request advance' },
                { status: 400 }
            );
        }

        // Validate Evidence
        if (!evidence || (typeof evidence !== 'object')) {
            return NextResponse.json(
                { error: 'Evidence is required (photos/receipts)' },
                { status: 400 }
            );
        }

        // Update Slice
        await db.update(slices)
            .set({
                materialAdvanceStatus: 'requested',
                materialAdvanceAmount: amount, // e.g. 40%
                materialAdvanceEvidence: evidence,
            })
            .where(eq(slices.id, sliceId));

        // TODO: Notify Client

        return NextResponse.json({
            success: true,
            message: 'Material advance requested successfully',
            status: 'requested',
            amount: amount
        });

    } catch (error) {
        console.error('Error requesting advance:', error);
        return NextResponse.json(
            { error: 'Failed to request advance' },
            { status: 500 }
        );
    }
}
