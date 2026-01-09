'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Mail } from 'lucide-react';

export function CtaSection() {
    return (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-orange-500/10 blur-3xl rounded-full" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white font-outfit mb-6">
                    ¿Listo para construir con confianza?
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
                    Unite a la comunidad que está cambiando la forma de hacer reformas en Argentina.
                    Sé de los primeros en probar la experiencia completa.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                    <Input
                        type="email"
                        placeholder="Tu email (ej. juan@gmail.com)"
                        className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                    />
                    <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold w-full sm:w-auto">
                        Unirme <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                <p className="text-slate-500 text-sm mt-6">
                    Sin spam. Solo actualizaciones importantes y acceso anticipado.
                </p>
            </div>
        </section>
    );
}
