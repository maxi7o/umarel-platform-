
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function main() {
    try {
        console.log('Applying migration...');
        const migrationPath = path.join(process.cwd(), 'supabase/migrations/0001_natural_stepford_cuckoos.sql');
        const migrationSql = fs.readFileSync(migrationPath, 'utf-8');

        // Split by semicolon to run statements? Or run as one block?
        // Postgres.js usually handles multiple statements if using simple query, but Drizzle execute might be safer.
        // Let's try executing the whole block.

        await db.execute(sql.raw(migrationSql));

        console.log('Migration Applied.');
    } catch (e) {
        console.error('Error applying migration:', e);
        process.exit(1);
    }
}

main().then(() => process.exit(0));
