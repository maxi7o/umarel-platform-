'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Lock, Clock, AlertCircle, ChevronDown, ChevronUp, ShieldCheck, Banknote } from 'lucide-react';
import { formatCurrency } from '@/lib/utils'; // Assuming this exists or I'll implement inline
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface Slice {
    id: string;
    title: string;
    description: string;
    amount: number; // or price
    status: 'proposed' | 'accepted' | 'in_progress' | 'completed' | 'approved_by_client' | 'disputed';
    paidAt?: string;
    currency?: string;
}

interface ConnectorTimelineProps {
    slices: Slice[];
    onApprove: (sliceId: string) => Promise<void>;
    isOwner: boolean;
}

export function ConnectorTimeline({ slices, onApprove, isOwner }: ConnectorTimelineProps) {
    const t = useTranslations('timeline');
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    // Sort or use existing order. Assuming sequential order matters.
    // We check availability based on previous slice status.
    // Logic: Slice N is locked until Slice N-1 is 'approved_by_client' (Paid).
    // Or at least 'completed'? User said: "payment of one doesnt happen until acceptance for the previous"

    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedIds(newSet);
    };

    return (
        <div className="relative pl-6 sm:pl-8 space-y-8 py-4">
            {/* Vertical Connector Line */}
            <div className="absolute left-[1.1rem] sm:left-[1.6rem] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800" />

            {slices.map((slice, index) => {
                const isFirst = index === 0;
                const prevSlice = !isFirst ? slices[index - 1] : null;
                const isPreviousDone = !prevSlice || prevSlice.status === 'approved_by_client'; // Strict sequential

                // Determine State
                let state: 'locked' | 'completed' | 'review' | 'active' | 'pending' = 'pending';

                if (slice.status === 'approved_by_client') state = 'completed';
                else if (slice.status === 'completed') state = 'review'; // Work done, waiting approval
                else if (!isPreviousDone) state = 'locked';
                else if (slice.status === 'in_progress' || slice.status === 'accepted') state = 'active';

                // Formatting
                const currency = slice.currency || 'USD';
                const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(slice.amount || 0);

                return (
                    <div key={slice.id} className="relative group">
                        {/* Status Node (Left) */}
                        <div className={cn(
                            "absolute -left-[1.85rem] sm:-left-[2.1rem] w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-4 bg-white dark:bg-slate-950 transition-all z-10",
                            state === 'completed' && "border-teal-500 text-teal-600 dark:border-teal-900 dark:text-teal-400",
                            state === 'review' && "border-orange-500 text-orange-600 dark:border-orange-500 animate-pulse", // Pulse for attention
                            state === 'active' && "border-blue-500 text-blue-600 dark:border-blue-700",
                            state === 'locked' && "border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-700",
                            state === 'pending' && "border-slate-200 text-slate-400"
                        )}>
                            {state === 'completed' && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                            {state === 'review' && <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />} // Needs Review
                            {state === 'active' && <Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
                            {state === 'locked' && <Lock className="w-3 h-3 sm:w-4 sm:h-4" />}
                            {state === 'pending' && <div className="w-2 h-2 rounded-full bg-slate-200" />}
                        </div>

                        {/* Card Content */}
                        <div className={cn(
                            "relative rounded-xl border transition-all duration-300 overflow-hidden",
                            // Light Mode: Fintech Blue & White
                            "bg-white border-slate-200 shadow-sm hover:shadow-md",
                            // Dark Mode: Midnight with Neon Accents
                            "dark:bg-slate-900 dark:border-slate-800",

                            // Active State Highlighting
                            state === 'review' && "border-orange-400 dark:border-orange-500/50 shadow-orange-100 dark:shadow-none ring-1 ring-orange-200 dark:ring-orange-900/30",
                            state === 'active' && "border-blue-500 dark:border-blue-700 shadow-blue-50 dark:shadow-none"
                        )}>
                            <div
                                className="p-4 sm:p-5 cursor-pointer"
                                onClick={() => toggleExpand(slice.id)}
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={cn(
                                                "text-xs font-bold uppercase tracking-wider",
                                                state === 'completed' ? "text-teal-600 dark:text-teal-400" :
                                                    state === 'review' ? "text-orange-600 dark:text-orange-400" :
                                                        state === 'active' ? "text-blue-600 dark:text-blue-400" :
                                                            "text-slate-400"
                                            )}>
                                                {state === 'completed' ? t('status.paid') :
                                                    state === 'review' ? t('status.review') :
                                                        state === 'active' ? t('status.active') :
                                                            state === 'locked' ? t('status.locked') : t('status.pending')}
                                            </span>
                                        </div>
                                        <h3 className={cn(
                                            "font-semibold text-lg leading-tight mb-1",
                                            state === 'locked' ? "text-slate-400" : "text-slate-900 dark:text-slate-100"
                                        )}>
                                            {slice.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                                            {slice.description}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className={cn(
                                            "font-mono font-medium text-lg",
                                            state === 'completed' ? "text-teal-600" : "text-slate-900 dark:text-white"
                                        )}>
                                            {formattedPrice}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Area (Expanded or Prominent) */}
                                {(state === 'review' || expandedIds.has(slice.id)) && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2">

                                        {/* Show Evidence if review */}
                                        {state === 'review' && (
                                            <div className="mb-4 bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg flex items-start gap-3 border border-orange-100 dark:border-orange-900/50">
                                                <ShieldCheck className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                                                        {t('reviewNames.evidenceReady')}
                                                    </p>
                                                    <p className="text-xs text-orange-600 dark:text-orange-400/80 mt-0.5">
                                                        {t('reviewNames.aiVerified')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-slate-500"
                                            >
                                                {t('actions.details')}
                                            </Button>

                                            {state === 'review' && isOwner && (
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onApprove(slice.id);
                                                    }}
                                                    className="bg-orange-600 hover:bg-orange-700 text-white font-medium shadow-lg shadow-orange-500/20 dark:shadow-orange-900/40"
                                                >
                                                    <Banknote className="w-4 h-4 mr-2" />
                                                    {t('actions.releaseFunds')}
                                                </Button>
                                            )}

                                            {state === 'completed' && (
                                                <Badge variant="outline" className="border-teal-200 text-teal-700 bg-teal-50 dark:bg-teal-900/20">
                                                    {t('status.paidOn')} {slice.paidAt ? new Date(slice.paidAt).toLocaleDateString() : 'Now'}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Ensure translation keys exist in 'timeline' namespace!
