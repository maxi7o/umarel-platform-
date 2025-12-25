"use client";

import { Crown, Star, Wallet, TrendingUp } from "lucide-react";

interface StatsHeaderProps {
    auraPoints: number;
    auraLevel: 'bronze' | 'silver' | 'gold' | 'diamond';
    totalEarnings: number; // in cents
    impactScore: number;
}

export function StatsHeader({ auraPoints, auraLevel, totalEarnings, impactScore }: StatsHeaderProps) {

    const getBadgeColor = (level: string) => {
        switch (level) {
            case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'silver': return 'bg-slate-100 text-slate-800 border-slate-200';
            case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'diamond': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Aura Card */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center gap-4">
                <div className={`p-4 rounded-full ${getBadgeColor(auraLevel)}`}>
                    <Crown className="w-8 h-8" />
                </div>
                <div>
                    <div className="text-sm text-stone-500 font-medium uppercase tracking-wider">Current Rank</div>
                    <div className="text-2xl font-black capitalize flex items-center gap-2">
                        {auraLevel}
                        <span className="text-sm font-normal text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                            {auraPoints} Aura
                        </span>
                    </div>
                </div>
            </div>

            {/* Earnings Card */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center gap-4">
                <div className="p-4 rounded-full bg-green-100 text-green-800 border border-green-200">
                    <Wallet className="w-8 h-8" />
                </div>
                <div>
                    <div className="text-sm text-stone-500 font-medium uppercase tracking-wider">Total Earnings</div>
                    <div className="text-2xl font-black text-stone-900">
                        ${(totalEarnings / 100).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </div>

            {/* Impact Card */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center gap-4">
                <div className="p-4 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                    <TrendingUp className="w-8 h-8" />
                </div>
                <div>
                    <div className="text-sm text-stone-500 font-medium uppercase tracking-wider">Impact Score</div>
                    <div className="text-2xl font-black text-stone-900 flex items-center gap-2">
                        {impactScore}
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}
