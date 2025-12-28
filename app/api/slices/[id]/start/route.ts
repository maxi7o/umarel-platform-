
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slices, sliceEvidence, users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { evidenceUrl, description, location } = body;

        // 1. Auth & Validation
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const slice = await db.query.slices.findFirst({
            where: eq(slices.id, id),
        });

        if (!slice) {
            return NextResponse.json({ error: 'Slice not found' }, { status: 404 });
        }

        if (slice.assignedProviderId !== user.id) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        if (slice.status !== 'accepted') {
            return NextResponse.json({ error: 'Slice must be in accepted state to start' }, { status: 400 });
        }

        // 2. Evidence Requirement
        if (!evidenceUrl && !location) {
            return NextResponse.json(
                { error: 'Proof of Arrival required (Photo or Location)' },
                { status: 400 }
            );
        }

        // 3. Transaction: Update Status + Add Evidence + Award Aura
        await db.transaction(async (tx) => {
            // A. Update Status
            await tx
                .update(slices)
                .set({ status: 'in_progress' })
                .where(eq(slices.id, id));

            // B. Store Evidence
            await tx.insert(sliceEvidence).values({
                sliceId: id,
                providerId: user.id,
                fileUrl: evidenceUrl || 'location_check_in',
                fileType: evidenceUrl ? 'image' : 'location',
                description: description || 'Provider Check-In',
                metadata: location ? { location } : {},
                isVerified: true // Self-verified for now
            });

            // C. Award Aura (+50 for showing up)
            await tx
                .update(users)
                .set({
                    auraPoints: sql`${users.auraPoints} + 50`
                })
                .where(eq(users.id, user.id));
        });

        return NextResponse.json({
            success: true,
            message: 'Job Started! Aura +50 awarded.',
            status: 'in_progress'
        });

    } catch (error) {
        console.error('Error starting slice:', error);
        return NextResponse.json({ error: 'Failed to start job' }, { status: 500 });
    }
}
