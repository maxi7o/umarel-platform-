'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CommentThread } from './comment-thread';
import { SliceKanban } from './slice-kanban';
import { QuoteBuilder } from './quote-builder';
import { ChangeProposalCard } from './change-proposal-card';
import { MessageSquare, KanbanSquare, Activity, LayoutList, ShieldCheck, Briefcase, FileText, BadgeDollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { CurrencyDisplay } from '@/components/currency-display';
import { useTranslations } from 'next-intl';
import { ConnectorTimeline } from '@/components/contract/connector-timeline';
import { QuoteEvaluationView } from '@/components/interaction/quote-evaluation-view';
import { StickyNoteButton } from '@/components/interaction/sticky-note-button';
import { cn } from '@/lib/utils';

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

    // Context & Roles
    const [isDemo, setIsDemo] = useState(false);
    useEffect(() => {
        setIsDemo(request?.id === 'demo');
    }, [request]);

    const isOwner = currentUser?.id === request.userId || currentUser?.id === request.user?.id || isDemo;

    // View State
    const [viewMode, setViewMode] = useState<'board' | 'timeline' | 'quotes'>('timeline');
    useEffect(() => {
        if (isOwner && quotes.length > 0) {
            setViewMode('quotes');
        }
    }, [isOwner, quotes.length]);

    const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
    const [quoteFeedbacks, setQuoteFeedbacks] = useState<any[]>([]);

    const handleQuoteSelect = async (quote: any) => {
        if (selectedQuote?.id === quote.id) {
            setSelectedQuote(null); // Deselect
            setQuoteFeedbacks([]);
            return;
        }
        setSelectedQuote(quote);
        // Mock fetching opinions for now (Replace with real API call)
        // In real app: fetch(`/api/quotes/${quote.id}/feedback`)
        setQuoteFeedbacks([
            {
                id: 'f1',
                authorName: 'Umarel Expert',
                authorAvatar: '',
                content: 'Price seems reasonable for 3 days work.',
                sentiment: 'positive',
                isVerified: true,
                createdAt: new Date().toISOString()
            }
        ]);
        toast.info("Opened evaluation view", { description: "Review expert opinions alongside the quote." });
    };

    const handleAcceptQuote = async () => {
        toast.success("Quote Accepted!", { description: "Proceeding to contract creation." });
        // Trigger acceptance logic
    };

    const handleRejectQuote = async () => {
        toast.error("Quote Rejected");
        setSelectedQuote(null);
    };

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

    const handleApproveSlice = async (sliceId: string) => {
        try {
            const res = await fetch(`/api/slices/${sliceId}/approve`, { method: 'POST' });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Approval failed");
            }
            const data = await res.json();
            toast.success("Payment Released! 💸", { description: "Transferred to Provider. Community dividends distributed." });

            // Update Local State
            setSlices(prev => prev.map(s => s.id === sliceId ? {
                ...s,
                status: 'approved_by_client',
                paidAt: new Date().toISOString()
            } : s));
        } catch (e: any) {
            toast.error("Failed to approve slice", { description: e.message });
        }
    };

    const handleProposalRespond = async (proposalId: string, status: 'accepted' | 'rejected') => {
        try {
            const res = await fetch(`/api/proposals/${proposalId}/respond`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (!res.ok) throw new Error("Failed to respond");

            setProposals(prev => prev.filter(p => p.id !== proposalId)); // Remove processed proposal
        } catch (e) {
            console.error(e);
            throw e; // Let the card handle the error toast
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. UNIFIED FOLDER HEADER */}
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
                        <h2 className="text-3xl font-bold font-archivo text-stone-900 tracking-tight">
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

            {/* REQUEST BRIEF & CONTEXT */}
            <div className="bg-stone-50/50 -mt-6 mb-8 p-6 rounded-xl border border-stone-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <div>
                            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 font-mono">
                                {t('brief.description') || 'MANIFIESTO DEL PROYECTO'}
                            </h3>
                            <p className="text-lg text-stone-800 leading-relaxed font-medium">
                                {request.description}
                            </p>
                        </div>
                        {/* Future: Photo Gallery here */}
                    </div>

                    {/* ACTION BOX (For Providers) */}
                    {!isOwner && (
                        <div className="flex flex-col justify-center items-start md:items-end md:text-right md:border-l md:border-stone-200 md:pl-8">
                            <div className="mb-4">
                                <span className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 font-mono">
                                    ESTADO
                                </span>
                                <div className="text-2xl font-bold text-stone-900 font-archivo">
                                    Abierto a Cotizar
                                </div>
                            </div>

                            <Button
                                id="cta-to-quote"
                                onClick={() => document.getElementById('quote-builder-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="w-full md:w-auto bg-stone-900 hover:bg-stone-800 text-white font-bold py-6 px-8 text-lg shadow-xl shadow-stone-200 flex items-center justify-center gap-2"
                            >
                                <BadgeDollarSign className="w-5 h-5" />
                                Enviar Presupuesto
                            </Button>
                            <p className="mt-3 text-xs text-stone-500 max-w-[200px]">
                                Revisá los detalles y enviá tu propuesta desglosada.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. THE STAGE (Unified Workspace) */}
            <div className="grid lg:grid-cols-[1fr_360px] gap-8">

                {/* LEFT: The Work Area (Focus Mode) */}
                <div className="space-y-8">

                    {selectedQuote ? (
                        <div className="animate-in slide-in-from-right duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-stone-800 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-stone-900" />
                                    Evaluate Proposal
                                </h3>
                                <button className="text-sm text-stone-500 hover:text-stone-800 underline" onClick={() => setSelectedQuote(null)}>
                                    Close Evaluation
                                </button>
                            </div>
                            <QuoteEvaluationView
                                quote={selectedQuote}
                                feedbacks={quoteFeedbacks}
                                requestTitle={request.title} // Pass project context
                                requestLocation={request.location}
                                onAccept={handleAcceptQuote}
                                onReject={handleRejectQuote}
                            />
                        </div>
                    ) : (
                        <>
                            {/* View Toggle & Title */}
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-stone-800 flex items-center gap-2">
                                    {viewMode === 'timeline' ? <LayoutList className="w-5 h-5 text-stone-900" /> : <KanbanSquare className="w-5 h-5 text-stone-900" />}
                                    {t('tabs.slices')}
                                </h3>
                                <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200">
                                    <button
                                        onClick={() => setViewMode('timeline')}
                                        className={cn(
                                            "px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                                            viewMode === 'timeline' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                                        )}
                                    >
                                        <LayoutList size={16} />
                                        Timeline
                                    </button>
                                    <button
                                        onClick={() => setViewMode('board')}
                                        className={cn(
                                            "px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                                            viewMode === 'board' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                                        )}
                                    >
                                        <KanbanSquare size={16} />
                                        Board
                                    </button>
                                </div>
                            </div>

                            <div className="min-h-[400px]">
                                {viewMode === 'timeline' ? (
                                    <ConnectorTimeline
                                        slices={slices}
                                        onApprove={handleApproveSlice}
                                        isOwner={isOwner}
                                    />
                                ) : (
                                    <SliceKanban
                                        slices={slices}
                                        onSliceUpdated={handleSliceUpdated}
                                        isOwner={isOwner}
                                        currentUserId={currentUser?.id}
                                        requestId={request.id}
                                    />
                                )}
                            </div>
                        </>
                    )}

                    {!selectedQuote && (
                        <CommentThread
                            comments={comments}
                            currentUser={currentUser}
                            requestId={request.id}
                            onCommentAdded={handleCommentAdded}
                        />
                    )}
                </div>

                {/* RIGHT: Sidebar (Tools & Context) */}
                <div className="space-y-6">
                    {/* The Quote Builder */}
                    <div id="quote-builder-section" className="scroll-mt-24">
                        <QuoteBuilder
                            requestId={request.id}
                            slices={slices}
                            userId={currentUser?.id}
                            onQuoteCreated={handleQuoteCreated}
                        />
                    </div>

                    {/* Active Bids / Quotes */}
                    {quotes.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
                                {t('tabs.quotes') || 'Received Bids'}
                            </h3>
                            {quotes.map((quote: any) => (
                                <Card
                                    key={quote.id}
                                    className={`bg-white border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer ${selectedQuote?.id === quote.id ? 'ring-2 ring-blue-500' : ''}`}
                                    onClick={() => handleQuoteSelect(quote)}
                                >
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-bold text-stone-900">
                                                    <CurrencyDisplay amount={quote.amount} currency={quote.currency || 'ARS'} />
                                                </div>
                                                <div className="text-xs text-stone-500 flex items-center gap-1">
                                                    {quote.provider?.fullName || 'Provider'}
                                                    {quote.isGuest && <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-stone-100 text-stone-900">Guest</Badge>}
                                                </div>
                                            </div>
                                            <Badge variant={quote.status === 'accepted' ? 'default' : 'outline'} className="capitalize">
                                                {quote.status}
                                            </Badge>
                                        </div>
                                        {quote.message && (
                                            <p className="text-xs text-stone-600 mb-3 bg-stone-50 p-2 rounded line-clamp-3 italic">
                                                "{quote.message}"
                                            </p>
                                        )}
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="text-xs text-stone-900 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                Click to Evaluate
                                            </div>
                                            {/* Allow Entendidos to verify quotes directly from list */}
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <StickyNoteButton
                                                    targetId={quote.id}
                                                    targetType="quote"
                                                    initialCount={0}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}


                    {/* Change Proposals */}
                    {proposals.length > 0 ? (
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
                                {t('pendingProposals')}
                            </h3>
                            {proposals.map(prop => (
                                <ChangeProposalCard
                                    key={prop.id}
                                    proposal={prop}
                                    onRespond={handleProposalRespond}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-stone-50 border-dashed shadow-sm">
                            <CardContent className="p-6 text-center text-stone-500 text-sm">
                                No proposals active
                            </CardContent>
                        </Card>
                    )}

                    {/* AI Tip / Insight */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-sm text-stone-900">
                        <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 mt-1 shrink-0" />
                            <div>
                                <strong>{t('tips.label')}:</strong> {t('tips.text')} <br />
                                <em className="text-stone-900 block mt-1">"{t('tips.example1')}"</em>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
}
