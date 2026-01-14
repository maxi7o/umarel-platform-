export const LOCALE_CONFIG = {
    es: { label: 'Español' },
} as const;

export type Locale = keyof typeof LOCALE_CONFIG;

export const SUPPORTED_LOCALES = Object.keys(LOCALE_CONFIG) as Locale[];
export const DEFAULT_LOCALE: Locale = 'es';
