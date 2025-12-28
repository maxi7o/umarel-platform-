'use server';

import { db } from '@/lib/db';
import { profiles, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface ProfileUpdateData {
    fullName?: string;
    avatarUrl?: string;
    bio?: string;
    tagline?: string;
    location?: string;
    website?: string;
    socialLinks?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
    };
}

export async function updateProfile(userId: string, data: ProfileUpdateData) {
    try {
        // 1. Update Users table (Basic Info)
        if (data.fullName || data.avatarUrl) {
            await db.update(users)
                .set({
                    fullName: data.fullName,
                    avatarUrl: data.avatarUrl,
                })
                .where(eq(users.id, userId));
        }

        // 2. Update Profiles table (Extended Info)
        // Check if profile exists first
        const existingProfile = await db.query.profiles.findFirst({
            where: eq(profiles.userId, userId),
        });

        const profileData = {
            bio: data.bio,
            tagline: data.tagline,
            location: data.location,
            website: data.website,
            socialLinks: data.socialLinks,
            updatedAt: new Date(),
        };

        if (existingProfile) {
            await db.update(profiles)
                .set(profileData)
                .where(eq(profiles.userId, userId));
        } else {
            await db.insert(profiles).values({
                userId,
                ...profileData,
            });
        }

        revalidatePath('/[locale]/profile/[id]', 'page');
        return { success: true };
    } catch (error) {
        console.error('Failed to update profile:', error);
        return { success: false, error: 'Failed to update profile' };
    }
}
