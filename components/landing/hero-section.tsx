'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Hammer, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
    const t = useTranslations('home');

    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">

            {/* Main Content */}
            <div className="container relative z-10 px-6 mx-auto max-w-6xl">

                {/* Hero Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 max-w-4xl mx-auto"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-6">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                        <span className="text-sm font-bold text-blue-700 tracking-wide uppercase">
                            {t('availableIn')}
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 font-outfit leading-[1.1] mb-6">
                        {t('heroTitle1')} <br />
                        <span className="text-blue-600">
                            {t('heroTitleHighlight')}
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-8">
                        {t('heroSubtitle')}
                    </p>

                    {/* Main CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <Link href="/requests/create">
                            <Button size="lg" className="w-full sm:w-auto min-h-[3.5rem] h-auto py-3 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-xl shadow-blue-200 transition-all hover:scale-105">
                                {t('postRequest')}
                                <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
                            </Button>
                        </Link>

                        <Link href="/create-offering">
                            <button className="w-full sm:w-auto group flex items-center justify-center gap-3 px-8 min-h-[3.5rem] h-auto py-3 rounded-full border-2 border-slate-200 bg-white hover:bg-slate-50 transition-all font-bold text-slate-700 shadow-sm">
                                <span>{t('offerServices')}</span>
                            </button>
                        </Link>
                    </div>

                    {/* Trust Badge */}
                    <div className="inline-flex items-center gap-4 bg-white px-8 py-4 rounded-full shadow-lg border border-slate-100">
                        <Image
                            src="/landing/mercadopago.png"
                            alt="MercadoPago"
                            width={160}
                            height={40}
                            className="h-8 w-auto"
                        />
                        <span className="text-base font-semibold text-slate-700">Pago Protegido</span>
                    </div>
                </motion.div>

                {/* Three Roles Section - Integrated */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-outfit mb-3">
                            Tres Roles, Una Plataforma
                        </h2>
                        <p className="text-lg text-slate-600">
                            Elegí cómo querés participar
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Role 1: CLIENT */}
                        <Link href="/requests/create">
                            <div className="group bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 p-6 rounded-3xl border-2 border-blue-100 hover:border-blue-300 transition-all cursor-pointer h-full flex flex-col shadow-sm hover:shadow-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Cliente</h3>
                                </div>
                                <p className="text-slate-600 text-sm mb-4 flex-grow">
                                    Tenés un proyecto o reparación para realizar.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm text-slate-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        Pagá contra avance de obra
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        Definición técnica con IA
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        Dinero protegido en garantía
                                    </li>
                                </ul>
                                <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                    <span>Empezar proyecto</span>
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </Link>

                        {/* Role 2: PROVIDER */}
                        <Link href="/create-offering">
                            <div className="group bg-gradient-to-br from-orange-50 to-white hover:from-orange-100 hover:to-orange-50 p-6 rounded-3xl border-2 border-orange-100 hover:border-orange-300 transition-all cursor-pointer h-full flex flex-col shadow-sm hover:shadow-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                                        <Hammer className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Profesional</h3>
                                </div>
                                <p className="text-slate-600 text-sm mb-4 flex-grow">
                                    Ofrecés servicios de construcción o mantenimiento.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm text-slate-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        Cobro liberado al cumplir
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        Sin visitas en vano
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        Tu reputación es tu activo
                                    </li>
                                </ul>
                                <div className="mt-4 flex items-center text-orange-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                    <span>Ofrecer servicios</span>
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </Link>

                        {/* Role 3: ENTENDIDO */}
                        <Link href="/browse">
                            <div className="group bg-gradient-to-br from-yellow-50 to-white hover:from-yellow-100 hover:to-yellow-50 p-6 rounded-3xl border-2 border-yellow-100 hover:border-yellow-300 transition-all cursor-pointer h-full flex flex-col shadow-sm hover:shadow-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Entendido</h3>
                                </div>
                                <p className="text-slate-600 text-sm mb-4 flex-grow">
                                    Tenés experiencia técnica y querés opinar.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm text-slate-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                        Monetizá tu experiencia
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                        Validación por pares
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                        Participación flexible
                                    </li>
                                </ul>
                                <div className="mt-4 flex items-center text-yellow-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                    <span>Ver oportunidades</span>
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
