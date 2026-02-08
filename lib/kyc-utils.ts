import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

/**
 * Checks if a user has completed the mandatory KYC (Verifik) verification.
 * @param userId UUID of the user
 * @returns boolean
 */
export async function isUserVerified(userId: string): Promise<boolean> {
    const [user] = await db.select({
        biometricStatus: users.biometricStatus
    })
        .from(users)
        .where(eq(users.id, userId));

    if (!user) return false;

    // In production, this must specifically be 'verified'
    return user.biometricStatus === 'verified';
}

/**
 * Throws an error if the user is not verified.
 */
export async function ensureUserVerified(userId: string) {
    const verified = await isUserVerified(userId);
    if (!verified) {
        throw new Error('KYC_REQUIRED: Debes verificar tu identidad con Verifik para realizar esta acción.');
    }
}
