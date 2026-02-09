'use client';

import Script from 'next/script';

interface OrganizationSchemaProps {
    name?: string;
    url?: string;
    logo?: string;
    description?: string;
}

export function OrganizationSchema({
    name = 'El Entendido',
    url = 'https://elentendido.ar',
    logo = 'https://elentendido.ar/logo.png',
    description = 'Plataforma de servicios profesionales verificados en Argentina. Conectamos clientes con expertos para proyectos de construcción, desarrollo, diseño y más.'
}: OrganizationSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name,
        url,
        logo,
        description,
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'AR',
            addressLocality: 'Buenos Aires',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'soporte@elentendido.ar',
            availableLanguage: ['Spanish', 'English'],
        },
        sameAs: [
            'https://twitter.com/elentendido',
            'https://linkedin.com/company/elentendido',
        ],
    };

    return (
        <Script
            id="organization-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface ServiceSchemaProps {
    name: string;
    description: string;
    provider: string;
    areaServed?: string;
    priceRange?: string;
}

export function ServiceSchema({
    name,
    description,
    provider,
    areaServed = 'Argentina',
    priceRange = '$$'
}: ServiceSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name,
        description,
        provider: {
            '@type': 'Organization',
            name: 'El Entendido',
        },
        areaServed: {
            '@type': 'Country',
            name: areaServed,
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Servicios Profesionales',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name,
                        description,
                    },
                },
            ],
        },
        priceRange,
    };

    return (
        <Script
            id="service-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface BreadcrumbSchemaProps {
    items: Array<{
        name: string;
        url: string;
    }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <Script
            id="breadcrumb-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface FAQSchemaProps {
    questions: Array<{
        question: string;
        answer: string;
    }>;
}

export function FAQSchema({ questions }: FAQSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: answer,
            },
        })),
    };

    return (
        <Script
            id="faq-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
