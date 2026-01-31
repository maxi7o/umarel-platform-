'use client';

import { useTranslations } from 'next-intl';
import { Bot, Layers, Zap, ShieldCheck } from 'lucide-react';

export function HowItWorksSection() {
    const t = useTranslations('landing.howItWorksSteps');

    const steps = [
        {
            icon: <Bot className="w-6 h-6 text-white" />,
            color: "bg-blue-500",
            title: t('step1.title'),
            desc: t('step1.desc')
        },
        {
            icon: <Layers className="w-6 h-6 text-white" />,
            color: "bg-indigo-500",
            title: t('step2.title'),
            desc: t('step2.desc')
        },
        {
            icon: <Zap className="w-6 h-6 text-white" />,
            color: "bg-orange-500",
            title: t('step3.title'),
            desc: t('step3.desc')
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-white" />,
            color: "bg-green-500",
            title: t('step4.title'),
            desc: t('step4.desc')
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-white">
            <div className="container mx-auto px-6">

                <div className="text-center mb-16">
                    <span className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-2 block">{t('subtitle')}</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-outfit">
                        {t('title')}
                    </h2>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-stone-200 -z-10" />

                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative flex flex-col items-center text-center">

                                {/* Step Circle */}
                                <div className={`w-24 h-24 rounded-full ${step.color} border-8 border-white flex items-center justify-center shadow-xl mb-6 transform transition-transform hover:scale-110`}>
                                    {step.icon}
                                </div>

                                <div className="space-y-3 bg-slate-50 p-6 rounded-2xl w-full h-full">
                                    <h3 className="text-xl font-bold text-slate-800">{step.title}</h3>
                                    <p className="text-stone-600 text-sm leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>

                            </div>
                        ))}
                    </div>

                </div>

                {/* Slices & AI Explanation - Simplified */}
                <div className="mt-24 max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">

                        {/* 1. SLICES EXPLANATION */}
                        <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 border-2 border-blue-100">
                            <h3 className="text-2xl font-bold font-outfit text-slate-900 mb-4">
                                {t('slicesFeature.title')}
                            </h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                {t('slicesFeature.description')}
                            </p>

                            <div className="bg-white rounded-xl p-5 border border-blue-200">
                                <p className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">
                                    {t('slicesFeature.exampleTitle')}
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-blue-50 p-3 rounded-lg">
                                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                                        {t('slicesFeature.exampleStep1')}
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-blue-50 p-3 rounded-lg">
                                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                                        {t('slicesFeature.exampleStep2')}
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium text-slate-400 bg-slate-50 p-3 rounded-lg border border-dashed border-slate-300">
                                        <div className="w-6 h-6 rounded-full bg-slate-300 text-white flex items-center justify-center text-xs font-bold">3</div>
                                        {t('slicesFeature.exampleStep3')}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 2. AI ASSISTANT */}
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
                            {/* Bg Effect */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                            <h3 className="text-2xl font-bold font-outfit mb-4 relative z-10">
                                {t('aiFeature.title')}
                            </h3>
                            <p className="text-blue-100 mb-6 leading-relaxed relative z-10">
                                {t('aiFeature.description')}
                            </p>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 relative z-10 space-y-4">
                                <div className="bg-blue-800/50 p-3 rounded-2xl rounded-tr-none shadow-sm border border-blue-700/50">
                                    <p className="text-sm text-blue-100">{t('aiFeature.chatUser')}</p>
                                </div>
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-lg">
                                    <p className="text-sm text-blue-900 font-medium">{t('aiFeature.chatAi')}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
