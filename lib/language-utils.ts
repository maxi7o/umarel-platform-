// Language detection utility
export function detectBrowserLanguage(): string {
    if (typeof window === 'undefined') return 'en';

    const browserLang = navigator.language || (navigator as any).userLanguage;

    // Map browser language codes to our supported locales
    const langMap: Record<string, string> = {
        'en': 'en',
        'en-US': 'en',
        'en-GB': 'en',
        'en-AU': 'en',
        'en-CA': 'en',
        'it': 'it',
        'it-IT': 'it',
        'es': 'es',
        'es-ES': 'es',
        'fr': 'fr',
        'fr-FR': 'fr',
        'de': 'de',
        'de-DE': 'de',
    };

    return langMap[browserLang] || langMap[browserLang.split('-')[0]] || 'en';
}

// Get suggested language based on market
export function getSuggestedLanguage(marketLocale: string): string {
    const localeToLang: Record<string, string> = {
        'it-IT': 'it',
        'en-US': 'en',
        'en-GB': 'en',
        'en-AU': 'en',
        'en-CA': 'en',
        'de-DE': 'de',
        'fr-FR': 'fr',
        'es-ES': 'es',
    };

    return localeToLang[marketLocale] || 'en';
}
