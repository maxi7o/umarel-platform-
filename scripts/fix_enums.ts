
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function fixEnums() {
    try {
        console.log("Fixing Enums...");

        const sliceStatusValues = ['proposed', 'accepted', 'completed', 'approved_by_client', 'paid', 'disputed', 'draft', 'active', 'full', 'cancelled'];

        for (const val of sliceStatusValues) {
            try {
                await db.execute(sql.raw(`ALTER TYPE slice_status ADD VALUE IF NOT EXISTS '${val}'`));
                console.log(`Added value '${val}' to slice_status`);
            } catch (e) {
                // Ignore if value exists
            }
        }

        console.log("Enum fix complete.");
        process.exit(0);
    } catch (e) {
        console.error("Enum fix failed:", e);
        process.exit(1);
    }
}

fixEnums();
