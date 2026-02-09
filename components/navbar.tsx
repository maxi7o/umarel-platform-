'use client'

import { Link, useRouter, usePathname } from '@/i18n/routing'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LogOut, LayoutDashboard, Bell, Menu, PlusCircle, Search, ShieldAlert, TestTube } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { NotificationBell } from '@/components/notifications/notification-bell';
import { ReferralDialog } from '@/components/growth/referral-dialog';
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { LOCALE_CONFIG } from '@/i18n/config'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
    user?: User | null
}

const ADMIN_EMAILS = ['admin@elentendido.ar', 'maxi7o@gmail.com'];

export function Navbar({ user }: NavbarProps) {
    const t = useTranslations('nav')
    const pathname = usePathname()
    const params = useParams()
    const currentLocale = params.locale as string
    const router = useRouter()
    const supabase = createClient()

    const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/80 border-b border-slate-200 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* 1. BRAND IDENTITY + EXPLORE */}
                    <div className="flex items-center gap-4 sm:gap-8 flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                            <div className="relative h-7 w-7 sm:h-8 sm:w-8 text-stone-900 transition-transform group-hover:rotate-12 duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" /><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" /></svg>
                            </div>
                            <span className="font-archivo font-bold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-stone-900 transition-colors whitespace-nowrap">
                                El Entendido
                            </span>
                        </Link>

                    </div>

                    {/* 2. CENTER NAV (Desktop) */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/browse" className="text-sm font-medium text-slate-600 hover:text-stone-900 transition-colors flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            {t('browse')}
                        </Link>
                        {!user && (
                            <Link href="/audit" className="text-sm font-medium text-slate-600 hover:text-stone-900 transition-colors">
                                {t('roleVerify')}
                            </Link>
                        )}
                    </div>

                    {/* 3. ACTIONS & PROFILE */}
                    <div className="flex items-center gap-2 sm:gap-4">

                        {/* Notifications - Hidden on very small screens */}
                        <div className="hidden sm:flex text-slate-600 items-center gap-2">
                            <ReferralDialog />
                            <NotificationBell />
                        </div>

                        {user && (
                            <Link href="/requests/create-universal">
                                <Button size="sm" className="hidden sm:flex bg-stone-900 hover:bg-stone-800 text-white shadow-md border-0 whitespace-nowrap">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Nuevo Proyecto
                                </Button>
                                <Button size="icon" variant="ghost" className="sm:hidden text-stone-900">
                                    <PlusCircle className="h-6 w-6" />
                                </Button>
                            </Link>
                        )}

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 p-0 overflow-hidden group">
                                        <span className="text-sm font-semibold text-slate-700 group-hover:scale-110 transition-transform">
                                            {user.email?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 bg-white border-slate-200 text-slate-900 p-2 shadow-xl">
                                    <div className="px-2 py-2 mb-2">
                                        <p className="text-sm font-medium text-slate-900">{user.email}</p>
                                        <p className="text-xs text-slate-500">Miembro</p>
                                    </div>
                                    <DropdownMenuSeparator className="bg-slate-100" />
                                    <Link href="/wallet">
                                        <DropdownMenuItem className="focus:bg-slate-50 cursor-pointer py-2">
                                            <LayoutDashboard className="mr-2 h-4 w-4 text-stone-900" />
                                            {t('dashboard')}
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator className="bg-slate-100" />
                                    {isAdmin && (
                                        <>
                                            <DropdownMenuSeparator className="bg-slate-100" />
                                            <Link href="/admin/dashboard">
                                                <DropdownMenuItem className="cursor-pointer py-2 font-bold text-orange-700 focus:bg-orange-50 focus:text-orange-800">
                                                    <ShieldAlert className="mr-2 h-4 w-4" />
                                                    Admin Panel
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link href="/admin/testing">
                                                <DropdownMenuItem className="cursor-pointer py-2 text-stone-500 focus:bg-stone-50">
                                                    <TestTube className="mr-2 h-4 w-4" />
                                                    Test Lab (Roles)
                                                </DropdownMenuItem>
                                            </Link>
                                        </>
                                    )}
                                    <DropdownMenuSeparator className="bg-slate-100" />
                                    <DropdownMenuItem onClick={handleSignOut} className="text-stone-900 focus:text-stone-900 focus:bg-stone-50 cursor-pointer py-2">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        {t('logout')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link href="/login" className="hidden sm:block">
                                    <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium">
                                        {t('login')}
                                    </Button>
                                </Link>

                                {/* Creá - Dropdown for Unauthenticated Users */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-sm font-medium gap-1 hidden sm:flex">
                                            <PlusCircle className="h-4 w-4 text-stone-900" />
                                            Creá
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200 shadow-xl p-1">
                                        <DropdownMenuLabel className="text-xs text-slate-500 font-normal px-2 py-1.5">
                                            ¿Qué querés publicar?
                                        </DropdownMenuLabel>
                                        <Link href="/requests/create-universal">
                                            <DropdownMenuItem className="cursor-pointer py-2.5 px-2 focus:bg-slate-50 rounded-sm">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium text-slate-900 flex items-center gap-2">
                                                        🏗️ Proyecto
                                                    </span>
                                                    <span className="text-xs text-slate-500 pl-6">
                                                        Necesito un servicio (Demand)
                                                    </span>
                                                </div>
                                            </DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuSeparator className="bg-slate-100 my-1" />
                                        <Link href="/experiences/create">
                                            <DropdownMenuItem className="cursor-pointer py-2.5 px-2 focus:bg-slate-50 rounded-sm">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium text-slate-900 flex items-center gap-2">
                                                        🎨 Experiencia
                                                    </span>
                                                    <span className="text-xs text-slate-500 pl-6">
                                                        Ofrezco un servicio (Listing)
                                                    </span>
                                                </div>
                                            </DropdownMenuItem>
                                        </Link>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}

                        {/* Mobile Menu */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900">
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="bg-white border-slate-200 text-slate-900">
                                    <SheetHeader>
                                        <SheetTitle className="text-left text-slate-900 font-archivo text-2xl">El Entendido</SheetTitle>
                                    </SheetHeader>
                                    <div className="flex flex-col gap-2 mt-8">
                                        <Link href="/browse" className="px-4 py-3 rounded-lg hover:bg-slate-50 text-lg font-medium transition-colors flex items-center justify-between">
                                            {t('browse')}
                                            <Search size={18} className="text-slate-400" />
                                        </Link>

                                        {/* Show notifications in mobile menu */}
                                        <div className="sm:hidden px-4 py-3">
                                            <div className="flex items-center gap-4">
                                                <ReferralDialog />
                                                <NotificationBell />
                                            </div>
                                        </div>

                                        {!user && (
                                            <>
                                                <div className="h-px bg-slate-100 my-4" />
                                                <Link href="/login" className="px-4 py-3 rounded-lg hover:bg-slate-50 text-lg font-medium">
                                                    {t('login')}
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
