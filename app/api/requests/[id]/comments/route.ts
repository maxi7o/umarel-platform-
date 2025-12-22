import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comments, sliceCards, wizardMessages, slices, users, contributionEvaluations, changeProposals } from '@/lib/db/schema'; // Added imports
import { eq, desc, sql } from 'drizzle-orm';
import { processExpertComment } from '@/lib/ai/openai'; // Added import
import { calculateAuraLevel } from '@/lib/aura/calculations';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    let aiDebug: any = null; // Capture AI result for debugging response
    let allCards: any[] = [];

    try {
        const { id } = await params;
        const body = await request.json();
        const { content, type, userId, locale = 'en' } = body; // Added locale extraction

        if (!content || !userId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const [newComment] = await db.insert(comments).values({
            requestId: id,
            userId,
            content,
            type: type || 'text',
            isAiGenerated: false,
        }).returning();

        // --- UMAREL FEEDBACK LOOP ---
        try {
            // 1. Get Context (All Slices)
            allCards = await db.query.sliceCards.findMany({
                where: eq(sliceCards.requestId, id),
            });

            // 2. Process Comment (Pass locale)
            const aiResult = await processExpertComment(content, allCards, id, locale);
            aiDebug = aiResult; // Capture result

            // 3. Execute Actions
            if (aiResult.actions.length > 0) {
                await db.insert(changeProposals).values({
                    requestId: id,
                    commentId: newComment.id,
                    proposedActions: aiResult.actions,
                    status: 'pending',
                    aiImpact: {
                        qualityScore: aiResult.qualityScore,
                        impactType: aiResult.impactType,
                        estimatedSavings: aiResult.estimatedSavings
                    }
                });

                // Notify via Wizard (Localized)
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
            }

            // 4. Post Wizard Question (Localized Header)
            if (aiResult.wizardQuestion) {
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

        } catch (aiError) {
            console.error('Failed to process expert comment:', aiError);
            aiDebug = { error: String(aiError) };
        }

        // --- AURA ALGORITHM APPLICATION ---
        // DEFERRED: Aura is now awarded when the Owner accepts the proposal in /api/proposals/[id]/respond


        return NextResponse.json(newComment);

    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // In a real app, we would join with users to get avatar/name
        // For now, we'll just get the comments
        const requestComments = await db
            .select()
            .from(comments)
            .where(eq(comments.requestId, id))
            .orderBy(comments.createdAt);

        return NextResponse.json(requestComments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
