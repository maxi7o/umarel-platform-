
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function fix() {
    try {
        console.log("Applying batch schema fixes...");

        // Requests
        await db.execute(sql`ALTER TABLE requests ADD COLUMN IF NOT EXISTS location_details jsonb;`);

        // Service Offerings
        await db.execute(sql`ALTER TABLE service_offerings ADD COLUMN IF NOT EXISTS location_details jsonb;`);

        // Quotes
        await db.execute(sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS currency text DEFAULT 'ARS';`);

        // Slices
        await db.execute(sql`ALTER TABLE slices ADD COLUMN IF NOT EXISTS escrow_payment_id text;`);
        await db.execute(sql`ALTER TABLE slices ADD COLUMN IF NOT EXISTS approved_by_client_at timestamp;`);
        await db.execute(sql`ALTER TABLE slices ADD COLUMN IF NOT EXISTS paid_at timestamp;`);

        console.log("Batch fixes applied.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fix();
