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
            title: "Umarel Argentina - Reformas y Servicios Verificados",
            description: "Conectá con profesionales verificados y 'abuelos de obra' que aseguran la calidad. Tu dinero protegido hasta que el trabajo esté terminado.",
            openGraph: {
                title: "Umarel - Construí con Confianza",
                description: "El primer mercado de servicios con verificación experta en Argentina.",
                images: ['/landing/hero-bg.png']
            },
            icons: {
                icon: '/umarel-mascot.png',
                shortcut: '/umarel-mascot.png',
            }
        };
    }

    return {
        title: "Umarel - Get things done with wisdom",
        description: "The marketplace where experienced Umarels help you break down tasks.",
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
            <body
                suppressHydrationWarning
                className={`${inter.variable} ${outfit.variable} ${instrumentSerif.variable} ${caveat.variable} font-sans antialiased min-h-screen flex flex-col`}
            >
                <NextIntlClientProvider messages={messages}>
                    <MarketProvider>
                        <div className="flex flex-col min-h-screen">
                            <Navbar user={user} />
                            <main className="flex-grow">
                                {children}
                            </main>
                            <Footer />
                        </div>
                        <Toaster />
                        <WhatsAppButton />
                        <RoleSelectorDialog />
                    </MarketProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
