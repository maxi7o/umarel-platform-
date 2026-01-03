'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    MapPin,
    Clock,
    DollarSign,
    User,
    Globe,
    CheckCircle2,
    Star,
    Sparkles,
    AlertCircle,
    ShieldCheck,
    Layers
} from 'lucide-react';
import { CurrencyDisplay } from '@/components/currency-display';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDate, getUserTimezone } from '@/lib/utils/date';


interface UnifiedCardProps {
    item: any; // Request or Offering
    type: 'request' | 'offering';
}

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

import { useTranslations } from 'next-intl';

export function UnifiedCard({ item, type }: UnifiedCardProps) {
    const t = useTranslations('card');
    const isRequest = type === 'request';
    const [isSaved, setIsSaved] = useState(false); // In real app, init from props

    // Default ambiguity if not present (mock fallback)
    const ambiguityScore = item.ambiguityScore || 0;

    const toggleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId: item.id, type: isRequest ? 'request' : 'offering' }),
            });

            if (res.ok) {
                const data = await res.json();
                setIsSaved(data.saved);
                toast.success(data.saved ? t('savedToFavorites') : t('removedFromFavorites'));
            }
        } catch (error) {
            toast.error(t('failedToUpdateFavorites'));
        }
    };

    return (
        <Link href={isRequest ? `/requests/${item.id}` : `/offerings/${item.id}`} className="block">
            <Card className={cn(
                "hover:shadow-lg transition-shadow relative group",
                isRequest ? "border-l-4 border-l-blue-500" : "border-l-4 border-l-green-500"
            )}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-transparent"
                    onClick={toggleSave}
                >
                    <Heart className={cn("h-5 w-5", isSaved ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                </Button>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge variant={isRequest ? "default" : "secondary"} className="gap-1">
                                    {isRequest ? (
                                        <>
                                            <User className="h-3 w-3" />
                                            {t('lookingForService')}
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-3 w-3" />
                                            {t('offeringService')}
                                        </>
                                    )}
                                </Badge>

                                {/* Ambiguity Badges (V2 Logic) */}
                                {isRequest && ambiguityScore > 50 && (
                                    <Badge variant="destructive" className="gap-1 bg-orange-500 hover:bg-orange-600 animate-pulse">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>Needs Umarel</span>
                                    </Badge>
                                )}
                                {isRequest && ambiguityScore <= 20 && ambiguityScore > 0 && (
                                    <Badge variant="outline" className="gap-1 text-green-600 border-green-200 bg-green-50">
                                        <ShieldCheck className="h-3 w-3" />
                                        <span>Clear Specs</span>
                                    </Badge>
                                )}

                                {item.isVirtual && (
                                    <Badge variant="outline" className="gap-1">
                                        <Globe className="h-3 w-3" />
                                        {t('virtual')}
                                    </Badge>
                                )}
                            </div>

                            <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                                {item.title}
                            </h3>

                            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                                {item.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                {item.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {item.location}
                                    </span>
                                )}

                                {/* Slice Count Indicator */}
                                {item.sliceCount !== undefined && (
                                    <span className="flex items-center gap-1" title="Number of Slices">
                                        <Layers className="h-3 w-3" />
                                        {item.sliceCount} Slices
                                    </span>
                                )}

                                {item.category && (
                                    <Badge variant="outline" className="text-xs">
                                        {item.category}
                                    </Badge>
                                )}
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(new Date(item.createdAt), getUserTimezone())}
                                </span>
                            </div>
                        </div>

                        {!isRequest && item.provider && (
                            <div className="flex flex-col items-end gap-2">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback>
                                        <User className="h-6 w-6" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-xs text-right">
                                    <div className="font-medium">{item.provider.fullName}</div>
                                    {item.provider.auraPoints > 0 && (
                                        <div className="text-muted-foreground flex items-center gap-1 justify-end">
                                            <Sparkles className="h-3 w-3" />
                                            {item.provider.auraPoints}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {!isRequest && item.hourlyRate && (
                                <div className="flex items-center gap-1 text-lg font-semibold">
                                    <CurrencyDisplay amount={item.hourlyRate} />
                                    <span className="text-sm font-normal text-muted-foreground">/hr</span>
                                </div>
                            )}

                            {!isRequest && item.metrics && (
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        {item.metrics.completionRate}%
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        {item.metrics.rating}/100
                                    </span>
                                </div>
                            )}

                            {isRequest && item.user && (
                                <div className="text-sm text-muted-foreground">
                                    {t('postedBy')} {item.user.fullName}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
