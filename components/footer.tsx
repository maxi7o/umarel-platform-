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
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Umarel</h3>
                        <p className="text-sm italic">
                            {tagline}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/browse" className="hover:text-white">Browse Services</Link></li>
                            <li><Link href="/requests/create" className="hover:text-white">Post a Request</Link></li>
                            <li><Link href="/create-offering" className="hover:text-white">Offer Services</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                            <li><Link href="/guidelines" className="hover:text-white">Community Guidelines</Link></li>
                            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                            <li><Link href="/cookie" className="hover:text-white">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
                    <p>&copy; {new Date().getFullYear()} Umarel. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
