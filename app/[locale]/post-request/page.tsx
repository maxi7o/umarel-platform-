
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

    // 2. Create a draft request
    const requestId = uuidv4();

    await db.insert(requests).values({
        id: requestId,
        userId: userId,
        title: 'New Project',
        description: '',
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    // 3. Create the initial "Root" slice
    const sliceId = uuidv4();
    await db.insert(slices).values({
        id: sliceId,
        requestId: requestId,
        creatorId: userId,
        title: 'Initial Request',
        description: 'Root slice for the project',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    // 4. Redirect to the Wizard for this slice
    redirect(`/${locale}/wizard/${sliceId}`);
}
