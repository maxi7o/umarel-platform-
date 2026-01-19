'use client'

import { Link as I18nLink } from '@/i18n/routing'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LogOut, LayoutDashboard, Bell, Menu, PlusCircle, Search } from 'lucide-react'
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
import { usePathname } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import { LOCALE_CONFIG } from '@/i18n/config'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
    user?: User | null
}

export function Navbar({ user }: NavbarProps) {
    const t = useTranslations('nav')
    // Fallback for guide title from guide namespace if key missing in nav
    const tGuide = useTranslations('guide.title').length > 0 ? "How it Works" : "How it Works";

    const pathname = usePathname()
    const params = useParams()
    const currentLocale = params.locale as string
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/80 border-b border-slate-200 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
            <div className="container mx-auto flex h-16 items-center justify-between px-6">

                {/* 1. BRAND IDENTITY */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-8 w-8 transition-transform group-hover:rotate-12 duration-500">
                        <Image
                            src="/icon.png"
                            alt="El Entendido"
                            fill
                            className="object-contain" // Removed invert to show original colors (likely black/orange) on white
                        />
                    </div>
                    <span className="font-outfit font-bold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                        El Entendido
                    </span>
                </Link>

                {/* 2. THE CONTROL DECK (Desktop) */}
                <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200 px-2 mx-4">
                    <Link href="/" className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all">
                        {t('home')}
                    </Link>

                    <div className="w-px h-4 bg-slate-300 mx-1" />

                    <Link href="/browse" className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all">
                        {t('browse')}
                    </Link>
                </div>

                {/* 3. ACTIONS & PROFILE */}
                <div className="flex items-center gap-4">

                    {/* Notifications */}
                    <div className="text-slate-600 flex items-center gap-2">
                        <ReferralDialog />
                        <NotificationBell />
                    </div>

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
                                        <LayoutDashboard className="mr-2 h-4 w-4 text-blue-600" />
                                        {t('dashboard')}
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator className="bg-slate-100" />
                                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer py-2">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    {t('logout')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                                    {t('login')}
                                </Button>
                            </Link>
                            <Link href="/requests/create">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200">
                                    {t('postNeed')}
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-white border-slate-200 text-slate-900">
                                <SheetHeader>
                                    <SheetTitle className="text-left text-slate-900 font-outfit text-2xl">El Entendido</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-2 mt-8">
                                    <Link href="/#how-it-works" className="px-4 py-3 rounded-lg hover:bg-slate-50 text-lg font-medium transition-colors flex items-center justify-between">
                                        {t('howto')}
                                    </Link>
                                    <Link href="/#roles" className="px-4 py-3 rounded-lg hover:bg-slate-50 text-lg font-medium transition-colors flex items-center justify-between">
                                        {t('roles')}
                                    </Link>
                                    <Link href="/browse" className="px-4 py-3 rounded-lg hover:bg-slate-50 text-lg font-medium transition-colors flex items-center justify-between">
                                        {t('browse')}
                                        <Search size={18} className="text-slate-400" />
                                    </Link>
                                    <Link href="/requests/create" className="px-4 py-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-lg font-medium transition-colors flex items-center justify-between">
                                        {t('postNeed')}
                                        <PlusCircle size={18} />
                                    </Link>
                                    <Link href="/create-offering" className="px-4 py-3 rounded-lg hover:bg-slate-50 text-lg font-medium transition-colors flex items-center justify-between">
                                        {t('offerServices')}
                                        <Badge variant="outline" className="border-slate-200 text-slate-500 text-xs">Pro</Badge>
                                    </Link>

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
        </nav>
    )
}
