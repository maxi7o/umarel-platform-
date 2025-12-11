
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { requests, sliceCards, slices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { QuoteBuilder } from '@/components/interaction/quote-builder';

interface QuotePageProps {
    params: Promise<{ id: string; locale: string }>;
}

export default async function QuotePage({ params }: QuotePageProps) {
    const { id } = await params;

    // 1. Fetch Request
    const [request] = await db.select().from(requests).where(eq(requests.id, id));
    if (!request) return notFound();

    // 2. Fetch Slices & Cards
    // We need the ACTUAL slices to link to, but the logic/descriptions are in sliceCards?
    // In our schema: `slices` is the operational unit, `sliceCards` is the AI definition.
    // We should fetching slices that have cards.
    // For simplicity, let's fetch slices and join or just fetch sliceCards if they map 1:1. 
    // Wait, sliceCards reference sliceId.

    // Better: Fetch SLICE CARDS, as they have the user-facing Title/Description/Skills.
    // Use the `sliceId` from the card to reference the slice.

    const cards = await db.select().from(sliceCards).where(eq(sliceCards.requestId, id));

    // Transform to friendly format for selector
    const quotableSlices = cards.map(c => ({
        id: c.sliceId, // Use the Slice ID as the key identifier
        title: c.title,
        description: c.description,
        skills: c.skills || [],
        status: 'open', // We could fetch real status from 'slices' table if needed, assuming open for now
        estimatedTime: c.estimatedTime
    }));

    return (
        <div className="container mx-auto py-8">
            <QuoteBuilder
                requestId={id}
                requestTitle={request.title}
                slices={quotableSlices}
                userId="22222222-2222-2222-2222-222222222222" // Mock Provider ID (Carlos)
            />
        </div>
    );
}
