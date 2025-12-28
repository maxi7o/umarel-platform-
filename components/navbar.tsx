'use client'

import { Link as I18nLink } from '@/i18n/routing'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationBell } from '@/components/notifications/notification-bell';
import { MarketBadge } from '@/components/location/market-badge';
import { useTranslations } from 'next-intl'
import { LocationInitializer } from '@/components/landing/location-detection';
import { usePathname } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import { LOCALE_CONFIG } from '@/i18n/config'

import { User } from '@supabase/supabase-js'
import { LogOut, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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
        <nav className="sticky top-0 z-50 border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-orange-100 dark:border-orange-900">
                        <Image
                            src="/hero-grandpa.png"
                            alt="Umarel Logo"
                            fill
                            className="object-cover"
                            sizes="40px"
                        />
                    </div>
                    <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                        Umarel
                    </span>
                </Link>

                {/* Center: Location Badge (Generic Market + Invisible Initializer) */}
                <div className="hidden md:block">
                    <LocationInitializer />
                    <MarketBadge />
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/browse" className="text-muted-foreground hover:text-foreground transition-colors">
                            {t('browse')}
                        </Link>
                        <Link href="/create-offering" className="text-muted-foreground hover:text-foreground transition-colors">
                            {t('offerServices')}
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Globe className="h-5 w-5" />
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
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <div className="bg-orange-100 text-orange-700 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                                            {user.email?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                                        {user.email}
                                    </div>
                                    <Link href="/wallet">
                                        <DropdownMenuItem>
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            {t('dashboard')}
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        {t('logout')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login">
                                <Button variant="outline">{t('login')}</Button>
                            </Link>
                        )}

                        <Link href="/requests/create">
                            <Button className="bg-orange-600 hover:bg-orange-700">{t('postNeed')}</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
