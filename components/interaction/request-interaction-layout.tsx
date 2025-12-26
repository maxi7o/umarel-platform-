'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CommentThread } from './comment-thread';
import { SliceKanban } from './slice-kanban';
import { QuoteBuilder } from './quote-builder';
import { ChangeProposalCard } from './change-proposal-card';
import { MessageSquare, KanbanSquare, FileText, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { CurrencyDisplay } from '@/components/currency-display';

interface RequestInteractionLayoutProps {
    request: any;
    initialSlices: any[];
    initialComments: any[];
    initialQuotes?: any[];
    initialQuestions?: any[];
    initialProposals?: any[]; // Added
    currentUser?: any; // In real app, use hook
}

import { useTranslations } from 'next-intl';

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
    const [activeTab, setActiveTab] = useState('overview');
    const [slices, setSlices] = useState(initialSlices);
    const [comments, setComments] = useState(initialComments);
    const [quotes, setQuotes] = useState(initialQuotes);
    const [proposals, setProposals] = useState(initialProposals);

    const [isDemo, setIsDemo] = useState(false);
    useEffect(() => {
        setIsDemo(request?.id === 'demo');
    }, [request]);

    const handleCommentAdded = (newComment: any) => {
        // If it's the demo page, ensure we update the local state which is passed to CommentThread
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
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 lg:w-[750px]">
                    <TabsTrigger value="overview" className="gap-2">
                        <MessageSquare size={16} />
                        <span className="hidden sm:inline">{t('tabs.overview')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="slices" className="gap-2">
                        <KanbanSquare size={16} />
                        <span className="hidden sm:inline">{t('tabs.slices')}</span>
                        <Badge variant="secondary" className="ml-1 px-1 h-5 min-w-[20px]">{slices.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="quotes" className="gap-2">
                        <FileText size={16} />
                        <span className="hidden sm:inline">{t('tabs.quotes')}</span>
                        <Badge variant="secondary" className="ml-1 px-1 h-5 min-w-[20px]">{quotes.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="gap-2">
                        <Activity size={16} />
                        <span className="hidden sm:inline">{t('tabs.activity')}</span>
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab: Description + Main Comment Thread */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* Pending Proposals Section */}
                    {proposals.length > 0 && proposals.some((p: any) => p.status === 'pending') && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
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
                                                // Call API
                                                const res = await fetch(`/api/proposals/${id}/respond`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ status, userId })
                                                });

                                                if (!res.ok) throw new Error('Failed');

                                                // Update local state
                                                setProposals(prev => prev.map((p: any) =>
                                                    p.id === id ? { ...p, status } : p
                                                ));

                                                if (status === 'accepted') {
                                                    // Refresh data or simpler: wait for user reload. 
                                                    // Ideally we get the new slices back from the API, but for MVP we might just prompt reload or trigger parent refresh.
                                                    // We can optimistically apply if we knew exactly what happened, but it's complex.
                                                    toast.success('Changes applied! Refreshing data...');
                                                    window.location.reload();
                                                }
                                            }}
                                        />
                                    ))}
                            </div>
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('description')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                        {request.description}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('privateInsights')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CommentThread
                                        requestId={request.id}
                                        comments={comments}
                                        onCommentAdded={handleCommentAdded}
                                        onSlicesCreated={handleSlicesCreated}
                                        currentUser={currentUser}
                                        mode="private_insight"
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">{t('details')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">{t('location')}:</span>
                                        <div className="font-medium">{request.location || 'Remote'}</div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">{t('postedBy')}:</span>
                                        <div className="font-medium">{request.user?.fullName || 'Unknown'}</div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">{t('created')}:</span>
                                        <div className="font-medium">{new Date(request.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Slices Tab: Kanban Board */}
                <TabsContent value="slices" className="mt-6">
                    <SliceKanban
                        slices={slices}
                        requestId={request.id}
                        isOwner={isOwner}
                        onSliceUpdated={handleSliceUpdated}
                    />
                </TabsContent>

                {/* Quotes Tab: List + Builder */}
                <TabsContent value="quotes" className="mt-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">{t('submittedQuotes')}</h3>
                            {quotes.length === 0 ? (
                                <Card className="bg-muted/50 border-dashed">
                                    <CardContent className="py-8 text-center text-muted-foreground">
                                        {t('noQuotes')}
                                    </CardContent>
                                </Card>
                            ) : (
                                quotes.map((quote: any) => (
                                    <Card key={quote.id}>
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-base">
                                                    {t('quoteFrom')} {quote.provider?.fullName || 'Provider'}
                                                </CardTitle>
                                                <Badge>{quote.status}</Badge>
                                            </div>
                                            <div className="text-2xl font-bold text-orange-600">
                                                <CurrencyDisplay amount={quote.amount} currency={quote.currency || 'ARS'} />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-600 mb-4">{quote.message}</p>

                                            {/* Optimization Thread for this Quote */}
                                            <div className="mt-4 pt-4 border-t">
                                                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                                                    {t('optimizationDiscussion')}
                                                </h4>
                                                <CommentThread
                                                    requestId={request.id}
                                                    quoteId={quote.id}
                                                    // Note: We might need a separate comment list for quote threads if we want to manage them centrally too,
                                                    // but for now let's assume the main list filters or we fetch separately.
                                                    // For simplicity in this refactor, let's keep quote threads fetching their own data or 
                                                    // pass a filtered list if we had all comments.
                                                    // Given the current structure, let's let them fetch or pass a filtered subset if available.
                                                    // But `comments` state above is likely just for the main thread.
                                                    // Let's stick to the pattern:
                                                    comments={comments.filter((c: any) => c.quoteId === quote.id)}
                                                    onCommentAdded={handleCommentAdded}
                                                    currentUser={currentUser}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        <div>
                            <QuoteBuilder
                                requestId={request.id}
                                requestTitle={request.title}
                                slices={slices.filter((s: any) => s.status === 'accepted' || s.status === 'proposed')}
                                onQuoteCreated={handleQuoteCreated}
                                userId={currentUser?.id}
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* Questions Tab: Q&A for Service Providers */}


                {/* Activity Tab: Just a full view of comments for now */}
                <TabsContent value="activity" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('fullActivityLog')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CommentThread
                                requestId={request.id}
                                comments={comments}
                                onCommentAdded={handleCommentAdded}
                                currentUser={currentUser}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

