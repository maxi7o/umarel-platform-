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
                        {quote && (
                            <div className="bg-stone-800/50 p-3 rounded-lg border-l-2 border-orange-500">
                                <p className="text-xs text-orange-200 font-mono">Daily Wisdom:</p>
                                <p className="text-sm italic text-stone-300">"{quote}"</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">{t('platform')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/browse" className="hover:text-white">{t('findWork')}</Link></li>
                            <li><Link href="/requests/create" className="hover:text-white">{t('howItWorks')}</Link></li>
                            <li><Link href="/create-offering" className="hover:text-white">{t('becomeUmarel')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">{t('support')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/help" className="hover:text-white">{t('helpCenter')}</Link></li>
                            <li><Link href="/guidelines" className="hover:text-white">{t('guidelines')}</Link></li>
                            <li><Link href="/contact" className="hover:text-white">{t('contact')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">{t('legal')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/terms" className="hover:text-white">{t('terms')}</Link></li>
                            <li><Link href="/privacy" className="hover:text-white">{t('privacy')}</Link></li>
                            <li><Link href="/cookie" className="hover:text-white">{t('cookie')}</Link></li>
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
