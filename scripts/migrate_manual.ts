import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '@/lib/db';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

async function main() {
    console.log('Running migrations manually...');
    try {
        await migrate(db, { migrationsFolder: 'supabase/migrations' });
        console.log('Migrations complete!');
    } catch (e) {
        console.error('Migration failed:', e);
        process.exit(1);
    }
    process.exit(0);
}

main();
