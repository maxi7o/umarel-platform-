"use client";

import { useTranslations } from "next-intl";
import { ScrollText, ShieldCheck, Zap } from "lucide-react";

export function Manifesto() {
    const t = useTranslations('manifesto');

    return (
        <section className="py-20 bg-stone-900 text-stone-100 relative overflow-hidden">
            {/* Blueprint Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-20" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-800 border border-stone-700 text-stone-300 text-sm font-medium mb-6">
                        <ScrollText className="w-4 h-4" />
                        <span>{t('heading.title')}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
                        {t('heading.headlineLine1')}<br />
                        <span className="text-orange-500">{t('heading.headlineLine2')}</span>
                    </h2>
                    <p className="text-xl text-stone-400 font-light leading-relaxed">
                        {t.rich('heading.subheadline', {
                            highlight: (chunks) => <strong className="text-stone-100">{chunks}</strong>
                        })}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 text-left">
                    {/* Pillar 1 */}
                    <div className="p-8 rounded-2xl bg-stone-800/50 border border-stone-700/50 backdrop-blur-sm hover:bg-stone-800 transition-colors">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                            <Zap className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-stone-100">{t('pillars.bandwidth.title')}</h3>
                        <p className="text-stone-400 leading-relaxed">
                            {t('pillars.bandwidth.description')}
                        </p>
                    </div>

                    {/* Pillar 2 */}
                    <div className="p-8 rounded-2xl bg-stone-800/50 border border-stone-700/50 backdrop-blur-sm hover:bg-stone-800 transition-colors">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-6">
                            <ShieldCheck className="w-6 h-6 text-orange-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-stone-100">{t('pillars.judge.title')}</h3>
                        <p className="text-stone-400 leading-relaxed">
                            {t.rich('pillars.judge.description', {
                                bold: (chunks) => <strong className="text-stone-100">{chunks}</strong>
                            })}
                        </p>
                    </div>

                    {/* Pillar 3 */}
                    <div className="p-8 rounded-2xl bg-stone-800/50 border border-stone-700/50 backdrop-blur-sm hover:bg-stone-800 transition-colors">
                        <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6">
                            <span className="text-2xl">🌱</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-stone-100">{t('pillars.growth.title')}</h3>
                        <p className="text-stone-400 leading-relaxed">
                            {t('pillars.growth.description')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
