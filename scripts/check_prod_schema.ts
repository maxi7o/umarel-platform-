
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';
import { config } from 'dotenv';
config({ path: '.env' });

async function check() {
    try {
        console.log("Checking Production Schema...");

        // Check Users
        const userCols = await db.execute(sql`
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'users'
        `);
        console.log("User Columns found:", userCols.map(c => c.column_name));

        // Check Slices
        const sliceCols = await db.execute(sql`
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'slices' AND column_name IN ('slice_type', 'max_capacity', 'activation_type')
        `);
        console.log("Slice Columns found:", sliceCols.map(c => c.column_name));

        // Check Experience
        const expTable = await db.execute(sql`
            SELECT table_name FROM information_schema.tables 
            WHERE table_name = 'experiences'
        `);
        console.log("Experiences table exists:", expTable.length > 0);

        process.exit(0);
    } catch (e) {
        console.error("Check failed:", e);
        process.exit(1);
    }
}

check();
