import { db } from '@/lib/db';
import { slices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getOpenSlicesForProvider(requestId: string) {
    const allSlices = await db
        .select()
        .from(slices)
        .where(eq(slices.requestId, requestId));

    // Filter in-memory as per test expectation (or DB level if we refine later)
    // For now, doing it here to match the "mock returns all" behavior of the test setup
    // unless we change the test to mock the specific DB call.
    // Ideally query should be: 
    // .where(and(eq(slices.requestId, requestId), eq(slices.status, 'accepted')))

    return allSlices.filter(slice => slice.status === 'accepted');
}
