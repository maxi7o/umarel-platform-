import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sliceCards, wizardMessages, slices } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ sliceId: string }> }
) {
    try {
        const { sliceId } = await params;

        // 1. Get the primary slice to link to Request
        // We first try to find a card 
        let primaryCard = await db.query.sliceCards.findFirst({
            where: eq(sliceCards.sliceId, sliceId),
        });

        // 2. If no card exists, check the slice itself and create one
        let requestId: string;

        if (!primaryCard) {
            const originalSlice = await db.query.slices.findFirst({
                where: eq(slices.id, sliceId),
            });

            if (!originalSlice) {
                // MOCK FALLBACK for DEMO ID
                if (sliceId === '00000000-0000-0000-0000-000000000001') {
                    return NextResponse.json({
                        sliceCards: [{
                            id: 'mock-card-1',
                            sliceId: sliceId,
                            title: 'Renovar Baño Pequeño',
                            description: 'Necesito renovar un baño de 2x2m. Incluye cambio de cerámicos y inodoro.',
                            finalPrice: 150000,
                            currency: 'ARS',
                            skills: ['plomería', 'albañilería'],
                            isLocked: false,
                        }],
                        messages: [{
                            id: 'msg-1',
                            role: 'assistant',
                            content: 'Hola. Veo que quieres renovar el baño. ¿Podrías confirmarme si tambien necesitas cambiar la grifería de la ducha?',
                            createdAt: new Date().toISOString()
                        }]
                    });
                }

                return NextResponse.json({ error: 'Slice not found' }, { status: 404 });
            }
            requestId = originalSlice.requestId;

            // Create initial card
            [primaryCard] = await db.insert(sliceCards).values({
                sliceId: originalSlice.id,
                requestId: originalSlice.requestId,
                title: originalSlice.title,
                description: originalSlice.description,
                finalPrice: originalSlice.finalPrice,
                currency: 'ARS',
                skills: [],
            }).returning();

        } else {
            requestId = primaryCard.requestId;
        }

        // 3. Fetch ALL cards for this Request (Smart Slicing support)
        const allCards = await db.query.sliceCards.findMany({
            where: eq(sliceCards.requestId, requestId),
            orderBy: [desc(sliceCards.createdAt)]
        });

        // 4. Fetch messages (Thread attached to primary card)
        const messages = await db.query.wizardMessages.findMany({
            where: eq(wizardMessages.sliceCardId, primaryCard.id),
            orderBy: (msgs, { asc }) => [asc(msgs.createdAt)],
        });

        return NextResponse.json({
            sliceCards: allCards, // Return array
            messages,
        });

    } catch (error) {
        console.error('Wizard load error:', error);
        return NextResponse.json({ error: 'Failed to load wizard' }, { status: 500 });
    }
}
