import { CustomerDashboardClient } from './client-page'

// Mock data
const MOCK_MY_REQUESTS = [
    {
        id: 'demo',
        title: 'Renovate my small bathroom',
        status: 'open',
        sliceCount: 2,
        quoteCount: 1,
        createdAt: new Date()
    }
]

export default async function CustomerDashboard() {
    const myRequests = MOCK_MY_REQUESTS

    return <CustomerDashboardClient myRequests={myRequests} />
}
