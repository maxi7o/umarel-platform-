import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elentendido.ar';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/verify/',
                    '/wallet/',
                    '/dashboard/',
                    '/messages/',
                    '/login',
                    '/forgot-password',
                    '/*?*', // Query parameters (except browse filters)
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/verify/',
                    '/wallet/',
                    '/dashboard/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
