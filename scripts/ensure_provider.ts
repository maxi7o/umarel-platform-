
import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    const id = '22222222-2222-2222-2222-222222222222';
    const exists = await db.query.users.findFirst({
        where: eq(users.id, id)
    });

    if (!exists) {
        console.log("User not found, creating Carlos...");
        await db.insert(users).values({
            id: id,
            email: 'carlos@demo.com',
            fullName: 'Carlos Rodríguez',
            role: 'user',
            auraPoints: 650,
            auraLevel: 'gold',
            totalSavingsGenerated: 450000,
        });
        console.log("Carlos created.");
    } else {
        console.log("Carlos already exists.");
    }
}

main().catch(console.error).then(() => process.exit(0));
