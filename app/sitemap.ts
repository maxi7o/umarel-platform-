import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elentendido.ar';

    const routes = [
        '',
        '/browse',
        '/create-offering',
        '/requests/create-universal',
        '/audit',
        '/guide',
        '/about',
        '/contact',
        '/terms',
        '/privacy',
    ];

    const locales = ['es', 'en'];

    const staticPages: MetadataRoute.Sitemap = [];

    locales.forEach(locale => {
        routes.forEach(route => {
            staticPages.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: route === '' ? 'daily' : 'weekly',
                priority: route === '' ? 1.0 : route.includes('browse') ? 0.9 : 0.8,
            });
        });
    });

    return staticPages;
}
