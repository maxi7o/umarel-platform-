import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ShieldAlert, CheckCircle } from "lucide-react"

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    // Fetch users sorted by creation date (newest first)
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Citizens Registry</h2>
                    <p className="text-slate-500">Manage the population of Umarel.org</p>
                </div>
                <Button>
                    <Shield className="w-4 h-4 mr-2" />
                    Export Census
                </Button>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Citizen</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Aura Level</TableHead>
                            <TableHead>Savings Gen.</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                            {user.fullName ? user.fullName[0] : '?'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span>{user.fullName || 'Anonymous'}</span>
                                            <span className="text-xs text-slate-400">{user.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? 'bg-slate-900' : ''}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {/* Aura Badge logic */}
                                        <Badge variant="outline" className={`
                                            ${user.auraLevel === 'bronze' ? 'border-orange-200 text-orange-700 bg-orange-50' : ''}
                                            ${user.auraLevel === 'silver' ? 'border-slate-300 text-slate-700 bg-slate-50' : ''}
                                            ${user.auraLevel === 'gold' ? 'border-yellow-300 text-yellow-700 bg-yellow-50' : ''}
                                            ${user.auraLevel === 'diamond' ? 'border-blue-300 text-blue-700 bg-blue-50' : ''}
                                        `}>
                                            {user.auraLevel} ({user.auraPoints})
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    ${(user.totalSavingsGenerated || 0) / 100}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <ShieldAlert className="h-4 w-4 text-slate-400 hover:text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
