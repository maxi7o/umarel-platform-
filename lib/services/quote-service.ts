import { db } from '@/lib/db';
import { quotes, quoteItems } from '@/lib/db/schema';

interface SubmitQuoteParams {
    providerId: string;
    requestId: string;
    amount: number;
    currency?: string; // Default 'ARS'
    message?: string;
    sliceIds: string[];
    estimatedDeliveryDate?: Date;
}

export function calculateQuoteSplits(totalAmount: number) {
    const platformFee = Math.round(totalAmount * 0.12);
    const communityPool = Math.round(totalAmount * 0.03);
    const providerNet = totalAmount - platformFee - communityPool;
    return {
        totalAmount,
        platformFee,
        communityPool,
        providerNet
    };
}

export function calculateTotalFromNet(netAmount: number) {
    // If provider wants 85, total is 100.
    // 85 / 0.85 = 100
    const total = Math.round(netAmount / 0.85);
    return calculateQuoteSplits(total);
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
                currency: (params.currency || 'ARS') as 'ARS' | 'USD' | 'BRL' | 'MXN' | 'COP',
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
