import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations, messages, users } from '@/lib/db/schema';
import { eq, or, desc, and } from 'drizzle-orm';

// Mock user ID for now - in production this would come from auth
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

export async function GET(request: NextRequest) {
    try {
        // Fetch conversations where current user is a participant
        const userConversations = await db.select({
            id: conversations.id,
            lastMessageAt: conversations.lastMessageAt,
            participant1Id: conversations.participant1Id,
            participant2Id: conversations.participant2Id,
            participant1: {
                id: users.id,
                fullName: users.fullName,
                avatarUrl: users.avatarUrl,
            },
            // Note: In a real join we'd alias users table to get both participants
            // For MVP simplicity we'll fetch participants separately or rely on client to know who is who
        })
            .from(conversations)
            .leftJoin(users, eq(users.id, conversations.participant1Id)) // Joining one participant for now
            .where(
                or(
                    eq(conversations.participant1Id, MOCK_USER_ID),
                    eq(conversations.participant2Id, MOCK_USER_ID)
                )
            )
            .orderBy(desc(conversations.lastMessageAt));

        // Enhanced fetching to get the "other" participant details
        // This is a bit N+1 but fine for MVP scale
        const enrichedConversations = await Promise.all(userConversations.map(async (conv) => {
            const otherUserId = conv.participant1Id === MOCK_USER_ID ? conv.participant2Id : conv.participant1Id;
            const [otherUser] = await db.select().from(users).where(eq(users.id, otherUserId));

            // Get last message content
            const [lastMessage] = await db.select()
                .from(messages)
                .where(eq(messages.conversationId, conv.id))
                .orderBy(desc(messages.createdAt))
                .limit(1);

            return {
                ...conv,
                otherUser: {
                    id: otherUser?.id,
                    fullName: otherUser?.fullName,
                    avatarUrl: otherUser?.avatarUrl,
                },
                lastMessage: lastMessage?.content || 'No messages yet',
                unreadCount: 0 // TODO: Implement unread count logic
            };
        }));

        return NextResponse.json(enrichedConversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { participantId } = body;

        if (!participantId) {
            return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
        }

        // Check if conversation already exists
        const [existingConv] = await db.select()
            .from(conversations)
            .where(
                or(
                    and(
                        eq(conversations.participant1Id, MOCK_USER_ID),
                        eq(conversations.participant2Id, participantId)
                    ),
                    and(
                        eq(conversations.participant1Id, participantId),
                        eq(conversations.participant2Id, MOCK_USER_ID)
                    )
                )
            );

        if (existingConv) {
            return NextResponse.json(existingConv);
        }

        // Create new conversation
        const [newConv] = await db.insert(conversations).values({
            participant1Id: MOCK_USER_ID,
            participant2Id: participantId,
        }).returning();

        return NextResponse.json(newConv);
    } catch (error) {
        console.error('Error creating conversation:', error);
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
    }
}
