
"use client";

import { useEffect, useState } from "react";
import { Quote, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

const SAFETY_TIPS_KEYS = [
    0, 1, 2, 3, 4, 5, 6
];

export function SiteSafetyTips() {
    const t = useTranslations('landing.safetyTips');
    const [index, setIndex] = useState(0);

    // Get the tips using the keys loop method which is standard for array-like structures in next-intl
    // or we can just access them by index if they result in an array, 
    // but type safety usually prefers known keys. 
    // Ideally we would use `t.raw('tips')` casting to string[], but let's be safe.
    // However, since we defined 'tips' as an array in JSON, `t.raw('tips')` is the way.
    const tips = t.raw('tips') as string[];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % tips.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [tips.length]);

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="relative bg-yellow-400 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                {/* Screws */}
                <div className="absolute top-2 left-2 w-3 h-3 bg-stone-800 rounded-full flex items-center justify-center text-[8px] text-stone-400">x</div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-stone-800 rounded-full flex items-center justify-center text-[8px] text-stone-400">x</div>
                <div className="absolute bottom-2 left-2 w-3 h-3 bg-stone-800 rounded-full flex items-center justify-center text-[8px] text-stone-400">x</div>
                <div className="absolute bottom-2 right-2 w-3 h-3 bg-stone-800 rounded-full flex items-center justify-center text-[8px] text-stone-400">x</div>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-black text-yellow-400 px-4 py-1 text-2xl font-black uppercase tracking-widest border-2 border-yellow-400">
                        {t('title')}
                    </div>

                    <div className="bg-white/90 p-4 w-full rotate-[-1deg] shadow-sm">
                        <p className="text-2xl md:text-3xl text-stone-900 font-hand leading-relaxed">
                            "{tips[index]}"
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/60">
                        <AlertTriangle className="w-4 h-4" /> Safety First • Seguridad Primero
                    </div>
                </div>
            </div>
        </div>
    );
}
