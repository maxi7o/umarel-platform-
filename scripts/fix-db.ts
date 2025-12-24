
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
        // Users
        await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_comment_at timestamp;`);
        await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_tos_accepted_at timestamp;`);
        await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS tos_version integer DEFAULT 0;`);

        // Escrow Payments (Disputes & Appeals)
        await db.execute(sql`ALTER TABLE escrow_payments ADD COLUMN IF NOT EXISTS is_appealed boolean DEFAULT false;`);
        await db.execute(sql`ALTER TABLE escrow_payments ADD COLUMN IF NOT EXISTS appeal_reason text;`);
        await db.execute(sql`ALTER TABLE escrow_payments ADD COLUMN IF NOT EXISTS appealed_at timestamp;`);
        await db.execute(sql`ALTER TABLE escrow_payments ADD COLUMN IF NOT EXISTS ai_dispute_analysis jsonb;`);

        await db.execute(sql`ALTER TABLE escrow_payments ADD COLUMN IF NOT EXISTS appeals_at timestamp;`);

        // Slice Evidence
        await db.execute(sql`ALTER TABLE slice_evidence ADD COLUMN IF NOT EXISTS metadata jsonb;`);
        await db.execute(sql`ALTER TABLE slice_evidence ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;`);

        // Withdrawals Table
        try {
            await db.execute(sql`CREATE TYPE withdrawal_status AS ENUM ('pending', 'processed', 'rejected');`);
        } catch {
            // Ignore if exists
        }

        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS withdrawals (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id uuid REFERENCES users(id) NOT NULL,
                amount integer NOT NULL,
                status withdrawal_status DEFAULT 'pending',
                method text DEFAULT 'mercadopago',
                destination text,
                requested_at timestamp DEFAULT now(),
                processed_at timestamp,
                admin_notes text
            );
        `);

        console.log("Batch fixes applied.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fix();
