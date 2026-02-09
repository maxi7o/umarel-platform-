
import { db } from '../lib/db';
import { requests, users } from '../lib/db/schema';
import { desc, eq } from 'drizzle-orm';

async function main() {
    console.log('Fetching requests...');
    try {
        const fetchedRequests = await db
            .select()
            .from(requests)
            .limit(5);

        console.log(`Fetched ${fetchedRequests.length} requests.`);

        for (const req of fetchedRequests) {
            console.log(`Request: ${req.id}, UserID: ${req.userId}`);
            const [user] = await db.select().from(users).where(eq(users.id, req.userId));
            console.log(`User found: ${user ? user.id : 'NULL'}`);
        }

    } catch (e) {
        console.error('Error:', e);
    }
    process.exit(0);
}

main();
