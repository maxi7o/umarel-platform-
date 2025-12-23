export const LOCALE_CONFIG = {
    en: { label: 'English' },
    es: { label: 'Español' },
    zh: { label: '中文 (Chinese)' },
    hi: { label: 'हिंदी (Hindi)' },
    ar: { label: 'العربية (Arabic)' },
    pt: { label: 'Português' },
    bn: { label: 'বাংলা (Bengali)' },
    ru: { label: 'Русский (Russian)' },
    ja: { label: '日本語 (Japanese)' },
    de: { label: 'Deutsch' },
    fr: { label: 'Français' },
    ur: { label: 'اردو (Urdu)' },
    id: { label: 'Bahasa Indonesia' },
    tr: { label: 'Türkçe' },
    vi: { label: 'Tiếng Việt' },
    it: { label: 'Italiano' },
    ko: { label: '한국어 (Korean)' },
    pl: { label: 'Polski' },
    uk: { label: 'Українська' },
    nl: { label: 'Nederlands' },
} as const;

export type Locale = keyof typeof LOCALE_CONFIG;

export const SUPPORTED_LOCALES = Object.keys(LOCALE_CONFIG) as Locale[];
export const DEFAULT_LOCALE: Locale = 'en';
