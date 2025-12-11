import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comments, sliceCards, wizardMessages, slices, users, contributionEvaluations } from '@/lib/db/schema'; // Added imports
import { eq, desc, sql } from 'drizzle-orm';
import { processExpertComment } from '@/lib/ai/openai'; // Added import

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    let aiDebug = null; // Capture AI result for debugging response

    try {
        const { id } = await params;
        const body = await request.json();
        const { content, type, userId } = body;

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
        // Fire and forget (or await if we want to return AI actions to UI, but usually async background)
        // For this demo, we await to ensure it happens before we return.

        try {
            // 1. Get Context (All Slices)
            const allCards = await db.query.sliceCards.findMany({
                where: eq(sliceCards.requestId, id),
            });

            // 2. Process Comment
            const aiResult = await processExpertComment(content, allCards, id);
            aiDebug = aiResult; // Capture result

            // 3. Execute Actions
            if (aiResult.actions.length > 0) {
                for (const action of aiResult.actions) {
                    if (action.type === 'UPDATE_CARD') {
                        await db.update(sliceCards)
                            .set({
                                ...action.updates,
                                updatedAt: new Date(),
                                version: sql`version + 1`, // increment version
                            })
                            .where(eq(sliceCards.id, action.cardId));
                    } else if (action.type === 'CREATE_CARD') {
                        // Create slice + card
                        const [newSlice] = await db.insert(slices).values({
                            requestId: id,
                            creatorId: userId, // Attribute creation to the Expert? Or System? Let's use Expert ID.
                            title: action.data.title,
                            description: action.data.description,
                            status: 'proposed',
                        }).returning();

                        await db.insert(sliceCards).values({
                            sliceId: newSlice.id,
                            requestId: id,
                            title: action.data.title,
                            description: action.data.description,
                            skills: action.data.skills || [],
                            currency: 'ARS',
                        });
                    }
                }
            }

            // 4. Post Wizard Question (if any)
            if (aiResult.wizardQuestion) {
                // Attach to the FIRST card found (or active one if we knew it)
                const targetCard = allCards[0];

                if (targetCard) {
                    await db.insert(wizardMessages).values({
                        sliceCardId: targetCard.id,
                        userId: 'ai',
                        content: `📢 **Un experto comentó:** "${content}"\n\n🤔 ${aiResult.wizardQuestion}`,
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
        if (aiDebug?.qualityScore && userId) {
            const score = aiDebug.qualityScore as number;
            const impactType = aiDebug.impactType as string;
            const savings = (aiDebug.estimatedSavings as number) || 0;

            let auraPoints = 0;

            // 1. Base Score calculation
            if (impactType === 'risk_mitigation') {
                // Exponential reward for risk: Score^2 * 5
                auraPoints = Math.pow(score, 2) * 5;
            } else if (impactType === 'savings') {
                // Savings reward: 1 point per 1000 ARS saved + Base Clarity score
                auraPoints = Math.floor(savings / 1000) + (score * 10);
            } else {
                // Default/Clarity: Linear 10x
                auraPoints = score * 10;
            }

            // Spam filter override
            if (score < 2) auraPoints = 0;

            if (auraPoints > 0) {
                // Update User Aura
                await db.update(users)
                    .set({
                        auraPoints: sql`aura_points + ${auraPoints}`,
                        totalSavingsGenerated: sql`total_savings_generated + ${savings}`
                    })
                    .where(eq(users.id, userId));

                // Log Contribution (Best Effort linking to a Slice)
                const targetSlice = allCards[0]?.sliceId; // Link to first slice context if available
                if (targetSlice) {
                    await db.insert(contributionEvaluations).values({
                        sliceId: targetSlice,
                        evaluatorModel: 'gpt-4-turbo-preview',
                        contributions: [{
                            userId,
                            userName: 'Expert', // We'd fetch real name in prod
                            score,
                            reasoning: `Impact: ${impactType}. Savings: ${savings}`,
                            contributionType: impactType === 'risk_mitigation' ? 'risk_mitigation' :
                                impactType === 'savings' ? 'savings' : 'quality'
                        }],
                        totalScore: auraPoints
                    });
                }
            }
        }

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
