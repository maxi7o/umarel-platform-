import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleWizardMessage } from '@/lib/services/wizard-service';

export async function POST(request: NextRequest) {
    try {
        const { sliceId, content, locale = 'en' } = await request.json();

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        let userId = user?.id;

        // DEV MODE: Allow bypass if no session/cookie
        if (!userId && process.env.NODE_ENV === 'development') {
            console.warn('⚠️ DEV MODE: Using mock user for Wizard API');
            userId = '00000000-0000-0000-0000-000000000001';
        }

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await handleWizardMessage(sliceId, userId, content, locale);

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
