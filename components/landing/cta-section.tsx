'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Mail } from 'lucide-react';

export function CtaSection() {
    return (
        <section className="py-24 bg-blue-600 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-white/10 blur-3xl rounded-full" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white font-outfit mb-6">
                    Empezá a arreglar sin vueltas.
                </h2>
                <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
                    Sumate a la comunidad. Pedí tu primer presupuesto o unite como profesional verificado.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                    <Input
                        type="email"
                        placeholder="Tu email (ej. juan@gmail.com)"
                        className="h-14 bg-white border-transparent text-slate-900 placeholder:text-slate-400 rounded-xl"
                    />
                    <Button size="lg" className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold w-full sm:w-auto rounded-xl shadow-lg">
                        Empezar <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                <p className="text-blue-200 text-sm mt-6">
                    Es gratis y seguro.
                </p>
            </div>
        </section>
    );
}
