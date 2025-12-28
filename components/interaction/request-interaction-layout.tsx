'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CommentThread } from './comment-thread';
import { SliceKanban } from './slice-kanban';
import { QuoteBuilder } from './quote-builder';
import { ChangeProposalCard } from './change-proposal-card';
import { MessageSquare, KanbanSquare, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { CurrencyDisplay } from '@/components/currency-display';
import { useTranslations } from 'next-intl';

interface RequestInteractionLayoutProps {
    request: any;
    initialSlices: any[];
    initialComments: any[];
    initialQuotes?: any[];
    initialQuestions?: any[];
    initialProposals?: any[];
    currentUser?: any;
}

export function RequestInteractionLayout({
    request,
    initialSlices,
    initialComments,
    initialQuotes = [],
    initialQuestions = [],
    initialProposals = [],
    currentUser
}: RequestInteractionLayoutProps) {
    const t = useTranslations('requestInteraction');
    const [slices, setSlices] = useState(initialSlices);
    const [comments, setComments] = useState(initialComments);
    const [quotes, setQuotes] = useState(initialQuotes);
    const [proposals, setProposals] = useState(initialProposals);

    const [isDemo, setIsDemo] = useState(false);
    useEffect(() => {
        setIsDemo(request?.id === 'demo');
    }, [request]);

    const handleCommentAdded = (newComment: any) => {
        setComments(prev => [...prev.filter(c => c.id !== newComment.id), newComment]);
    };

    const handleSliceUpdated = (updatedSlice: any) => {
        setSlices(prev => prev.map((s: any) => s.id === updatedSlice.id ? updatedSlice : s));
    };

    const handleSlicesCreated = (newSlices: any[]) => {
        setSlices(prev => [...prev, ...newSlices]);
    };

    const handleQuoteCreated = (newQuote: any) => {
        setQuotes(prev => [...prev, newQuote]);
    };

    const isOwner = currentUser?.id === request.userId || currentUser?.id === request.user?.id || isDemo;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. UNIFIED FOLDER HEADER (Replaces 'Detalles de Obra') */}
            <div className="border-b border-stone-200 pb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-stone-500 mb-2 font-medium">
                            <span className="flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-full">
                                <Activity size={12} className="text-orange-500" />
                                {new Date(request.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                📍 {request.location || 'Remote'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                👤 {request.user?.fullName || 'Unknown Client'}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold font-outfit text-stone-900 tracking-tight">
                            {request.title}
                        </h2>
                    </div>

                    {/* Status / Phase Indicator */}
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="px-3 py-1 text-sm bg-white border-stone-200 text-stone-600 shadow-sm">
                            {t('phase.label')}: <strong className="ml-1 text-stone-900">{slices.length === 0 ? t('phase.defining') : t('phase.bidding')}</strong>
                        </Badge>
                    </div>
                </div>
            </div>

            {/* 2. THE STAGE (Unified Workspace) */}
            <div className="grid lg:grid-cols-[1fr_360px] gap-8">

                {/* LEFT: The Work Area (Focus Mode) */}
                <div className="space-y-10">

                    {/* Description Card (Context) */}
                    <div className="prose prose-stone max-w-none">
                        <p className="whitespace-pre-wrap text-lg text-stone-700 leading-relaxed">
                            {request.description}
                        </p>
                    </div>

                    {/* Pending Proposals Section */}
                    {proposals.length > 0 && proposals.some((p: any) => p.status === 'pending') && (
                        <div className="space-y-4 bg-orange-50 p-6 rounded-xl border border-orange-100">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-orange-800">
                                <Activity className="text-orange-600" size={20} />
                                {t('pendingProposals')}
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                {proposals
                                    .filter((p: any) => p.status === 'pending')
                                    .map((proposal: any) => (
                                        <ChangeProposalCard
                                            key={proposal.id}
                                            proposal={proposal}
                                            onRespond={async (id, status) => {
                                                const userId = currentUser?.id;
                                                const res = await fetch(`/api/proposals/${id}/respond`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ status, userId })
                                                });
                                                if (!res.ok) throw new Error('Failed');
                                                setProposals(prev => prev.map((p: any) => p.id === id ? { ...p, status } : p));
                                                if (status === 'accepted') {
                                                    toast.success('Changes applied!');
                                                    window.location.reload();
                                                }
                                            }}
                                        />
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* THE SLICES (Main Actor) */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold font-outfit text-stone-900 flex items-center gap-2">
                                <KanbanSquare className="text-orange-600" size={24} />
                                {t('tabs.slices')}
                            </h3>
                        </div>

                        <SliceKanban
                            slices={slices}
                            requestId={request.id}
                            isOwner={isOwner}
                            currentUserId={currentUser?.id}
                            onSliceUpdated={handleSliceUpdated}
                        />
                    </div>

                    {/* QUOTES SECTION (Shown if there are slices) */}
                    {slices.length > 0 && (
                        <div className="pt-10 border-t border-stone-200">
                            <h3 className="text-xl font-bold font-outfit text-stone-900 mb-6">{t('tabs.quotes')}</h3>

                            <div className="grid gap-6">
                                {quotes.length === 0 ? (
                                    <div className="text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                                        <p className="text-stone-500 mb-2">{t('noQuotes')}</p>
                                        <p className="text-sm text-stone-400">Waiting for providers to bid on your Execution Cards.</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {quotes.map((quote: any) => (
                                            <Card key={quote.id} className="hover:shadow-md transition-shadow">
                                                <CardHeader className="pb-2">
                                                    <div className="flex justify-between items-start">
                                                        <CardTitle className="text-base">
                                                            {t('quoteFrom')} {quote.provider?.fullName || 'Provider'}
                                                        </CardTitle>
                                                        <Badge variant={quote.status === 'accepted' ? 'default' : 'secondary'}>
                                                            {quote.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-2xl font-bold text-orange-600">
                                                        <CurrencyDisplay amount={quote.amount} currency={quote.currency || 'ARS'} />
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-stone-600 mb-4 line-clamp-3">{quote.message}</p>
                                                    <div className="mt-4 pt-4 border-t border-stone-100">
                                                        <h4 className="text-xs font-semibold uppercase text-stone-400 mb-2">
                                                            {t('optimizationDiscussion')}
                                                        </h4>
                                                        <CommentThread
                                                            requestId={request.id}
                                                            quoteId={quote.id}
                                                            comments={comments.filter((c: any) => c.quoteId === quote.id)}
                                                            onCommentAdded={handleCommentAdded}
                                                            currentUser={currentUser}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {/* Quote Builder (For Providers) */}
                                {!isOwner && (
                                    <div className="mt-8">
                                        <QuoteBuilder
                                            requestId={request.id}
                                            requestTitle={request.title}
                                            slices={slices.filter((s: any) => s.status === 'accepted' || s.status === 'proposed')}
                                            onQuoteCreated={handleQuoteCreated}
                                            userId={currentUser?.id}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>

                {/* RIGHT: The Umarel Sidebar (AI & Context) */}
                <div className="space-y-6">
                    {/* The Notebook (AI Chat) - Sticky Sidebar */}
                    <div className="sticky top-6">
                        <div className="bg-[#fffdf5] rounded-xl border-2 border-dashed border-stone-300 shadow-sm overflow-hidden flex flex-col h-[600px]">
                            <div className="border-b border-stone-200 bg-[#fffbf0] px-4 py-3 flex items-center justify-between">
                                <h4 className="text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
                                    <MessageSquare size={16} className="text-stone-500" />
                                    {t('privateInsights')}
                                </h4>
                                <Badge variant="outline" className="bg-white text-[10px] uppercase">
                                    {t('aiMode')}
                                </Badge>
                            </div>
                            <div className="flex-1 overflow-hidden flex flex-col p-0">
                                <CommentThread
                                    requestId={request.id}
                                    comments={comments}
                                    onCommentAdded={handleCommentAdded}
                                    onSlicesCreated={handleSlicesCreated}
                                    currentUser={currentUser}
                                    mode="private_insight"
                                    fitParent={true}
                                />
                            </div>
                        </div>

                        {/* Helper Tip */}
                        <div className="mt-4 p-4 bg-stone-100 rounded-lg text-xs text-stone-500 leading-relaxed">
                            💡 <strong>{t('tips.label')}:</strong> {t('tips.text')} "{t('tips.example1')}" {t('or')} "{t('tips.example2')}"
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
