import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { questions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { forwardToCommunity } = body;

        if (forwardToCommunity === undefined) {
            return NextResponse.json(
                { error: 'Missing forwardToCommunity field' },
                { status: 400 }
            );
        }

        const [updatedQuestion] = await db
            .update(questions)
            .set({
                forwardedToCommunity: forwardToCommunity,
                status: forwardToCommunity ? 'forwarded_to_community' : 'pending',
            })
            .where(eq(questions.id, id))
            .returning();

        return NextResponse.json(updatedQuestion);
    } catch (error) {
        console.error('Error updating question:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
