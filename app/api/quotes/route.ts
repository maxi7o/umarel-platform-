import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quotes, quoteItems } from '@/lib/db/schema';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { requestId, providerId, amount, message, estimatedDeliveryDate, sliceIds } = body;

        if (!requestId || !providerId || !amount || !sliceIds || !Array.isArray(sliceIds)) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 1. Create Quote
        const [newQuote] = await db.insert(quotes).values({
            requestId,
            providerId,
            amount,
            message,
            estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : null,
            status: 'pending',
        }).returning();

        // 2. Create Quote Items (Link slices)
        if (sliceIds.length > 0) {
            await db.insert(quoteItems).values(
                sliceIds.map((sliceId: string) => ({
                    quoteId: newQuote.id,
                    sliceId,
                }))
            );
        }

        return NextResponse.json(newQuote);
    } catch (error) {
        console.error('Error creating quote:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
