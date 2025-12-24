/**
 * AI Model Worker
 * Processes jobs from the Redis Queue.
 */
import { QueueService, AIJob } from './queue';
import { generateExperienceSuggestions as openaiSuggest } from '@/lib/ai/experience-helper'; // Reuse our logic
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Clients again (Worker might run in separate process)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'mock', dangerouslyAllowBrowser: false });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock');

export class ModelWorker {

    static async processJob(job: AIJob) {
        console.log(`[Worker] Processing Job ${job.id} (${job.type})`);

        try {
            let result;

            if (job.config?.strategy === 'race') {
                result = await this.runRace(job.payload.input);
            } else if (job.config?.strategy === 'best_of_n') {
                result = await this.runBestOfN(job.payload.input, job.config.iterations || 3);
            } else {
                // Default: Cheapest First (Gemini -> OpenAI)
                result = await this.runCheapestFirst(job.payload.input);
            }

            await QueueService.completeJob(job.id, result);
            console.log(`[Worker] Job ${job.id} Completed.`);
        } catch (error) {
            console.error(`[Worker] Job ${job.id} Failed:`, error);
            await QueueService.completeJob(job.id, { error: 'Processing Failed' });
        }
    }

    // RACE: Run both, return first completion
    static async runRace(input: string) {
        // We wrap our existing helper logic to decompose it, or just call APIs directly here.
        // For demonstration, let's call APIs directly to show independence.

        const p1 = this.callGemini(input).then(res => ({ ...res, provider: 'gemini' }));
        const p2 = this.callOpenAI(input).then(res => ({ ...res, provider: 'openai' }));

        return Promise.any([p1, p2]);
    }

    // CHEAPEST FIRST: Try Gemini. If fail/empty, try OpenAI.
    static async runCheapestFirst(input: string) {
        try {
            const geminiRes = await this.callGemini(input);
            return { ...geminiRes, provider: 'gemini' };
        } catch (e) {
            console.warn("Gemini failing in worker, trying OpenAI");
            const gptRes = await this.callOpenAI(input);
            return { ...gptRes, provider: 'openai' };
        }
    }

    // RUN INDEPENDENTLY (Best of N)
    static async runBestOfN(input: string, n: number) {
        // Run N independent calls (mixed models)
        // e.g. 2 Gemini, 1 OpenAI
        const promises = [];
        for (let i = 0; i < n; i++) {
            // Alternate models or random
            const useGemini = Math.random() > 0.5;
            promises.push(
                useGemini
                    ? this.callGemini(input).then(r => ({ ...r, provider: 'gemini', run: i }))
                    : this.callOpenAI(input).then(r => ({ ...r, provider: 'openai', run: i }))
            );
        }

        const results = await Promise.allSettled(promises);
        return results
            .filter(r => r.status === 'fulfilled')
            // @ts-ignore
            .map(r => r.value);
    }

    // --- Private Wrappers ---

    private static async callOpenAI(input: string) {
        // Simplified wrapper
        const res = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: `Suggest marketing copy for: ${input}. JSON.` }],
            response_format: { type: "json_object" }
        });
        return JSON.parse(res.choices[0].message.content || '{}');
    }

    private static async callGemini(input: string) {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const res = await model.generateContent(`Suggest marketing copy for: ${input}. Valid JSON.`);
        const text = res.response.text().replace(/```json|```/g, '').trim();
        return JSON.parse(text);
    }
}
