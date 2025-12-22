import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
    try {
        console.log('Resetting DB...');
        await db.execute(sql`DROP SCHEMA IF EXISTS drizzle CASCADE;`);
        await db.execute(sql`DROP SCHEMA public CASCADE;`);
        await db.execute(sql`CREATE SCHEMA public;`);
        await db.execute(sql`GRANT ALL ON SCHEMA public TO public;`);
        await db.execute(sql`GRANT ALL ON SCHEMA public TO postgres;`); // Ensure default user has access
        console.log('DB Reset Complete.');
    } catch (e) {
        console.error('Error:', e);
    }
}

main().then(() => process.exit(0));
