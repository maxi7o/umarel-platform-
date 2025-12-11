"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2 } from "lucide-react"

interface Message {
    id: string
    senderId: string
    content: string
    createdAt: string
}

interface ChatWindowProps {
    conversationId: string
    currentUserId: string
}

export function ChatWindow({ conversationId, currentUserId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchMessages()
        // Poll every 5 seconds
        const interval = setInterval(fetchMessages, 5000)
        return () => clearInterval(interval)
    }, [conversationId])

    useEffect(() => {
        // Scroll to bottom on new messages
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/conversations/${conversationId}/messages`)
            if (res.ok) {
                const data = await res.json()
                setMessages(data)
            }
        } catch (error) {
            console.error('Failed to fetch messages', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        setIsSending(true)
        try {
            const res = await fetch(`/api/conversations/${conversationId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage }),
            })

            if (res.ok) {
                setNewMessage("")
                fetchMessages() // Refresh immediately
            }
        } catch (error) {
            console.error('Failed to send message', error)
        } finally {
            setIsSending(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[600px]">
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((msg) => {
                        const isMe = msg.senderId === currentUserId
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg px-4 py-2 ${isMe
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                        }`}
                                >
                                    <p className="text-sm">{msg.content}</p>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>
            <div className="p-4 border-t">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isSending}
                    />
                    <Button type="submit" size="icon" disabled={isSending}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
