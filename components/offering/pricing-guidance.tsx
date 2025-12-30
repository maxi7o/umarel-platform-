'use client';

import { useEffect, useState } from 'react';
import { TrendingDown, TrendingUp, Info, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PricingGuidanceProps {
    category: string;
    currentPrice: number | null;
    currency?: string;
}

// Mock data - in a real app, this would come from the 'market_pricing' table
const MARKET_DATA: Record<string, { min: number; avg: number; max: number; recommendedEntry: number }> = {
    plumbing: { min: 40, avg: 85, max: 150, recommendedEntry: 50 },
    electrical: { min: 50, avg: 95, max: 180, recommendedEntry: 60 },
    carpentry: { min: 35, avg: 70, max: 120, recommendedEntry: 45 },
    painting: { min: 25, avg: 50, max: 90, recommendedEntry: 30 },
    cleaning: { min: 20, avg: 35, max: 60, recommendedEntry: 25 },
    gardening: { min: 25, avg: 45, max: 80, recommendedEntry: 30 },
    moving: { min: 30, avg: 60, max: 100, recommendedEntry: 40 },
    default: { min: 25, avg: 50, max: 100, recommendedEntry: 30 },
};

export function PricingGuidance({ category, currentPrice, currency = '$' }: PricingGuidanceProps) {
    const [data, setData] = useState(MARKET_DATA['default']);
    const [status, setStatus] = useState<'low' | 'optimal' | 'high' | 'premium'>('optimal');

    useEffect(() => {
        const key = category && MARKET_DATA[category] ? category : 'default';
        setData(MARKET_DATA[key]);
    }, [category]);

    useEffect(() => {
        if (!currentPrice) return;

        if (currentPrice < data.min) setStatus('low');
        else if (currentPrice <= data.avg) setStatus('optimal');
        else if (currentPrice <= data.max) setStatus('high');
        else setStatus('premium');
    }, [currentPrice, data]);

    if (!category) return null;

    const stats = [
        { label: 'Entry Level', value: data.min, color: 'bg-green-500' },
        { label: 'Market Avg', value: data.avg, color: 'bg-blue-500' },
        { label: 'Premium', value: data.max, color: 'bg-purple-500' },
    ];

    // Calculate position of current price on the bar (clamped 0-100)
    const getPosition = (price: number) => {
        const range = data.max * 1.2 - (data.min * 0.5);
        const offset = price - (data.min * 0.5);
        return Math.min(100, Math.max(0, (offset / range) * 100));
    };

    return (
        <Card className="bg-muted/30 border-dashed mt-4">
            <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="font-semibold flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            Market Pricing Insights
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Based on {category} volume in your area
                        </p>
                    </div>
                    {currentPrice && (
                        <Badge variant={
                            status === 'low' ? 'secondary' :
                                status === 'optimal' ? 'default' :
                                    status === 'high' ? 'outline' : 'destructive'
                        }>
                            {status === 'low' && 'Below Market'}
                            {status === 'optimal' && 'Competitive'}
                            {status === 'high' && 'Above Average'}
                            {status === 'premium' && 'Premium'}
                        </Badge>
                    )}
                </div>

                {/* Price Visualization Bar */}
                <div className="relative h-12 mb-6 mt-6">
                    {/* Background Track */}
                    <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full transform -translate-y-1/2 overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 opacity-50" />
                    </div>

                    {/* Markers */}
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group cursor-help"
                            style={{ left: `${getPosition(stat.value)}%` }}
                        >
                            <div className={`w-3 h-3 rounded-full ${stat.color} ring-2 ring-white shadow-sm mb-2`} />
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-1 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                {stat.label}: {currency}{stat.value}
                            </div>
                        </div>
                    ))}

                    {/* Current Price Indicator */}
                    {currentPrice && (
                        <div
                            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-500 z-10"
                            style={{ left: `${getPosition(currentPrice)}%` }}
                        >
                            <div className="w-4 h-4 rounded-full bg-primary border-[3px] border-white shadow-md animate-pulse" />
                            <div className="mt-2 text-xs font-bold text-primary bg-background px-1 rounded shadow-sm border">
                                You
                            </div>
                        </div>
                    )}
                </div>

                {/* Recommendation Engine */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex gap-3 items-start">
                    <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full mt-0.5">
                        <Zap className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                    </div>
                    <div>
                        <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                            Maximize your Transaction Volume
                        </h5>
                        <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">
                            {!currentPrice ? (
                                <>Try starting around <span className="font-bold">{currency}{data.recommendedEntry}</span> to get your first 5 reviews quickly.</>
                            ) : currentPrice <= data.recommendedEntry ? (
                                "Great price for building reputation! You should see high booking volume."
                            ) : currentPrice > data.max ? (
                                "Your price is in the premium range. Ensure your portfolio justifies this to maintain volume."
                            ) : (
                                <>A competitive price. Consider a temporary <span className="font-bold">-10% discount</span> to boost immediate bookings.</>
                            )}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
