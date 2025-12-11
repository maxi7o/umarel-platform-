
import { db } from '@/lib/db';
import { users, requests, slices, comments, communityRewards, escrowPayments, dailyPayouts, wizardMessages } from '@/lib/db/schema';
import { faker } from '@faker-js/faker'; // Assuming faker is available or I'll use simple random
import { v4 as uuidv4 } from 'uuid';

// Simple random helpers if faker isn't installed
const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const CITIES = ['Buenos Aires', 'Córdoba', 'Rosario', 'Santiago', 'Bogotá', 'CDMX', 'Lima'];
const CATEGORIES = ['Plumbing', 'Electrical', 'Construction', 'Painting', 'Cleaning', 'Carpentry', 'HVAC'];
const TITLES = [
    'Fix leaking pipe in kitchen', 'Install new light fixtures', 'Paint living room', 'Repair drywall',
    'Deep clean apartment', 'Build custom shelves', 'Fix AC unit', 'Replace bathroom faucet',
    'Install ceiling fan', 'Repair wooden door', 'Waterproofing roof', 'Install electrical outlet'
];

async function seed() {
    console.log('🌱 Starting Umarel Launch Seed...');

    // 1. Create Users (Clients and Umarels)
    const umarels = [];
    const clients = [];

    // Create 50 Umarels
    for (let i = 0; i < 50; i++) {
        const [user] = await db.insert(users).values({
            email: `umarel${i}@example.com`,
            fullName: `Umarel ${i}`,
            role: 'user',
            auraLevel: getRandom(['bronze', 'silver', 'gold', 'diamond']),
            totalSavingsGenerated: getRandomInt(10000, 5000000), // in cents
        }).returning();
        umarels.push(user);
    }

    // Create 20 Clients
    for (let i = 0; i < 20; i++) {
        const [user] = await db.insert(users).values({
            email: `client${i}@example.com`,
            fullName: `Client ${i}`,
            role: 'user',
        }).returning();
        clients.push(user);
    }

    console.log(`✅ Created ${umarels.length} Umarels and ${clients.length} Clients`);

    // 2. Create 250 Requests
    for (let i = 0; i < 250; i++) {
        const client = getRandom(clients);
        const city = getRandom(CITIES);
        const category = getRandom(CATEGORIES);
        const title = getRandom(TITLES);

        const [request] = await db.insert(requests).values({
            userId: client.id,
            title: `${title} in ${city}`,
            description: `I need help with ${title.toLowerCase()}. Please advise on the best way to do this.`,
            category,
            location: city,
            status: 'open',
        }).returning();

        // 40% have comments
        if (Math.random() < 0.4) {
            const numComments = getRandomInt(3, 8);
            for (let j = 0; j < numComments; j++) {
                const umarel = getRandom(umarels);
                const isHelpful = Math.random() < 0.3;
                const savings = isHelpful ? getRandomInt(500000, 2000000) : 0; // 5k - 20k ARS

                // Insert into Wizard Messages (the new core interaction)
                await db.insert(wizardMessages).values({
                    // sliceCardId: null, // Optional
                    requestId: request.id,
                    userId: umarel.id,
                    content: `Here is a tip: you can save money by buying materials yourself at Easy.`,
                    role: 'user',
                    isMarkedHelpful: isHelpful,
                    markedHelpfulBy: isHelpful ? client.id : null,
                    savingsGenerated: savings,
                });

                // Also keep legacy comments for now if needed, but Wizard is primary
                if (Math.random() < 0.5) {
                    await db.insert(comments).values({
                        requestId: request.id,
                        userId: umarel.id,
                        content: `Legacy comment: Check the wiring standards.`,
                        isMarkedHelpful: false,
                    });
                }
            }
        }

        // 15% have approved slices (generating pool money)
        if (Math.random() < 0.15) {
            const umarel = getRandom(umarels);
            const price = getRandomInt(5000000, 30000000); // 50k - 300k ARS
            const fee = Math.floor(price * 0.15);
            const communityPool = Math.floor(price * 0.03);

            const [slice] = await db.insert(slices).values({
                requestId: request.id,
                creatorId: umarel.id,
                title: `Slice for ${title}`,
                description: 'Detailed execution plan',
                finalPrice: price,
                status: 'approved_by_client',
                approvedByClientAt: new Date(Date.now() - getRandomInt(0, 48 * 60 * 60 * 1000)), // Last 48h
            }).returning();

            // Create Escrow Payment
            await db.insert(escrowPayments).values({
                sliceId: slice.id,
                clientId: client.id,
                providerId: umarel.id, // Assuming Umarel is provider for simplicity in seed
                totalAmount: price + fee,
                sliceAmount: price,
                platformFee: fee,
                communityRewardPool: communityPool,
                paymentMethod: 'mercado_pago',
                status: 'released', // Money is "real"
                releasedAt: slice.approvedByClientAt,
            });

            // We don't distribute yet, the cron does that
        }
    }

    console.log('✅ Seed completed successfully!');
}

seed().catch(console.error);
