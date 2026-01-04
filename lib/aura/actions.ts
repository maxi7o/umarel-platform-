'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { calculateAuraLevel } from './calculations';

export type AuraActionType =
    | 'VALID_SLICE_CREATION'
    | 'HELPFUL_CLARIFICATION'
    | 'COMMUNITY_UPVOTE'
    | 'COMPLETED_SLICE'
    | 'DISPUTE_LOST' // Penalty
    | 'DISPUTE_FEE' // Cost
    | 'JURY_DUTY'   // Reward for voting
    | 'AUDIT_SUCCESS'; // Reward for catching a honey pot

const AURA_POINTS = {
    VALID_SLICE_CREATION: 10,
    HELPFUL_CLARIFICATION: 5,
    COMMUNITY_UPVOTE: 2,
    COMPLETED_SLICE: 50,
    DISPUTE_LOST: -500,
    DISPUTE_FEE: -50,
    JURY_DUTY: 20,
    AUDIT_SUCCESS: 50
};

export async function awardAura(userId: string, actionType: AuraActionType, multiplier: number = 1) {
    try {
        const points = Math.round(AURA_POINTS[actionType] * multiplier);
        if (points === 0) return; // Allow negative changes

        // 1. Update User Aura Points
        const [updatedUser] = await db.update(users)
            .set({
                auraPoints: sql`${users.auraPoints} + ${points}`
            })
            .where(eq(users.id, userId))
            .returning();

        if (!updatedUser) return;

        // 2. Check and Update Level if needed
        const newLevel = calculateAuraLevel(updatedUser.auraPoints || 0);
        if (newLevel !== updatedUser.auraLevel) {
            await db.update(users)
                .set({ auraLevel: newLevel })
                .where(eq(users.id, userId));
            // TODO: Create notification for level up
        }

        return { success: true, pointsAwarded: points, newTotal: updatedUser.auraPoints, newLevel };
    } catch (error) {
        console.error('Failed to award Aura:', error);
        return { success: false, error };
    }
}
