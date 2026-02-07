import { redirect } from 'next/navigation';
import { UniversalSliceIDE } from '@/components/ide/universal-slice-ide';
import { createDraftRequest } from '@/lib/actions/request-actions';
import { createClient } from '@/lib/supabase/server';

export default async function CreateUniversalRequestPage() {
    const supabase = await createClient(); // Fixed: await createClient
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?next=/requests/create-universal');
    }

    // Create a new request context for the IDE
    // In a real flow, you might redirect to /requests/[id]/edit
    const newRequest = await createDraftRequest();

    // Redirect to the edit mode for this specific request
    redirect(`/requests/${newRequest.id}/edit`);
}
