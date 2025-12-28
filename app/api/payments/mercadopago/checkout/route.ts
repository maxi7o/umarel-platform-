import { NextRequest, NextResponse } from 'next/server';
import { preference } from '@/lib/mercadopago';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { escrowPayments, slices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const escrowId = searchParams.get('escrowId');

        if (!escrowId) {
            return NextResponse.json({ error: 'Escrow ID required' }, { status: 400 });
        }

        // Get escrow payment details
        const escrow = await db.query.escrowPayments.findFirst({
            where: eq(escrowPayments.id, escrowId),
        });

        if (!escrow) {
            return NextResponse.json({ error: 'Escrow payment not found' }, { status: 404 });
        }

        if (escrow.status !== 'pending_escrow') {
            return NextResponse.json(
                { error: 'Payment already processed' },
                { status: 400 }
            );
        }

        if (!escrow.sliceId) {
            return NextResponse.json({ error: 'Slice ID missing in escrow' }, { status: 400 });
        }

        // Get slice details for description
        const slice = await db.query.slices.findFirst({
            where: eq(slices.id, escrow.sliceId),
        });

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) {
            // Fallback or error? For now error if not logged in
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Create Mercado Pago Preference
        const preferenceData = {
            items: [
                {
                    id: escrow.sliceId,
                    title: slice?.title || 'Umarel Slice Payment',
                    description: `Payment for slice: ${slice?.title || 'Service'}`,
                    quantity: 1,
                    unit_price: escrow.totalAmount / 100, // Convert cents to ARS
                    currency_id: 'ARS',
                },
            ],
            payer: {
                email: user.email,
            },
            back_urls: {
                success: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?escrowId=${escrowId}`,
                failure: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure?escrowId=${escrowId}`,
                pending: `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending?escrowId=${escrowId}`,
            },
            auto_return: 'approved' as const,
            notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
            external_reference: escrowId,
            metadata: {
                escrow_id: escrowId,
                slice_id: escrow.sliceId,
                client_id: escrow.clientId,
                provider_id: escrow.providerId,
            },
            statement_descriptor: 'UMAREL',
        };

        const response = await preference.create({ body: preferenceData });

        // Update escrow with Mercado Pago preference ID
        await db
            .update(escrowPayments)
            .set({
                mercadoPagoPreapprovalId: response.id,
                paymentMethod: 'mercado_pago',
            })
            .where(eq(escrowPayments.id, escrowId));

        if (!response.init_point) {
            throw new Error('Failed to create Mercado Pago preference init_point');
        }

        // Return init point for redirect
        return NextResponse.redirect(response.init_point);
    } catch (error) {
        console.error('Mercado Pago checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create Mercado Pago preference' },
            { status: 500 }
        );
    }
}
