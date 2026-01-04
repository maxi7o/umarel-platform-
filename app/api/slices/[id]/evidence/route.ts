
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
        const { evidenceItems } = body; // Array of { url, description, metadata, criterionId }

        if (!evidenceItems || !Array.isArray(evidenceItems) || evidenceItems.length === 0) {
            return NextResponse.json({ error: 'Evidence items are required' }, { status: 400 });
        }

        // 1. Get Slice
        const [slice] = await db.select().from(slices).where(eq(slices.id, id));
        if (!slice) return NextResponse.json({ error: 'Slice not found' }, { status: 404 });

        const providerId = slice.assignedProviderId || '22222222-2222-2222-2222-222222222222'; // Fallback

        // 2. Insert Evidence Records
        const evidencePromises = evidenceItems.map((item: any) => {
            return db.insert(sliceEvidence).values({
                sliceId: id,
                providerId: providerId,
                fileUrl: item.url,
                description: item.description || 'Evidence submission',
                fileType: 'image',
                metadata: item.metadata, // { lat, lng... }
                aiValidationStatus: 'approved', // Mock Auto-Approve (AI Judge)
                aiValidationJson: { confidence: 0.98, notes: 'Geotag matches slice location.' },
                isVerified: true,
                capturedAt: new Date(),
            });
        });

        await Promise.all(evidencePromises);

        // 3. Update Slice Status -> 'completed' (Pending Acceptance)
        await db.update(slices)
            .set({
                status: 'completed',
                // We don't set paidAt or approvedByClientAt yet. That's for the 'approve' endpoint.
            })
            .where(eq(slices.id, id));

        return NextResponse.json({ success: true, aiStatus: 'approved' });

    } catch (error) {
        console.error('Evidence submission error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
