import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function run() {
    console.log("Running manual migration for biometrics...");

    try {
        await db.execute(sql`
            DO $$ 
            BEGIN 
                -- Create biometric_status Enum if not exists
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'biometric_status') THEN
                    CREATE TYPE biometric_status AS ENUM ('none', 'pending', 'verified', 'failed');
                END IF;

                -- Add biometricStatus column
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'biometric_status') THEN
                    ALTER TABLE users ADD COLUMN biometric_status biometric_status DEFAULT 'none';
                END IF;

                -- Add biometricVerifiedAt column
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'biometric_verified_at') THEN
                    ALTER TABLE users ADD COLUMN biometric_verified_at TIMESTAMP;
                END IF;
            END $$;
        `);
        console.log("Migration completed successfully.");
    } catch (error) {
        console.error("Migration failed:", error);
    }
    process.exit(0);
}

run();
