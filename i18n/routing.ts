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
            es: '/guia',
            en: '/guide'
        },
        '/browse': {
            es: '/explorar',
            en: '/browse'
        },
        '/requests': {
            es: '/iniciativas',
            en: '/requests'
        },
        '/requests/create': {
            es: '/iniciativas/crear',
            en: '/requests/create'
        },
        '/requests/[id]': {
            es: '/iniciativas/[id]',
            en: '/requests/[id]'
        },
        '/create-offering': {
            es: '/crear-talento',
            en: '/create-offering'
        },
        '/login': {
            es: '/ingresar',
            en: '/login'
        },
        '/wallet': {
            es: '/billetera',
            en: '/wallet'
        },
        '/profile/[id]': {
            es: '/perfil/[id]',
            en: '/profile/[id]'
        },
        '/about': {
            es: '/nosotros',
            en: '/about'
        },
        '/terms': {
            es: '/terminos',
            en: '/terms'
        },
        '/privacy': {
            es: '/privacidad',
            en: '/privacy'
        },
        '/wizard/[sliceId]': {
            es: '/asistente/[sliceId]',
            en: '/wizard/[sliceId]'
        },
        '/requests/create-universal': {
            es: '/iniciativas/crear-universal',
            en: '/requests/create-universal'
        },
        '/experiences/create': {
            es: '/experiencias/crear',
            en: '/experiences/create'
        },
        '/admin/dashboard': '/admin/dashboard',
        '/admin/testing': '/admin/testing',
        '/audit': '/audit'
    },
    localePrefix: 'as-needed'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
