"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function TrustHero() {
    const t = useTranslations('landing.trustHero');

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-b from-stone-50 to-white overflow-hidden">
            {/* Background Pattern - Softer, less industrial */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-100/20 via-transparent to-transparent" />

            {/* Container */}
            <div className="container relative z-10 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left: Value Prop */}
                <div className="text-left space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-800 rounded-full text-sm font-bold tracking-wide shadow-sm border border-orange-100">
                        <Users className="w-4 h-4" />
                        {t('tagline')}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold font-heading text-stone-900 leading-[1.1] tracking-tight">
                        {t('title')}
                    </h1>

                    <p className="text-xl md:text-2xl text-stone-600 max-w-lg leading-relaxed border-l-4 border-orange-300 pl-6">
                        {t('subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href="/requests/create">
                            <Button size="lg" className="h-16 px-8 text-lg font-bold bg-stone-900 text-white hover:bg-stone-800 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 w-full sm:w-auto rounded-xl">
                                <ArrowRight className="w-6 h-6 mr-3 text-orange-400" />
                                {t('ctaPrimary')}
                            </Button>
                        </Link>
                        <Link href="/browse">
                            <Button size="lg" variant="outline" className="h-16 px-8 text-lg font-semibold border-2 border-stone-200 hover:border-orange-200 hover:bg-orange-50 bg-white w-full sm:w-auto rounded-xl">
                                <TrendingUp className="w-6 h-6 mr-3 text-stone-400" />
                                {t('ctaSecondary')}
                            </Button>
                        </Link>
                    </div>

                    {/* Social Proof / Stats */}
                    <div className="pt-8 flex items-center gap-6 text-sm font-medium text-stone-500">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center overflow-hidden shadow-sm">
                                    <Image src={`/avatars/avatar-${i}.png`} width={40} height={40} alt="User" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <span className="text-green-600 font-bold block text-lg">100%</span>
                            {t('demoCard.verifiedAudits')}
                        </div>
                    </div>
                </div>

                {/* Right: Dynamic Visual */}
                <div className="relative group perspective-1000 hidden lg:block">
                    {/* The "Experience" Card */}
                    <div className="relative z-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/50 transform rotate-[-1deg] transition-transform duration-700 hover:rotate-0 hover:scale-105">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">🧘‍♀️</div>
                                <div>
                                    <h3 className="font-bold text-stone-900 text-lg">{t('demoCard.header')}</h3>
                                    <p className="text-xs text-stone-500 font-medium">{t('demoCard.meta')}</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 flex items-center gap-1">
                                <ShieldCheck size={12} />
                                {t('demoCard.riskBadge')}
                            </span>
                        </div>

                        {/* Body */}
                        <div className="space-y-4 font-sans text-sm">
                            <div className="flex justify-between items-center text-stone-600">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400" /> {t('demoCard.item1')}</span>
                                <span className="font-semibold">Included</span>
                            </div>
                            <div className="flex justify-between items-center text-stone-600">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400" /> {t('demoCard.item2')}</span>
                                <span className="font-semibold">Included</span>
                            </div>

                            {/* Umarel Insight - Sticky Note Style */}
                            <div className="relative bg-[#fffce8] p-5 my-6 shadow-sm border border-yellow-100 rounded-xl transform rotate-1">
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl shadow-sm shrink-0">✨</div>
                                    <div>
                                        <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1">COMMUNITY VERIFIED</p>
                                        <p className="text-stone-700 text-sm font-medium leading-relaxed">
                                            "{t('demoCard.insightText')}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t('demoCard.fairPrice')}</span>
                                <span className="font-heading text-3xl font-bold text-stone-900">5.0 <span className="text-orange-400 text-lg">★</span></span>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -top-4 -right-4 bg-white text-stone-900 w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-bold shadow-xl border border-stone-100 transform rotate-6 animate-pulse-slow">
                            <span className="text-2xl">🌿</span>
                            <span className="text-[10px] uppercase font-bold text-stone-400">{t('demoCard.savedBadge')}</span>
                        </div>
                    </div>

                    {/* Background Blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-orange-200/30 to-purple-200/30 rounded-full blur-3xl -z-10" />
                </div>
            </div>

            {/* Ticker Bottom */}
            <div className="absolute bottom-0 w-full bg-white/50 backdrop-blur-md border-t border-stone-100 py-3 overflow-hidden flex">
                <div className="animate-marquee whitespace-nowrap flex gap-12 items-center text-stone-500 text-sm font-medium tracking-wide">
                    {/* Repeat content for smooth loop */}
                    {[1, 2, 3].map(i => (
                        <span key={i} className="flex items-center gap-2">
                            <span className="text-orange-400">✨</span> {t('ticker')}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
