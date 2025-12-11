import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { commentHearts, comments } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const commentId = params.id;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = user.id;

        // Check if already hearted
        const existing = await db.query.commentHearts.findFirst({
            where: and(
                eq(commentHearts.commentId, commentId),
                eq(commentHearts.userId, userId)
            ),
        });

        if (existing) {
            return NextResponse.json({ error: 'Already hearted' }, { status: 400 });
        }

        // Add heart
        await db.insert(commentHearts).values({
            commentId,
            userId,
        });

        // Increment hearts count
        const comment = await db.query.comments.findFirst({
            where: eq(comments.id, commentId),
        });

        if (comment) {
            await db
                .update(comments)
                .set({
                    heartsCount: (comment.heartsCount || 0) + 1,
                })
                .where(eq(comments.id, commentId));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error adding heart:', error);
        return NextResponse.json({ error: 'Failed to add heart' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const commentId = params.id;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = user.id;

        // Remove heart
        await db
            .delete(commentHearts)
            .where(
                and(
                    eq(commentHearts.commentId, commentId),
                    eq(commentHearts.userId, userId)
                )
            );

        // Decrement hearts count
        const comment = await db.query.comments.findFirst({
            where: eq(comments.id, commentId),
        });

        if (comment && (comment.heartsCount || 0) > 0) {
            await db
                .update(comments)
                .set({
                    heartsCount: (comment.heartsCount || 0) - 1,
                })
                .where(eq(comments.id, commentId));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error removing heart:', error);
        return NextResponse.json({ error: 'Failed to remove heart' }, { status: 500 });
    }
}
