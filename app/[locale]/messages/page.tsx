"use client"

import { useState } from "react"
import { ConversationList } from "@/components/messaging/conversation-list"
import { ChatWindow } from "@/components/messaging/chat-window"
import { Card } from "@/components/ui/card"

// Mock user ID for now
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function MessagesPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>()

    return (
        <div className="container mx-auto max-w-6xl py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Messages</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
                {/* Conversation List Sidebar */}
                <Card className="md:col-span-1 border-r">
                    <ConversationList
                        selectedId={selectedConversationId}
                        onSelect={setSelectedConversationId}
                    />
                </Card>

                {/* Chat Window */}
                <Card className="md:col-span-2">
                    {selectedConversationId ? (
                        <ChatWindow
                            conversationId={selectedConversationId}
                            currentUserId={MOCK_USER_ID}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            Select a conversation to start chatting
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
