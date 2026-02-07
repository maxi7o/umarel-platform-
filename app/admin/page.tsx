import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    Users,
    Scale,
    Building2,
    Activity,
    Zap,
    ShieldCheck
} from "lucide-react"
import { db } from "@/lib/db"
import { users as usersTable, disputes, scoutLeads } from "@/lib/db/schema"
import { count, eq } from "drizzle-orm"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Verify Admin Role (Database Check for Security)
    const dbUser = await db.query.users.findFirst({
        where: eq(usersTable.id, user.id),
        columns: { role: true }
    })

    if (dbUser?.role !== 'admin') {
        // Not authorized
        redirect("/")
    }

    // Fetch Quick Stats
    const [userCount] = await db.select({ value: count() }).from(usersTable)
    const [disputeCount] = await db.select({ value: count() }).from(disputes).where(eq(disputes.status, 'open'))
    const [pendingLeadCount] = await db.select({ value: count() }).from(scoutLeads).where(eq(scoutLeads.status, 'pending_review'))

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Command Center</h2>
                    <p className="text-slate-500">Welcome back, Administrator. System status is stable.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Activity className="mr-2 h-4 w-4" /> System Health
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Citizens</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount.value}</div>
                        <p className="text-xs text-muted-foreground">+2% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Disputes</CardTitle>
                        <Scale className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{disputeCount.value}</div>
                        <p className="text-xs text-muted-foreground">Needs immediate attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Leads</CardTitle>
                        <Zap className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{pendingLeadCount.value}</div>
                        <p className="text-xs text-muted-foreground">Scout Agent findings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Treasury Balance</CardTitle>
                        <Building2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">$12,450</div>
                        <p className="text-xs text-muted-foreground">Escrow held active</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions / Tools Grid */}
            <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Operational Tools</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {/* Scout Queue Tool */}
                    <Link href="/admin/scout-queue">
                        <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-l-yellow-400 h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-yellow-500" />
                                    Scout Queue
                                </CardTitle>
                                <CardDescription>
                                    Review and approve AI-detected leads from social media.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-sm font-medium text-yellow-700">
                                    {pendingLeadCount.value > 0 ? (
                                        <span className="flex items-center">
                                            <span className="relative flex h-3 w-3 mr-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                            </span>
                                            {pendingLeadCount.value} leads pending review
                                        </span>
                                    ) : "All caught up"}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Dispute Tool */}
                    <Link href="/admin/disputes">
                        <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-l-red-400 h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Scale className="h-5 w-5 text-red-500" />
                                    Tribunal (Disputes)
                                </CardTitle>
                                <CardDescription>
                                    Adjudicate conflicts and manage fund releases manually.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-medium text-red-700">
                                    {disputeCount.value} active cases
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Users Tool */}
                    <Link href="/admin/users">
                        <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-l-blue-400 h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-500" />
                                    Citizen Registry
                                </CardTitle>
                                <CardDescription>
                                    Manage users, verify identities, and handle bans.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    {/* Role Switcher (Dev Tool) */}
                    <Link href="/admin/role-switcher-page">
                        <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-l-purple-400 h-full opacity-75">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-purple-500" />
                                    Role Simulator
                                </CardTitle>
                                <CardDescription>
                                    Impersonate roles for testing workflows.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                </div>
            </div>
        </div>
    )
}
