"use client"

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const TAGLINES: Record<string, string> = {
    'en': 'Connecting wisdom with needs.',
    'it': 'Collegare la saggezza con i bisogni.',
    'es': 'Conectando sabiduría con necesidades.',
    'fr': 'Connecter la sagesse aux besoins.',
    'de': 'Weisheit mit Bedürfnissen verbinden.',
    'pt': 'Conectando sabedoria com necessidades.',
    'ja': '知恵とニーズをつなぐ。',
    'nl': 'Wijsheid verbinden met behoeften.',
    'sv': 'Koppla visdom till behov.',
};

export function Footer() {
    const t = useTranslations('footer');
    const pathname = usePathname();

    // Extract locale from pathname
    const locale = pathname.split('/')[1] || 'en';
    const tagline = TAGLINES[locale] || TAGLINES['en'];

    // Select a random quote from the localization on mount (client-side only for hydration safety)
    const [quote, setQuote] = useState<string>('');
    const quotes = t.raw('quotes') as unknown as string[]; // Access raw array

    useEffect(() => {
        if (Array.isArray(quotes) && quotes.length > 0) {
            setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        }
    }, []);

    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Umarel</h3>
                        <p className="text-sm italic text-stone-400 mb-4">
                            {tagline}
                        </p>
                        <div className="flex gap-4 mb-6">
                            {/* Social Icons - Placeholder SVGs */}
                            <a href="#" className="text-stone-400 hover:text-white transition-colors" aria-label="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                            </a>
                            <a href="#" className="text-stone-400 hover:text-white transition-colors" aria-label="Twitter">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                            </a>
                            <a href="#" className="text-stone-400 hover:text-white transition-colors" aria-label="LinkedIn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                            </a>
                        </div>
                        {quote && (
                            <div className="bg-stone-800/50 p-3 rounded-lg border-l-2 border-orange-500">
                                <p className="text-xs text-orange-200 font-mono">{t('dailyWisdom')}</p>
                                <p className="text-sm italic text-stone-300">"{quote}"</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">{t('platform')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/browse" className="hover:text-white">{t('findWork')}</Link></li>
                            <li><Link href="/#how-it-works" className="hover:text-white">{t('howItWorks')}</Link></li>
                            <li><Link href="/create-offering" className="hover:text-white">{t('becomeUmarel')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">{t('support')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-white">{t('about')}</Link></li>
                            <li><Link href="/faq" className="hover:text-white text-stone-400 hover:text-slate-200">Preguntas Frecuentes</Link></li>
                            <li><Link href="/contact" className="hover:text-white">{t('contact')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">{t('legal')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/legal/terms" className="hover:text-white">{t('terms')}</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-white">{t('privacy')}</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
                    <p>{t('copyright')}</p>
                </div>
            </div>
        </footer>
    );
}
