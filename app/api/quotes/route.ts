import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quotes, quoteItems } from '@/lib/db/schema';

import { createClient } from '@/lib/supabase/server';
import { ensureUserVerified } from '@/lib/kyc-utils';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Enforce KYC
        try {
            await ensureUserVerified(user.id);
        } catch (error: any) {
            return NextResponse.json({ error: error.message, code: 'KYC_REQUIRED' }, { status: 403 });
        }

        const body = await request.json();
        const { requestId, amount, message, estimatedDeliveryDate, sliceIds } = body;
        const providerId = user.id;

        if (!requestId || !amount || !sliceIds || !Array.isArray(sliceIds)) {
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
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    const allQuotes = await db.select().from(quotes);
    return NextResponse.json(allQuotes);
}
