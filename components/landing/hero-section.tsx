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

                    {/* Main CTAs - Single CTA now */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <Link href="/requests/create">
                            <Button size="lg" className="w-full sm:w-auto min-h-[3.5rem] h-auto py-3 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-xl shadow-blue-200 transition-all hover:scale-105">
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
                            <div className="group bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 p-6 rounded-3xl border-2 border-blue-100 hover:border-blue-300 transition-all cursor-pointer h-full flex flex-col shadow-sm hover:shadow-xl text-left">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Tenés un proyecto</h3>
                                </div>
                                <ul className="space-y-3 mb-4 flex-grow">
                                    <li className="flex items-start gap-3 text-sm text-slate-700">
                                        <Bot className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                        <span>Definición con IA</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-700">
                                        <Layers className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                        <span>Pagá contra avance</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-700">
                                        <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                        <span>Dinero en garantía</span>
                                    </li>
                                </ul>
                                <div className="mt-2 flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                    <span>Empezar proyecto</span>
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </Link>

                        {/* Role 2: PROVIDER */}
                        <Link href="/create-offering">
                            <div className="group bg-gradient-to-br from-orange-50 to-white hover:from-orange-100 hover:to-orange-50 p-6 rounded-3xl border-2 border-orange-100 hover:border-orange-300 transition-all cursor-pointer h-full flex flex-col shadow-sm hover:shadow-xl text-left">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                                        <Shovel className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Ofrecés servicios</h3>
                                </div>
                                <ul className="space-y-3 mb-4 flex-grow">
                                    <li className="flex items-start gap-3 text-sm text-slate-700">
                                        <DollarSign className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                        <span>Cobro por etapas cumplidas</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-700">
                                        <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                        <span>Sin visitas en vano</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-700">
                                        <Star className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                        <span>Reputación pública</span>
                                    </li>
                                </ul>
                                <div className="mt-2 flex items-center text-orange-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                    <span>Ofrecer servicios</span>
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </Link>

                        {/* Role 3: ENTENDIDO */}
                        <Link href="/browse">
                            <div className="group bg-gradient-to-br from-yellow-50 to-white hover:from-yellow-100 hover:to-yellow-50 p-6 rounded-3xl border-2 border-yellow-100 hover:border-yellow-300 transition-all cursor-pointer h-full flex flex-col shadow-sm hover:shadow-xl text-left">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Tenés experiencia</h3>
                                </div>
                                <ul className="space-y-3 mb-4 flex-grow">
                                    <li className="flex items-start gap-3 text-sm text-slate-700">
                                        <Eye className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                        <span>Validá presupuestos y avances</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-700">
                                        <TrendingUp className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                        <span>Monetizá tu conocimiento</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-700">
                                        <Users className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                        <span>Validación por pares</span>
                                    </li>
                                </ul>
                                <div className="mt-2 flex items-center text-yellow-600 font-semibold text-sm group-hover:gap-2 transition-all">
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
