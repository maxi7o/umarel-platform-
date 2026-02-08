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
import { Badge } from "@/components/ui/badge"

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
    const [pendingKycCount] = await db.select({ value: count() }).from(usersTable).where(eq(usersTable.biometricStatus, 'none'))

    return (
        <div className="space-y-8 pb-10">
            {/* 🌌 Header Area */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent">
                        Command Center
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium italic">
                        "La confianza se construye con transparencia." — El Entendido
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="shadow-sm border-slate-200">
                        <Activity className="mr-2 h-4 w-4 text-emerald-500" /> System Online
                    </Button>
                </div>
            </div>

            {/* 🚀 Strategic KPIs */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-md bg-gradient-to-br from-blue-500/10 to-transparent">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-blue-800">Citizens</CardTitle>
                        <Users className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{userCount.value}</div>
                        <p className="text-xs text-blue-600/60 font-medium">Registros orgánicos</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-gradient-to-br from-amber-500/10 to-transparent">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-amber-800">Pending KYC</CardTitle>
                        <ShieldCheck className="h-5 w-5 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{pendingKycCount.value}</div>
                        <p className="text-xs text-amber-600/60 font-medium font-bold">Por validar Verifik</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-gradient-to-br from-red-500/10 to-transparent">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-red-800">Conflict Tribunal</CardTitle>
                        <Scale className="h-5 w-5 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-red-600">{disputeCount.value}</div>
                        <p className="text-xs text-red-600/60 font-medium">Disputas abiertas</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-gradient-to-br from-emerald-500/10 to-transparent">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-emerald-800">Escrow Total</CardTitle>
                        <Building2 className="h-5 w-5 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-emerald-600">$12,450</div>
                        <p className="text-xs text-emerald-600/60 font-medium">ARS en custodia</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-7">
                {/* 🛠️ Main Operational Tools */}
                <div className="md:col-span-4 space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-orange-500 fill-orange-500" />
                        Operational Tools
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Link href="/admin/scout-queue">
                            <Card className="group hover:scale-[1.02] transition-all cursor-pointer border-slate-100 shadow-sm hover:shadow-md h-full overflow-hidden">
                                <CardHeader className="bg-slate-50/50">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">Scout Engine</CardTitle>
                                        <Zap className="h-4 w-4 text-amber-500 group-hover:animate-pulse" />
                                    </div>
                                    <CardDescription>Review AI-detected leads</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="text-2xl font-bold text-slate-700">{pendingLeadCount.value} New</div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/admin/users">
                            <Card className="group hover:scale-[1.02] transition-all cursor-pointer border-slate-100 shadow-sm hover:shadow-md h-full overflow-hidden">
                                <CardHeader className="bg-slate-50/50">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">Citizen Registry</CardTitle>
                                        <Users className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <CardDescription>Manage IDs & KYC documents</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="text-sm font-semibold text-blue-600">Explore Evidence Store →</div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-emerald-400" />
                                Growth & A/B Tests
                            </h4>
                            <p className="text-slate-400 text-sm mb-6 max-w-md">
                                "Mover los hilos": Configurá el comportamiento del ecosistema para maximizar la tracción orgánica.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Referral Boost</div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold">2.5x Aura</span>
                                        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-none">Active</Badge>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">KYC Enforcement</div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold italic">Soft</span>
                                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-none">Stable</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
                    </div>
                </div>

                {/* 📋 Recent Activity / Sidebar */}
                <div className="md:col-span-3 space-y-6">
                    <Card className="border-slate-100 shadow-sm h-full">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Activity className="h-5 w-5 text-slate-400" />
                                System Heartbeat
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg"><Zap className="h-4 w-4 text-blue-600" /></div>
                                <div className="text-sm">
                                    <p className="font-bold text-slate-800">Verifik API Active</p>
                                    <p className="text-xs text-slate-500">Latency: 145ms</p>
                                </div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg"><Users className="h-4 w-4 text-emerald-600" /></div>
                                <div className="text-sm">
                                    <p className="font-bold text-slate-800">Last Citizen Joined</p>
                                    <p className="text-xs text-slate-500">2 minutes ago</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-wider h-10 border-slate-200">
                                    Download System Log
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
