'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { PencilLine, HandCoins, Hammer, CheckCircle2 } from 'lucide-react';

export function HowItWorksSection() {
    const t = useTranslations('landing.howItWorksSteps');

    const steps = [
        // ... (steps remain unchanged, just ensuring `steps` variable is available)
        {
            icon: <PencilLine className="w-6 h-6 text-white" />,
            color: "bg-blue-500",
            title: t('step1.title'),
            desc: t('step1.desc')
        },
        {
            icon: <HandCoins className="w-6 h-6 text-white" />,
            color: "bg-indigo-500",
            title: t('step2.title'),
            desc: t('step2.desc')
        },
        {
            icon: <Hammer className="w-6 h-6 text-white" />,
            color: "bg-orange-500",
            title: t('step3.title'),
            desc: t('step3.desc')
        },
        {
            icon: <CheckCircle2 className="w-6 h-6 text-white" />,
            color: "bg-green-500",
            title: t('step4.title'),
            desc: t('step4.desc')
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-stone-50">
            <div className="container mx-auto px-6">

                <div className="text-center mb-16">
                    <span className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-2 block">{t('subtitle')}</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-outfit">
                        {t('title')}
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

                    <div className="mt-16 flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                            <Image
                                src="/umarel-mascot.png"
                                alt="Umarel Mascot"
                                width={80}
                                height={80}
                                className="object-contain hover:scale-110 transition-transform duration-300"
                            />
                            {/* Speech Bubble Tail */}
                            <div className="absolute -top-2 left-1/2 -ml-2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-stone-200 hidden" />
                        </div>
                        <div className="bg-white px-6 py-3 rounded-full shadow-sm border border-stone-200 relative">
                            <div className="absolute -top-2 left-1/2 -ml-2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-stone-200"></div>
                            <p className="text-stone-600 italic font-medium text-lg relative z-10">
                                {t('quote')}
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
