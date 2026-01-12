
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { slices, requests } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: sliceId } = await params;
        const body = await req.json();
        const { amount, evidence } = body;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Fetch Slice
        const [slice] = await db
            .select()
            .from(slices)
            .where(eq(slices.id, sliceId));

        if (!slice) return NextResponse.json({ error: 'Slice not found' }, { status: 404 });

        // 2. Verify Provider match
        if (slice.assignedProviderId !== user.id) {
            return NextResponse.json({ error: 'Only the assigned provider can request acopio' }, { status: 403 });
        }

        // 3. Validation
        // Max 50% of final price
        const maxAdvance = (slice.finalPrice || 0) * 0.50;
        if (amount > maxAdvance) {
            return NextResponse.json({ error: `Amount exceeds 50% limit of ${maxAdvance}` }, { status: 400 });
        }

        // 4. Update DB
        await db.update(slices)
            .set({
                materialAdvanceStatus: 'requested',
                materialAdvanceAmount: amount,
                materialAdvanceEvidence: evidence // { photos: [], receipts: [] }
            })
            .where(eq(slices.id, sliceId));

        return NextResponse.json({ success: true, status: 'requested' });

    } catch (error) {
        console.error('Advance Request Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
