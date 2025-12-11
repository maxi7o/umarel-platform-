'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    User,
    CheckCircle2,
    Clock,
    Star,
    TrendingUp,
    Sparkles,
    DollarSign
} from 'lucide-react';

interface ProviderCardProps {
    provider: {
        id: string;
        fullName: string;
        avatarUrl?: string;
        auraPoints?: number;
    };
    metrics?: {
        totalSlicesCompleted: number;
        completionRate: number;
        onTimeRate: number;
        rating: number;
        totalEarnings: number;
        umarelEndorsements: number;
    };
    compact?: boolean;
}

export function ProviderCard({ provider, metrics, compact = false }: ProviderCardProps) {
    if (compact) {
        return (
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                <Avatar className="h-10 w-10">
                    <AvatarFallback>
                        <User className="h-5 w-5" />
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{provider.fullName}</p>
                        {provider.auraPoints && provider.auraPoints > 0 && (
                            <Badge variant="outline" className="text-xs gap-1">
                                <Sparkles className="h-3 w-3" />
                                {provider.auraPoints}
                            </Badge>
                        )}
                    </div>
                    {metrics && (
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                {metrics.completionRate}%
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {metrics.onTimeRate}% on-time
                            </span>
                            <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {metrics.rating}/100
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg">
                            <User className="h-8 w-8" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{provider.fullName}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                            {provider.auraPoints && provider.auraPoints > 0 && (
                                <Badge variant="secondary" className="gap-1">
                                    <Sparkles className="h-3 w-3" />
                                    {provider.auraPoints} Aura
                                </Badge>
                            )}
                            {metrics && metrics.totalSlicesCompleted > 0 && (
                                <Badge variant="outline">
                                    {metrics.totalSlicesCompleted} slices completed
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>
            {metrics && (
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Completion Rate</span>
                            </div>
                            <p className="text-2xl font-bold">{metrics.completionRate}%</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>On-Time Delivery</span>
                            </div>
                            <p className="text-2xl font-bold">{metrics.onTimeRate}%</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>Rating</span>
                            </div>
                            <p className="text-2xl font-bold">{metrics.rating}/100</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                <span>Total Earnings</span>
                            </div>
                            <p className="text-2xl font-bold">${(metrics.totalEarnings / 100).toFixed(0)}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Sparkles className="h-4 w-4" />
                                <span>Umarel Endorsements</span>
                            </div>
                            <p className="text-2xl font-bold">{metrics.umarelEndorsements}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <TrendingUp className="h-4 w-4" />
                                <span>Trust Score</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                                {Math.round((metrics.completionRate + metrics.onTimeRate + metrics.rating) / 3)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
