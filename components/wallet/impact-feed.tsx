"use client"

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Flame, ShieldAlert, BadgeCheck, PiggyBank } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Contribution {
    id: string;
    score: number;
    contributionType: string;
    reasoning: string;
    createdAt: Date;
    sliceId?: string;
    totalScore: number;
}

interface ImpactFeedProps {
    contributions: Contribution[];
}

export function ImpactFeed({ contributions }: ImpactFeedProps) {
    const t = useTranslations('wallet');

    const getIcon = (type: string) => {
        switch (type) {
            case 'risk_mitigation': return <ShieldAlert className="h-5 w-5 text-red-500" />;
            case 'savings': return <PiggyBank className="h-5 w-5 text-green-500" />;
            case 'quality': return <BadgeCheck className="h-5 w-5 text-blue-500" />;
            default: return <Flame className="h-5 w-5 text-orange-500" />;
        }
    };

    const getImpactTitle = (type: string) => {
        // Fallback keys if generic
        return t.has(`impactType.${type}`) ? t(`impactType.${type}`) : 'Contribución';
    };

    if (contributions.length === 0) {
        return (
            <Card className="border-dashed border-2 border-stone-200 dark:border-stone-800 bg-transparent h-full flex items-center justify-center p-8 text-center text-muted-foreground">
                <p>{t('emptyStash')}</p>
            </Card>
        );
    }

    return (
        <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-stone-700 dark:text-stone-300">
                    {t('impact')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {contributions.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 transition-all hover:shadow-md">
                        <div className="p-2 bg-white dark:bg-stone-800 rounded-lg border shadow-sm flex-shrink-0">
                            {getIcon(item.contributionType)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                                    {getImpactTitle(item.contributionType)}
                                </h4>
                                <span className={cn(
                                    "text-xs font-bold px-2 py-0.5 rounded-full",
                                    item.totalScore > 100 ? "bg-purple-100 text-purple-700" : "bg-stone-200 text-stone-700"
                                )}>
                                    +{item.totalScore} Aura
                                </span>
                            </div>
                            <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2 mt-1">
                                {item.reasoning}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-stone-400">
                                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                {item.sliceId && (
                                    <>
                                        •
                                        <Link href={`/slices/${item.sliceId}`} className="flex items-center gap-1 hover:text-orange-600 transition-colors">
                                            Ver contexto <ExternalLink className="h-3 w-3" />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
