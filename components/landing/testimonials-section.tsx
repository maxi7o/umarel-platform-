'use client';

import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function TestimonialsSection() {
    const testimonials = [
        {
            name: "Carlos M.",
            role: "Vecino de Caballito",
            quote: "Tenía una humedad hace meses. Umarel me ayudó a definir bien el trabajo y el albañil que vino fue un fenómeno. Pagué recién cuando vi la pared seca.",
            rating: 5,
            avatar: "C"
        },
        {
            name: "Roberto S.",
            role: "Gasista Matriculado",
            quote: "Lo mejor para mí es el pago seguro. Ya no tengo que andar persiguiendo clientes para cobrar. Hago el laburo, subo la foto y cobro.",
            rating: 5,
            avatar: "R"
        },
        {
            name: "Antonio V.",
            role: "Umarel (Jubilado)",
            quote: "Toda la vida trabajé en obra. Ahora uso mi experiencia para ayudar a otros a que no los estafen. Y de paso, me mantengo activo.",
            rating: 5,
            avatar: "A"
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-outfit mb-4">
                        Lo que dicen nuestros vecinos
                    </h2>
                    <p className="text-stone-500 text-lg">
                        Historias reales de personas conectadas por la confianza.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((t, idx) => (
                        <Card key={idx} className="h-full border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="flex flex-col p-6 h-full">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star key={i} size={16} className="fill-orange-400 text-orange-400" />
                                    ))}
                                </div>
                                <blockquote className="text-stone-700 italic flex-grow mb-6 leading-relaxed">
                                    "{t.quote}"
                                </blockquote>
                                <div className="flex items-center gap-3 mt-auto">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                                        <div className="text-stone-500 text-xs">{t.role}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    );
}
