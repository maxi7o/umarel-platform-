import { Metadata } from 'next';

interface SEOConfig {
    title: string;
    description: string;
    keywords?: string[];
    canonical?: string;
    ogImage?: string;
    ogType?: 'website' | 'article' | 'profile';
    twitterCard?: 'summary' | 'summary_large_image';
    noindex?: boolean;
}

export function generateSEOMetadata(config: SEOConfig): Metadata {
    const {
        title,
        description,
        keywords = [],
        canonical,
        ogImage = '/og-image.jpg',
        ogType = 'website',
        twitterCard = 'summary_large_image',
        noindex = false
    } = config;

    const siteName = 'El Entendido';
    const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elentendido.ar';
    const canonicalUrl = canonical || baseUrl;

    return {
        title: fullTitle,
        description,
        keywords: keywords.join(', '),
        authors: [{ name: siteName }],
        creator: siteName,
        publisher: siteName,
        robots: noindex ? 'noindex, nofollow' : 'index, follow',
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: fullTitle,
            description,
            url: canonicalUrl,
            siteName,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: 'es_AR',
            type: ogType,
        },
        twitter: {
            card: twitterCard,
            title: fullTitle,
            description,
            images: [ogImage],
            creator: '@elentendido',
        },
        verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
    };
}

// Predefined SEO configs for common pages
export const SEO_CONFIGS = {
    home: {
        title: 'El Entendido - Plataforma de Servicios Profesionales en Argentina',
        description: 'Conectamos clientes con profesionales verificados. Pagá por hitos completados, con garantía de calidad. Servicios de construcción, desarrollo, diseño y más en Argentina.',
        keywords: [
            'servicios profesionales argentina',
            'contratar profesionales',
            'plataforma freelance argentina',
            'trabajos por proyecto',
            'servicios verificados',
            'construcción argentina',
            'desarrollo web argentina',
            'diseño gráfico argentina',
            'pago seguro',
            'escrow argentina'
        ],
    },
    browse: {
        title: 'Explorar Servicios y Proyectos',
        description: 'Descubrí profesionales verificados y proyectos activos en Argentina. Filtrá por categoría, ubicación y presupuesto. Encontrá el talento perfecto para tu proyecto.',
        keywords: [
            'buscar profesionales',
            'proyectos argentina',
            'servicios freelance',
            'contratar expertos',
            'trabajos disponibles',
            'oportunidades laborales'
        ],
    },
    createRequest: {
        title: 'Publicar Proyecto - Encontrá Profesionales',
        description: 'Publicá tu proyecto gratis y recibí presupuestos de profesionales verificados. Dividí el trabajo en hitos y pagá solo por resultados aprobados.',
        keywords: [
            'publicar proyecto',
            'solicitar presupuesto',
            'contratar profesional',
            'proyecto por hitos',
            'pago seguro'
        ],
    },
    createOffering: {
        title: 'Ofrecer Servicios Profesionales',
        description: 'Registrate como profesional verificado y accedé a proyectos reales. Cobrá seguro por cada hito completado. Sin comisiones ocultas.',
        keywords: [
            'trabajar freelance',
            'ofrecer servicios',
            'profesional independiente',
            'ganar dinero online',
            'trabajos remotos argentina'
        ],
    },
    verify: {
        title: 'Verificación de Identidad',
        description: 'Verificá tu identidad para ofrecer servicios en la plataforma. Proceso rápido y seguro con validación biométrica.',
        keywords: [
            'verificación identidad',
            'kyc argentina',
            'validación biométrica',
            'profesional verificado'
        ],
        noindex: true, // Private page
    },
    login: {
        title: 'Iniciar Sesión',
        description: 'Accedé a tu cuenta de El Entendido. Gestioná tus proyectos, presupuestos y pagos en un solo lugar.',
        keywords: ['login', 'iniciar sesión', 'acceder cuenta'],
        noindex: true,
    },
};
