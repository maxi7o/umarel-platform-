"use client";

import { useTranslations } from "next-intl";

export function ItalianQuotes() {
    const t = useTranslations('landing.italianQuotes');

    // We'll iterate manually or use raw, but let's stick to manual keys if known, 
    // or just hardcode a few specific ones if the keys aren't an array in existing json structure.
    // In messages/es.json it's keys "q1"..."q5".
    const quotes = [
        t('q1'),
        t('q2'),
        t('q3'),
        t('q4'),
        t('q5')
    ];

    return (
        <section className="bg-orange-600 overflow-hidden py-3 border-y-4 border-stone-900">
            <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
                {/* Tripled for seamless loop */}
                {[...quotes, ...quotes, ...quotes].map((quote, i) => (
                    <span key={i} className="text-white text-xl md:text-2xl font-hand font-bold tracking-wide italic opacity-90">
                        {quote} <span className="mx-4 not-italic opacity-50">✦</span>
                    </span>
                ))}
            </div>
        </section>
    );
}
