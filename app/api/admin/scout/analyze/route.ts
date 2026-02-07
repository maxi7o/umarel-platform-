import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// This endpoint should be protected by admin middleware (already handled by path /api/admin/*)
export async function POST(req: NextRequest) {
    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: 'OpenAI API Key not configured' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const content = body.content || '';

        console.log(`[Scout API] Analyzing content: "${content.substring(0, 50)}..."`);

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant for a construction marketplace called "El Entendido" (elentendido.ar). 
                    Your goal is to identify high-intent leads on social media who are looking for construction/home services in Argentina.
                    
                    Analyze the user post content provided.
                    Return a JSON object with:
                    - intentScore: number (0-10), where 10 is explicit urgent demand for service.
                    - reason: string (brief explanation of why this score was given).
                    - suggestedReply: string (a helpful, non-spammy comment in Spanish, max 280 chars).
                    
                    The reply should:
                    - Be empathetic to their problem (e.g. "Qué bajón lo de la humedad").
                    - Suggest "El Entendido" (elentendido.ar) as a safe solution because it holds funds until work is verified.
                    - NOT sound like a robot. Use local Argentine slang appropriately if the user does.
                    
                    If intentScore < 4, suggestedReply can be null.`
                },
                {
                    role: "user",
                    content: `Post Content: "${content}"`
                }
            ],
            response_format: { type: "json_object" }
        });

        const resultContent = completion.choices[0].message.content;
        if (!resultContent) {
            throw new Error("No content from OpenAI");
        }

        const result = JSON.parse(resultContent);
        return NextResponse.json(result);

    } catch (error) {
        console.error('Error in Scout Agent API:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
    }
}
