
import { config } from 'dotenv';
config({ path: '.env.local' });

import { initializeRequest } from '@/lib/services/request-service';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    const MARIA_ID = '11111111-1111-1111-1111-111111111111';

    console.log('🔌 Debug Script DB URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@'));

    console.log('🚀 Attempting to create request for Maria...');

    try {
        const result = await initializeRequest({
            userId: MARIA_ID,
            title: "Golden Path Test",
            description: "Test description",
            location: "Miami"
        });
        console.log('✅ Request created successfully:', result);
    } catch (e) {
        console.error('🔥 FAILURE!');
        console.error(e);
        if (e instanceof Error && 'cause' in e) {
            console.error('Cause:', (e as any).cause);
        }
    }
}

main().catch(console.error).then(() => process.exit(0));
