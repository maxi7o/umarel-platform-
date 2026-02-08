
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyArgentinaDni } from '@/lib/services/verifik-service';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { dniNumber, images } = await req.json();

        if (!dniNumber || dniNumber.length < 7) {
            return NextResponse.json({ error: 'Invalid DNI number' }, { status: 400 });
        }

        // --- STORAGE LOGIC ---
        const storagePaths: { [key: string]: string } = {};

        if (images) {
            for (const [key, base64Data] of Object.entries(images)) {
                if (typeof base64Data === 'string' && base64Data.startsWith('data:image')) {
                    const contentType = base64Data.split(';')[0].split(':')[1];
                    const buffer = Buffer.from(base64Data.split(',')[1], 'base64');
                    const fileName = `${user.id}/${key}_${Date.now()}.jpg`;

                    const { data, error: uploadError } = await supabase.storage
                        .from('identities')
                        .upload(fileName, buffer, {
                            contentType,
                            upsert: true
                        });

                    if (uploadError) {
                        console.error(`Upload error for ${key}:`, uploadError);
                        // We continue even if one upload fails, but log it
                    } else {
                        storagePaths[key] = data.path;
                    }
                }
            }
        }

        // Call Verifik
        const result = await verifyArgentinaDni(dniNumber);

        // Update user record with Verifik data AND storage paths
        await db.update(users)
            .set({
                dniNumber: dniNumber,
                dniVerifiedAt: new Date(),
                biometricStatus: 'verified',
                kycFrontPath: storagePaths.front || null,
                kycBackPath: storagePaths.back || null,
                kycSelfiePath: storagePaths.selfie || null
            })
            .where(eq(users.id, user.id));

        return NextResponse.json({
            success: true,
            data: result.data
        });

    } catch (error) {
        console.error('DNI Verification Route Error:', error);
        return NextResponse.json(
            { error: 'Failed to verify DNI', details: (error as Error).message },
            { status: 500 }
        );
    }
}
