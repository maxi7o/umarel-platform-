import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comments, sliceCards, wizardMessages, slices } from '@/lib/db/schema'; // Added imports
import { eq, desc, sql } from 'drizzle-orm';
import { processExpertComment } from '@/lib/ai/openai'; // Added import

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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
            // Don't fail the request, just log
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
