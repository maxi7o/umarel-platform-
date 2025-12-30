
import { WizardInterface } from '@/components/wizard/wizard-interface';
import { createClient } from '@/lib/supabase/server';
import { getEffectiveUserId, GUEST_USER_ID, GUEST_COOKIE_NAME } from '@/lib/services/special-users';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function SharePage({ params }: { params: Promise<{ sliceId: string; locale: string }> }) {
    const resolvedParams = await params;
    const cookieStore = await cookies();
    const supabase = await createClient();

    // 1. Get Auth User (Consultant)
    const { data: { user } } = await supabase.auth.getUser();
    let effectiveUserId = user?.id;
    let userName = user?.user_metadata?.full_name || 'Consultant';
    let auraLevel = 'bronze';

    // 2. Identify Consultant
    if (!effectiveUserId) {
        effectiveUserId = GUEST_USER_ID;
        userName = 'Guest Consultant';
    } else {
        const [dbUser] = await db.select().from(users).where(eq(users.id, effectiveUserId));
        if (dbUser) {
            auraLevel = dbUser.auraLevel || 'bronze';
            userName = dbUser.fullName || userName;
        }
    }

    // Ensure session for guest consultant
    let sessionId = effectiveUserId;
    if (effectiveUserId === GUEST_USER_ID) {
        if (!cookieStore.has(GUEST_COOKIE_NAME)) {
            // We can't set cookies in Server Component output during render easily without Middleware 
            // or Server Action. For now, generate a temporary one or rely on client side?
            // BETTER: Use a read-only view if no cookie? 
            // OR: Just read it. Content won't be saved properly without it.
            // Let's assume Middleware sets it or we accept "transient".
            sessionId = cookieStore.get(GUEST_COOKIE_NAME)?.value || crypto.randomUUID();
        } else {
            sessionId = cookieStore.get(GUEST_COOKIE_NAME)?.value!;
        }
    }

    const currentUser = {
        id: effectiveUserId,
        sessionId: sessionId,
        name: userName,
        auraLevel: auraLevel,
    };

    return (
        <WizardInterface
            sliceId={resolvedParams.sliceId}
            requestId="request-id" // Placeholder, loaded by generic component
            currentUser={currentUser}
            locale={resolvedParams.locale}
            mode="consultant"
        />
    );
}
