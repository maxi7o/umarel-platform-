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
        <nav className="sticky top-0 z-50 bg-slate-950 border-b border-white/10 shadow-xl backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/80">
            <div className="container mx-auto flex h-16 items-center justify-between px-6">

                {/* 1. BRAND IDENTITY */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-8 w-8 transition-transform group-hover:rotate-12 duration-500">
                        <Image
                            src="/icon.png"
                            alt="Umarel"
                            fill
                            className="object-contain invert brightness-0 filter" // Make icon white if it's black, or just use as is if colorful
                        />
                    </div>
                    <span className="font-outfit font-bold text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
                        Umarel
                    </span>
                </Link>

                {/* 2. THE CONTROL DECK (Desktop) */}
                <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 px-2 mx-4">
                    <Link href="/" className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-400 hover:text-white transition-all">
                        {t('home')}
                    </Link>

                    <div className="w-px h-4 bg-white/10 mx-1" />

                    <Link href="/browse" className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-400 hover:text-white transition-all">
                        {t('browse')}
                    </Link>
                </div>

                {/* 3. ACTIONS & PROFILE */}
                <div className="flex items-center gap-4">



                    {/* Notifications (Assuming Dark Mode Compatibility inside component, passing class?) */}
                    <div className="text-white flex items-center gap-2">
                        <ReferralDialog />
                        <NotificationBell />
                    </div>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 p-0 overflow-hidden group">
                                    <span className="text-sm font-semibold text-white group-hover:scale-110 transition-transform">
                                        {user.email?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 bg-slate-900 border-slate-800 text-slate-200 p-2">
                                <div className="px-2 py-2 mb-2">
                                    <p className="text-sm font-medium text-white">{user.email}</p>
                                    <p className="text-xs text-slate-500">Member</p>
                                </div>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <Link href="/wallet">
                                    <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer py-2">
                                        <LayoutDashboard className="mr-2 h-4 w-4 text-blue-400" />
                                        {t('dashboard')}
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem onClick={handleSignOut} className="text-red-400 focus:text-red-300 focus:bg-red-950/30 cursor-pointer py-2">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    {t('logout')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
                                    {t('login')}
                                </Button>
                            </Link>
                            <Link href="/requests/create">
                                <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-900/20 border border-orange-500/50">
                                    {t('postNeed')}
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-slate-950 border-slate-800 text-white">
                                <SheetHeader>
                                    <SheetTitle className="text-left text-white font-outfit text-2xl">Umarel</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-2 mt-8">
                                    <Link href="/#how-it-works" className="px-4 py-3 rounded-lg hover:bg-white/5 text-lg font-medium transition-colors flex items-center justify-between">
                                        {t('howto')}
                                    </Link>
                                    <Link href="/#roles" className="px-4 py-3 rounded-lg hover:bg-white/5 text-lg font-medium transition-colors flex items-center justify-between">
                                        {t('roles')}
                                    </Link>
                                    <Link href="/browse" className="px-4 py-3 rounded-lg hover:bg-white/5 text-lg font-medium transition-colors flex items-center justify-between">
                                        {t('browse')}
                                        <Search size={18} className="text-slate-500" />
                                    </Link>
                                    <Link href="/requests/create" className="px-4 py-3 rounded-lg bg-orange-600/10 text-orange-400 hover:bg-orange-600/20 text-lg font-medium transition-colors flex items-center justify-between">
                                        {t('postNeed')}
                                        <PlusCircle size={18} />
                                    </Link>
                                    <Link href="/create-offering" className="px-4 py-3 rounded-lg hover:bg-white/5 text-lg font-medium transition-colors flex items-center justify-between">
                                        {t('offerServices')}
                                        <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">Pro</Badge>
                                    </Link>

                                    {!user && (
                                        <>
                                            <div className="h-px bg-white/10 my-4" />
                                            <Link href="/login" className="px-4 py-3 rounded-lg hover:bg-white/5 text-lg font-medium">
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
