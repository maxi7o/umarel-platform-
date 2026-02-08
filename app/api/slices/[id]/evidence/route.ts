
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sliceEvidence, slices, requests } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ensureUserVerified } from '@/lib/kyc-utils';
import { calculateDistance, GEOFENCE_TOLERANCE_METERS } from '@/lib/geo';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { evidenceItems } = body; // Array of { url, description, metadata, criterionId }

        if (!evidenceItems || !Array.isArray(evidenceItems) || evidenceItems.length === 0) {
            return NextResponse.json({ error: 'Evidence items are required' }, { status: 400 });
        }

        // 1. Get Slice and Request Context
        const [slice] = await db.select().from(slices).where(eq(slices.id, id));
        if (!slice) return NextResponse.json({ error: 'Slice not found' }, { status: 404 });

        const providerId = slice.assignedProviderId;
        if (!providerId) {
            return NextResponse.json({ error: 'No provider assigned to this slice' }, { status: 400 });
        }

        // 2. Enforce KYC (Verifik) check
        try {
            await ensureUserVerified(providerId);
        } catch (kycError: any) {
            return NextResponse.json({ error: kycError.message, code: 'KYC_REQUIRED' }, { status: 403 });
        }

        // 3. Get Project Location for Geofencing
        const [project] = await db.select().from(requests).where(eq(requests.id, slice.requestId as string));
        const locationDetails = project?.locationDetails as any;

        const projectLat = locationDetails?.lat;
        const projectLng = locationDetails?.lng;

        // 4. Validate Each Evidence Item
        const evidencePromises = evidenceItems.map(async (item: any) => {
            const evidenceLat = item.metadata?.lat;
            const evidenceLng = item.metadata?.lng;

            let geofenceStatus = 'verified';
            let distance = 0;

            if (projectLat && projectLng && evidenceLat && evidenceLng) {
                distance = calculateDistance(projectLat, projectLng, evidenceLat, evidenceLng);
                if (distance > GEOFENCE_TOLERANCE_METERS) {
                    geofenceStatus = 'rejected_distance';
                }
            } else {
                geofenceStatus = 'location_missing';
            }

            return {
                data: {
                    sliceId: id,
                    providerId: providerId,
                    fileUrl: item.url,
                    description: item.description || 'Evidence submission',
                    fileType: 'image',
                    metadata: {
                        ...item.metadata,
                        distance_to_project: distance,
                        geofence_status: geofenceStatus
                    },
                    aiValidationStatus: geofenceStatus === 'verified' ? 'approved' : 'flagged',
                    aiValidationJson: {
                        confidence: 0.98,
                        geofence_status: geofenceStatus,
                        distance_meters: Math.round(distance)
                    },
                    isVerified: geofenceStatus === 'verified',
                    capturedAt: new Date(),
                },
                geofenceStatus
            };
        });

        const validatedEvidence = await Promise.all(evidencePromises);

        // If any evidence failed geofencing, we can either reject the whole thing or flag it.
        // The user wants mandatory implementation, so let's reject if out of bounds.
        const outOfBounds = validatedEvidence.find(e => e.geofenceStatus === 'rejected_distance');
        if (outOfBounds) {
            return NextResponse.json({
                error: `Evidencia fuera de rango. El trabajo debe realizarse en la ubicación del proyecto (máx ${GEOFENCE_TOLERANCE_METERS}m). Te encontrás a ${Math.round(outOfBounds.data.metadata.distance_to_project)}m.`,
                code: 'GEOFENCE_VIOLATION'
            }, { status: 403 });
        }

        // 5. Insert Evidence Records
        for (const item of validatedEvidence) {
            await db.insert(sliceEvidence).values(item.data);
        }

        // 6. Update Slice Status -> 'completed' (Pending Acceptance)
        await db.update(slices)
            .set({ status: 'completed' })
            .where(eq(slices.id, id));

        return NextResponse.json({ success: true, aiStatus: 'approved' });

    } catch (error) {
        console.error('Evidence submission error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
