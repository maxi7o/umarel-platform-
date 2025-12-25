"use client";

import { Wrench } from "lucide-react";

interface DemandCategory {
    category: string;
    count: number;
    trend: 'up' | 'stable' | 'down';
}

export function MarketDemand({ demands }: { demands: DemandCategory[] }) {
    return (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-stone-600" />
                    Most Needed Tools
                </h3>
                <p className="text-sm text-stone-500">High demand categories where help is needed.</p>
            </div>

            <div className="p-6">
                <div className="space-y-4">
                    {demands.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className="font-medium text-stone-700 capitalize">{item.category}</span>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-32 bg-stone-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-stone-800 rounded-full"
                                        style={{ width: `${Math.min((item.count / 50) * 100, 100)}%` }}
                                    />
                                </div>
                                <span className="text-sm font-bold w-6 text-right">{item.count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
