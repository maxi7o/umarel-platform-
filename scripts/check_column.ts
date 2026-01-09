import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function run() {
    console.log("Checking for biometric_status column...");
    try {
        const result = await db.execute(sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'biometric_status';
        `);
        console.log("Found columns:", result);

        const rows = await db.execute(sql`SELECT count(biometric_status) from users`);
        console.log("Count query success:", rows);

    } catch (error) {
        console.error("Column check failed:", error);
    }
    process.exit(0);
}
run();
