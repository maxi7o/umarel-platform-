import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch user verification data from database
        const [userData] = await db
            .select({
                biometricStatus: users.biometricStatus,
                biometricVerifiedAt: users.biometricVerifiedAt,
                dniNumber: users.dniNumber,
                dniVerifiedAt: users.dniVerifiedAt,
                kycFrontPath: users.kycFrontPath,
                kycBackPath: users.kycBackPath,
                kycSelfiePath: users.kycSelfiePath,
            })
            .from(users)
            .where(eq(users.id, user.id))
            .limit(1);

        if (!userData) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            verification: userData
        });

    } catch (error) {
        console.error('Verification status error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: (error as Error).message },
            { status: 500 }
        );
    }
}
