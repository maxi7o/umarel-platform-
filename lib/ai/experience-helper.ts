import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Clients
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock-key',
    dangerouslyAllowBrowser: false,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY || process.env.GEMINI_API_KEY || 'mock-key');

export interface ExperienceSuggestion {
    title: string;
    description: string;
    strategy: 'standard' | 'early_bird' | 'viral';
    reasoning: string;
    estimatedPrice: number;
}

const SYSTEM_PROMPT = `You are an expert event planner and marketing strategist for 'Umarel'. 
User will give a rough idea for an Experience.
Output a JSON object with:
- title: Catchy, SEO-friendly title.
- description: Compelling 2-sentence description.
- strategy: 'standard', 'early_bird' (filling seats), or 'viral' (large groups).
- reasoning: Brief explanation.
- estimatedPrice: Suggested price in ARS cents (e.g. 2000000 = $20,000).`;

export async function generateExperienceSuggestions(input: string): Promise<ExperienceSuggestion> {

    // 1. Try OpenAI First
    try {
        if (!process.env.OPENAI_API_KEY) throw new Error("No OpenAI Key");

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `Suggestion for: ${input}` }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content from AI");
        return JSON.parse(content) as ExperienceSuggestion;

    } catch (openaiError) {
        console.warn("OpenAI failed, attempting Gemini Fallback...", openaiError);

        // 2. Fallback to Gemini
        try {
            if (!process.env.GEMINI_API_KEY) throw new Error("No Gemini Key");

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nInput: ${input}\n\nIMPORTANT: Output ONLY valid JSON.`);
            const response = result.response;
            const text = response.text();

            // Clean up code blocks if Gemini adds them
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr) as ExperienceSuggestion;

        } catch (geminiError) {
            console.error("Both AIs failed:", geminiError);

            // 3. Final Mock Fallback
            return {
                title: "New Experience",
                description: input,
                strategy: 'standard',
                reasoning: "AI services unavailable, defaulting to standard.",
                estimatedPrice: 20000
            };
        }
    }
}
