import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!['approved', 'rejected', 'posted'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('scout_leads')
            .update({
                status,
                reviewed_at: new Date().toISOString(),
                reviewed_by: user?.id
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating scout lead:', error);
        return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
    }
}
