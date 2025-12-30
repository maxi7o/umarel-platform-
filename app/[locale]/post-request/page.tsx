
import { db } from '@/lib/db';
import { requests, slices } from '@/lib/db/schema';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getEffectiveUserId, GUEST_USER_ID, GUEST_COOKIE_NAME } from '@/lib/services/special-users';
import { cookies } from 'next/headers';

export default async function PostRequestPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // 1. Get the current user (Real Auth or Guest)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userId = await getEffectiveUserId(user?.id);

    // If Guest, set a session cookie to track them (optional for now, but good practice)
    // If Guest, set a session cookie to track them
    if (userId === GUEST_USER_ID) {
        const cookieStore = await cookies();
        if (!cookieStore.has(GUEST_COOKIE_NAME)) {
            cookieStore.set(GUEST_COOKIE_NAME, crypto.randomUUID(), { secure: true, httpOnly: true });
        }
    }

    // 2. Create a draft request
    const [newRequest] = await db.insert(requests).values({
        userId: userId,
        title: 'New Project',
        description: '',
        status: 'open',
    }).returning();

    const requestId = newRequest.id;

    // 3. Create the initial "Root" slice
    const [newSlice] = await db.insert(slices).values({
        requestId: requestId,
        creatorId: userId,
        title: 'Initial Request',
        description: 'Root slice for the project',
        status: 'proposed',
    }).returning();

    const sliceId = newSlice.id;

    // 4. Redirect to the Wizard for this slice
    redirect(`/${locale}/wizard/${sliceId}`);
}
