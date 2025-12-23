import { ProviderDashboardClient } from './client-page'

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let opportunities: any[] = []

    try {
        // In a real app, we would join slices with requests and filter by location/status
        // const result = await db.select().from(slices)...
    } catch (e) {
        console.error("DB Error", e)
    }

    if (opportunities.length === 0) {
        opportunities = MOCK_OPPORTUNITIES
    }

    const mockStats = {
        totalEarnings: 1250000, // 12,500.00 in cents
        pendingEarnings: 450000,
        auraScore: 94
    }

    return <ProviderDashboardClient opportunities={opportunities} stats={mockStats} />
}
