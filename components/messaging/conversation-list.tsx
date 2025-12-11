"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { Loader2 } from "lucide-react"

interface Conversation {
    id: string
    lastMessageAt: string
    lastMessage: string
    otherUser: {
        id: string
        fullName: string
        avatarUrl: string | null
    }
    unreadCount: number
}

interface ConversationListProps {
    selectedId?: string
    onSelect: (id: string) => void
}

export function ConversationList({ selectedId, onSelect }: ConversationListProps) {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchConversations()
        // Poll every 10 seconds
        const interval = setInterval(fetchConversations, 10000)
        return () => clearInterval(interval)
    }, [])

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/conversations')
            if (res.ok) {
                const data = await res.json()
                setConversations(data)
            }
        } catch (error) {
            console.error('Failed to fetch conversations', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (conversations.length === 0) {
        return (
            <div className="text-center p-8 text-muted-foreground">
                No messages yet.
            </div>
        )
    }

    return (
        <ScrollArea className="h-[600px]">
            <div className="space-y-2 p-2">
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => onSelect(conv.id)}
                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent ${selectedId === conv.id ? 'bg-accent' : ''
                            }`}
                    >
                        <Avatar>
                            <AvatarImage src={conv.otherUser.avatarUrl || undefined} />
                            <AvatarFallback>{conv.otherUser.fullName?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <h4 className="font-semibold truncate">{conv.otherUser.fullName}</h4>
                                <span className="text-xs text-muted-foreground">
                                    {conv.lastMessageAt && formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                                {conv.lastMessage}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}
