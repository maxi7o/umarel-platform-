
import { db } from '@/lib/db';
import { requests, slices, users } from '@/lib/db/schema';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

export default async function PostRequestPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // 1. Get the current user (Simulating 'Maria' logged in)
    let userId = 'demo-user-id';
    const [dbUser] = await db.select().from(users).where(eq(users.email, 'maria@demo.com'));
    if (dbUser) {
        userId = dbUser.id;
    }

    // 2. Create a draft request (using 'open' as draft isn't in enum yet)
    const [newRequest] = await db.insert(requests).values({
        userId: userId,
        title: 'New Project',
        description: '',
        status: 'open',
    }).returning();

    const requestId = newRequest.id;

    // 3. Create the initial "Root" slice
    const [newSlice] = await db.insert(slices).values({
        requestId: requestId,
        creatorId: userId,
        title: 'Initial Request',
        description: 'Root slice for the project',
        status: 'proposed',
    }).returning();

    const sliceId = newSlice.id;

    // 4. Redirect to the Wizard for this slice
    redirect(`/${locale}/wizard/${sliceId}`);
}
