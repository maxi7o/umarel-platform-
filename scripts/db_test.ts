
import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import { sql, eq } from 'drizzle-orm';

async function main() {
    console.log('Testing DB connection...');
    try {
        const result = await db.execute(sql`SELECT 1`);
        console.log('Connection successful!', result);

        const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);
        console.log('Total Users:', userCount[0].count);

        const targetId = '25a7bf55-790e-48e3-b22a-f9bc9f2b068b';
        const specificUser = await db.select().from(users).where(eq(users.id, targetId));
        console.log('Target User Found:', specificUser.length > 0);
        if (specificUser.length > 0) console.log('User Email:', specificUser[0].email);


        process.exit(0);
    } catch (e: any) {
        console.error('CONNECTION FAILED:');
        console.error(e);
        // Print specific properties if they exist
        if (e.code) console.error('Error Code:', e.code);
        if (e.detail) console.error('Error Detail:', e.detail);
        if (e.hint) console.error('Error Hint:', e.hint);
        process.exit(1);
    }
}

main();
