import { db } from '@/lib/db';
import { quotes, quoteItems } from '@/lib/db/schema';

interface SubmitQuoteParams {
    providerId: string;
    requestId: string;
    amount: number;
    message?: string;
    sliceIds: string[];
    estimatedDeliveryDate?: Date;
}

export async function submitQuote(params: SubmitQuoteParams) {
    const { providerId, requestId, amount, message, sliceIds, estimatedDeliveryDate } = params;

    return await db.transaction(async (tx) => {
        // 1. Create Quote
        const [newQuote] = await tx
            .insert(quotes)
            .values({
                providerId,
                requestId,
                amount,
                message,
                estimatedDeliveryDate,
                status: 'pending' // pending by default
            })
            .returning({ id: quotes.id });

        // 2. Link Slices (Quote Items)
        if (sliceIds.length > 0) {
            const itemsToInsert = sliceIds.map(sliceId => ({
                quoteId: newQuote.id,
                sliceId: sliceId
            }));

            await tx.insert(quoteItems).values(itemsToInsert);
        }

        return newQuote;
    });
}
