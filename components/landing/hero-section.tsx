'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Shovel, CheckCircle2, Bot, DollarSign, MapPin, Eye, TrendingUp, Users, ShieldCheck, Layers, Star } from 'lucide-react';
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 border border-stone-300 mb-6">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                        <span className="text-sm font-bold text-stone-900 tracking-wide uppercase">
                            {t('availableIn')}
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 font-archivo leading-[1.1] mb-6">
                        {t('heroTitle1')} <br />
                        <span className="text-stone-900">
                            {t('heroTitleHighlight')}
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-8">
                        {t('heroSubtitle')}
                    </p>

                    {/* Main CTAs - Single CTA now */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <Link href="/requests/create">
                            <Button size="lg" className="w-full sm:w-auto min-h-[3.5rem] h-auto py-3 px-8 text-lg bg-stone-900 hover:bg-stone-800 text-white rounded-full font-bold shadow-xl shadow-stone-300 transition-all hover:scale-105">
                                {t('postRequest')}
                                <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
                            </Button>
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

                {/* Three Roles Section - STREAMLINED */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-archivo mb-3">
                            Tres Roles, Una Plataforma
                        </h2>
                        <p className="text-lg text-slate-600">
                            Elegí cómo querés participar
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Role 1: CLIENT */}
                        <Link href="/requests/create">
                            <div className="group bg-white hover:bg-stone-50 p-5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-all cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-0.5">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-base font-bold text-stone-900">Querés solicitar un servicio</h3>
                                </div>
                                <ul className="space-y-2 mb-3">
                                    <li className="flex items-center gap-2 text-xs text-slate-600">
                                        <div className="w-1 h-1 rounded-full bg-stone-400" />
                                        <span>Definición con IA</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-slate-600">
                                        <div className="w-1 h-1 rounded-full bg-stone-400" />
                                        <span>Pagá contra avance</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-slate-600">
                                        <div className="w-1 h-1 rounded-full bg-stone-400" />
                                        <span>Dinero en garantía</span>
                                    </li>
                                </ul>
                                <div className="flex items-center text-stone-900 font-medium text-xs group-hover:gap-1 transition-all">
                                    <span>Empezar</span>
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </Link>

                        {/* Role 2: PROVIDER */}
                        <Link href="/create-offering">
                            <div className="group bg-white hover:bg-stone-50 p-5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-all cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-0.5">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center flex-shrink-0">
                                        <Shovel className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-base font-bold text-stone-900">Ofrecés servicios</h3>
                                </div>
                                <ul className="space-y-2 mb-3">
                                    <li className="flex items-center gap-2 text-xs text-slate-600">
                                        <div className="w-1 h-1 rounded-full bg-stone-400" />
                                        <span>Cobro por etapas</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-slate-600">
                                        <div className="w-1 h-1 rounded-full bg-stone-400" />
                                        <span>Sin visitas en vano</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-slate-600">
                                        <div className="w-1 h-1 rounded-full bg-stone-400" />
                                        <span>Reputación pública</span>
                                    </li>
                                </ul>
                                <div className="flex items-center text-stone-900 font-medium text-xs group-hover:gap-1 transition-all">
                                    <span>Ofrecer</span>
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </Link>

                        {/* Role 3: ENTENDIDO */}
                        <Link href="/browse">
                            <div className="group bg-white hover:bg-stone-50 p-5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-all cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-0.5">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-base font-bold text-stone-900">Tenés experiencia</h3>
                                </div>
                                <ul className="space-y-2 mb-3">
                                    <li className="flex items-center gap-2 text-xs text-slate-600">
                                        <div className="w-1 h-1 rounded-full bg-stone-400" />
                                        <span>Validá presupuestos</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-slate-600">
                                        <div className="w-1 h-1 rounded-full bg-stone-400" />
                                        <span>Monetizá conocimiento</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-slate-600">
                                        <div className="w-1 h-1 rounded-full bg-stone-400" />
                                        <span>Validación por pares</span>
                                    </li>
                                </ul>
                                <div className="flex items-center text-stone-900 font-medium text-xs group-hover:gap-1 transition-all">
                                    <span>Explorar</span>
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
