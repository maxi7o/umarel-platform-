'use server'

import { revalidatePath } from "next/cache";

export async function uploadEvidence(formData: FormData) {
    // Mock Action
    // Real implementation would handle Supabase Storage upload
    console.log("Evidence Upload Mock Triggered");

    // Simulate DB delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Force refresh
    revalidatePath('/disputes/[id]');
}
