'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap, HandCoins, TrendingUp, Info } from 'lucide-react';
import { useFormatter } from 'next-intl';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AuraCardProps {
    points: number;
    level: string;
    totalSavings: number;
    weeklyScore?: number;
}

const LEVELS = {
    BRONZE: 100,
    SILVER: 500,
    GOLD: 2000,
};

export function AuraCard({ points, level, totalSavings, weeklyScore = 0 }: AuraCardProps) {
    const format = useFormatter();

    // specific thresholds for progress bar calculation
    const getLevelProgress = (points: number) => {
        if (points < LEVELS.BRONZE) return (points / LEVELS.BRONZE) * 100;
        if (points < LEVELS.SILVER) return ((points - LEVELS.BRONZE) / (LEVELS.SILVER - LEVELS.BRONZE)) * 100;
        if (points < LEVELS.GOLD) return ((points - LEVELS.SILVER) / (LEVELS.GOLD - LEVELS.SILVER)) * 100;
        return 100; // Diamond/Max
    };

    const getNextLevelText = (points: number) => {
        if (points < LEVELS.BRONZE) return `${LEVELS.BRONZE - points} pts to Silver`;
        if (points < LEVELS.SILVER) return `${LEVELS.SILVER - points} pts to Gold`;
        if (points < LEVELS.GOLD) return `${LEVELS.GOLD - points} pts to Diamond`;
        return 'Max Level Reached';
    };

    return (
        <Card className="h-full border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-orange-500 fill-orange-500" />
                        Aura Reputation
                    </CardTitle>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground hover:text-orange-500 transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="w-52 text-xs">
                                    Earn Aura by identifying savings opportunities and helpful interactions.
                                    Higher Aura increases your share of the Daily Dividend Pool.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-3xl font-bold font-heading text-foreground">{points}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{level} Tier</span>
                    </div>
                    <Progress value={getLevelProgress(points)} className="h-2 bg-orange-100" />
                    <p className="text-xs text-muted-foreground mt-2 text-right">
                        {getNextLevelText(points)}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                            <HandCoins className="h-4 w-4" />
                            <span className="text-xs font-medium">Value Created</span>
                        </div>
                        <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                            {format.number(totalSavings / 100, { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}
                        </p>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg border border-green-100 dark:bg-green-900/20 dark:border-green-800">
                        <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400 mb-1">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-xs font-medium">Weekly Score</span>
                        </div>
                        <p className="text-lg font-bold text-green-800 dark:text-green-300">
                            {weeklyScore} pts
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
