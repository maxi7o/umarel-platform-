import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { messages, conversations } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

// Mock user ID for now
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: conversationId } = await params;

        const conversationMessages = await db.select()
            .from(messages)
            .where(eq(messages.conversationId, conversationId))
            .orderBy(asc(messages.createdAt));

        return NextResponse.json(conversationMessages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: conversationId } = await params;
        const body = await request.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // Create message
        const [newMessage] = await db.insert(messages).values({
            conversationId,
            senderId: MOCK_USER_ID,
            content,
            read: false,
        }).returning();

        // Update conversation lastMessageAt
        await db.update(conversations)
            .set({ lastMessageAt: new Date() })
            .where(eq(conversations.id, conversationId));

        return NextResponse.json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
