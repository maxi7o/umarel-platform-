import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, users, serviceOfferings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;

        // Fetch user basic info
        const [user] = await db.select({
            id: users.id,
            fullName: users.fullName,
            avatarUrl: users.avatarUrl,
            auraPoints: users.auraPoints,
            createdAt: users.createdAt,
        })
            .from(users)
            .where(eq(users.id, userId));

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch extended profile
        const [profile] = await db.select()
            .from(profiles)
            .where(eq(profiles.userId, userId));

        // Fetch active service offerings
        const offerings = await db.select()
            .from(serviceOfferings)
            .where(
                and(
                    eq(serviceOfferings.providerId, userId),
                    eq(serviceOfferings.status, 'active')
                )
            );

        return NextResponse.json({
            ...user,
            profile: profile || null,
            offerings,
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;
        const body = await request.json();

        // TODO: Validate that current user is the owner of the profile

        // Check if profile exists
        const [existingProfile] = await db.select()
            .from(profiles)
            .where(eq(profiles.userId, userId));

        if (existingProfile) {
            const [updatedProfile] = await db.update(profiles)
                .set({
                    ...body,
                    updatedAt: new Date(),
                })
                .where(eq(profiles.userId, userId))
                .returning();
            return NextResponse.json(updatedProfile);
        } else {
            const [newProfile] = await db.insert(profiles)
                .values({
                    userId,
                    ...body,
                })
                .returning();
            return NextResponse.json(newProfile);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
