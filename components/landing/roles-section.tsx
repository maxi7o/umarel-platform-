'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function RolesSection() {
    const t = useTranslations('home');

    return (
        <section id="roles" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit mb-4 text-slate-900">{t('rolesTitle')}</h2>
                    <p className="text-lg text-stone-500">{t('rolesSubtitle')}</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">

                    {/* Client */}
                    <div className="group relative bg-white p-8 rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-stone-200/80 transition-all duration-300 hover:-translate-y-2">
                        <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 font-outfit text-slate-900">{t('roleClientTitle')}</h3>
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 font-outfit text-white">{t('roleUmarelTitle')}</h3>
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 font-outfit text-slate-900">{t('roleProviderTitle')}</h3>
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
