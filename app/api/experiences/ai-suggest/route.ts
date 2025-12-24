
import { generateExperienceSuggestions } from '@/lib/ai/experience-helper';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return new NextResponse('Prompt is required', { status: 400 });
        }

        const suggestion = await generateExperienceSuggestions(prompt);
        return NextResponse.json(suggestion);

    } catch (error) {
        console.error('[AI_SUGGEST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
