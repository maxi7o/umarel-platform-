
import { UniversalSliceIDE, IdeMode } from '@/components/ide/universal-slice-ide';
import { getSlicesForContext } from '@/lib/actions/slice-actions';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { requests, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function RequestEditPage({ params }: { params: { id: string } }) {
    // Get User
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?next=/requests/' + params.id + '/edit');
    }

    // Get Request Data
    const request = await db.query.requests.findFirst({
        where: eq(requests.id, params.id),
    });

    if (!request) {
        return <div>Request not found</div>;
    }

    // Determine User Role & Mode
    let initialMode: IdeMode = 'REQUEST_CREATION';
    let userRole: 'client' | 'provider' | 'admin' | 'ai' = 'client';

    // Get User Profile Role
    const userProfile = await db.query.users.findFirst({
        where: eq(users.id, user.id),
    });

    const isOwner = request.userId === user.id;

    if (userProfile?.role === 'admin') {
        initialMode = 'CRITIQUE_REVIEW'; // Admins default to oversight
        userRole = 'admin';
    } else if (userProfile?.role === 'user' && !isOwner) { // Assuming 'provider' isn't a role enum value here yet, check logic
        // If user isn't owner, treat as Provider for now (or improve role logic)
        // For now, let's assume 'user' role but different person = Provider potentially
        initialMode = 'QUOTE_PROPOSAL';
        userRole = 'provider';
    } else {
        // Owner (Client)
        initialMode = 'REQUEST_CREATION';
        userRole = 'client';
    }

    // Get Slices
    const slices = await getSlicesForContext(params.id, 'request');

    return (
        <div className="h-screen w-screen overflow-hidden">
            <UniversalSliceIDE
                initialMode={initialMode}
                contextId={params.id}
                userRole={userRole}
                existingSlices={slices}
            />
        </div>
    );
}
