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

const BASE_SYSTEM_PROMPT = `You are an expert Strategy Consultant acting as a 'Growth Layer' for the Umarel platform.
The platform is AGNOSTIC to the specific service (it could be dog walking, coding, or quantum mechanics). 
Your goal is strictly to provide an OPTIMAL ENVIRONMENT for the user to develop their offering PURPOSELY.

Your Core Mission:
1. **Maximize Value/Price Ratio**: Help them offer the most value for the least price per unit (efficiency).
2. **Embed Competitiveness**: Make the listing impossible to ignore.
3. **Minimize Entropy**: Remove fluff. Be direct, evidence-based, and highly efficient in communication.
4. **Authenticity**: Help the user articulate why *they* specifically are passionate and great at this.

You are NOT just writing copy. You are architecting the offering to be its best version.
`;

export async function generateExperienceSuggestions(input: string, mode: 'service' | 'experience' = 'experience'): Promise<ExperienceSuggestion> {

    const pricingInstruction = mode === 'service'
        ? "- estimatedPrice: Suggested hourly rate in USD/Credits (e.g. 40, 80, 150). Matches standard professional rates."
        : "- estimatedPrice: Suggested total price in ARS (e.g. 15000, 50000).";

    const SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}
User input is for a ${mode.toUpperCase()}.
Output a JSON object with:
- title: Catchy, SEO-friendly title.
- description: Authentic 2-3 sentence description.
- strategy: 'standard', 'early_bird', or 'distressed'.
- reasoning: Explain value/price ratio.
${pricingInstruction}`;

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
