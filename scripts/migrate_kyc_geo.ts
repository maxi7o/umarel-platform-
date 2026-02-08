
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function migrate() {
    try {
        console.log("Applying KYC and Geofencing schema updates...");

        // Slices table updates
        await db.execute(sql`ALTER TABLE slices ADD COLUMN IF NOT EXISTS experience_id uuid;`);
        await db.execute(sql`ALTER TABLE slices ADD COLUMN IF NOT EXISTS price_cents integer DEFAULT 0;`);
        await db.execute(sql`ALTER TABLE slices ADD COLUMN IF NOT EXISTS activation_type text DEFAULT 'manual';`);
        await db.execute(sql`ALTER TABLE slices ADD COLUMN IF NOT EXISTS slice_type text DEFAULT 'standard';`);
        await db.execute(sql`ALTER TABLE slices ADD COLUMN IF NOT EXISTS max_capacity integer;`);
        await db.execute(sql`ALTER TABLE slices ADD COLUMN IF NOT EXISTS current_bookings integer DEFAULT 0;`);
        await db.execute(sql`ALTER TABLE slices ADD COLUMN IF NOT EXISTS waitlist_enabled boolean DEFAULT false;`);

        // Users table updates
        await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS dni_number text;`);
        await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS dni_verified_at timestamp;`);
        await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_front_path text;`);
        await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_back_path text;`);
        await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_selfie_path text;`);

        // Slice Evidence table updates
        await db.execute(sql`ALTER TABLE slice_evidence ADD COLUMN IF NOT EXISTS captured_at timestamp;`);
        await db.execute(sql`ALTER TABLE slice_evidence ADD COLUMN IF NOT EXISTS device_signature text;`);
        await db.execute(sql`ALTER TABLE slice_evidence ADD COLUMN IF NOT EXISTS ai_validation_status text DEFAULT 'pending';`);
        await db.execute(sql`ALTER TABLE slice_evidence ADD COLUMN IF NOT EXISTS ai_validation_json jsonb;`);
        await db.execute(sql`ALTER TABLE slice_evidence ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;`);
        await db.execute(sql`ALTER TABLE slice_evidence ADD COLUMN IF NOT EXISTS metadata jsonb;`);

        // Make sure types exist
        try {
            await db.execute(sql`CREATE TYPE biometric_status AS ENUM ('none', 'pending', 'verified', 'failed');`);
            await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS biometric_status biometric_status DEFAULT 'none';`);
        } catch (e) {
            // Already exists or handled
        }

        console.log("Migration complete.");
        process.exit(0);
    } catch (e) {
        console.error("Migration failed:", e);
        process.exit(1);
    }
}

migrate();
