
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

async function listUsers() {
    try {
        const allUsers = await db.select().from(users);
        console.log('Users in DB:', allUsers.length);
        allUsers.forEach(u => console.log(`- ${u.id} (${u.email})`));
    } catch (error) {
        console.error('Error listing users:', error);
    }
    process.exit(0);
}

listUsers();
