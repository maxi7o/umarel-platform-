import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { questions, answers, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { content, askerId } = body;

        if (!content || !askerId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const [newQuestion] = await db.insert(questions).values({
            requestId: id,
            askerId,
            content,
            status: 'pending',
            forwardedToCommunity: false,
        }).returning();

        return NextResponse.json(newQuestion);
    } catch (error) {
        console.error('Error creating question:', error);
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

        // Fetch questions with asker info and answers
        const requestQuestions = await db
            .select()
            .from(questions)
            .where(eq(questions.requestId, id))
            .orderBy(desc(questions.createdAt));

        // For each question, fetch the asker and answers
        const questionsWithDetails = await Promise.all(
            requestQuestions.map(async (question) => {
                const [asker] = await db
                    .select()
                    .from(users)
                    .where(eq(users.id, question.askerId));

                const questionAnswers = await db
                    .select()
                    .from(answers)
                    .where(eq(answers.questionId, question.id))
                    .orderBy(desc(answers.upvotes), desc(answers.createdAt));

                // Fetch answerer info for each answer
                const answersWithUsers = await Promise.all(
                    questionAnswers.map(async (answer) => {
                        const [answerer] = await db
                            .select()
                            .from(users)
                            .where(eq(users.id, answer.answererId));
                        return { ...answer, answerer };
                    })
                );

                return {
                    ...question,
                    asker,
                    answers: answersWithUsers,
                };
            })
        );

        return NextResponse.json(questionsWithDetails);
    } catch (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
