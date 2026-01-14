'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { PencilLine, HandCoins, Hammer, CheckCircle2 } from 'lucide-react';

export function HowItWorksSection() {
    const t = useTranslations('landing.howItWorksSteps');

    const steps = [
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

                </div>
            </div>

            {/* NEW: Slices & AI Section */}
            <div className="container mx-auto px-6">
                <div className="mt-24 grid lg:grid-cols-2 gap-12">

                    {/* 1. SLICES EXPLANATION */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-stone-100 flex flex-col">
                        <h3 className="text-2xl font-bold font-outfit text-slate-900 mb-4 flex items-center gap-2">
                            <span className="text-3xl">🍕</span> {t('slicesFeature.title')}
                        </h3>
                        <p className="text-stone-600 mb-6 text-lg">
                            {t('slicesFeature.description')}
                        </p>

                        <div className="bg-stone-50 rounded-xl p-6 border border-stone-200 mt-auto">
                            <p className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide opacity-70">
                                {t('slicesFeature.exampleTitle')}
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-white p-3 rounded-lg shadow-sm">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</div>
                                    {t('slicesFeature.exampleStep1')}
                                </li>
                                <li className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-white p-3 rounded-lg shadow-sm border-l-4 border-green-500">
                                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">2</div>
                                    {t('slicesFeature.exampleStep2')}
                                </li>
                                <li className="flex items-center gap-3 text-sm font-medium text-slate-400 bg-white/50 p-3 rounded-lg border border-dashed border-stone-300">
                                    <div className="w-6 h-6 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center text-xs font-bold">3</div>
                                    {t('slicesFeature.exampleStep3')}
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 2. AI ASSISTANT */}
                    <div className="bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-800 text-white flex flex-col relative overflow-hidden">
                        {/* Bg Effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <h3 className="text-2xl font-bold font-outfit mb-4 flex items-center gap-2 relative z-10">
                            <span className="text-3xl">🤖</span> {t('aiFeature.title')}
                        </h3>
                        <p className="text-slate-300 mb-6 text-lg relative z-10">
                            {t('aiFeature.description')}
                        </p>

                        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mt-auto relative z-10 space-y-4">
                            <div className="bg-slate-800 p-3 rounded-2xl rounded-tr-none self-end ml-8 relative shadow-lg">
                                <p className="text-sm text-slate-200">{t('aiFeature.chatUser')}</p>
                            </div>
                            <div className="bg-purple-600 p-3 rounded-2xl rounded-tl-none mr-8 shadow-lg">
                                <p className="text-sm text-white font-medium">{t('aiFeature.chatAi')}</p>
                            </div>

                            <div className="pt-2">
                                <button className="w-full py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors shadow-lg">
                                    {t('aiFeature.cta')}
                                </button>
                            </div>
                        </div>
                    </div>

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
        </section>
    );
}
