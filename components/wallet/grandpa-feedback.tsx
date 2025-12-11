"use client"

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils'; // Assuming utils exists

interface GrandpaFeedbackProps {
    auraLevel: 'bronze' | 'silver' | 'gold' | 'diamond';
    auraPoints: number;
}

export function GrandpaFeedback({ auraLevel, auraPoints }: GrandpaFeedbackProps) {
    const t = useTranslations('wallet');

    // Aura Badge Colors
    const badgeColors = {
        bronze: "bg-orange-100 text-orange-800 border-orange-200",
        silver: "bg-gray-100 text-gray-800 border-gray-200",
        gold: "bg-yellow-100 text-yellow-800 border-yellow-200",
        diamond: "bg-purple-100 text-purple-800 border-purple-200"
    };

    return (
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-stone-900 dark:to-orange-950 border-orange-200 dark:border-orange-900 overflow-hidden relative">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                {/* The Grandpa */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                    <div className="absolute inset-0 bg-white rounded-full border-4 border-orange-200 shadow-md overflow-hidden">
                        <Image
                            src="/hero-grandpa.png"
                            alt="Umarel Grandpa"
                            fill
                            className="object-cover"
                        />
                    </div>
                    {/* Badge */}
                    <div className={cn(
                        "absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-bold border uppercase shadow-sm",
                        badgeColors[auraLevel]
                    )}>
                        {auraLevel}
                    </div>
                </div>

                {/* The Speech Bubble */}
                <div className="flex-1 relative bg-white dark:bg-stone-800 p-4 rounded-2xl rounded-tl-sm border border-stone-200 dark:border-stone-700 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="absolute top-4 -left-2 w-4 h-4 bg-white dark:bg-stone-800 border-l border-t border-stone-200 dark:border-stone-700 transform -rotate-45" />
                    <p className="font-medium text-lg text-stone-800 dark:text-stone-200 italic">
                        "{t(`greetings.${auraLevel}`)}"
                    </p>
                    <div className="mt-2 text-sm text-stone-500 dark:text-stone-400 font-mono">
                        ~ {auraPoints} {t('aura')}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
