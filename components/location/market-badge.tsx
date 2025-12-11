"use client"

import { useMarket } from '@/lib/market-context';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { MARKETS } from '@/lib/markets';
import { useRouter } from 'next/navigation';

export function MarketBadge() {
    const { market, setMarket } = useMarket();
    const router = useRouter();

    // Don't show badge if no market selected yet
    const hasMarket = typeof window !== 'undefined' && localStorage.getItem('umarel_market');

    if (!market || !hasMarket) return null;

    const handleChangeMarket = (newMarketId: string) => {
        setMarket(newMarketId);
        router.push(`/browse?market=${newMarketId}`);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-primary/10 border-primary/30 hover:bg-primary/20 hover:border-primary font-medium"
                >
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="hidden sm:inline">{market.city}</span>
                    <span className="sm:hidden">{market.city.slice(0, 3)}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="start">
                <div className="space-y-3">
                    <div>
                        <h4 className="font-semibold text-sm mb-1">Current Location</h4>
                        <p className="text-xs text-muted-foreground">
                            {market.city}, {market.country} • {market.currency}
                        </p>
                    </div>
                    <div className="border-t pt-3">
                        <h4 className="font-semibold text-sm mb-2">Switch Location</h4>
                        <div className="max-h-64 overflow-y-auto space-y-1">
                            {Object.values(MARKETS).map((m) => (
                                <Button
                                    key={m.id}
                                    variant={m.id === market.id ? 'secondary' : 'ghost'}
                                    className="w-full justify-start text-sm h-auto py-2"
                                    onClick={() => handleChangeMarket(m.id)}
                                >
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">{m.city}, {m.country}</span>
                                        <span className="text-xs text-muted-foreground">{m.currency} • {m.timezone.split('/')[1]}</span>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
