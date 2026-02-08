import { ServiceRatingForm } from '@/components/ratings/service-rating-form';
import { db } from '@/lib/db';
import { slices, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export default async function RateServicePage({
    params
}: {
    params: { sliceId: string; locale: string }
}) {
    // Get slice details
    const slice = await db.query.slices.findFirst({
        where: eq(slices.id, params.sliceId),
    });

    if (!slice || !slice.assignedProviderId || !slice.requestId) {
        notFound();
    }

    // Get provider details
    const provider = await db.query.users.findFirst({
        where: eq(users.id, slice.assignedProviderId),
    });

    if (!provider) {
        notFound();
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <ServiceRatingForm
                sliceId={params.sliceId}
                requestId={slice.requestId}
                providerId={slice.assignedProviderId}
                providerName={provider.fullName || provider.email}
                locale={params.locale}
            />
        </div>
    );
}
