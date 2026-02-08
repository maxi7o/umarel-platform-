'use client';

import { useTranslations } from 'next-intl';
import { Shield, Heart, Sparkles, Users, Clock, TrendingUp, Award, CheckCircle2 } from 'lucide-react';

export function TrattoriaBenefits() {
    const t = useTranslations('landing.trattoria');

    const benefits = [
        {
            icon: Shield,
            emoji: '🔒',
            title: t('escrowProtection.title'),
            description: t('escrowProtection.description'),
            color: 'from-[#D62828] to-[#B91C1C]',
            bgColor: 'bg-stone-50',
        },
        {
            icon: Heart,
            emoji: '💝',
            title: t('dailyDividends.title'),
            description: t('dailyDividends.description'),
            color: 'from-[#52B788] to-[#40916C]',
            bgColor: 'bg-stone-50',
        },
        {
            icon: Sparkles,
            emoji: '✨',
            title: t('aiWizard.title'),
            description: t('aiWizard.description'),
            color: 'from-[#E76F51] to-[#D65A3F]',
            bgColor: 'bg-stone-50',
        },
        {
            icon: Users,
            emoji: '👥',
            title: t('communityWisdom.title'),
            description: t('communityWisdom.description'),
            color: 'from-[#F4A261] to-[#E89350]',
            bgColor: 'bg-stone-50',
        },
        {
            icon: Award,
            emoji: '🏆',
            title: t('auraReputation.title'),
            description: t('auraReputation.description'),
            color: 'from-[#8B4513] to-[#6B3410]',
            bgColor: 'bg-stone-50',
        },
        {
            icon: CheckCircle2,
            emoji: '✅',
            title: t('proofOfArrival.title'),
            description: t('proofOfArrival.description'),
            color: 'from-[#52B788] to-[#2D6A4F]',
            bgColor: 'bg-stone-900',
        },
        {
            icon: TrendingUp,
            emoji: '📈',
            title: t('fairPricingBenefit.title'),
            description: t('fairPricingBenefit.description'),
            color: 'from-[#D62828] to-[#9D0208]',
            bgColor: 'bg-stone-50',
        },
        {
            icon: Clock,
            emoji: '⏰',
            title: t('milestonePayments.title'),
            description: t('milestonePayments.description'),
            color: 'from-[#E76F51] to-[#C85A3E]',
            bgColor: 'bg-stone-50',
        },
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-white to-[#FFF8F0] relative overflow-hidden">

            {/* Decorative elements */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#52B788] rounded-full blur-3xl opacity-5" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#D62828] rounded-full blur-3xl opacity-5" />

            <div className="container relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <span className="text-6xl">🍽️</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#3D2817] mb-4">
                        {t('benefitsTitle')}
                    </h2>
                    <p className="text-xl text-[#6C5B4D] max-w-2xl mx-auto">
                        {t('benefitsSubtitle')}
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className={`${benefit.bgColor} p-6 rounded-2xl border-2 border-[#E8D5C4] hover:border-[#D62828] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group relative overflow-hidden`}
                        >
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-white/50 rounded-bl-full" />

                            {/* Icon */}
                            <div className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                <span className="text-3xl">{benefit.emoji}</span>
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-bold text-[#3D2817] mb-2">
                                {benefit.title}
                            </h3>
                            <p className="text-sm text-[#6C5B4D] leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom decorative quote */}
                <div className="text-center mt-16">
                    <div className="inline-block bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl border-2 border-[#E76F51] shadow-lg">
                        <p className="text-[#3D2817] italic text-lg">
                            "{t('quote')}"
                        </p>
                        <p className="text-[#6C5B4D] text-sm mt-2">— {t('quoteAuthor')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
