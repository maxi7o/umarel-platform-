'use client'

import { Link as I18nLink } from '@/i18n/routing'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Globe, LogOut, LayoutDashboard, Bell, Menu } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationBell } from '@/components/notifications/notification-bell';
import { useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import { LOCALE_CONFIG } from '@/i18n/config'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavbarProps {
    user?: User | null
}

export function Navbar({ user }: NavbarProps) {
    const t = useTranslations('nav')
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
        <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-6">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="relative h-8 w-8 transition-transform group-hover:scale-105">
                        <Image
                            src="/icon.png"
                            alt="Umarel"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-900">
                        Umarel
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/browse" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        {t('browse')}
                    </Link>
                    <Link href="/create-offering" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        {t('offerServices')}
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <NotificationBell />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
                                <Globe className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {Object.entries(LOCALE_CONFIG).map(([key, { label }]) => (
                                <I18nLink
                                    key={key}
                                    href={pathname}
                                    locale={key}
                                    onClick={() => sessionStorage.setItem('manualLanguageSwitch', 'true')}
                                >
                                    <DropdownMenuItem>
                                        {currentLocale === key ? '✓ ' : ''}{label}
                                    </DropdownMenuItem>
                                </I18nLink>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 border border-gray-200 bg-gray-50">
                                    <span className="text-sm font-semibold text-gray-700">
                                        {user.email?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="px-2 py-1.5 text-xs font-medium text-gray-500 truncate border-b mb-1">
                                    {user.email}
                                </div>
                                <Link href="/wallet">
                                    <DropdownMenuItem>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        {t('dashboard')}
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    {t('logout')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" className="text-gray-600">{t('login')}</Button>
                            </Link>
                            <Link href="/requests/create">
                                <Button className="bg-gray-900 hover:bg-black text-white">{t('postNeed')}</Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <div className="flex flex-col gap-4 mt-8">
                                    <Link href="/browse" className="text-lg font-medium">
                                        {t('browse')}
                                    </Link>
                                    <Link href="/create-offering" className="text-lg font-medium">
                                        {t('offerServices')}
                                    </Link>
                                    {!user && (
                                        <>
                                            <hr className="my-2" />
                                            <Link href="/login" className="text-lg font-medium">
                                                {t('login')}
                                            </Link>
                                            <Link href="/requests/create">
                                                <Button className="w-full">{t('postNeed')}</Button>
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
