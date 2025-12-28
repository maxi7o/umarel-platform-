
import { NextRequest, NextResponse } from 'next/server';
import { PayrollService } from '@/lib/services/payroll-service';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const payroll = new PayrollService();

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));
        if (dbUser.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Re-generate preview to ensure freshness (or accept ID if passed)
        const preview = await payroll.generatePreview();

        if (preview.poolTotal === 0) {
            return NextResponse.json({ error: 'Pool is empty, nothing to distribute.' }, { status: 400 });
        }

        const result = await payroll.executePayout(preview);

        return NextResponse.json({ success: true, runId: result.id, date: result.date });

    } catch (error) {
        console.error('Payroll Execution Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
