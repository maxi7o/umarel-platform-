"use client"

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-slate-50 text-slate-500 py-8 border-t border-slate-200 mt-auto">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
                <div className="flex flex-col gap-1 items-start">
                    <div className="flex items-center gap-4">
                        <span className="font-outfit text-slate-900 font-bold">El Entendido</span>
                        <span className="text-slate-400">© 2026</span>
                    </div>
                    <p className="text-[10px] text-slate-400 hidden md:block">
                        Proyectos claros. Pagos seguros con Mercado Pago. Sin costo para publicar.
                    </p>
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
            {/* Mobile Tagline */}
            <div className="container mx-auto px-6 md:hidden text-center mt-4">
                <p className="text-[10px] text-slate-400">
                    Proyectos claros. Pagos seguros con Mercado Pago. Sin costo para publicar.
                </p>
            </div>
        </footer>
    );
}
