'use server'

import { submitQuote } from '@/lib/services/quote-service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { slices, sliceCards } from '@/lib/db/schema';
import { openai } from '@/lib/ai/openai';
import { inArray } from 'drizzle-orm';

export async function submitQuoteAction(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const requestId = formData.get('requestId') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const currency = (formData.get('currency') as string) || 'ARS';
    const message = formData.get('message') as string;
    const sliceIds = (formData.get('sliceIds') as string).split(',');

    if (!requestId || isNaN(amount) || sliceIds.length === 0) {
        throw new Error('Invalid form data');
    }

    try {
        await submitQuote({
            providerId: user.id,
            requestId,
            amount,
            currency,
            message,
            sliceIds,
            // estimatedDeliveryDate: new Date() // Optional
        });

        revalidatePath(`/requests/${requestId}`);

    } catch (error) {
        console.error('Failed to submit quote:', error);
        throw new Error('Failed to submit quote');
    }
}

export async function createSlice(requestId: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const estimatedEffort = formData.get('estimatedEffort') as string;

    if (!requestId || !title || !description) {
        throw new Error('Invalid form data');
    }

    try {
        await db.insert(slices).values({
            requestId,
            creatorId: user.id,
            title,
            description,
            estimatedEffort,
            status: 'proposed'
        });

        revalidatePath(`/requests/${requestId}`);
    } catch (error) {
        console.error('Failed to create slice:', error);
        throw new Error('Failed to create slice');
    }
}

export async function generateQuoteDraft(requestId: string, sliceIds: string[]) {
    // 1. Fetch Request & Slices Context
    const cards = await db.select().from(sliceCards).where(inArray(sliceCards.sliceId, sliceIds));

    if (cards.length === 0) return null;

    const tasks = cards.map(c => `- ${c.title} (${c.qualityLevel || 'standard'}): ${c.description}`).join('\n');

    const systemPrompt = `You are an expert professional contractor 'Umarel'.
    Analyze the tasks and generate a competitive draft quote.
    
    Context:
    - Location: Argentina (Currency ARS)
    - Tasks:
    ${tasks}
    
    Output JSON ONLY:
    {
      "amount": number, // Estimated total price in ARS (realistic for 2025/2026 inflation, e.g. 50000+ per day)
      "message": "Professional, polite cover letter in Spanish (Rioplatense). Brief and confident.",
      "estimatedDays": number // Whole number
    }`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o', // Fast & Smart
            messages: [{ role: 'system', content: systemPrompt }],
            response_format: { type: "json_object" },
            temperature: 0.7
        });

        const content = response.choices[0].message.content || '{}';
        return JSON.parse(content);
    } catch (e) {
        console.error("AI Quote Generation Failed", e);
        // Fallback or rethrow
        return null;
    }
}
