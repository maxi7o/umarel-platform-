"use client";

import { Heart, ThumbsUp, DollarSign } from "lucide-react";

interface Contribution {
    id: string;
    content: string;
    type: 'suggestion' | 'correction' | 'answer';
    hearts: number;
    upvotes: number;
    savingsGenerated: number; // in cents
    context: string; // e.g., "Roof Repair Quote"
    date: string;
}

export function QualityReview({ contributions }: { contributions: Contribution[] }) {
    return (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-blue-500" />
                    Quality Review
                </h3>
                <p className="text-sm text-stone-500">How your wisdom is performing.</p>
            </div>

            <div className="divide-y divide-stone-100">
                {contributions.length === 0 ? (
                    <div className="p-8 text-center text-stone-500 italic">
                        No contributions yet. Start commenting to earn respect!
                    </div>
                ) : (
                    contributions.map((item) => (
                        <div key={item.id} className="p-6 hover:bg-stone-50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-xs font-bold uppercase tracking-wide text-stone-400 bg-stone-100 px-2 py-1 rounded">
                                    {item.context}
                                </span>
                                <span className="text-xs text-stone-400 font-mono">{item.date}</span>
                            </div>

                            <p className="text-stone-700 italic font-hand text-lg mb-4">"{item.content}"</p>

                            <div className="flex items-center gap-6">
                                {item.savingsGenerated > 0 && (
                                    <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm border border-green-100">
                                        <DollarSign className="w-4 h-4" />
                                        ${(item.savingsGenerated / 100).toLocaleString()} Saved
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-stone-500 text-sm">
                                    <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                                    <span>{item.hearts}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-stone-500 text-sm">
                                    <ThumbsUp className="w-4 h-4 text-blue-400" />
                                    <span>{item.upvotes}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
