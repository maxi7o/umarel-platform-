
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error('Please provide an email address as an argument.');
        process.exit(1);
    }

    console.log(`Promoting ${email} to ADMIN...`);

    const updated = await db.update(users)
        .set({ role: 'admin' })
        .where(eq(users.email, email))
        .returning();

    if (updated.length > 0) {
        console.log(`Success! User ${updated[0].fullName} (${updated[0].id}) is now an ADMIN.`);
    } else {
        console.error('User not found.');
    }

    process.exit(0);
}

main();
