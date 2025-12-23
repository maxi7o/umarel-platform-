
import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import { sql } from 'drizzle-orm';

async function check() {
    try {
        console.log("Checking users table columns...");
        const result = await db.execute(sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users';
        `);
        console.log("Columns:", result.map((r: any) => r.column_name));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check();
