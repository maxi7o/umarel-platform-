import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './config';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: SUPPORTED_LOCALES,

    // Used when no locale matches
    defaultLocale: DEFAULT_LOCALE,

    // Localized pathnames
    pathnames: {
        '/': '/',
        '/guide': {
            en: '/guide',
            es: '/guia'
        },
        '/browse': {
            en: '/browse',
            es: '/explorar'
        },
        '/requests/create': '/requests/create',
        '/create-offering': '/create-offering',
        '/login': '/login',
        '/wallet': '/wallet'
    }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
