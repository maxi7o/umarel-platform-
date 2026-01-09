
import { db } from '@/lib/db';
import { slices, requests, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

async function main() {
    console.log('🚀 Verifying Material Advance Schema & Logic...');

    const userId = '11111111-1111-1111-1111-111111111111';
    const requestId = '77777777-7777-7777-7777-777777777777';
    const sliceId = '66666666-6666-6666-6666-666666666666';

    try {
        // Cleanup
        await db.delete(slices).where(eq(slices.id, sliceId));
        await db.delete(requests).where(eq(requests.id, requestId));

        // Create Request
        await db.insert(requests).values({
            id: requestId,
            userId: userId,
            title: 'Material Advance Test',
            description: 'Testing Acopio',
            status: 'in_progress',
        });

        // Create Slice
        await db.insert(slices).values({
            id: sliceId,
            requestId: requestId,
            creatorId: userId,
            assignedProviderId: userId,
            title: 'Acopio Slice',
            description: 'Testing',
            status: 'in_progress',
            finalPrice: 100000, // $1000.00
            materialAdvanceStatus: 'none',
        });

        console.log('✅ Base data created.');

        // Simulate "Request Advance" (what the API does)
        const evidence = { photos: ['http://example.com/photo.jpg'], receipts: [] };
        const advanceAmount = 40000;

        await db.update(slices)
            .set({
                materialAdvanceStatus: 'requested',
                materialAdvanceAmount: advanceAmount,
                materialAdvanceEvidence: evidence
            })
            .where(eq(slices.id, sliceId));

        console.log('🔄 Requested Advance...');

        // Verify
        const result = await db.query.slices.findFirst({
            where: eq(slices.id, sliceId)
        });

        if (result?.materialAdvanceStatus === 'requested' && result.materialAdvanceAmount === 40000) {
            console.log('✅ Verification SUCCEEDED: Material Advance data persisted.');
            console.log('Status:', result.materialAdvanceStatus);
            console.log('Amount:', result.materialAdvanceAmount);
            console.log('Evidence:', result.materialAdvanceEvidence);
        } else {
            console.error('❌ Verification FAILED: Data mismatch.');
            console.log('Result:', result);
            process.exit(1);
        }

    } catch (e) {
        console.error('❌ Script Error:', e);
        process.exit(1);
    }
}

main().then(() => process.exit(0));
