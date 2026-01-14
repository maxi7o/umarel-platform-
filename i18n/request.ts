import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Force use of Spanish for now
    if (!locale || locale !== 'es') {
        locale = 'es';
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
