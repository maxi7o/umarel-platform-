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
import { LanguageSwitchPrompt } from '@/components/location/language-switch-prompt';
import { InteractiveTable } from "@/components/layout/interactive-table";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
import { Instrument_Serif, Caveat } from "next/font/google";
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-serif" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-hand" });

export const metadata: Metadata = {
    title: "Umarel - Get things done with wisdom",
    description: "The marketplace where experienced Umarels help you break down tasks.",
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    // Ensure that the incoming `locale` is valid
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${inter.variable} ${outfit.variable} ${instrumentSerif.variable} ${caveat.variable} font-sans antialiased min-h-screen flex flex-col`}>
                <InteractiveTable />
                <NextIntlClientProvider messages={messages}>
                    <MarketProvider>
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                        <Toaster />
                        <LanguageSwitchPrompt />
                    </MarketProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
