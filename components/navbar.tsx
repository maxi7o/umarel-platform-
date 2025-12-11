'use client'

import { Link as I18nLink } from '@/i18n/routing'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import { Notifications } from './notifications'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationBell } from '@/components/notifications/notification-bell';
import { MarketBadge } from '@/components/location/market-badge';
import { useTranslations } from 'next-intl'
import { LocationBadge } from '@/components/landing/location-detection';
import { usePathname } from '@/i18n/routing'
import { useParams } from 'next/navigation'

export function Navbar() {
    const t = useTranslations('nav')
    const pathname = usePathname()
    const params = useParams()
    const currentLocale = params.locale as string

    return (
        <nav className="sticky top-0 z-50 border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-6">
                {/* Logo */}
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

                {/* Center: Location Badge */}
                <div className="hidden md:block">
                    <LocationBadge />
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
                                <I18nLink href={pathname} locale="en" onClick={() => sessionStorage.setItem('manualLanguageSwitch', 'true')}>
                                    <DropdownMenuItem>
                                        {currentLocale === 'en' ? '✓ ' : ''}English
                                    </DropdownMenuItem>
                                </I18nLink>
                                <I18nLink href={pathname} locale="es" onClick={() => sessionStorage.setItem('manualLanguageSwitch', 'true')}>
                                    <DropdownMenuItem>
                                        {currentLocale === 'es' ? '✓ ' : ''}Español
                                    </DropdownMenuItem>
                                </I18nLink>
                                <I18nLink href={pathname} locale="it" onClick={() => sessionStorage.setItem('manualLanguageSwitch', 'true')}>
                                    <DropdownMenuItem>
                                        {currentLocale === 'it' ? '✓ ' : ''}Italiano
                                    </DropdownMenuItem>
                                </I18nLink>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Notifications />
                        <Link href="/login">
                            <Button variant="outline">{t('login')}</Button>
                        </Link>
                        <Link href="/requests/create">
                            <Button className="bg-orange-600 hover:bg-orange-700">{t('postNeed')}</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
