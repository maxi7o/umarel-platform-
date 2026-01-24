
import { WizardInterface } from '@/components/wizard/wizard-interface';
import { createClient } from '@/lib/supabase/server';
import { getEffectiveUserId, GUEST_USER_ID, GUEST_COOKIE_NAME } from '@/lib/services/special-users';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users, slices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function WizardPage({ params }: { params: Promise<{ sliceId: string; locale: string }> }) {
    const resolvedParams = await params;
    const cookieStore = await cookies();
    const supabase = await createClient();

    // 1. Get Auth User
    const { data: { user } } = await supabase.auth.getUser();
    let effectiveUserId = user?.id;
    let userName = user?.user_metadata?.full_name || 'User';
    let auraLevel = 'bronze';

    // 2. Fetch Slice to get Request ID
    const [slice] = await db.select({ requestId: slices.requestId }).from(slices).where(eq(slices.id, resolvedParams.sliceId));
    const requestId = slice?.requestId || '';

    // 3. Fallback to Guest if needed
    if (!effectiveUserId) {
        // Only treat as Guest if cookie exists or we decide to allow pure anonymous
        // For continuity, we check if they are the valid Guest for this session? 
        // For now, simpler: If no user, they are Guest.
        effectiveUserId = GUEST_USER_ID;
        userName = 'Guest';
    } else {
        // Fetch extended profile for Aura
        const [dbUser] = await db.select().from(users).where(eq(users.id, effectiveUserId));
        if (dbUser) {
            auraLevel = dbUser.auraLevel || 'bronze';
            userName = dbUser.fullName || userName;
        }
    }

    const sessionId = effectiveUserId !== GUEST_USER_ID
        ? effectiveUserId
        : cookieStore.get(GUEST_COOKIE_NAME)?.value || 'guest-session-unknown';

    const currentUser = {
        id: effectiveUserId,
        sessionId: sessionId,
        name: userName,
        auraLevel: auraLevel,
    };

    return (
        <WizardInterface
            sliceId={resolvedParams.sliceId}
            requestId={requestId}
            currentUser={currentUser}
            locale={resolvedParams.locale}
        />
    );
}
