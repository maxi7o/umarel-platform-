import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function check() {
    const user = await db.query.users.findFirst({
        where: eq(users.email, "umarel0@example.com")
    });
    console.log("User found:", user ? "YES" : "NO");
    if (user) console.log("User details:", user);
    process.exit(0);
}
check();
