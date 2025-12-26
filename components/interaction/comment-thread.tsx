'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Send, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SliceProposal } from './slice-proposal';

interface Comment {
    id: string;
    content: string;
    type: 'text' | 'prompt' | 'ai_response';
    isAiGenerated: boolean;
    userId: string;
    createdAt: string;
    quoteId?: string;
    user?: { fullName: string; avatarUrl: string }; // In real app, joined
    slices?: any[]; // Array of propose/created slices from AI response
}

interface CommentThreadProps {
    requestId: string;
    quoteId?: string;
    comments?: Comment[]; // Now controlled by parent
    initialComments?: Comment[]; // Fallback if not controlled
    onCommentAdded?: (comment: Comment) => void;
    onSlicesCreated?: (slices: any[]) => void;
    currentUser?: any;
    mode?: 'public' | 'private_insight';
}

import { useTranslations } from 'next-intl';

export function CommentThread({
    requestId,
    quoteId,
    comments: parentComments,
    initialComments = [],
    onCommentAdded,
    onSlicesCreated,
    currentUser,
    mode = 'public'
}: CommentThreadProps) {
    const t = useTranslations('requestInteraction');
    // Use parent-controlled state if provided, otherwise use local state
    const [localComments, setLocalComments] = useState<Comment[]>(initialComments);
    const comments = parentComments !== undefined ? parentComments : localComments;
    const isControlled = parentComments !== undefined;

    const [newComment, setNewComment] = useState('');
    const [isPromptMode, setIsPromptMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Only poll for new comments if not controlled by parent
    useEffect(() => {
        if (isControlled) return; // Parent manages state, no polling needed

        const interval = setInterval(async () => {
            try {
                let url = `/api/requests/${requestId}/comments`;
                if (mode === 'private_insight' && currentUser?.id) {
                    url += `?userId=${currentUser.id}`;
                }

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    const filtered = quoteId
                        ? data.filter((c: any) => c.quoteId === quoteId)
                        : data.filter((c: any) => !c.quoteId);
                    setLocalComments(filtered);
                }
            } catch (e) {
                console.error("Polling error", e);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [requestId, quoteId, isControlled, mode, currentUser?.id]);

    const handleSubmit = async () => {
        if (!newComment.trim()) return;

        if (!currentUser) {
            toast.error("Please log in to post a comment");
            return;
        }

        setIsLoading(true);

        try {
            // 1. Post the comment
            const res = await fetch(`/api/requests/${requestId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newComment,
                    type: isPromptMode ? 'prompt' : 'text',
                    userId: currentUser.id,
                    quoteId
                })
            });

            if (!res.ok) throw new Error('Failed to post comment');
            const savedComment = await res.json();

            // Optimistically add user details if not returned by API (API might just return raw DB row)
            if (!savedComment.user && currentUser) {
                savedComment.user = {
                    fullName: currentUser.fullName,
                    avatarUrl: currentUser.avatarUrl
                };
            }

            // Update state via callback or local state
            if (onCommentAdded) {
                onCommentAdded(savedComment);
            } else {
                setLocalComments(prev => [...prev, savedComment]);
            }

            const promptContent = newComment;
            setNewComment('');

            // 2. If it's a prompt, trigger AI
            if (isPromptMode) {
                toast.info("AI Agent is analyzing...");

                // Use Wizard API for Request Slicing flow
                // For quotes, valid endpoint is different, but for this demo let's focus on Wizard flow
                const aiEndpoint = quoteId
                    ? `/api/quotes/${quoteId}/optimize`
                    : `/api/wizard/message`;

                const aiRes = await fetch(aiEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: promptContent,
                        sliceId: "primary", // TODO: Pass actual context/primary slice ID properly
                        userId: currentUser.id
                        // The Wizard API expects 'sliceId' and 'content'
                    })
                });

                if (aiRes.ok) {
                    const aiData = await aiRes.json();

                    // The Wizard API returns { message: string, sliceCards: [], userMessage: ... }
                    // We need to adapt it to a "Comment" structure for this thread

                    if (aiData.message) {
                        const aiComment: Comment = {
                            id: aiData.message.id || `ai-${Date.now()}`,
                            content: aiData.message.content,
                            type: 'ai_response',
                            isAiGenerated: true,
                            userId: 'ai-agent',
                            createdAt: new Date().toISOString(),
                            user: { fullName: 'AI Agent', avatarUrl: '' },
                            // Identify newly created slices from the wizard response
                            slices: aiData.sliceCards?.filter((sc: any) =>
                                !comments.some(c => c.slices?.some(s => s.id === sc.id)) && // Dedupe if needed
                                sc.title !== "Primary Request" // Filter out the main card if it returns it
                            )
                        };

                        if (onCommentAdded) {
                            onCommentAdded(aiComment);
                        } else {
                            setLocalComments(prev => [...prev, aiComment]);
                        }
                    }

                    // Handle slices if generated (Global Handler)
                    if (aiData.sliceCards && onSlicesCreated) {
                        onSlicesCreated(aiData.sliceCards);
                        toast.success(`AI updated project structure!`);
                    }
                } else {
                    toast.error("AI processing failed. Please try again.");
                }
            } else {
                toast.success("Comment posted!");
            }
        } catch (error) {
            toast.error("Failed to post comment");
            console.error(error);
        } finally {
            setIsLoading(false);
            setIsPromptMode(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        className={cn(
                            "flex gap-3 p-4 rounded-lg",
                            comment.type === 'prompt' ? "bg-purple-50 dark:bg-purple-900/20 border border-purple-100" : "bg-gray-50 dark:bg-gray-800/50",
                            comment.isAiGenerated && "bg-blue-50 dark:bg-blue-900/10 border border-blue-100"
                        )}
                    >
                        <Avatar className="h-8 w-8 mt-1">
                            {comment.isAiGenerated ? (
                                <AvatarFallback className="bg-blue-600 text-white"><Bot size={16} /></AvatarFallback>
                            ) : (
                                <AvatarFallback><User size={16} /></AvatarFallback>
                            )}
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm">
                                    {comment.isAiGenerated ? "AI Agent" : (comment.user?.fullName || "User")}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(comment.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="text-sm whitespace-pre-wrap">{comment.content}</div>

                            {/* Render Slice Proposals if Any */}
                            {comment.slices && comment.slices.length > 0 && (
                                <div className="mt-3 grid gap-2">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Proposed Slices
                                    </p>
                                    {comment.slices.map((slice: any) => (
                                        <SliceProposal
                                            key={slice.id}
                                            slice={slice}
                                            // onAccept handled globally implicitly for now via creating them directly
                                            // In a clearer flow, we would create them as "drafts" and let user accept here.
                                            // For now, since Wizard creates them directly, we just show them "interactive-like"
                                            isAccepted={true}
                                            onAccept={() => toast.success("Opening slice details...")}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <div className="text-center text-muted-foreground py-8 text-sm">
                        {mode === 'private_insight'
                            ? t('noInsights')
                            : t('noComments')}
                    </div>
                )}
            </div>



            {/* Umarel Notebook Input */}
            <div className="relative border-2 border-stone-300 dark:border-stone-700 bg-[#fffdf5] dark:bg-[#1c1917] rounded-xl shadow-sm overflow-hidden p-1 group focus-within:ring-2 ring-orange-400/50 transition-all">
                {/* Notebook Header Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-400/20 w-full z-0"></div>
                <div className="absolute top-0 left-6 bottom-0 w-[1px] bg-red-400/20 z-0 h-full"></div>

                <div className="relative z-10 p-3 pb-1 pl-10">
                    {newComment.length === 0 && !isPromptMode && (
                        <div className="absolute top-4 left-10 text-stone-400 italic pointer-events-none text-sm font-serif">
                            {t('placeholder')}
                        </div>
                    )}
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={
                            isPromptMode
                                ? t('placeholderPrompt')
                                : mode === 'private_insight'
                                    ? t('placeholderInsight')
                                    : t('placeholderComment')
                        }
                        className="min-h-[100px] border-0 bg-transparent focus-visible:ring-0 p-0 resize-none shadow-none text-base text-stone-800 dark:text-stone-200 font-medium placeholder:text-transparent"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-stone-100/50 dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-800 relative z-20">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsPromptMode(!isPromptMode)}
                        className={cn(
                            "gap-2 transition-colors",
                            isPromptMode ? "text-purple-600 bg-purple-50" : "text-muted-foreground"
                        )}
                    >
                        <Sparkles size={16} />
                        {isPromptMode ? t('aiModeActive') : t('aiMode')}
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={isLoading || !newComment.trim()}
                        className={cn(isPromptMode && "bg-purple-600 hover:bg-purple-700")}
                    >
                        {isLoading ? t('sending') : (
                            <>
                                {t('send')} <Send size={14} className="ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div >
    );
}
