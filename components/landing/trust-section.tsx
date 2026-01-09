'use client';

import Image from 'next/image';
import { ShieldCheck, Eye, Lock } from 'lucide-react';

export function TrustSection() {
    const features = [
        {
            icon: <Lock className="w-8 h-8 text-blue-600" />,
            title: "Pagos en Escrow",
            desc: "Tu dinero queda protegido en una cuenta segura hasta que vos apruebes el trabajo. Sin sorpresas."
        },
        {
            icon: <Eye className="w-8 h-8 text-orange-600" />,
            title: "Verificación Umarel",
            desc: "Nuestros 'abuelos de obra' (IA o humanos) verifican la calidad antes de liberar cualquier pago."
        },
        {
            image: "/landing/mercadopago.png",
            title: "Integrado con Mercado Pago",
            desc: "Pagá con tus medios favoritos de Argentina. Tarjetas, débito o dinero en cuenta.",
            isImage: true
        }
    ];

    return (
        <section className="py-24 bg-white border-b border-stone-100">
            <div className="container mx-auto px-6">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 font-outfit mb-4">
                        Confianza construida en cada ladrillo.
                    </h2>
                    <p className="text-lg text-slate-600">
                        Eliminamos la incertidumbre de las reformas. Tecnología de punta con la calidez de barrio.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-stone-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-stone-100">
                                {feature.isImage ? (
                                    <div className="relative w-12 h-12">
                                        <Image
                                            src={feature.image!}
                                            alt={feature.title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                ) : (
                                    feature.icon
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed max-w-sm">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
