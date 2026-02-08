import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// This API route acts as a proxy to the n8n AI workflow.
// Instead of complex logic here, we just forward the context to n8n.
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { context, mode, input_text } = body;

        // N8N Workflow URL (We'll update this once n8n is configured)
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_SLICE_AI || 'https://elentendido.app.n8n.cloud/webhook-test/suggest-slices';

        // Call n8n
        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': user.id, // Pass user context securely via header if needed
            },
            body: JSON.stringify({
                userId: user.id,
                mode: mode, // 'REQUEST', 'QUOTE', 'EXPERIENCE'
                input: input_text,
                context: context
            })
        });

        if (!response.ok) {
            throw new Error(`n8n Error: ${response.statusText}`);
        }

        const aiSuggestion = await response.json();

        return NextResponse.json({
            success: true,
            suggestion: aiSuggestion
        });

    } catch (error) {
        console.error('Error calling AI Suggest:', error);
        return NextResponse.json(
            { error: 'Failed to get AI suggestion', details: (error as Error).message },
            { status: 500 }
        );
    }
}
