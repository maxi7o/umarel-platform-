import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { MarketProvider } from '@/lib/market-context';
import { RoleSelectorDialog } from '@/components/dialogs/role-selector-dialog';

import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { createClient } from '@/lib/supabase/server';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
import { Instrument_Serif, Caveat } from "next/font/google";
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-serif" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-hand" });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    if (locale === 'es') {
        return {
            title: "El Entendido - Proyectos Claros",
            description: "Plataforma de servicios verificados. Definí tu proyecto, dividilo en etapas y pagá solo por resultados.",
            openGraph: {
                title: "El Entendido - Tu Proyecto Bien Hecho",
                description: "Gestión de proyectos y servicios con garantía de calidad.",
                images: ['https://www.elentendido.ar/slices/slice-thumbnail.png']
            },
            icons: {
                icon: '/icon.svg'
            },
            verification: {
                other: {
                    'facebook-domain-verification': 'japaa9urij6uagxze4jmi2djjvx4jt'
                }
            }
        };
    }

    return {
        title: "El Entendido - Projects Done Right",
        description: "The marketplace where you define projects in clear stages and pay for results.",
        icons: {
            icon: '/icon.svg'
        },
        verification: {
            other: {
                'facebook-domain-verification': 'japaa9urij6uagxze4jmi2djjvx4jt'
            }
        }
    };
}

export const viewport = {
    themeColor: '#ffffff',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Often desired for PWA feeling
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // User is logged in
    }

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                {/* Meta Pixel Code */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1888420661778370');
              fbq('track', 'PageView');
            `,
                    }}
                />
                <noscript>
                    <img
                        height="1"
                        width="1"
                        style={{ display: 'none' }}
                        src="https://www.facebook.com/tr?id=1888420661778370&ev=PageView&noscript=1"
                        alt=""
                    />
                </noscript>
                {/* End Meta Pixel Code */}

                {/* Google Analytics (GA4) */}
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-MEASUREMENT_ID" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MEASUREMENT_ID');
            `,
                    }}
                />
            </head>
            <body
                suppressHydrationWarning
                className={`${inter.variable} ${outfit.variable} ${instrumentSerif.variable} ${caveat.variable} font-sans antialiased min-h-screen flex flex-col`}
            >
                <NextIntlClientProvider messages={messages}>
                    <MarketProvider>
                        <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-black overflow-x-hidden w-full">
                            {/* Desktop Container Constraint */}
                            <div className="w-full max-w-[600px] mx-auto bg-white dark:bg-stone-900 min-h-screen shadow-2xl border-x border-stone-100 dark:border-stone-800 flex flex-col relative overflow-x-hidden">
                                <Navbar user={user} />
                                <main className="flex-grow flex flex-col relative w-full overflow-x-hidden">
                                    {children}
                                </main>
                                <Footer />
                            </div>
                        </div>
                        <Toaster />
                        <WhatsAppButton />
                    </MarketProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
