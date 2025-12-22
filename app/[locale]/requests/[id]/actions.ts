'use server'

import { submitQuote } from '@/lib/services/quote-service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function submitQuoteAction(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const requestId = formData.get('requestId') as string;
    const amount = parseFloat(formData.get('amount') as string);
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
