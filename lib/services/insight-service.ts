import { db } from '@/lib/db';
import { comments, sliceCards, wizardMessages, changeProposals } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { processExpertComment } from '@/lib/ai/openai';

interface SubmitInsightParams {
    requestId: string;
    userId: string;
    content: string;
    locale: string;
    type?: 'text' | 'prompt' | 'ai_response';
}

export async function submitInsight(params: SubmitInsightParams) {
    const { requestId, userId, content, locale, type } = params;

    // 1. Create Comment
    const [newComment] = await db.insert(comments).values({
        requestId,
        userId,
        content,
        type: type || 'text',
        isAiGenerated: false
    }).returning();

    // 2. AI Feedback Loop
    try {
        const allCards = await db.query.sliceCards.findMany({
            where: eq(sliceCards.requestId, requestId)
        });

        const aiResult = await processExpertComment(content, allCards, requestId, locale);

        if (aiResult.actions.length > 0) {
            await db.insert(changeProposals).values({
                requestId,
                commentId: newComment.id,
                proposedActions: aiResult.actions,
                status: 'pending',
                aiImpact: {
                    qualityScore: aiResult.qualityScore,
                    impactType: aiResult.impactType,
                    estimatedSavings: aiResult.estimatedSavings
                }
            });

            // Notify Wizard
            const targetCard = allCards[0];
            if (targetCard) {
                const messageContent = locale === 'es'
                    ? `📢 **Un experto ha propuesto cambios.**\n\nRevisa la propuesta arriba para validarla.`
                    : `📢 **An expert has proposed changes.**\n\nReview the proposal above to validate it.`;

                await db.insert(wizardMessages).values({
                    sliceCardId: targetCard.id,
                    userId: 'ai',
                    content: messageContent,
                    role: 'assistant',
                    metadata: { source: 'change_proposal', originalCommentId: newComment.id },
                });
            }
        } else if (aiResult.wizardQuestion) {
            const targetCard = allCards[0];
            if (targetCard) {
                const params = locale === 'es'
                    ? { header: "Un experto comentó", question: aiResult.wizardQuestion }
                    : { header: "An expert commented", question: aiResult.wizardQuestion };

                await db.insert(wizardMessages).values({
                    sliceCardId: targetCard.id,
                    userId: 'ai',
                    content: `📢 **${params.header}:** "${content}"\n\n🤔 ${params.question}`,
                    role: 'assistant',
                    metadata: { source: 'expert_feedback', originalCommentId: newComment.id },
                });
            }
        }
    } catch (e) {
        console.error("AI Insight Error", e);
    }

    return newComment;
}
