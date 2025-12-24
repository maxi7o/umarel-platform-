'use server'

import { db } from '@/lib/db';
import { slices, requests, escrowPayments, sliceEvidence } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { analyzeDispute } from '@/lib/ai/admin-helper';

export async function getDisputes() {
    // In real app, check auth/role here

    // Fetch disputes from escrowPayments (more reliable source of truth for money disputes)
    const disputes = await db.query.escrowPayments.findMany({
        where: eq(escrowPayments.status, 'disputed'),
        with: {
            slice: {
                with: {
                    request: true
                }
            }
        }
    });

    return disputes.map(d => ({
        id: d.id, // Escrow ID
        sliceId: d.sliceId,
        title: d.slice.title,
        amount: d.totalAmount,
        currency: 'ARS', // Default or fetch from somewhere
        disputedAt: d.createdAt,
        aiAnalysis: d.aiDisputeAnalysis as any, // Cast or type properly
    }));
}

export async function analyzeDisputeAction(escrowId: string) {
    try {
        // 1. Fetch Full Context
        const payment = await db.query.escrowPayments.findFirst({
            where: eq(escrowPayments.id, escrowId),
            with: {
                slice: {
                    with: {
                        request: true,
                    }
                }
            }
        });

        if (!payment || !payment.slice) throw new Error("Payment/Slice not found");

        const evidence = await db.query.sliceEvidence.findMany({
            where: eq(sliceEvidence.sliceId, payment.sliceId)
        });

        const evidenceUrls = evidence.map(e => e.fileUrl);

        if (evidenceUrls.length === 0) {
            return { error: "No evidence found to analyze." };
        }

        // 2. Call AI
        const analysis = await analyzeDispute({
            disputeId: payment.id,
            requestTitle: payment.slice.request.title,
            requestDescription: payment.slice.request.description,
            sliceTitle: payment.slice.title,
            sliceDescription: payment.slice.description,
            evidenceUrls: evidenceUrls,
            disputeReason: payment.disputeReason || "No reason provided",
        });

        // 3. Save Result
        await db.update(escrowPayments)
            .set({ aiDisputeAnalysis: analysis })
            .where(eq(escrowPayments.id, escrowId));

        revalidatePath('/admin/disputes');
        return { success: true, analysis };

    } catch (error) {
        console.error("Analysis Action failed:", error);
        return { error: "Failed to analyze dispute." };
    }
}
