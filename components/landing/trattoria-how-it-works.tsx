'use client';

import { useTranslations } from 'next-intl';

export function TrattoriaHowItWorks() {
    const t = useTranslations('home');

    const steps = [
        {
            number: '1',
            emoji: '📝',
            title: t('step1Title'),
            description: t('step1Desc'),
            illustration: '🍝',
            color: 'bg-gradient-to-br from-[#D62828] to-[#B91C1C]',
        },
        {
            number: '2',
            emoji: '👴',
            title: t('step2Title'),
            description: t('step2Desc'),
            illustration: '🔪',
            color: 'bg-gradient-to-br from-[#52B788] to-[#40916C]',
        },
        {
            number: '3',
            emoji: '💰',
            title: t('step3Title'),
            description: t('step3Desc'),
            illustration: '✅',
            color: 'bg-gradient-to-br from-[#E76F51] to-[#D65A3F]',
        },
    ];

    return (
        <section className="py-24 bg-[#FFF8F0] relative overflow-hidden">

            {/* Wood table texture background */}
            <div className="absolute inset-0 opacity-5">
                <div className="bg-wood-texture w-full h-full" />
            </div>

            <div className="container relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <span className="text-6xl">👨‍🍳</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#3D2817] mb-4">
                        {t('howItWorksTitle')}
                    </h2>
                    <p className="text-xl text-[#6C5B4D] max-w-2xl mx-auto">
                        {t('howItWorksSubtitle')}
                    </p>
                </div>

                {/* Steps - Like a recipe */}
                <div className="max-w-5xl mx-auto">
                    {steps.map((step, index) => (
                        <div key={index} className="mb-12 last:mb-0">
                            <div className="flex flex-col md:flex-row items-center gap-8">

                                {/* Step Number Circle */}
                                <div className={`flex-shrink-0 w-24 h-24 ${step.color} rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl relative`}>
                                    <span className="relative z-10">{step.number}</span>
                                    {/* Decorative ring */}
                                    <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-pulse" />
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 bg-white rounded-2xl p-8 border-2 border-[#E8D5C4] shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">

                                    {/* Decorative illustration */}
                                    <div className="absolute top-4 right-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
                                        {step.illustration}
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-3xl">{step.emoji}</span>
                                            <h3 className="text-2xl font-bold text-[#3D2817]">
                                                {step.title}
                                            </h3>
                                        </div>
                                        <p className="text-lg text-[#6C5B4D] leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Connecting line (except for last item) */}
                            {index < steps.length - 1 && (
                                <div className="flex justify-center my-6">
                                    <div className="w-1 h-12 bg-gradient-to-b from-[#E8D5C4] to-transparent rounded-full" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <div className="inline-block bg-white/90 backdrop-blur-sm px-8 py-6 rounded-2xl border-2 border-[#D62828] shadow-xl">
                        <p className="text-[#3D2817] text-lg mb-4">
                            <span className="font-bold text-[#D62828]">{t('simpleMessage')}</span> {t('simpleSubtext')}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-[#6C5B4D]">
                            <span className="text-2xl">🍷</span>
                            <span>{t('joinFamily')}</span>
                            <span className="text-2xl">🍷</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
