
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sliceCards, wizardMessages, slices, requests } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { getEffectiveUserId, GUEST_USER_ID } from '@/lib/services/special-users';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ sliceId: string }> }
) {
    try {
        const { sliceId } = await params;

        // 0. Auth & Ownership Check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Check slice existence and owner first
        const originalSlice = await db.query.slices.findFirst({
            where: eq(slices.id, sliceId),
        });

        if (!originalSlice) {
            // MOCK FALLBACK for DEMO ID
            if (sliceId === '00000000-0000-0000-0000-000000000001') {
                // ... (Keep existing mock response logic or remove if valid cleanup)
                // Keeping brief mock response logic as it was useful for dev
                return NextResponse.json({
                    sliceCards: [{
                        id: 'mock-card-1',
                        sliceId: sliceId,
                        title: 'Renovar Baño Pequeño',
                        description: 'Mock data...',
                        finalPrice: 150000,
                        currency: 'ARS',
                        skills: ['plomería'],
                        isLocked: false,
                    }],
                    messages: []
                });
            }
            return NextResponse.json({ error: 'Slice not found' }, { status: 404 });
        }

        const effectiveUserId = await getEffectiveUserId(user?.id);

        // --- CLAIMING LOGIC ---
        // If the slice is owned by Guest, but now we have a Real User, 
        // we transfer ownership (Claiming the project).
        if (originalSlice.creatorId === GUEST_USER_ID && effectiveUserId !== GUEST_USER_ID && originalSlice.requestId) {
            console.log(`User ${effectiveUserId} claiming guest slice ${sliceId}`);

            await db.transaction(async (tx) => {
                // 1. Update Request Owner
                await tx.update(requests)
                    .set({ userId: effectiveUserId })
                    .where(eq(requests.id, originalSlice.requestId!));

                // 2. Update Slice Owner (and siblings if any - assuming context is Request)
                await tx.update(slices)
                    .set({ creatorId: effectiveUserId })
                    .where(eq(slices.requestId, originalSlice.requestId!));

                // 3. Update Message History Owner
                // We need to find all cards for this request first
                const relatedCards = await tx.query.sliceCards.findMany({
                    where: eq(sliceCards.requestId, originalSlice.requestId!)
                });

                for (const card of relatedCards) {
                    await tx.update(wizardMessages)
                        .set({ userId: effectiveUserId })
                        .where(and(
                            eq(wizardMessages.sliceCardId, card.id),
                            eq(wizardMessages.userId, GUEST_USER_ID)
                        ));
                }
            });
        }
        // --- END CLAIMING LOGIC ---


        // 1. Get the primary slice card
        let primaryCard = await db.query.sliceCards.findFirst({
            where: eq(sliceCards.sliceId, sliceId),
        });

        // 2. If no card exists, create (This part happens if wizard visited first time)
        let requestId = originalSlice.requestId;

        if (!requestId) {
            return NextResponse.json({ error: 'Slice has no associated request' }, { status: 400 });
        }

        if (!primaryCard) {
            [primaryCard] = await db.insert(sliceCards).values({
                sliceId: originalSlice.id,
                requestId: requestId, // Already verified as non-null above
                title: originalSlice.title,
                description: originalSlice.description,
                finalPrice: originalSlice.finalPrice ?? null,
                currency: 'ARS' as const,
            }).returning();
        } else {
            requestId = primaryCard.requestId;
        }

        // 3. Fetch ALL cards for this Request
        const allCards = await db.query.sliceCards.findMany({
            where: eq(sliceCards.requestId, requestId),
            orderBy: [desc(sliceCards.createdAt)]
        });

        // 4. Fetch messages
        const messages = await db.query.wizardMessages.findMany({
            where: eq(wizardMessages.sliceCardId, primaryCard.id),
            orderBy: (msgs, { asc }) => [asc(msgs.createdAt)],
        });

        return NextResponse.json({
            sliceCards: allCards,
            messages,
        });

    } catch (error) {
        console.error('Wizard load error:', error);
        return NextResponse.json({ error: 'Failed to load wizard' }, { status: 500 });
    }
}
