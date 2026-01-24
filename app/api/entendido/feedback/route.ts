
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { comments, umarelContributions } from '@/lib/db/schema'; // Assuming umarelContributions is the table for verified feedback
import { runConsensusFilter } from '@/lib/ai/consensus-filter';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { targetId, targetType, content } = body;

        if (!content || !targetId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Run the AI Firewall (Consensus Filter)
        const safetyResult = await runConsensusFilter(content, 'quote_feedback');

        // 2. Handle Rejection
        if (!safetyResult.isSafe) {
            console.warn(`[Entendido Feedback] Content blocked. Reason: ${safetyResult.reasoning}`);
            return NextResponse.json({
                status: 'rejected',
                reason: safetyResult.reasoning
            });
        }

        // 3. Store Safe Content
        // We might store it in 'comments' or 'umarelContributions' depending on schema.
        // For now, let's use 'comments' but mark it with metadata.

        /* 
           Ideally, we insert into `umarelContributions` if it's high value, 
           or just a standard comment if it's casual. 
           Let's assume standard comment for MVP but tagged as 'verified_opinion'.
        */

        const [newComment] = await db.insert(comments).values({
            userId: user.id,
            content: content,
            // Check if schema supports polymorphic targets (requestId vs quoteId)
            // If targetType is 'quote', we set quoteId. If 'slice', maybe need to adapt schema or use requestId.
            // For MVP, assuming we map it to requestId if possible or just use quoteId.
            quoteId: targetType === 'quote' ? targetId : undefined,
            // requestId: targetType === 'slice' ? targetId : undefined, // Check schema if this column exists
            type: 'text',
            isMarkedHelpful: false, // Starts neutral
        }).returning();

        // 4. Record the specific Contribution Metadata (The "Sticky Note" logic)
        // If we have a dedicated table for structured feedback:
        /*
        await db.insert(umarelContributions).values({
             umarelId: user.id,
             contributionType: 'pricing_feedback',
             description: content,
             // targetId: targetId // If schema has this
             status: 'pending_client_review'
        });
        */

        return NextResponse.json({
            status: 'approved',
            commentId: newComment.id,
            analysis: safetyResult
        });

    } catch (error) {
        console.error('Feedback API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
