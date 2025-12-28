
import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStrategy } from '@/lib/payments/factory';
import { db } from '@/lib/db';
import { slices, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUserTimezone } from '@/lib/utils/date';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sliceId, paymentMethodId } = body;

        // 1. Fetch Slice and Request info
        const [slice] = await db.select().from(slices).where(eq(slices.id, sliceId));
        if (!slice) {
            return NextResponse.json({ error: 'Slice not found' }, { status: 404 });
        }

        // 2. Determine Context (Country) for Payment Factory
        // In a real app, strict geolocation or user profile 'country' is better.
        // Here we derive it loosely from timezone or explicit param.
        // Let's assume the frontend sends 'userCountry' or we guess from TZ.
        // For Verification: We will look for a header or body param, defaulting to 'US'.
        const userCountry = body.userCountry || 'US';

        // 3. Get Strategy
        const strategy = getPaymentStrategy({ countryCode: userCountry });

        // 4. Create Escrow
        // Ensure price is set
        const amount = slice.finalPrice || slice.marketPriceMax || 1000; // Default 10.00 if missing

        // Payer usually current user (need auth). Mocking for now:
        const payerId = 'current-user-id';

        const result = await strategy.createEscrow(
            slice.id,
            amount,
            'ARS', // TODO: Get from slice/request currency
            payerId,
            slice.assignedProviderId || 'provider-id'
        );

        // Save escrowPaymentId to Slice
        if (result.transactionId) {
            await db.update(slices)
                .set({ escrowPaymentId: result.transactionId })
                .where(eq(slices.id, sliceId));
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('Payment creation failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
