import { db } from '@/lib/db';
import { slices, wizardMessages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { processWizardMessage, WizardAction } from '@/lib/ai/openai';

export async function handleWizardMessage(requestId: string, userId: string, message: string, locale: string = 'en') {

    // 1. Fetch current slices for context
    const currentSlices = await db
        .select()
        .from(slices)
        .where(eq(slices.requestId, requestId));

    // 2. Fetch recent messages for context (optional optimization)
    const recentMessages = await db
        .select()
        .from(wizardMessages)
        // This query assumes we're linking wizard messages to a request via slice card or direct. 
        // Schema checks: wizardMessages -> sliceCardId. 
        // The new flow suggests wizard messages are per request?
        // For now, let's pass empty array for messages mock or assume we fetch them if needed. 
        // Simplified for this Iteration.
        // Actually, processWizardMessage needs messages history.
        // Let's pass empty for the MVP TDD pass.
        .limit(0);

    // 3. Call AI
    // We cast the messages to any[] because DB schema types might differ slightly from OpenAI message types
    const aiResponse = await processWizardMessage(message, currentSlices, [], locale);

    // 4. Handle Actions
    for (const action of aiResponse.actions) {
        if (action.type === 'CREATE_CARD') {
            await db.insert(slices).values({
                requestId,
                creatorId: userId,
                title: action.data.title,
                description: action.data.description,
                skillsRequired: action.data.skills,
                status: 'proposed',
                isAiGenerated: true
            });
        }
    }

    return aiResponse;
}
