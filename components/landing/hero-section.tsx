'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
    const t = useTranslations('home');

    return (
        <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">

            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/landing/hero-bg.png"
                    alt="Umarel supervisando obra"
                    fill
                    className="object-cover object-center opacity-60 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-blue-900/30" />
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-md">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </span>
                        <span className="text-sm font-bold text-orange-200 tracking-wide uppercase">
                            {t('availableIn')}
                        </span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white font-outfit leading-[1.1]">
                        {t('heroTitle1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
                            {t('heroTitleHighlight')}
                        </span>
                    </h1>

                    <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                        {t('heroSubtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        <Link href="/requests/create" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-orange-600 hover:bg-orange-700 text-white rounded-full font-bold shadow-lg shadow-orange-900/20 transition-all hover:scale-105">
                                {t('postRequest')}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>

                        <button className="w-full sm:w-auto group flex items-center justify-center gap-3 px-8 h-14 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur transition-all">
                            <PlayCircle className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors" />
                            <span className="text-white font-medium">{t('watchVideo')}</span>
                        </button>
                    </div>

                    <div className="pt-8 flex items-center gap-4 text-sm text-slate-400">
                        <p>{t('steps.trustedBy')}</p>
                        <div className="h-1 w-1 rounded-full bg-slate-600" />
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs text-white`}>
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Trust/Visual Element (Glassmorphism Card) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hidden lg:block relative"
                >
                    {/* Abstract Construction UI Representation */}
                    {/* Stages UI Representation */}
                    <div className="relative p-6 bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
                        {/* Floating Elements */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                        <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />

                        <div className="space-y-4">
                            {/* Stage 1 */}
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 opacity-60">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <div>
                                    <p className="text-white font-bold">{t('steps.stage1.title')}</p>
                                    <p className="text-slate-400 text-xs">{t('steps.stage1.desc')}</p>
                                </div>
                                <div className="ml-auto text-green-400 font-mono text-sm">$0.00</div>
                            </div>

                            {/* Stage 2 (Active) */}
                            <div className="relative transform scale-105 z-10">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20"></div>
                                <div className="relative flex items-center gap-4 p-4 bg-slate-900 rounded-2xl border border-blue-500/30 shadow-xl">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-white font-bold text-sm truncate pr-2">{t('steps.stage2.title')}</p>
                                            <span className="px-2 py-0.5 text-[10px] rounded-full bg-blue-500/20 text-blue-300 font-medium uppercase tracking-wide whitespace-nowrap">
                                                {t('steps.stage2.badge')}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-xs truncate">{t('steps.stage2.desc')}</p>
                                        {/* Progress Bar */}
                                        <div className="mt-2 h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-2/3 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stage 3 */}
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 opacity-40">
                                <div className="w-10 h-10 rounded-full bg-slate-500/20 flex items-center justify-center text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                </div>
                                <div>
                                    <p className="text-white font-bold">{t('steps.stage3.title')}</p>
                                    <p className="text-slate-400 text-xs">{t('steps.stage3.desc')}</p>
                                </div>
                                <div className="ml-auto text-slate-500 font-mono text-sm">$450.00</div>
                            </div>
                        </div>

                        {/* Floating Floater (Toast) */}
                        <div className="absolute -bottom-12 -right-12 z-20 flex items-center gap-3 p-4 bg-slate-900 border border-green-500/30 rounded-xl shadow-2xl max-w-[240px]">
                            <div className="w-10 h-10 rounded bg-green-900/50 flex items-center justify-center text-green-400 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                            </div>
                            <div>
                                <p className="text-green-400 font-bold text-xs uppercase tracking-wide">{t('steps.floater.title')}</p>
                                <p className="text-slate-400 text-[10px] leading-tight">{t('steps.floater.desc')}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
