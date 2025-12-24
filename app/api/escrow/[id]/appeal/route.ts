
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { escrowPayments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

import { createClient } from '@/lib/supabase/server';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { reason } = await request.json();

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const escrow = await db.query.escrowPayments.findFirst({
            where: eq(escrowPayments.id, id),
        });

        if (!escrow) {
            return NextResponse.json({ error: 'Escrow not found' }, { status: 404 });
        }

        if (escrow.clientId !== user.id && escrow.providerId !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await db.update(escrowPayments)
            .set({
                isAppealed: true,
                appealReason: reason,
                appealedAt: new Date(),
                status: 'disputed' // Re-open dispute
            })
            .where(eq(escrowPayments.id, id));

        return NextResponse.json({ success: true, message: 'Appeal submitted.' });
    } catch (error) {
        console.error('Appeal failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
