
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyArgentinaDni } from '@/lib/services/verifik-service';
import { db } from '@/lib/db';
import { users, userWallets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { dniNumber, cbu, images } = await req.json();

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

        // Call Verifik (Graceful degradation)
        let verificationData = null;
        let biometricStatus = 'pending'; // Default: manual review required

        try {
            const result = await verifyArgentinaDni(dniNumber);
            verificationData = result.data;
            biometricStatus = 'verified'; // Auto-verified by API
        } catch (verifikError) {
            console.warn('Verifik API failed. Proceeding with pending status.', verifikError);
            // We allow the user to continue, but their identity is not auto-verified.
        }

        // Update user record with Verifik data (if any) and storage paths
        await db.update(users)
            .set({
                dniNumber: dniNumber,
                dniVerifiedAt: biometricStatus === 'verified' ? new Date() : null,
                biometricStatus: biometricStatus,
                kycFrontPath: storagePaths.front || null,
                kycBackPath: storagePaths.back || null,
                kycSelfiePath: storagePaths.selfie || null
            })
            .where(eq(users.id, user.id));

        // Store CBU/Alias if provided
        if (cbu) {
            const isNumericCbu = /^\d+$/.test(cbu);

            await db.insert(userWallets)
                .values({
                    userId: user.id,
                    cbuNumber: isNumericCbu ? cbu : null,
                    cbuAlias: !isNumericCbu ? cbu : null
                })
                .onConflictDoUpdate({
                    target: userWallets.userId,
                    set: {
                        cbuNumber: isNumericCbu ? cbu : undefined, // Only update what changed
                        cbuAlias: !isNumericCbu ? cbu : undefined
                    }
                });
        }

        return NextResponse.json({
            success: true,
            data: verificationData,
            status: biometricStatus
        });

    } catch (error) {
        console.error('DNI Verification Route Error:', error);
        return NextResponse.json(
            { error: 'Failed to verify DNI', details: (error as Error).message },
            { status: 500 }
        );
    }
}
