import { WizardInterface } from '@/components/wizard/wizard-interface';

export default async function WizardPage({ params }: { params: Promise<{ sliceId: string; locale: string }> }) {
    // TODO: Get current user from session
    const currentUser = {
        id: 'current-user-id',
        name: 'Test User',
        auraLevel: 'bronze',
    };

    const resolvedParams = await params;

    return (
        <WizardInterface
            sliceId={resolvedParams.sliceId}
            requestId="request-id" // TODO: Get from slice
            currentUser={currentUser}
            locale={resolvedParams.locale}
        />
    );
}
