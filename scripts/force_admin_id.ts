
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const TARGET_ID = '4831105b-a3ba-477c-973b-d463edc188a0';
const TARGET_EMAIL = 'admin.test@umarel.org';

async function main() {
    console.log(`Force creating/updating admin user: ${TARGET_EMAIL} (${TARGET_ID})`);

    try {
        await db.insert(users).values({
            id: TARGET_ID,
            email: TARGET_EMAIL,
            fullName: 'Admin Test',
            role: 'admin',
            auraLevel: 'diamond',
            auraPoints: 99999,
        }).onConflictDoUpdate({
            target: users.id,
            set: {
                role: 'admin',
                email: TARGET_EMAIL
            }
        });

        console.log('✅ User forced to admin successfully');
    } catch (e) {
        console.error('Error:', e);
    }
    process.exit(0);
}

main();
