'use client';

import { useTranslations } from 'next-intl';
import { PencilLine, HandCoins, Hammer, CheckCircle2 } from 'lucide-react';

export function HowItWorksSection() {
    // const t = useTranslations('howItWorks'); 

    const steps = [
        {
            icon: <PencilLine className="w-6 h-6 text-white" />,
            color: "bg-blue-500",
            title: "1. Definí tu Proyecto",
            desc: "Contanos qué necesitás. Nuestro Asistente IA te ayuda a armar un pedido claro y técnico que los profesionales puedan estimar."
        },
        {
            icon: <HandCoins className="w-6 h-6 text-white" />,
            color: "bg-indigo-500",
            title: "2. Recibí Presupuestos",
            desc: "Los 'Creadores' ofertan sobre tu pedido. Compará precios, perfiles y reputación (Aura) sin compromiso."
        },
        {
            icon: <Hammer className="w-6 h-6 text-white" />,
            color: "bg-orange-500",
            title: "3. Manos a la Obra",
            desc: "El profesional trabaja tranquilo sabiendo que el pago está garantizado."
        },
        {
            icon: <CheckCircle2 className="w-6 h-6 text-white" />,
            color: "bg-green-500",
            title: "4. Aprobá y Liberá",
            desc: "Revisá las fotos. Si está todo bien, liberás el pago seguro (Escrow). ¡Todos felices!"
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-stone-50">
            <div className="container mx-auto px-6">

                <div className="text-center mb-16">
                    <span className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-2 block">Paso a Paso</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-outfit">
                        ¿Cómo funciona Umarel?
                    </h2>
                </div>

                <div className="relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-stone-200 -z-10" />

                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative flex flex-col items-center text-center">

                                {/* Step Circle */}
                                <div className={`w-24 h-24 rounded-full ${step.color} border-8 border-stone-50 flex items-center justify-center shadow-xl mb-6 transform transition-transform hover:scale-110`}>
                                    {step.icon}
                                </div>

                                <div className="space-y-3 bg-white p-6 rounded-2xl shadow-sm border border-stone-100 w-full h-full">
                                    <h3 className="text-xl font-bold text-slate-800">{step.title}</h3>
                                    <p className="text-stone-500 text-sm leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>

                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-stone-500 italic">"Es como tener a un tío arquitecto en el bolsillo."</p>
                    </div>

                </div>

            </div>
        </section>
    );
}
