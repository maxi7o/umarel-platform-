'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TrattoriaHero() {
    const t = useTranslations('home');
    const tTrattoria = useTranslations('landing.trattoria');

    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-[#FFF8F0] via-[#FFF0E0] to-[#FFF8F0]">

            {/* Decorative checkered pattern overlay */}
            <div className="absolute inset-0 bg-checkered opacity-40" />

            {/* Warm glow circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D62828] rounded-full blur-3xl opacity-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#52B788] rounded-full blur-3xl opacity-10" />

            <div className="container relative z-10 py-20 md:py-32">

                {/* Welcome Banner */}
                <div className="text-center mb-8">
                    <div className="inline-block bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-[#E76F51] shadow-lg">
                        <p className="text-[#D62828] font-semibold text-sm md:text-base flex items-center gap-2">
                            <span className="text-2xl">🍝</span>
                            {tTrattoria('welcome')}
                            <span className="text-2xl">🍷</span>
                        </p>
                    </div>
                </div>

                {/* Main Hero Content */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#3D2817] leading-tight">
                        {t('heroTitle')}{' '}
                        {t('heroTitleLine2Pre')}
                        <span className="relative inline-block">
                            <span className="text-[#D62828]">{t('heroTitleHighlight')}</span>
                            <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                                <path d="M2 10C50 5 150 5 198 10" stroke="#E76F51" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </span>
                        {t('heroTitleLine2Post')}
                    </h1>

                    <p className="text-xl md:text-2xl text-[#6C5B4D] mb-12 leading-relaxed max-w-3xl mx-auto">
                        {t('heroSubtitle')}
                    </p>

                    {/* Primary CTAs - Large and accessible */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        <Link href="/requests/create">
                            <Button
                                size="lg"
                                className="bg-[#D62828] hover:bg-[#B91C1C] text-white text-lg px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group w-full sm:w-auto"
                            >
                                <span className="text-2xl mr-2">🔍</span>
                                {t('postNeed')}
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>

                        <Link href="/create-offering">
                            <Button
                                size="lg"
                                className="bg-[#52B788] hover:bg-[#40916C] text-white text-lg px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group w-full sm:w-auto"
                            >
                                <span className="text-2xl mr-2">🛠️</span>
                                {tTrattoria('offerServices')}
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    {/* Secondary CTA */}
                    <Link href="/browse">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-2 border-[#E76F51] text-[#E76F51] hover:bg-[#E76F51] hover:text-white text-lg px-8 py-6 rounded-2xl transition-all duration-300 hover:scale-105"
                        >
                            <span className="text-2xl mr-2">🌍</span>
                            {tTrattoria('exploreCommunity')}
                        </Button>
                    </Link>
                </div>

                {/* Trust Indicators - Like ingredients on the table */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {[
                        { icon: '🔒', label: tTrattoria('secureEscrow'), color: 'bg-[#D62828]' },
                        { icon: '⭐', label: tTrattoria('verifiedExperts'), color: 'bg-[#52B788]' },
                        { icon: '💰', label: tTrattoria('fairPricing'), color: 'bg-[#E76F51]' },
                        { icon: '🤝', label: tTrattoria('communityTrust'), color: 'bg-[#F4A261]' },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border-2 border-[#E8D5C4] text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="text-4xl mb-2">{item.icon}</div>
                            <p className="text-sm font-semibold text-[#3D2817]">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
