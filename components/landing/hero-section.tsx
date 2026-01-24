'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
    const t = useTranslations('home');

    return (
        <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-50">

            {/* Background Image with Light Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/landing/hero-bg.png"
                    alt="Trabajo en casa"
                    fill
                    className="object-cover object-center opacity-40 mix-blend-multiply"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 via-white/80 to-blue-50/50" />
            </div>

            <div className="container relative z-10 px-6 mx-auto grid lg:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8 max-w-2xl"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                        <span className="text-sm font-bold text-blue-700 tracking-wide uppercase">
                            {t('availableIn')}
                        </span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 font-outfit leading-[1.1]">
                        {t('heroTitle1')} <br />
                        <span className="text-blue-600">
                            {t('heroTitleHighlight')}
                        </span>
                    </h1>

                    <div className="text-lg text-slate-600 leading-relaxed max-w-lg space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <CheckCircle2 size={16} />
                            </div>
                            <p>{t('heroSteps.step1')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <CheckCircle2 size={16} />
                            </div>
                            <p>{t('heroSteps.step2')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <CheckCircle2 size={16} />
                            </div>
                            <p>{t('heroSteps.step3')}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        <Link href="/requests/create" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto min-h-[3.5rem] h-auto py-3 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-xl shadow-blue-200 transition-all hover:scale-105 border-0 whitespace-normal text-center leading-tight">
                                {t('postRequest')}
                                <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
                            </Button>
                        </Link>

                        <Link href="/create-offering" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto group flex items-center justify-center gap-3 px-8 min-h-[3.5rem] h-auto py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all font-bold text-slate-600 shadow-sm whitespace-normal text-center leading-tight">
                                <span>{t('offerServices')}</span>
                            </button>
                        </Link>
                    </div>

                    <div className="pt-8 flex items-center gap-4 text-sm text-slate-500">
                        <p>{t('steps.trustedBy')}</p>
                    </div>
                </motion.div>

                {/* Right Side: Trust/Visual Element (Simple Card) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hidden lg:block relative"
                >
                    {/* Simplified Visual Element: The Perfect Slice */}
                    <div className="relative p-8 px-12 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100/60 rotate-2 hover:rotate-0 transition-transform duration-500">

                        {/* Main Trust Indicator */}
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-2 shadow-inner">
                                <ShieldCheck size={40} className="text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 font-outfit">Slice #1: Completada</h3>
                                <p className="text-slate-500 mt-2 max-w-[220px] mx-auto text-sm">
                                    Evidencia presente. Valor entregado. Vos decidís si seguimos.
                                </p>
                            </div>
                        </div>

                        {/* Floating Badge - Safeword */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 py-3 px-6 rounded-full shadow-xl flex items-center gap-3 whitespace-nowrap min-w-max">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                            <span className="text-sm font-bold text-white tracking-wide">Control: TOTAL</span>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
