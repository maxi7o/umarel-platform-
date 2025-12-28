'use client';

import { useTranslations } from 'next-intl';
import { Eye, Hand, Search } from 'lucide-react';

export function UmarelBrief() {
    const t = useTranslations('landing.concept');

    return (
        <section className="py-20 bg-[#fff8f0] border-y border-orange-100/50">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                    {/* Visual / Icon Side */}
                    <div className="relative order-2 md:order-1 flex justify-center">
                        {/* Decorative Rings */}
                        <div className="absolute inset-0 bg-orange-200/20 rounded-full blur-3xl transform scale-75" />

                        <div className="relative z-10 bg-white p-12 rounded-full shadow-xl border-4 border-orange-100 flex flex-col items-center text-center w-64 h-64 justify-center">
                            <span className="text-8xl mb-4 filter drop-shadow-md">👴</span>
                            <div className="text-sm font-mono text-orange-600 tracking-widest uppercase font-bold mt-2">The Umarell</div>
                        </div>

                        {/* Floating "Hands Behind Back" Icon Concept */}
                        <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-orange-100 rotate-12 hidden md:block">
                            <Eye className="w-8 h-8 text-stone-600" />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="order-1 md:order-2 space-y-6">
                        <div>
                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold tracking-wider uppercase rounded-full mb-4">
                                {t('subtitle')}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold font-outfit text-stone-900 leading-tight">
                                {t('title')}
                            </h2>
                        </div>

                        <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                            <p>
                                {t.rich('description', {
                                    strong: (chunks) => <strong className="text-stone-900 font-semibold">{chunks}</strong>
                                })}
                            </p>

                            <div className="pl-6 border-l-4 border-orange-400">
                                <p className="italic text-stone-700">
                                    {t.rich('digital', {
                                        strong: (chunks) => <strong className="text-orange-600 font-semibold">{chunks}</strong>
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
