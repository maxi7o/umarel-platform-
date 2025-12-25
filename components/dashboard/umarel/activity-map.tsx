"use client";

import { MapPin } from "lucide-react";

interface ActivityZone {
    name: string;
    activeRequests: number;
    trendingCategory: string;
    intensity: 'high' | 'medium' | 'low';
}

export function ActivityMap({ zones }: { zones: ActivityZone[] }) {
    return (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    Activity Hot Zones
                </h3>
                <p className="text-sm text-stone-500">Neighborhoods needing Umarel attention right now.</p>
            </div>

            <div className="p-0">
                {zones.map((zone, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`
                                w-2 h-2 rounded-full ring-4 
                                ${zone.intensity === 'high' ? 'bg-red-500 ring-red-100' :
                                    zone.intensity === 'medium' ? 'bg-orange-500 ring-orange-100' : 'bg-yellow-500 ring-yellow-100'}
                            `} />
                            <div>
                                <div className="font-bold text-stone-800">{zone.name}</div>
                                <div className="text-xs text-stone-500">Trending: {zone.trendingCategory}</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="font-mono font-bold text-lg">{zone.activeRequests}</span>
                            <span className="text-[10px] uppercase tracking-wider text-stone-400">Requests</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
