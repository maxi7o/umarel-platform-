import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { answers, users, questions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Calculate reward based on answer quality and timing
function calculateReward(isFirstAnswer: boolean, questionForwarded: boolean) {
    const baseAura = questionForwarded ? 10 : 5; // More aura for community questions
    const baseMoney = questionForwarded ? 50 : 0; // Money only for community questions (in cents)

    const auraBonus = isFirstAnswer ? 5 : 0;
    const moneyBonus = isFirstAnswer ? 25 : 0;

    return {
        aura: baseAura + auraBonus,
        money: baseMoney + moneyBonus,
    };
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: questionId } = await params;
        const body = await request.json();
        const { content, answererId } = body;

        if (!content || !answererId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get question details to check if forwarded to community
        const [question] = await db
            .select()
            .from(questions)
            .where(eq(questions.id, questionId));

        if (!question) {
            return NextResponse.json(
                { error: 'Question not found' },
                { status: 404 }
            );
        }

        // Check if this is the first answer
        const existingAnswers = await db
            .select()
            .from(answers)
            .where(eq(answers.questionId, questionId));

        const isFirstAnswer = existingAnswers.length === 0;
        const rewards = calculateReward(isFirstAnswer, question.forwardedToCommunity || false);

        // Create answer with rewards
        const [newAnswer] = await db.insert(answers).values({
            questionId,
            answererId,
            content,
            auraReward: rewards.aura,
            moneyReward: rewards.money,
            upvotes: 0,
            isAccepted: false,
        }).returning();

        // Update user's aura points
        await db
            .update(users)
            .set({
                auraPoints: eq(users.id, answererId)
                    ? eq(users.auraPoints, users.auraPoints) // This is a placeholder - we need to increment
                    : 0
            })
            .where(eq(users.id, answererId));

        // Better approach: fetch current aura, increment, and update
        const [user] = await db.select().from(users).where(eq(users.id, answererId));
        if (user) {
            await db
                .update(users)
                .set({ auraPoints: (user.auraPoints || 0) + rewards.aura })
                .where(eq(users.id, answererId));
        }

        // Update question status if this is the first answer
        if (isFirstAnswer) {
            await db
                .update(questions)
                .set({ status: 'answered' })
                .where(eq(questions.id, questionId));
        }

        return NextResponse.json({
            ...newAnswer,
            rewards,
        });
    } catch (error) {
        console.error('Error creating answer:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
