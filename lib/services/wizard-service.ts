
import { db } from '@/lib/db';
import { slices, sliceCards, wizardMessages, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { processWizardMessage } from '@/lib/ai/openai';
import { awardAura } from '@/lib/aura/actions';
import { createNotification } from '@/lib/notifications';
import { GUEST_USER_ID } from '@/lib/auth-constants';

export interface WizardServiceResponse {
    userMessage: typeof wizardMessages.$inferSelect | undefined;
    aiMessage: typeof wizardMessages.$inferSelect;
    sliceCards: typeof sliceCards.$inferSelect[];
}

export async function handleWizardMessage(
    sliceId: string,
    userId: string,
    content: string,
    locale: string = 'en',
    sessionId?: string
): Promise<WizardServiceResponse> {

    // 1. Get the primary slice first to know the requestId
    const originalSlice = await db.query.slices.findFirst({
        where: eq(slices.id, sliceId),
    });

    if (!originalSlice) throw new Error('Slice not found');

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

    // 4. Get conversation history
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
            metadata: sessionId ? { sessionId } : undefined,
        }).returning();
    }

    // 6. Call AI
    const { message: aiContent, actions, qualityScore = 0, refusalReason } = await processWizardMessage(
        content,
        allCards,
        recentMessages.reverse(), // Chronological order
        locale
    );

    // 6b. Aura Reward Logic (Quality Gate)
    if (qualityScore >= 7 && userId) {
        if (actions.some(a => a.type === 'CREATE_CARD')) {
            await awardAura(userId, 'VALID_SLICE_CREATION');
        } else {
            await awardAura(userId, 'HELPFUL_CLARIFICATION');
        }
    }

    // 6c. Notification Logic (Consultant Advice)
    if (
        userId !== originalSlice.creatorId &&
        originalSlice.creatorId !== GUEST_USER_ID &&
        content !== 'INITIAL_ANALYSIS_TRIGGER'
    ) {
        await createNotification(
            originalSlice.creatorId,
            locale === 'es' ? 'Nuevo consejo recibido' : 'New advice received',
            locale === 'es'
                ? `Un consultor ha dejado un mensaje en "${originalSlice.title}"`
                : `A consultant left a message on "${originalSlice.title}"`,
            `/wizard/${sliceId}`
        );
    }

    // 7. Execute Actions
    let updatedCards = [...allCards];

    for (const action of actions) {
        if (action.type === 'UPDATE_CARD') {
            const [updated] = await db.update(sliceCards)
                .set({
                    ...action.updates,
                    updatedAt: new Date(),
                    version: (primaryCard.version || 1) + 1,
                })
                .where(eq(sliceCards.id, action.cardId))
                .returning();

            updatedCards = updatedCards.map(c => c.id === action.cardId ? updated : c);

        } else if (action.type === 'CREATE_CARD') {
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
    const { AI_USER_ID, ensureSpecialUsers } = await import('@/lib/services/special-users');
    await ensureSpecialUsers(); // Ensure AI user exists

    const [aiResponse] = await db.insert(wizardMessages).values({
        sliceCardId: primaryCard.id,
        userId: AI_USER_ID,
        content: aiContent,
        role: 'assistant',
        metadata: {
            model: 'gpt-4-turbo-preview',
            actionsExecuted: actions.length,
            userQualityScore: qualityScore,
            refusalReason,
            auraAwarded: qualityScore >= 7
        },
    }).returning();

    return {
        userMessage,
        aiMessage: aiResponse,
        sliceCards: updatedCards
    };
}
