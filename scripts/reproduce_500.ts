
import { initializeRequest } from '@/lib/services/request-service';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    console.log('Starting reproduction script...');

    // Get a user
    let user = await db.query.users.findFirst();
    if (!user) {
        console.log('No user found, creating dev user...');
        await db.insert(users).values({
            email: 'reproduce@test.com',
            fullName: 'Repro User',
            role: 'user',
        }).onConflictDoNothing();
        user = await db.query.users.findFirst({ where: eq(users.email, 'reproduce@test.com') });
    }

    if (!user) throw new Error('Failed to get user');
    console.log('Using user:', user.id);

    try {
        console.log('Calling initializeRequest...');
        const result = await initializeRequest({
            userId: user.id,
            title: 'Test Project 500',
            description: 'This is a test to repro 500 error',
            location: 'Test City',
            category: 'plumbing'
        });
        console.log('Success!', result);
    } catch (error) {
        console.error('CAUGHT ERROR:', error);
    }

    process.exit(0);
}

main();
