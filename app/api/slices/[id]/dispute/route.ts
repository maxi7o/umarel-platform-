
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slices, requests, productInsights, escrowPayments, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { analyzeDispute } from '@/lib/ai/judge';
import { NotificationService } from '@/lib/services/notification-service';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: sliceId } = await params;
        const body = await req.json();
        const { reason, description, evidenceDescription } = body;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Fetch Slice (Verify Client Ownership)
        const [slice] = await db
            .select({
                id: slices.id,
                creatorId: slices.creatorId,
                title: slices.title,
                finalPrice: slices.finalPrice,
                status: slices.status,
                assignedProviderId: slices.assignedProviderId,
                escrowPaymentId: slices.escrowPaymentId
            })
            .from(slices)
            .where(eq(slices.id, sliceId));

        if (!slice) return NextResponse.json({ error: 'Slice not found' }, { status: 404 });

        if (slice.creatorId !== user.id) {
            return NextResponse.json({ error: 'Only the client can raise a dispute' }, { status: 403 });
        }

        if (slice.status !== 'completed') {
            return NextResponse.json({ error: 'Can only dispute completed slices (before final release)' }, { status: 400 });
        }

        // 2. STOP THE CLOCK (Pause Auto-Release) & Open Dispute
        await db
            .update(slices)
            .set({
                disputeStatus: 'open',
                autoReleaseAt: null, // <--- THE STOP BUTTON (Pauses Timer)
                refundStatus: 'disputed', // Legacy field sync
                refundReason: reason,
                disputedAt: new Date()
            })
            .where(eq(slices.id, sliceId));

        // Update Escrow Payment status too if it exists
        if (slice.escrowPaymentId) {
            // We need to resolve the UUID if stored as text in slices vs UUID in payments table
            // Assuming direct match for now or handled by logic
            // Ideally we find the payment record
        }

        // 3. Trigger "The Judge" (Async analysis)
        // In a real serverless env, use Inngest/Queue. Here we await or fire-and-forget.
        // We'll await for MVP immediate feedback potential.

        console.log('⚖️ The Judge is analyzing case:', sliceId);
        const analysis = await analyzeDispute(slice, { reason, description, evidenceDescription });

        // 4. Store Product Insight ("The Engine")
        if (analysis.productInsight) {
            await db.insert(productInsights).values({
                source: 'dispute',
                sourceId: sliceId,
                insight: analysis.productInsight.insight,
                featureArea: analysis.productInsight.featureArea,
                sentiment: 'negative', // Disputes are inherently negative/friction
                confidence: analysis.confidence
            });
        }

        // 5. Store Resolution Recommendation (e.g. in admin notes or separate table)
        // For now, we log it or update the payment record with AI recommendation
        if (slice.escrowPaymentId) {
            // Find the payment UUID. Slice has it as text/uuid
            const payment = await db.query.escrowPayments.findFirst({
                where: eq(escrowPayments.id, slice.escrowPaymentId)
            });

            if (payment) {
                await db.update(escrowPayments).set({
                    status: 'disputed',
                    aiDisputeAnalysis: analysis as any // Cast for JSONB
                }).where(eq(escrowPayments.id, payment.id));
            }
        }

        // NOTIFICATION: Dispute Opened
        if (slice.assignedProviderId) {
            const [provider] = await db.select().from(users).where(eq(users.id, slice.assignedProviderId));
            if (provider?.email && user.email) {
                await NotificationService.notifyDisputeOpened(
                    user.email, // Client
                    provider.email, // Provider
                    slice.title,
                    reason
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Dispute opened. Auto-release paused. AI Judge is reviewing.',
            analysisPreview: analysis // Optional: Return to UI for transparency
        });

    } catch (error) {
        console.error('Dispute Error:', error);
        return NextResponse.json({ error: 'Failed to open dispute' }, { status: 500 });
    }
}
