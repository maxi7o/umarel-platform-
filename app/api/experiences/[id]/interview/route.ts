import { OpenAI } from 'openai';
import { db } from '@/lib/db';
import { experiences } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// Initialize OpenAI Wrapper
// In a production app, use the `lib/ai/openai.ts` wrapper if it exists and handles configured clients
// For now, direct instantiation for clarity
// Initialize OpenAI Wrapper Lazily
// In a production app, use the `lib/ai/openai.ts` wrapper if it exists and handles configured clients

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error('OPENAI_API_KEY is not set');
            return NextResponse.json(
                { message: "Service temporarily unavailable (AI Config)", isComplete: false },
                { status: 503 }
            );
        }

        const openai = new OpenAI({ apiKey });
        const { id } = await params;
        const { message, history } = await req.json();

        // 1. Fetch Experience Context
        const [experience] = await db
            .select()
            .from(experiences)
            .where(eq(experiences.id, id))
            .limit(1);

        if (!experience) {
            return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
        }

        const config = experience.pricingConfig as any;
        const providerQuestions = config?.aiInterviewerConfig?.initial_questions || [];

        // 2. Construct System Prompt
        const systemPrompt = `
You are the AI Concierge for an experience called "${experience.title}".
Your goal is to friendly interview the guest to prepare the host.

The host wants you to ask about:
${providerQuestions.map((q: string) => `- ${q}`).join('\n')}

Rules:
- Be concise and friendly.
- Ask one question at a time.
- If the user answers a question, acknowledge it and move to the next.
- If the conversation is done (all questions answered or user seems ready), output a special JSON signal.
- DO NOT hallucinate details about the event location or time unless provided in context.

Current Context:
Location: ${experience.location || 'Virtual'}
Date: ${experience.date}

Output Format:
Return a JSON object.
If the conversation is NOT finished:
{ "message": "Your text response here", "isComplete": false }

If the conversation IS finished (all info gathered):
{ "message": "Great! You look all set. You can now proceed to payment.", "isComplete": true, "bookingSummary": { "ready": true } }
`;

        // 3. Format Messages for OpenAI
        const apiMessages = [
            { role: 'system', content: systemPrompt },
            ...history.map((m: any) => ({
                role: m.role === 'ai' ? 'assistant' : 'user',
                content: m.content
            })),
            { role: 'user', content: message }
        ];

        // 4. Call LLM
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o', // Or gpt-3.5-turbo
            messages: apiMessages as any,
            response_format: { type: 'json_object' }, // Enforce JSON
            temperature: 0.7,
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error('No content from AI');

        const parsed = JSON.parse(content);

        return NextResponse.json(parsed);

    } catch (error) {
        console.error('[AI_INTERVIEW_ERROR]', error);
        return NextResponse.json(
            {
                message: "I'm sorry, I'm having a little trouble thinking right now. Could you repeat that?",
                isComplete: false
            },
            { status: 500 }
        );
    }
}
