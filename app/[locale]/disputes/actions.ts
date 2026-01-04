'use server'

import { revalidatePath } from "next/cache";
import { createClient } from '@supabase/supabase-js';
import { db } from "@/lib/db";
import { disputeEvidence } from "@/lib/db/schema";
import { randomUUID } from "crypto";

// Initialize Supabase Admin Client (for reliable uploads/bucket access)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function uploadEvidence(formData: FormData) {
    const file = formData.get('file') as File;
    const disputeId = formData.get('disputeId') as string;
    const uploaderId = formData.get('uploaderId') as string;
    const description = formData.get('description') as string;

    if (!file || !disputeId || !uploaderId) {
        throw new Error("Missing required fields");
    }

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${disputeId}/${randomUUID()}.${fileExt}`;
        const bucketName = 'disputes';

        // 1. Ensure bucket exists (optional check, better done in clean setup, but harmless here)
        // For performance, we assume it exists or create once manually.
        // But for robustness in this session:
        const { data: buckets } = await supabase.storage.listBuckets();
        if (!buckets?.find(b => b.name === bucketName)) {
            await supabase.storage.createBucket(bucketName, { public: true });
        }

        // 2. Upload to Supabase Storage
        const fileBuffer = await file.arrayBuffer();
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, fileBuffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error("Storage Error:", uploadError);
            throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // 3. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        // 4. Record in Database
        await db.insert(disputeEvidence).values({
            disputeId,
            uploaderId,
            mediaUrl: publicUrl,
            mimeType: file.type,
            description: description || "Evidence submitted via Dispute Room",
            metadata: {
                originalName: file.name,
                size: file.size
            }
        });

        console.log(`Evidence uploaded for dispute ${disputeId}: ${publicUrl}`);

        revalidatePath(`/disputes/${disputeId}`);
        return { success: true, url: publicUrl };

    } catch (error: any) {
        console.error("Evidence Upload Error:", error);
        return { success: false, error: error.message };
    }
}
