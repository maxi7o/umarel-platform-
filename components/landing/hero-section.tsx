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
                            Disponible en Argentina
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
                            <span className="text-white font-medium">Ver cómo funciona</span>
                        </button>
                    </div>

                    <div className="pt-8 flex items-center gap-4 text-sm text-slate-400">
                        <p>Confiado por +2.000 vecinos en Buenos Aires</p>
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
                    <div className="relative p-6 bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
                        {/* Floating Elements */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                        <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-900/60 rounded-2xl border border-white/5">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <div>
                                    <p className="text-white font-bold">Verificación Umarel</p>
                                    <p className="text-slate-400 text-sm">Fondos liberados tras aprobación</p>
                                </div>
                                <div className="ml-auto text-green-400 font-mono font-bold">+$150k</div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-slate-900/60 rounded-2xl border border-white/5 opacity-80">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                                </div>
                                <div>
                                    <p className="text-white font-bold">Reparación de Cañería</p>
                                    <p className="text-slate-400 text-sm">En progreso • Belgrano</p>
                                </div>
                                <div className="ml-auto">
                                    <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-300">Activo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
