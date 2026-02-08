
'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export function BrowseHero() {
    const t = useTranslations('browse');

    return (
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white mb-10 shadow-2xl">
            {/* Background Image / Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900 opacity-90 z-10" />
            <div
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"
                style={{ filter: 'grayscale(50%)' }}
            />

            {/* Content */}
            <div className="relative z-20 px-8 py-16 md:py-24 max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-outfit mb-6 tracking-tight">
                        {t('heroTitle') || "Encontrá el Servicio Perfecto"} <span className="text-orange-400">.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                        {t('heroSubtitle') || "Desde reparaciones rápidas hasta proyectos complejos. Conecta con profesionales verificados y paga seguro."}
                    </p>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent z-20" />
        </div>
    );
}
