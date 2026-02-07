
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const TARGET_ID = '4831105b-a3ba-477c-973b-d463edc188a0';

async function check() {
    console.log(`Checking DB for user: ${TARGET_ID}`);
    const result = await db.select().from(users).where(eq(users.id, TARGET_ID));
    console.log('Result:', result);
    process.exit(0);
}

check();
