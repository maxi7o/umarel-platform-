import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleWizardMessage } from '@/lib/services/wizard-service';

export async function POST(request: NextRequest) {
    try {
        const { sliceId, content, locale = 'en', sessionId } = await request.json();

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Support Guest Mode
        let userId = user?.id;
        if (!userId) {
            // In a real app, we might check for a session header or cookie here to prevent abuse,
            // but for now we fallback to the structural Guest ID.
            const { getEffectiveUserId } = await import('@/lib/services/special-users');
            userId = await getEffectiveUserId(null);
        }

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await handleWizardMessage(sliceId, userId, content, locale, sessionId);

        return NextResponse.json({
            message: result.aiMessage,
            sliceCards: result.sliceCards,
            userMessage: result.userMessage,
        });

    } catch (error) {
        console.error('Wizard message error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
