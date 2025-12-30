"use client"

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
    userId: string;
    hearts?: number;
    isMarkedHelpful?: boolean;
    createdAt: Date;
    metadata?: any;
}

import { GUEST_USER_ID } from '@/lib/auth-constants';

interface MessageThreadProps {
    messages: Message[];
    currentUserId: string;
    sessionId?: string;
}

export function MessageThread({ messages, currentUserId, sessionId }: MessageThreadProps) {
    const [heartedMessages, setHeartedMessages] = useState<Set<string>>(new Set());

    const handleHeart = async (messageId: string) => {
        // TODO: API call
        setHeartedMessages(prev => {
            const next = new Set(prev);
            if (next.has(messageId)) {
                next.delete(messageId);
            } else {
                next.add(messageId);
            }
            return next;
        });
    };

    return (
        <div className="space-y-6">
            {messages.map((message) => {
                const isUser = message.role === 'user';
                // Check if message is own, considering Guest sessions
                const isOwn = message.userId === currentUserId && (
                    message.userId !== GUEST_USER_ID ||
                    !sessionId ||
                    message.metadata?.sessionId === sessionId
                );
                const isAI = message.role === 'assistant';

                return (
                    <div
                        key={message.id}
                        className={cn(
                            "flex gap-4",
                            isOwn && "flex-row-reverse"
                        )}
                    >
                        {/* Avatar */}
                        <Avatar className={cn(
                            "shrink-0",
                            isAI && "bg-gradient-to-br from-purple-500 to-pink-500"
                        )}>
                            <AvatarFallback>
                                {isAI ? '🧙' : isOwn ? 'You' : 'U'}
                            </AvatarFallback>
                        </Avatar>

                        {/* Message Content */}
                        <div className={cn(
                            "flex-1 space-y-2",
                            isOwn && "items-end"
                        )}>
                            <div className={cn(
                                "rounded-2xl px-4 py-3 max-w-2xl",
                                isOwn ? "bg-primary text-primary-foreground ml-auto" :
                                    isAI ? "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950" :
                                        "bg-gray-100 dark:bg-gray-800"
                            )}>
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>

                            {/* Actions */}
                            {!isOwn && (
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleHeart(message.id)}
                                        className={cn(
                                            "gap-1.5",
                                            heartedMessages.has(message.id) && "text-red-500"
                                        )}
                                    >
                                        <Heart
                                            className={cn(
                                                "h-4 w-4",
                                                heartedMessages.has(message.id) && "fill-current"
                                            )}
                                        />
                                        <span className="text-xs">{(message.hearts || 0) + (heartedMessages.has(message.id) ? 1 : 0)}</span>
                                    </Button>

                                    {message.isMarkedHelpful && (
                                        <span className="text-xs text-green-600 font-semibold">
                                            ✓ Marked Helpful
                                        </span>
                                    )}
                                </div>
                            )}

                            <p className="text-xs text-muted-foreground">
                                {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
