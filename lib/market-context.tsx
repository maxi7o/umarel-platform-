"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MarketConfig, getMarketById, DEFAULT_MARKET } from '@/lib/markets';

interface MarketContextType {
    marketId: string | null;
    market: MarketConfig | undefined;
    setMarket: (marketId: string) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const MARKET_COOKIE_KEY = 'umarel_market';

export function MarketProvider({ children }: { children: React.ReactNode }) {
    const [marketId, setMarketId] = useState<string | null>(null);

    useEffect(() => {
        // Load from localStorage on mount
        const saved = localStorage.getItem(MARKET_COOKIE_KEY);
        if (saved) {
            setMarketId(saved);
        }
    }, []);

    const setMarket = (newMarketId: string) => {
        setMarketId(newMarketId);
        localStorage.setItem(MARKET_COOKIE_KEY, newMarketId);
    };

    const market = marketId ? getMarketById(marketId) : undefined;

    return (
        <MarketContext.Provider value={{ marketId, market, setMarket }}>
            {children}
        </MarketContext.Provider>
    );
}

export function useMarket() {
    const context = useContext(MarketContext);
    if (!context) {
        throw new Error('useMarket must be used within MarketProvider');
    }
    return context;
}
