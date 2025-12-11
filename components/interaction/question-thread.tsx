'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    MessageCircleQuestion,
    Send,
    Users,
    CheckCircle2,
    Coins,
    Sparkles,
    User
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Answer {
    id: string;
    content: string;
    upvotes: number;
    auraReward: number;
    moneyReward: number;
    isAccepted: boolean;
    createdAt: string;
    answerer?: {
        fullName: string;
        auraPoints: number;
    };
}

interface Question {
    id: string;
    content: string;
    status: 'pending' | 'forwarded_to_community' | 'answered';
    forwardedToCommunity: boolean;
    createdAt: string;
    asker?: {
        fullName: string;
    };
    answers: Answer[];
}

interface QuestionThreadProps {
    requestId: string;
    questions: Question[];
    currentUser?: any;
    isOwner: boolean;
    onQuestionAdded?: (question: Question) => void;
    onQuestionUpdated?: (question: Question) => void;
    onAnswerAdded?: (questionId: string, answer: Answer) => void;
}

export function QuestionThread({
    requestId,
    questions,
    currentUser,
    isOwner,
    onQuestionAdded,
    onQuestionUpdated,
    onAnswerAdded,
}: QuestionThreadProps) {
    const [newQuestion, setNewQuestion] = useState('');
    const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAskQuestion = async () => {
        if (!newQuestion.trim()) return;

        if (!currentUser) {
            toast.error("Please log in to ask a question");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/requests/${requestId}/questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newQuestion,
                    askerId: currentUser.id,
                }),
            });

            if (!res.ok) throw new Error('Failed to post question');

            const question = await res.json();
            toast.success("Question posted!");
            setNewQuestion('');

            if (onQuestionAdded) onQuestionAdded(question);
        } catch (error) {
            console.error(error);
            toast.error("Failed to post question");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForwardToCommunity = async (questionId: string) => {
        try {
            const res = await fetch(`/api/questions/${questionId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ forwardToCommunity: true }),
            });

            if (!res.ok) throw new Error('Failed to forward question');

            const updatedQuestion = await res.json();
            toast.success("Question forwarded to Umarel community! 🎉");

            if (onQuestionUpdated) onQuestionUpdated(updatedQuestion);
        } catch (error) {
            console.error(error);
            toast.error("Failed to forward question");
        }
    };

    const handleSubmitAnswer = async (questionId: string) => {
        const content = answerInputs[questionId];
        if (!content?.trim()) return;

        if (!currentUser) {
            toast.error("Please log in to answer");
            return;
        }

        try {
            const res = await fetch(`/api/questions/${questionId}/answers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    answererId: currentUser.id,
                }),
            });

            if (!res.ok) throw new Error('Failed to post answer');

            const answer = await res.json();

            // Show reward notification
            if (answer.rewards.aura > 0 || answer.rewards.money > 0) {
                toast.success(
                    `Answer posted! You earned ${answer.rewards.aura} aura` +
                    (answer.rewards.money > 0 ? ` and $${(answer.rewards.money / 100).toFixed(2)}` : '') +
                    '! 🎉'
                );
            } else {
                toast.success("Answer posted!");
            }

            setAnswerInputs(prev => ({ ...prev, [questionId]: '' }));

            if (onAnswerAdded) onAnswerAdded(questionId, answer);
        } catch (error) {
            console.error(error);
            toast.error("Failed to post answer");
        }
    };

    return (
        <div className="space-y-6">
            {/* Ask Question Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircleQuestion className="h-5 w-5" />
                        Ask a Question
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Textarea
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Ask about costs, timeline, materials, or anything that helps you provide a better quote..."
                            className="min-h-[100px]"
                        />
                        <Button
                            onClick={handleAskQuestion}
                            disabled={isSubmitting || !newQuestion.trim()}
                            className="w-full"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            {isSubmitting ? 'Posting...' : 'Post Question'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Questions List */}
            <div className="space-y-4">
                {questions.map((question) => (
                    <Card key={question.id} className="border-l-4 border-l-blue-500">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-xs">
                                                <User className="h-3 w-3" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">
                                            {question.asker?.fullName || 'Service Provider'}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(question.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-base">{question.content}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {question.forwardedToCommunity ? (
                                        <Badge variant="secondary" className="gap-1">
                                            <Users className="h-3 w-3" />
                                            Community
                                        </Badge>
                                    ) : isOwner ? (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleForwardToCommunity(question.id)}
                                            className="gap-1"
                                        >
                                            <Users className="h-3 w-3" />
                                            Forward to Community
                                        </Button>
                                    ) : null}
                                    {question.status === 'answered' && (
                                        <Badge variant="default" className="gap-1 bg-green-600">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Answered
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        {/* Answers */}
                        {question.answers.length > 0 && (
                            <CardContent className="space-y-3 pt-0">
                                <div className="border-t pt-4">
                                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-orange-500" />
                                        Answers from Umarels
                                    </h4>
                                    {question.answers.map((answer) => (
                                        <div
                                            key={answer.id}
                                            className={cn(
                                                "p-3 rounded-lg mb-2 border",
                                                answer.isAccepted ? "bg-green-50 border-green-200" : "bg-muted/30"
                                            )}
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-5 w-5">
                                                        <AvatarFallback className="text-xs bg-orange-100">
                                                            <Sparkles className="h-3 w-3 text-orange-600" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs font-medium">
                                                        {answer.answerer?.fullName || 'Umarel'}
                                                    </span>
                                                    {answer.answerer?.auraPoints && (
                                                        <Badge variant="outline" className="text-xs px-1 h-4">
                                                            {answer.answerer.auraPoints} aura
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    {answer.auraReward > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <Sparkles className="h-3 w-3" />
                                                            +{answer.auraReward}
                                                        </span>
                                                    )}
                                                    {answer.moneyReward > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <Coins className="h-3 w-3" />
                                                            +${(answer.moneyReward / 100).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm">{answer.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        )}

                        {/* Answer Input (for community questions or owner) */}
                        {(question.forwardedToCommunity || isOwner) && (
                            <CardContent className="pt-0">
                                <div className="border-t pt-4 space-y-2">
                                    <Textarea
                                        value={answerInputs[question.id] || ''}
                                        onChange={(e) => setAnswerInputs(prev => ({
                                            ...prev,
                                            [question.id]: e.target.value
                                        }))}
                                        placeholder={
                                            question.forwardedToCommunity
                                                ? "Share your expertise and earn aura + rewards! 💰"
                                                : "Provide an answer..."
                                        }
                                        className="min-h-[80px] text-sm"
                                    />
                                    <Button
                                        size="sm"
                                        onClick={() => handleSubmitAnswer(question.id)}
                                        disabled={!answerInputs[question.id]?.trim()}
                                        className="w-full"
                                    >
                                        <Send className="h-3 w-3 mr-2" />
                                        Submit Answer
                                    </Button>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}

                {questions.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="py-8 text-center text-muted-foreground">
                            <MessageCircleQuestion className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No questions yet. Service providers can ask questions to better understand the project.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
