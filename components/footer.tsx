"use client"

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

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

    return (
        <footer className="bg-slate-50 text-slate-500 py-8 border-t border-slate-200 mt-auto">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
                <div className="flex items-center gap-4">
                    <span className="font-outfit text-slate-900 font-bold">El Entendido</span>
                    <span className="text-slate-400">© 2026</span>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/legal/terms" className="hover:text-slate-900 transition-colors">
                        Términos
                    </Link>
                    <Link href="/legal/privacy" className="hover:text-slate-900 transition-colors">
                        Privacidad
                    </Link>
                    <Link href="mailto:soporte@umarel.org" className="hover:text-slate-900 transition-colors">
                        Soporte
                    </Link>
                </div>
            </div>
        </footer>
    );
}
