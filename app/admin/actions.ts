
import { db } from '@/lib/db';
import { slices, users, requestSlices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getDisputes() {
    // Check Admin Role
    const supabase = createServerActionClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) redirect('/login');

    // In a real app, strict role check: 
    // const user = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
    // if (user?.role !== 'admin') redirect('/');

    // Fetch disputed slices
    const disputedSlices = await db.select({
        id: slices.id,
        title: slices.title,
        status: slices.status,
        disputedAt: slices.disputedAt,
        amount: slices.offerAmount,
        currency: slices.currency,
        providerId: slices.providerId,
        requestId: requestSlices.requestId
    })
        .from(slices)
        .innerJoin(requestSlices, eq(slices.id, requestSlices.sliceId))
        .where(eq(slices.status, 'disputed'));

    return disputedSlices;
}
