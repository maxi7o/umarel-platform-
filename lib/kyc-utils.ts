import { db } from '@/lib/db';
import { users, userWallets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Checks if a user has completed the mandatory KYC (Verifik) verification AND has bank details.
 * @param userId UUID of the user
 * @returns boolean
 */
export async function isUserVerified(userId: string): Promise<boolean> {
    const [data] = await db.select({
        biometricStatus: users.biometricStatus,
        cbuAlias: userWallets.cbuAlias
    })
        .from(users)
        .leftJoin(userWallets, eq(users.id, userWallets.userId))
        .where(eq(users.id, userId));

    if (!data) return false;

    // Must be verified and have a CBU/Alias for payouts
    return data.biometricStatus === 'verified' && !!data.cbuAlias;
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
