"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function TrustHero() {
    const t = useTranslations('landing.trustHero');

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center bg-stone-50 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {/* Container */}
            <div className="container relative z-10 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left: Value Prop */}
                <div className="text-left space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-bold tracking-wide shadow-sm border border-orange-200">
                        <Users className="w-4 h-4" />
                        {t('tagline')}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-stone-900 leading-[1.1] tracking-tight">
                        {t('title').split(' ').map((word, i) => (
                            word.toLowerCase().includes('peace') || word.toLowerCase().includes('tranquilidad') ?
                                <span key={i} className="text-orange-600">{word} </span> :
                                <span key={i}>{word} </span>
                        ))}
                    </h1>

                    <p className="text-xl md:text-2xl text-stone-600 max-w-lg leading-relaxed border-l-4 border-orange-500 pl-6">
                        {t('subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href="/requests/create">
                            <Button size="lg" className="h-16 px-8 text-lg font-bold bg-stone-900 text-white hover:bg-stone-800 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 w-full sm:w-auto">
                                <ShieldCheck className="w-6 h-6 mr-3 text-orange-500" />
                                {t('ctaPrimary')}
                            </Button>
                        </Link>
                        <Link href="/browse">
                            <Button size="lg" variant="outline" className="h-16 px-8 text-lg font-semibold border-2 border-stone-200 hover:border-orange-200 hover:bg-orange-50 bg-white w-full sm:w-auto">
                                <TrendingUp className="w-6 h-6 mr-3 text-stone-400" />
                                {t('ctaSecondary')}
                            </Button>
                        </Link>
                    </div>

                    {/* Social Proof / Stats */}
                    <div className="pt-8 flex items-center gap-6 text-sm font-medium text-stone-500">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-stone-200 flex items-center justify-center overflow-hidden">
                                    <Image src={`/avatars/avatar-${i}.png`} width={40} height={40} alt="User" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <span className="text-orange-600 font-bold block text-lg">100%</span>
                            {t('demoCard.verifiedAudits')}
                        </div>
                    </div>
                </div>

                {/* Right: Dynamic Visual */}
                <div className="relative group perspective-1000 hidden lg:block">
                    {/* The "Shield" Card */}
                    <div className="relative z-20 bg-white rounded-2xl shadow-2xl p-6 border border-stone-100 transform rotate-[-2deg] transition-transform duration-700 hover:rotate-0">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">👷‍♂️</div>
                                <div>
                                    <h3 className="font-bold text-stone-900">{t('demoCard.header')}</h3>
                                    <p className="text-xs text-stone-500">{t('demoCard.meta')}</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">{t('demoCard.riskBadge')}</span>
                        </div>

                        {/* Body */}
                        <div className="space-y-4 font-mono text-sm">
                            <div className="flex justify-between items-center opacity-50">
                                <span>{t('demoCard.item1')}</span>
                                <span className="line-through">$450.000</span>
                            </div>
                            <div className="flex justify-between items-center text-stone-400">
                                <span>{t('demoCard.item2')}</span>
                                <span className="line-through">$300.000</span>
                            </div>

                            {/* Umarel Intervention - Handwritten Sticker Style */}
                            <div className="relative bg-[#fefce8] -mx-8 px-8 py-5 my-6 shadow-md border border-yellow-200 transform -rotate-1">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-yellow-200/50 rotate-[-2deg] blur-[1px]" /> {/* Tape effect */}
                                <div className="flex gap-4 items-start">
                                    <Image src="/hero-grandpa.png" width={56} height={56} className="rounded-full bg-stone-100 object-cover border-2 border-white shadow-sm shrink-0" alt="Umarel" />
                                    <div>
                                        <p className="text-sm font-bold text-orange-800 uppercase tracking-wider mb-1 font-sans">{t('demoCard.insightLabel')}</p>
                                        <p className="text-stone-800 text-xl font-hand leading-tight transform rotate-[0.5deg]">
                                            "{t('demoCard.insightText')}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-lg font-bold text-green-600 pt-2 border-t border-stone-100">
                                <span>{t('demoCard.fairPrice')}</span>
                                <span>{t('demoCard.fairPrice')}</span>
                                <span className="font-hand text-2xl">$420.000 <span className="font-sans text-xs font-normal text-stone-400 line-through ml-2">$750.000</span></span>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -top-6 -right-6 bg-green-500 text-white w-24 h-24 rounded-full flex flex-col items-center justify-center font-bold shadow-lg animate-bounce-slow">
                            <span className="text-2xl">-45%</span>
                            <span className="text-xs uppercase">{t('demoCard.savedBadge')}</span>
                        </div>
                    </div>

                    {/* Background Blob */}
                    <div className="absolute top-10 right-10 w-full h-full bg-orange-200/20 rounded-full blur-3xl -z-10" />
                </div>
            </div>

            {/* Ticker Bottom */}
            <div className="absolute bottom-0 w-full bg-stone-900 border-t border-stone-800 py-3 overflow-hidden flex">
                <div className="animate-marquee whitespace-nowrap flex gap-12 items-center text-stone-400 text-sm font-mono tracking-wide">
                    {/* Repeat content for smooth loop */}
                    {[1, 2, 3].map(i => (
                        <span key={i} className="flex items-center gap-2">
                            <span className="text-green-500">●</span> {t('ticker')}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
