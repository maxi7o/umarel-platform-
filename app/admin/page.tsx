import { db } from "@/lib/db"
import { users, transactions, requests } from "@/lib/db/schema"
import { count, eq, sum } from "drizzle-orm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, AlertTriangle, Activity } from "lucide-react"

// Force dynamic rendering - don't try to build this at build time
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // Parallel data fetching
    const [userCount] = await db.select({ value: count() }).from(users)
    const [requestCount] = await db.select({ value: count() }).from(requests)
    const [disputeCount] = await db.select({ value: count() }).from(transactions).where(eq(transactions.status, 'disputed'))

    // Revenue mock (or real if transactions exist)
    // In a real app, sum(transactions.platformFee) where status = completed
    const revenue = { value: 0 } // Placeholder for now

    const stats = [
        {
            title: "Total Citizens",
            value: userCount.value,
            icon: Users,
            color: "text-blue-500",
            desc: "Registered users in the platform"
        },
        {
            title: "Total Requests",
            value: requestCount.value,
            icon: Activity,
            color: "text-green-500",
            desc: "Active construction/service needs"
        },
        {
            title: "Active Disputes",
            value: disputeCount?.value || 0,
            icon: AlertTriangle,
            color: "text-red-500",
            desc: "Tribunal cases requiring attention"
        },
        {
            title: "Treasury Revenue",
            value: `$${(revenue.value / 100).toFixed(2)}`,
            icon: DollarSign,
            color: "text-yellow-500",
            desc: "Total platform fees collected"
        }
    ]

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                <p className="text-slate-500">Welcome back to the Municipio, Administrator.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.desc}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity Section (Placeholder) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm border-2 border-dashed rounded-md">
                            No recent activity recorded by the constables.
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Database (Neon)</span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Healthy</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Payments (Stripe)</span>
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Test Mode</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Edge Router</span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
