
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { escrowPayments, slices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const sliceId = searchParams.get('sliceId');
    const txId = searchParams.get('txId');

    if (!sliceId) {
        return NextResponse.json({ error: 'Missing sliceId' }, { status: 400 });
    }

    try {
        // Find the pending escrow payment for this slice
        const [escrow] = await db.select().from(escrowPayments)
            .where(eq(escrowPayments.sliceId, sliceId));

        if (escrow) {
            // Update to in_escrow (Simulate successful payment)
            await db.update(escrowPayments)
                .set({
                    status: 'in_escrow',
                    paymentMethod: 'mercado_pago', // Or 'mock' if we want to be explicit, but schemas usually strict
                    mercadoPagoPaymentId: txId,
                    createdAt: new Date() // Reset timestamp to now
                })
                .where(eq(escrowPayments.id, escrow.id));
        }

        // Redirect to UI Success Page
        return NextResponse.redirect(new URL('/requests/success', req.url));

    } catch (error) {
        console.error('[MockSuccess] Error:', error);
        return NextResponse.json({ error: 'Internal Mock Error' }, { status: 500 });
    }
}
