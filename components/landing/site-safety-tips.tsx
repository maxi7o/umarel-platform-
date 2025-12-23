
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
            <div className="relative bg-yellow-100 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-r-lg shadow-sm">
                <div className="absolute -top-3 -left-3 bg-yellow-500 rounded-full p-2 text-white shadow-md">
                    <AlertTriangle className="w-5 h-5" />
                </div>

                <div className="flex flex-col items-center text-center">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-yellow-700 dark:text-yellow-400 mb-2">
                        {t('title')}
                    </h4>
                    <p className="text-xl md:text-2xl font-medium text-yellow-900 dark:text-yellow-100 transition-all duration-500 ease-in-out font-hand">
                        "{tips[index]}"
                    </p>
                </div>
            </div>
        </div>
    );
}
