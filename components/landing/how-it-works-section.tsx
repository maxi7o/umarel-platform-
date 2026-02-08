'use client';

import { useTranslations } from 'next-intl';
import { Bot, Layers, Zap, ShieldCheck, Sparkles } from 'lucide-react';

export function HowItWorksSection() {
    const t = useTranslations('landing.howItWorksSteps');

    const steps = [
        {
            id: "01",
            icon: <Bot className="w-8 h-8 text-stone-900" />,
            title: t('step1.title'),
            desc: t('step1.desc')
        },
        {
            id: "02",
            icon: <Layers className="w-8 h-8 text-stone-900" />,
            title: t('step2.title'),
            desc: t('step2.desc')
        },
        {
            id: "03",
            icon: <Zap className="w-8 h-8 text-stone-900" />,
            title: t('step3.title'),
            desc: t('step3.desc')
        },
        {
            id: "04",
            icon: <ShieldCheck className="w-8 h-8 text-stone-900" />,
            title: t('step4.title'),
            desc: t('step4.desc')
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-white border-b border-stone-200">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-20">
                    <span className="text-stone-500 font-medium uppercase tracking-widest text-xs mb-3 block">
                        Paso a Paso
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-stone-900 font-heading tracking-tight mb-6">
                        {t('title')}
                    </h2>
                    <p className="text-xl text-stone-600 max-w-2xl mx-auto font-light">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Steps Grid - Swiss Brutalism Style */}
                <div className="grid md:grid-cols-4 gap-8 mb-24">
                    {steps.map((step, idx) => (
                        <div key={idx} className="group relative flex flex-col p-6 border border-stone-200 hover:border-stone-900 transition-colors duration-300 bg-stone-50/50 hover:bg-white min-h-[320px]">
                            {/* Number Background */}
                            <span className="absolute top-2 right-4 text-8xl font-black text-stone-100/80 group-hover:text-stone-100 transition-colors select-none -z-10 font-heading">
                                {step.id}
                            </span>

                            <div className="flex-1 flex flex-col justify-end">
                                <div className="mb-6 p-3 bg-white border border-stone-200 w-fit rounded-none shadow-sm group-hover:shadow-md transition-all">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-3 font-heading border-b-2 border-transparent group-hover:border-stone-900 w-fit transition-all pb-1">
                                    {step.title}
                                </h3>
                                <p className="text-stone-600 text-sm leading-relaxed font-medium">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* AI Explanation - High Contrast Box */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-stone-950 text-stone-50 rounded-sm p-8 md:p-12 relative overflow-hidden ring-1 ring-stone-900 shadow-2xl">

                        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">

                            {/* Left: Text */}
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-stone-400">
                                    <Sparkles className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Potenciado por IA</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold font-heading mb-4 text-white">
                                    {t('aiFeature.title')}
                                </h3>
                                <p className="text-stone-400 font-medium leading-relaxed mb-6">
                                    {t('aiFeature.description')}
                                </p>
                            </div>

                            {/* Right: Code/Chat Mockup */}
                            <div className="bg-stone-900 rounded-sm border border-stone-800 p-4 font-mono text-xs shadow-inner">
                                <div className="flex gap-1.5 mb-4 border-b border-stone-800 pb-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-stone-700"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-stone-700"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-stone-700"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-stone-500">
                                        <span className="text-green-500 font-bold">$ user: </span>
                                        "{t('aiFeature.chatUser')}"
                                    </div>
                                    <div className="text-stone-300 pl-4 border-l-2 border-stone-700">
                                        <span className="text-purple-400 font-bold">AI: </span>
                                        {t('aiFeature.chatAi')}
                                    </div>
                                    <div className="animate-pulse flex gap-1 items-center mt-2 pl-4">
                                        <div className="w-1.5 h-4 bg-stone-500"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
