
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sliceEvidence, slices, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { evidenceUrl, description, type } = body; // Provider ID should come from auth, mocking for MVP

        if (!evidenceUrl) {
            return NextResponse.json({ error: 'Evidence URL is required' }, { status: 400 });
        }

        // 1. Get Slice Author (Provider)
        const [slice] = await db.select().from(slices).where(eq(slices.id, id));
        if (!slice) return NextResponse.json({ error: 'Slice not found' }, { status: 404 });

        // Mock Provider ID from slice (assigned) or fallback if not assigned yet (demo mode)
        // In real flow, slice already has assignedProviderId.
        const providerId = slice.assignedProviderId || '22222222-2222-2222-2222-222222222222'; // Carlitos if null

        // 2. Save Evidence
        await db.insert(sliceEvidence).values({
            sliceId: id,
            providerId: providerId,
            fileUrl: evidenceUrl,
            description,
            fileType: type || 'image'
        });

        // 3. Update Slice Status -> 'completed' (Work is done, pending client approval)
        // Or 'verification_pending' if we had that status. 'completed' fits 'work completed'.
        // Next status is 'approved_by_client'.
        await db.update(slices)
            .set({
                status: 'completed'
            })
            .where(eq(slices.id, id));

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Evidence submission error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
