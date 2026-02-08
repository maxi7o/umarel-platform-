
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

async function main() {
    console.log('--- Migrating CBU/Alias fields ---');

    // Add cbu_alias and cbu_number columns to user_wallets table
    // Using user_wallets because it's financial info

    // Check if user_wallets exists, otherwise we assume schema push handles it, or migration order.
    // This is safe to run as a patch.

    await db.execute(sql`ALTER TABLE user_wallets ADD COLUMN IF NOT EXISTS cbu_alias text;`);
    await db.execute(sql`ALTER TABLE user_wallets ADD COLUMN IF NOT EXISTS cbu_number text;`);
    await db.execute(sql`ALTER TABLE user_wallets ADD COLUMN IF NOT EXISTS bank_name text;`);

    console.log('✅ CBU Columns Added');
    process.exit(0);
}

main().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
