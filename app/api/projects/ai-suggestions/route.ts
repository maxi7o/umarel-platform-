import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ProjectAIService } from '@/lib/ai/project-ai-service';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { title, description, category } = body;

        if (!title || !description) {
            return NextResponse.json(
                { success: false, error: 'Title and description are required' },
                { status: 400 }
            );
        }

        // Generate AI suggestions
        const suggestions = await ProjectAIService.generateSuggestions(
            title,
            description,
            category
        );

        return NextResponse.json({
            success: true,
            suggestions
        });

    } catch (error) {
        console.error('Project AI suggestions error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: (error as Error).message },
            { status: 500 }
        );
    }
}
