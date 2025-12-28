'use server'

import { submitQuote } from '@/lib/services/quote-service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { slices } from '@/lib/db/schema';

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
