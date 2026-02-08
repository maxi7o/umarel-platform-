
import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStrategy } from '@/lib/payments/factory';
import { db } from '@/lib/db';
import { slices, requests, escrowPayments, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sliceId, paymentMethodId } = body;

        // 1. Fetch Slice and Request info
        const [slice] = await db
            .select({
                id: slices.id,
                requestId: slices.requestId,
                finalPrice: slices.finalPrice,
                marketPriceMax: slices.marketPriceMax,
                assignedProviderId: slices.assignedProviderId,
                title: slices.title
            })
            .from(slices)
            .where(eq(slices.id, sliceId));

        if (!slice) {
            return NextResponse.json({ error: 'Slice not found' }, { status: 404 });
        }

        if (!slice.requestId) {
            return NextResponse.json({ error: 'Slice has no associated request' }, { status: 400 });
        }

        const [request] = await db
            .select({ userId: requests.userId })
            .from(requests)
            .where(eq(requests.id, slice.requestId));

        if (!request) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        // Payer is the Client (Request owner)
        const payerId = request.userId;
        const payeeId = slice.assignedProviderId;

        if (!payeeId) {
            return NextResponse.json({ error: 'No provider assigned to this slice' }, { status: 400 });
        }

        // 2. Determine Amounts
        const price = slice.finalPrice || slice.marketPriceMax || 1000; // Default 10.00 if missing

        // 15% Platform Fee Logic
        // We assume 'price' is the Total Amount the Client pays.
        // The Platform Fee is deducted from this amount when paying the Provider.
        const totalAmount = price;
        const platformFee = Math.round(price * 0.15); // 15%
        const communityRewardPool = Math.round(price * 0.03); // 3%
        const sliceAmount = price; // The base amount for records

        // 3. Create Escrow Record (Pending)
        // We create this FIRST so we have an ID to pass to the Payment Provider
        const [escrowPayment] = await db.insert(escrowPayments).values({
            sliceId: slice.id,
            clientId: payerId,
            providerId: payeeId,
            totalAmount,
            sliceAmount,
            platformFee,
            communityRewardPool,
            paymentMethod: 'mercado_pago', // Defaulting for now since we use MP strategy
            status: 'pending_escrow',
        }).returning();

        // 4. Get Strategy & Create Payment Intent
        const userCountry = body.userCountry || 'US';
        const strategy = getPaymentStrategy({ countryCode: userCountry });

        const result = await strategy.createEscrow(
            slice.id,
            totalAmount,
            'ARS',
            payerId,
            payeeId,
            escrowPayment.id // check this matches updated signature
        );

        // 5. Update Escrow Record with External ID
        // (If provided immediately, otherwise webhook handles it)
        if (result.transactionId) {
            // Store the Preference ID (or PaymentIntent ID)
            // We store it in `mercadoPagoPreapprovalId` or similar? 
            // The schema has `mercadoPagoPaymentId` (usually for the final payment) 
            // and `stripePaymentIntentId`. 
            // For MP, `transactionId` returned here is the Preference ID (init_point ID), not the Payment ID.
            // We don't have a dedicated column for Preference ID in schema shown earlier?
            // Checking schema... `mercadoPagoPreapprovalId`? No.
            // Let's store it in `mercadoPagoPaymentId` for now, OR rely on `external_reference` (escrowPayment.id) for link.
            // Webhook uses `external_reference` -> `escrowId` mapping. 
            // So we don't strictily NEED to store the Preference ID, but it helps for debugging.
            // Let's update `slices.escrowPaymentId` to point to our internal UUID for easy lookup.

            await db.update(slices)
                .set({ escrowPaymentId: escrowPayment.id }) // Point to internal UUID
                .where(eq(slices.id, sliceId));
        }

        return NextResponse.json({
            ...result,
            escrowId: escrowPayment.id
        });

    } catch (error) {
        console.error('Payment creation failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
