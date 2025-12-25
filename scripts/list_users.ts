import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function list() {
    // Find first 5 users with 'umarel' implicit role (or just any user to start)
    // The schema has a 'role' enum but seed might just set names.
    const allUsers = await db.query.users.findMany({
        limit: 5
    });
    console.log("Users found:", allUsers);

    // Check key Umarel names from seed
    const target = await db.query.users.findFirst({
        where: eq(users.email, "umarel0@example.com")
    });
    console.log("Umarel0 status:", target ? "FOUND" : "MISSING");
    if (target) console.log("Umarel0 ID:", target.id);

    process.exit(0);
}
list();
