'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CommentThread } from './comment-thread';
import { SliceKanban } from './slice-kanban';
import { QuoteBuilder } from './quote-builder';
import { QuestionThread } from './question-thread';
import { MessageSquare, KanbanSquare, FileText, Activity, MessageCircleQuestion } from 'lucide-react';

interface RequestInteractionLayoutProps {
    request: any;
    initialSlices: any[];
    initialComments: any[];
    initialQuotes?: any[];
    initialQuestions?: any[];
    currentUser?: any; // In real app, use hook
}

export function RequestInteractionLayout({
    request,
    initialSlices,
    initialComments,
    initialQuotes = [],
    initialQuestions = [],
    currentUser
}: RequestInteractionLayoutProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const [slices, setSlices] = useState(initialSlices);
    const [comments, setComments] = useState(initialComments);
    const [quotes, setQuotes] = useState(initialQuotes);
    const [questions, setQuestions] = useState(initialQuestions);

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
        // If demo, we might need to trigger a re-render or state update
        if (isDemo) {
            // No separate state, just add to slices and CommentThread should see it if linked
        }
    };

    const handleQuoteCreated = (newQuote: any) => {
        setQuotes(prev => [...prev, newQuote]);
    };

    const handleQuestionAdded = (newQuestion: any) => {
        setQuestions(prev => [...prev, newQuestion]);
    };

    const handleQuestionUpdated = (updatedQuestion: any) => {
        setQuestions(prev => prev.map((q: any) => q.id === updatedQuestion.id ? updatedQuestion : q));
    };

    const handleAnswerAdded = (questionId: string, newAnswer: any) => {
        setQuestions(prev => prev.map((q: any) =>
            q.id === questionId
                ? { ...q, answers: [...(q.answers || []), newAnswer] }
                : q
        ));
    };

    const isOwner = currentUser?.id === request.userId || currentUser?.id === request.user?.id || isDemo;

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 lg:w-[750px]">
                    <TabsTrigger value="overview" className="gap-2">
                        <MessageSquare size={16} />
                        <span className="hidden sm:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="slices" className="gap-2">
                        <KanbanSquare size={16} />
                        <span className="hidden sm:inline">Slices</span>
                        <Badge variant="secondary" className="ml-1 px-1 h-5 min-w-[20px]">{slices.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="quotes" className="gap-2">
                        <FileText size={16} />
                        <span className="hidden sm:inline">Quotes</span>
                        <Badge variant="secondary" className="ml-1 px-1 h-5 min-w-[20px]">{quotes.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="questions" className="gap-2">
                        <MessageCircleQuestion size={16} />
                        <span className="hidden sm:inline">Q&A</span>
                        <Badge variant="secondary" className="ml-1 px-1 h-5 min-w-[20px]">{questions.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="gap-2">
                        <Activity size={16} />
                        <span className="hidden sm:inline">Activity</span>
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab: Description + Main Comment Thread */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                        {request.description}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Discussion & AI Prompts</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CommentThread
                                        requestId={request.id}
                                        comments={comments}
                                        onCommentAdded={handleCommentAdded}
                                        onSlicesCreated={handleSlicesCreated}
                                        currentUser={currentUser}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Location:</span>
                                        <div className="font-medium">{request.location || 'Remote'}</div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Posted by:</span>
                                        <div className="font-medium">{request.user?.fullName || 'Unknown'}</div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Created:</span>
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
                            <h3 className="text-lg font-semibold">Submitted Quotes</h3>
                            {quotes.length === 0 ? (
                                <Card className="bg-muted/50 border-dashed">
                                    <CardContent className="py-8 text-center text-muted-foreground">
                                        No quotes received yet.
                                    </CardContent>
                                </Card>
                            ) : (
                                quotes.map((quote: any) => (
                                    <Card key={quote.id}>
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-base">
                                                    Quote from {quote.provider?.fullName || 'Provider'}
                                                </CardTitle>
                                                <Badge>{quote.status}</Badge>
                                            </div>
                                            <div className="text-2xl font-bold text-orange-600">
                                                ${(quote.amount / 100).toFixed(2)}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-600 mb-4">{quote.message}</p>

                                            {/* Optimization Thread for this Quote */}
                                            <div className="mt-4 pt-4 border-t">
                                                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                                                    Optimization & Discussion
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
                <TabsContent value="questions" className="mt-6">
                    <QuestionThread
                        requestId={request.id}
                        questions={questions}
                        currentUser={currentUser}
                        isOwner={isOwner}
                        onQuestionAdded={handleQuestionAdded}
                        onQuestionUpdated={handleQuestionUpdated}
                        onAnswerAdded={handleAnswerAdded}
                    />
                </TabsContent>

                {/* Activity Tab: Just a full view of comments for now */}
                <TabsContent value="activity" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Full Activity Log</CardTitle>
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
