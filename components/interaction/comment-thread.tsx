'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Send, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Comment {
    id: string;
    content: string;
    type: 'text' | 'prompt' | 'ai_response';
    isAiGenerated: boolean;
    userId: string;
    createdAt: string;
    quoteId?: string;
    user?: { fullName: string; avatarUrl: string }; // In real app, joined
}

interface CommentThreadProps {
    requestId: string;
    quoteId?: string;
    comments?: Comment[]; // Now controlled by parent
    initialComments?: Comment[]; // Fallback if not controlled
    onCommentAdded?: (comment: Comment) => void;
    onSlicesCreated?: (slices: any[]) => void;
    currentUser?: any;
}

export function CommentThread({
    requestId,
    quoteId,
    comments: parentComments,
    initialComments = [],
    onCommentAdded,
    onSlicesCreated,
    currentUser
}: CommentThreadProps) {
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
                const res = await fetch(`/api/requests/${requestId}/comments`);
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
    }, [requestId, quoteId, isControlled]);

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
                const aiEndpoint = quoteId
                    ? `/api/quotes/${quoteId}/optimize`
                    : `/api/requests/${requestId}/slice`;

                const aiRes = await fetch(aiEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: promptContent,
                        userId: currentUser.id
                    })
                });

                if (aiRes.ok) {
                    const aiData = await aiRes.json();

                    // Add AI comment to state
                    if (aiData.comment) {
                        if (onCommentAdded) {
                            onCommentAdded(aiData.comment);
                        } else {
                            setLocalComments(prev => [...prev, aiData.comment]);
                        }
                    }

                    // Handle slices if generated
                    if (aiData.slices && onSlicesCreated) {
                        onSlicesCreated(aiData.slices);
                        toast.success(`AI generated ${aiData.slices.length} slices!`);
                    } else if (aiData.suggestions) {
                        toast.success("AI provided optimization suggestions!");
                    } else {
                        toast.success("AI response received!");
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
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm">
                                    {comment.isAiGenerated ? "AI Agent" : "User"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(comment.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="text-sm whitespace-pre-wrap">{comment.content}</div>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <div className="text-center text-muted-foreground py-8 text-sm">
                        No comments yet. Start the conversation!
                    </div>
                )}
            </div>

            <div className="border rounded-lg p-3 bg-background focus-within:ring-1 ring-ring">
                <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={isPromptMode ? "Ask the AI Agent to split tasks, optimize, or suggest..." : "Write a comment..."}
                    className="min-h-[80px] border-0 focus-visible:ring-0 p-0 resize-none shadow-none"
                />
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
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
                        {isPromptMode ? "AI Prompt Mode Active" : "AI Prompt Mode"}
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={isLoading || !newComment.trim()}
                        className={cn(isPromptMode && "bg-purple-600 hover:bg-purple-700")}
                    >
                        {isLoading ? "Sending..." : (
                            <>
                                Send <Send size={14} className="ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
