import { ProviderDashboardClient } from './client-page'
import { db } from '@/lib/db'
import { serviceOfferings, requests, slices } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { getEffectiveUserId } from '@/lib/services/special-users'

// Mock data for development
const MOCK_OPPORTUNITIES = [
    {
        id: '1',
        title: 'Demolition & Removal',
        description: 'Remove old tiles and sanitary ware. Dispose of debris.',
        estimatedEffort: '1 day',
        status: 'proposed',
        request: {
            title: 'Renovate my small bathroom',
            location: 'Via Roma 123, Milano'
        }
    },
    {
        id: '2',
        title: 'Paint Living Room Wall',
        description: 'Paint one accent wall (red) in the living room. Paint provided.',
        estimatedEffort: '3 hours',
        status: 'proposed',
        request: {
            title: 'Living room refresh',
            location: 'Corso Italia 45, Milano'
        }
    }
]

export default async function ProviderDashboard() {
    // 1. Get Current User
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Default to a demo user if not logged in (for dev) or redirect? 
    // Given the context, we likely want to show empty or redirect. 
    // But for now, let's allow it to run even if not logged in (will show empty offerings)
    const userId = await getEffectiveUserId(user?.id);

    // 2. Fetch My Offerings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let myOfferings: any[] = [];

    if (userId) {
        try {
            myOfferings = await db
                .select()
                .from(serviceOfferings)
                .where(eq(serviceOfferings.providerId, userId))
                .orderBy(desc(serviceOfferings.createdAt));
        } catch (e) {
            console.error("Failed to fetch offerings", e);
        }
    }

    // 3. Opportunities (Mock for now, but could be real if we implemented matching)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let opportunities: any[] = []

    /* 
    try {
        // Real implementation would find open slices in user's area
    } catch (e) { ... } 
    */

    if (opportunities.length === 0) {
        opportunities = MOCK_OPPORTUNITIES
    }

    const mockStats = {
        totalEarnings: 1250000,
        pendingEarnings: 450000,
        auraScore: 94
    }

    return <ProviderDashboardClient
        opportunities={opportunities}
        stats={mockStats}
        offerings={myOfferings}
    />
}
