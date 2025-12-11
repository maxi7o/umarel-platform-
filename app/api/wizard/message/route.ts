import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sliceCards, wizardMessages, slices, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { processWizardMessage, WizardAction } from '@/lib/ai/openai';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const { sliceId, content, locale = 'en' } = await request.json(); // Added locale extraction

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        let userId = user?.id;

        // DEV MODE: Allow bypass if no session/cookie
        if (!userId && process.env.NODE_ENV === 'development') {
            console.warn('⚠️ DEV MODE: Using mock user for Wizard API');
            userId = '00000000-0000-0000-0000-000000000001';
        }

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Get the primary slice first to know the requestId
        const originalSlice = await db.query.slices.findFirst({
            where: eq(slices.id, sliceId),
        });

        if (!originalSlice) return NextResponse.json({ error: 'Slice not found' }, { status: 404 });

        const requestId = originalSlice.requestId;

        // 2. Ensure initial slice card exists for this slice
        let primaryCard = await db.query.sliceCards.findFirst({
            where: eq(sliceCards.sliceId, sliceId),
        });

        if (!primaryCard) {
            [primaryCard] = await db.insert(sliceCards).values({
                sliceId: originalSlice.id,
                requestId: originalSlice.requestId,
                title: originalSlice.title,
                description: originalSlice.description,
                finalPrice: originalSlice.finalPrice,
                currency: 'ARS',
                skills: [],
            }).returning();
        }

        // 3. Get ALL slice cards for this Request (Context for AI)
        const allCards = await db.query.sliceCards.findMany({
            where: eq(sliceCards.requestId, requestId),
        });

        // 4. Get conversation history (Attached to the primary card for now, or we could have a request-level thread)
        // For simplicity, we keep tracking messages on the primary card ID to maintain the thread UI.
        const recentMessages = await db.query.wizardMessages.findMany({
            where: eq(wizardMessages.sliceCardId, primaryCard.id),
            orderBy: (messages, { desc }) => [desc(messages.createdAt)],
            limit: 10,
        });

        // 5. Save User Message (Skip if hidden trigger)
        let userMessage;
        if (content !== 'INITIAL_ANALYSIS_TRIGGER') {
            [userMessage] = await db.insert(wizardMessages).values({
                sliceCardId: primaryCard.id,
                userId,
                content,
                role: 'user',
            }).returning();
        }

        // 6. Call AI
        const { message: aiContent, actions } = await processWizardMessage(
            content,
            allCards, // Pass all cards as context
            recentMessages.reverse(), // Chronological order
            locale // Pass locale
        );

        // 7. Execute Actions
        let updatedCards = [...allCards];

        for (const action of actions) {
            if (action.type === 'UPDATE_CARD') {
                const [updated] = await db.update(sliceCards)
                    .set({
                        ...action.updates,
                        updatedAt: new Date(),
                        version: (primaryCard.version || 1) + 1, // Simple increment
                    })
                    .where(eq(sliceCards.id, action.cardId))
                    .returning();

                // Update local array
                updatedCards = updatedCards.map(c => c.id === action.cardId ? updated : c);

            } else if (action.type === 'CREATE_CARD') {
                // Create a new real Slice + SliceCard
                // NOTE: We need a new 'slice' entry too because 'slice_cards' link to 'slices'
                const [newSlice] = await db.insert(slices).values({
                    requestId: requestId,
                    creatorId: userId,
                    title: action.data.title,
                    description: action.data.description,
                    status: 'proposed',
                }).returning();

                const [newCard] = await db.insert(sliceCards).values({
                    sliceId: newSlice.id,
                    requestId: requestId,
                    title: action.data.title,
                    description: action.data.description,
                    skills: action.data.skills || [],
                    currency: 'ARS',
                }).returning();

                updatedCards.push(newCard);
            }
        }

        // 8. Save AI Response
        // 8. Save AI Response
        const AI_USER_ID = '00000000-0000-0000-0000-000000000000'; // Specific UUID for AI

        // Ensure AI user exists in DB to satisfy FK
        try {
            // We use a raw SQL query or check existence to avoid throwing if possible, 
            // but insert on conflict do nothing is easiest if supported or we just catch.
            // Since 'users' table might be enforced by Supabase auth in real prod, 
            // this might be tricky if we don't have a real usage. 
            // BUT, for now, let's try to insert it.
            // NOTE: 'users' table usually mirrors auth.users. 
            // If we can't insert into users easily, we might need a workaround.
            // However, let's assume we can for this "app level" users table.
        } catch (e) {
            // ignore
        }

        // Actually, let's just use the ID. If FK fails, we need to fix schema or insert user.
        // Let's safe-insert the AI user first.
        await db.insert(users).values({
            id: AI_USER_ID,
            email: 'ai@umarel.org',
            fullName: 'Umarel AI',
            role: 'admin',
        }).onConflictDoNothing();

        const [aiResponse] = await db.insert(wizardMessages).values({
            sliceCardId: primaryCard.id,
            userId: AI_USER_ID,
            content: aiContent,
            role: 'assistant',
            metadata: { model: 'gpt-4-turbo-preview', actionsExecuted: actions.length },
        }).returning();

        return NextResponse.json({
            message: aiResponse,
            sliceCards: updatedCards, // Return array!
            userMessage,
        });

    } catch (error) {
        console.error('Wizard message error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
