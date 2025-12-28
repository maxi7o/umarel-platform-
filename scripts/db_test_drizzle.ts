
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '@/lib/db';
import { slices, requests } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    const MARIA_ID = '11111111-1111-1111-1111-111111111111';

    console.log('🧪 Drizzle Direct Insert Test');

    // 1. Create Request
    const [req] = await db.insert(requests).values({
        userId: MARIA_ID,
        title: 'Drizzle Test',
        description: 'Desc',
        status: 'open',
    }).returning();

    console.log('Created Request:', req.id);

    try {
        // 2. Insert Slice
        const [slice] = await db.insert(slices).values({
            requestId: req.id,
            creatorId: MARIA_ID,
            title: 'Drizzle Slice',
            description: 'Desc',
            status: 'proposed',
            // implicit refundStatus: 'none'
        }).returning();

        console.log('✅ Drizzle Insert Success:', slice.id);
    } catch (e) {
        console.error('❌ Drizzle Insert FAILED');
        console.error(e);
    }
}

main().catch(console.error).then(() => process.exit(0));
