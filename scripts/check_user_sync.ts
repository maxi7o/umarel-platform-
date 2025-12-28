
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    const MARIA_ID = '11111111-1111-1111-1111-111111111111';

    console.log('🔍 Checking for Maria in public.users...');
    const user = await db.query.users.findFirst({
        where: eq(users.id, MARIA_ID)
    });

    if (user) {
        console.log('✅ Found Maria:', user.email);
    } else {
        console.error('❌ Maria NOT found in public.users! Auth<->DB Sync missing.');
    }
}

main().catch(console.error).then(() => process.exit(0));
