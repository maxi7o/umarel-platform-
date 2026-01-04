import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createDispute } from '@/lib/services/dispute-service';

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

        const combinedReason = `${reason}\n\n${description}${evidenceDescription ? `\n\nEvidence Context: ${evidenceDescription}` : ''}`;

        await createDispute(sliceId, user.id, combinedReason);

        return NextResponse.json({
            success: true,
            message: 'Dispute opened. Logic migrated to Dispute Service.'
        });

    } catch (error) {
        console.error('Dispute Error:', error);
        return NextResponse.json({ error: 'Failed to open dispute' }, { status: 500 });
    }
}
