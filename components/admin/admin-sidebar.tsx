"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Scale, Settings, Building2, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
    {
        title: "Municipio Overview",
        href: "/admin",
        icon: LayoutDashboard
    },
    {
        title: "Citizens (Users)",
        href: "/admin/users",
        icon: Users
    },
    {
        title: "Tribunal (Disputes)",
        href: "/admin/disputes",
        icon: Scale
    },
    {
        title: "Treasury (Finance)",
        href: "/admin/treasury",
        icon: Building2
    },
    {
        title: "Protocol (Settings)",
        href: "/admin/settings",
        icon: Settings
    }
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="w-64 h-screen bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold tracking-wider flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-yellow-500" />
                    MUNICIPIO
                </h1>
                <p className="text-xs text-slate-400 mt-1">Umarel Governance 🏛️</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-slate-800 text-yellow-500 shadow-sm"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.title}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-400 hover:bg-slate-800/50 rounded-md transition-colors">
                    <LogOut className="w-5 h-5" />
                    Leave Office
                </button>
            </div>
        </div>
    )
}
