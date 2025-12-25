
import { db } from '@/lib/db';
import { users, requests, answers, questions, comments, sliceCards } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const TARGET_EMAIL = "umarel0@example.com"; // Matches current dashboard demo user (Diamond rank)

async function seedDemoDashboard() {
    console.log('🌱 Seeding Demo Dashboard Data...');

    // 1. Get or Create Hero User
    let hero = await db.query.users.findFirst({
        where: eq(users.email, TARGET_EMAIL)
    });

    if (!hero) {
        console.log(`Hero user ${TARGET_EMAIL} not found, creating...`);
        // Fallback if list_users lied or db was reset
        const [newUser] = await db.insert(users).values({
            email: TARGET_EMAIL,
            fullName: "Giuseppe The Diamond",
            role: 'user',
            auraLevel: 'diamond',
            auraPoints: 50000,
            totalSavingsGenerated: 12500000, // 12.5M
        }).returning();
        hero = newUser;
    } else {
        // Boost stats just in case
        await db.update(users)
            .set({
                auraPoints: 50000,
                totalSavingsGenerated: 12500000,
                auraLevel: 'diamond'
            })
            .where(eq(users.id, hero.id));
        console.log(`Boosted stats for ${hero.fullName}`);
    }

    // 2. Create "Hot Zone" Requests (Palermo & Belgrano)
    const hotZones = [
        { city: "Palermo", count: 12, categories: ["Plumbing", "Electrical"] },
        { city: "Belgrano", count: 8, categories: ["Construction", "Painting"] },
        { city: "Recoleta", count: 5, categories: ["HVAC"] }
    ];

    for (const zone of hotZones) {
        for (let i = 0; i < zone.count; i++) {
            await db.insert(requests).values({
                userId: hero!.id, // Self-created or random doesn't matter for map, but let's use hero as creator to ensure validity
                title: `${zone.categories[i % zone.categories.length]} Request in ${zone.city}`,
                description: "Demo request for hot zone map",
                category: zone.categories[i % zone.categories.length],
                location: zone.city,
                status: 'open',
            });
        }
    }
    console.log("✅ Populated Hot Zones");

    // 3. Create High-Value Contributions (Quality Review Feed)
    // We need Questions -> Answers
    const contributions = [
        {
            q: "Is $500k reasonable for a bathroom pipe fix?",
            a: "Absolutely not! Material costs are max $150k. Reject this immediately.",
            hearts: 45,
            savings: 350000
        },
        {
            q: "Contractor wants to use 'Standard' paint for exterior.",
            a: "Amateur mistake. Demand 'WeatherShield' or it will peel in 6 months.",
            hearts: 120,
            savings: 1000000 // Future savings
        },
        {
            q: "They are charging me for 'Premium Air' in tires...",
            a: "This is a scam. Air is free.",
            hearts: 500,
            savings: 20000
        }
    ];

    for (const item of contributions) {
        // Create a dummy question
        const [q] = await db.insert(questions).values({
            requestId: (await db.query.requests.findFirst())?.id!, // Pick any request
            askerId: hero!.id, // Dummy ID
            content: item.q,
            status: 'answered'
        }).returning();

        // Create the Hero's Answer
        await db.insert(answers).values({
            questionId: q.id,
            answererId: hero!.id,
            content: item.a,
            upvotes: item.hearts,
            contributionScore: 100,
        });
    }
    console.log("✅ Populated Quality Review Feed");

    console.log("🚀 Dashboard Seed Complete!");
    process.exit(0);
}

seedDemoDashboard().catch(console.error);
