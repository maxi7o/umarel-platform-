import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
    try {
        console.log('Connecting to DB:', process.env.DATABASE_URL?.split('@')[1]);
        const tables = await db.execute(sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('Tables found:', tables.map(r => r.table_name));

        const types = await db.execute(sql`
            SELECT typname 
            FROM pg_type 
            JOIN pg_namespace ON pg_namespace.oid = pg_type.typnamespace 
            WHERE nspname = 'public' AND typtype = 'e'
        `);
        console.log('Enums found:', types.map(r => r.typname));
    } catch (e) {
        console.error('Error:', e);
    }
}

main().then(() => process.exit(0));
