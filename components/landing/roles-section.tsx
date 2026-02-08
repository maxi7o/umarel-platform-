'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Briefcase, Eye, Lightbulb } from 'lucide-react';

export function RolesSection() {
    const t = useTranslations('home');

    return (
        <section id="roles" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-archivo mb-4 text-slate-900">{t('rolesTitle')}</h2>
                    <p className="text-lg text-stone-500">{t('rolesSubtitle')}</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">

                    {/* Client */}
                    <div className="group relative bg-white p-8 rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-stone-200/80 transition-all duration-300 hover:-translate-y-2">
                        <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Lightbulb className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 font-archivo text-slate-900">{t('roleClientTitle')}</h3>
                        <p className="text-stone-600 mb-8 leading-relaxed">
                            {t('roleClientDesc')}
                        </p>
                        <div className="pt-6 border-t border-stone-100">
                            <Link href="/requests/create">
                                <span className="text-blue-600 font-bold flex items-center group-hover:gap-2 transition-all">
                                    {t('roleClientAction')} <ArrowRight className="ml-1 h-4 w-4" />
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Entendido (ex-Umarel) */}
                    <div className="group relative bg-green-600 p-8 rounded-[2rem] border border-green-500 shadow-2xl shadow-green-900/20 hover:shadow-green-900/30 transition-all duration-300 hover:-translate-y-2 -mt-4 lg:-mt-8">
                        <div className="h-16 w-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/20">
                            <Eye className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 font-archivo text-white">{t('roleUmarelTitle')}</h3>
                        <p className="text-green-50 mb-8 leading-relaxed">
                            {t('roleUmarelDesc')}
                        </p>
                        <div className="pt-6 border-t border-green-500">
                            <Link href="/browse">
                                <span className="text-white font-bold flex items-center group-hover:gap-2 transition-all">
                                    {t('roleUmarelAction')} <ArrowRight className="ml-1 h-4 w-4" />
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Provider */}
                    <div className="group relative bg-white p-8 rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-stone-200/80 transition-all duration-300 hover:-translate-y-2">
                        <div className="h-16 w-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Briefcase className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 font-archivo text-slate-900">{t('roleProviderTitle')}</h3>
                        <p className="text-stone-600 mb-8 leading-relaxed">
                            {t('roleProviderDesc')}
                        </p>
                        <div className="pt-6 border-t border-stone-100">
                            <Link href="/create-offering">
                                <span className="text-orange-600 font-bold flex items-center group-hover:gap-2 transition-all">
                                    {t('roleProviderAction')} <ArrowRight className="ml-1 h-4 w-4" />
                                </span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
