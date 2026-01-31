'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CtaSection() {
    return (
        <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-white/10 blur-3xl rounded-full" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white font-outfit mb-6">
                    Empezá a trabajar sin vueltas.
                </h2>
                <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
                    Proyectos claros, pagos seguros, y gente de confianza. Todo en una plataforma.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/requests/create">
                        <Button size="lg" className="h-14 px-8 bg-white hover:bg-slate-50 text-blue-600 font-bold w-full sm:w-auto rounded-xl shadow-lg transition-all hover:scale-105">
                            Publicar Proyecto <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/create-offering">
                        <Button size="lg" variant="outline" className="h-14 px-8 bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold w-full sm:w-auto rounded-xl">
                            Ofrecer Servicios
                        </Button>
                    </Link>
                </div>

                <p className="text-blue-200 text-sm mt-6">
                    Sin costo para publicar. Pago protegido con MercadoPago.
                </p>
            </div>
        </section>
    );
}
