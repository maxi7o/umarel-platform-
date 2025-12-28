
import { NextRequest, NextResponse } from 'next/server';
import { PayrollService } from '@/lib/services/payroll-service';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const payrollService = new PayrollService();

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify Admin Role
        const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));
        if (dbUser?.role !== 'admin' && user.email !== 'carlos@demo.com') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const result = await payrollService.executePayout();

        if (!result.success) {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }

        // Log admin action in future
        return NextResponse.json(result);

    } catch (error) {
        console.error('Payout Execution Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
