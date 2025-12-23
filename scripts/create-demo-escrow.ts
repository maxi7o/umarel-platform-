
import { db } from '@/lib/db';
import { escrowPayments, slices, requests, users } from '@/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

async function createDemo() {
    console.log("Creating Demo Escrow...");
    const userId = (await db.select().from(users).limit(1))[0]?.id || uuidv4(); // simplified
    const requestId = uuidv4();
    const sliceId = uuidv4();
    const escrowId = uuidv4();

    await db.insert(requests).values({
        id: requestId,
        userId: userId,
        title: 'Dispute Demo Project',
        description: 'For recording purposes',
        status: 'open'
    });

    await db.insert(slices).values({
        id: sliceId,
        requestId,
        creatorId: userId,
        title: 'Disputed Slice',
        description: 'This work is contested.',
        status: 'accepted'
    });

    await db.insert(escrowPayments).values({
        id: escrowId,
        sliceId, clientId: userId, providerId: userId,
        totalAmount: 5000, sliceAmount: 4000, platformFee: 1000, communityRewardPool: 0,
        paymentMethod: 'stripe',
        status: 'in_escrow'
    });

    console.log(`✅ Demo Ready: /en/requests/${requestId}`);
    console.log("Please copy this URL for the browser agent.");
}

createDemo();
