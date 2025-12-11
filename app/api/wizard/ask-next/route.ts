import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sliceCards, wizardMessages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateSliceOptimization } from '@/lib/ai/openai';

export async function POST(request: NextRequest) {
    try {
        const { sliceId, sliceCard, messages } = await request.json();

        // Get slice card
        const card = await db.query.sliceCards.findFirst({
            where: eq(sliceCards.sliceId, sliceId),
        });

        if (!card) {
            return NextResponse.json({ error: 'Slice card not found' }, { status: 404 });
        }

        // Generate AI suggestion
        const suggestion = await generateSliceOptimization(
            sliceCard || card,
            messages || [],
            'Analyze the current slice and suggest the next optimization step'
        );

        // Save suggestion as AI message
        await db.insert(wizardMessages).values({
            sliceCardId: card.id,
            userId: 'ai',
            content: suggestion || 'I suggest reviewing the current price and timeline estimates.',
            role: 'assistant',
            metadata: { type: 'suggestion', model: 'gpt-4-turbo-preview' },
        });

        return NextResponse.json({
            suggestion,
        });
    } catch (error) {
        console.error('Ask next error:', error);
        return NextResponse.json(
            { error: 'Failed to generate suggestion' },
            { status: 500 }
        );
    }
}
