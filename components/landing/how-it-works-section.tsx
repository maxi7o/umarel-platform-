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

                {/* AI Explanation - Simplified & Centered */}
                <div className="mt-20 max-w-3xl mx-auto">
                    {/* AI ASSISTANT */}
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                        {/* Bg Effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold font-outfit mb-3 relative z-10">
                                {t('aiFeature.title')}
                            </h3>
                            <p className="text-blue-100 relative z-10 font-medium text-lg max-w-lg mx-auto">
                                {t('aiFeature.description')}
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 relative z-10 space-y-4 shadow-inner max-w-xl mx-auto">
                            <div className="bg-blue-800/60 p-4 rounded-2xl rounded-tr-none shadow-sm border border-blue-700/50 flex items-start gap-4">
                                <span className="text-xl mt-1">🧠</span>
                                <p className="text-sm text-blue-50 font-medium leading-relaxed italic">"{t('aiFeature.chatUser')}"</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-lg flex items-start gap-4">
                                <span className="text-xl mt-1">🤖</span>
                                <p className="text-sm text-blue-900 font-bold leading-relaxed">{t('aiFeature.chatAi')}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
