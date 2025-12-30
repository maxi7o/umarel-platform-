
import { db } from '@/lib/db';
import { requests, slices, serviceOfferings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getEffectiveUserId, GUEST_USER_ID, GUEST_COOKIE_NAME } from '@/lib/services/special-users';
import { cookies } from 'next/headers';

export default async function PostRequestPage({
    params,
    searchParams
}: {
    params: Promise<{ locale: string }>,
    searchParams: Promise<{ offeringId?: string }>
}) {
    const { locale } = await params;
    const { offeringId } = await searchParams;

    // 1. Get the current user (Real Auth or Guest)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userId = await getEffectiveUserId(user?.id);

    // If Guest, set a session cookie to track them
    if (userId === GUEST_USER_ID) {
        const cookieStore = await cookies();
        if (!cookieStore.has(GUEST_COOKIE_NAME)) {
            cookieStore.set(GUEST_COOKIE_NAME, crypto.randomUUID(), { secure: true, httpOnly: true });
        }
    }

    // 2. Determine Initial Content based on Offering (if any)
    let initialTitle = 'New Project';
    let initialDesc = 'Root slice for the project';
    let providerId: string | null = null;
    let offeringTitle = '';

    if (offeringId) {
        const [offering] = await db.select().from(serviceOfferings).where(eq(serviceOfferings.id, offeringId));
        if (offering) {
            initialTitle = offering.title; // Use offering title
            initialDesc = `Request based on offering: ${offering.title}`;
            providerId = offering.providerId;
            offeringTitle = offering.title;
        }
    }

    // 3. Create a draft request
    const [newRequest] = await db.insert(requests).values({
        userId: userId,
        title: initialTitle,
        description: initialDesc, // Could be better
        status: 'open',
    }).returning();

    const requestId = newRequest.id;

    // 4. Create the initial "Root" slice
    const [newSlice] = await db.insert(slices).values({
        requestId: requestId,
        creatorId: userId,
        title: initialTitle,
        description: initialDesc,
        status: 'proposed',
    }).returning();

    const sliceId = newSlice.id;

    // 5. Redirect to Wizard
    // If it's from an offering, we might want to pass that context to the wizard
    // For now, simple redirect is enough. The title is already set.
    redirect(`/${locale}/wizard/${sliceId}`);
}
