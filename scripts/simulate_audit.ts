import './env_setup';

import { db } from '../lib/db';
import { users, requests, slices, sliceCards, quotes, comments, userWallets } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { shouldAnalyzeComment } from '../lib/ai/openai';
import { raiseDispute } from '../lib/disputes';
import { checkSpamCooldown } from '../lib/safety';

// Colors for logging
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
};

function log(step: string, msg: string, success: boolean = true) {
    const icon = success ? '✅' : '❌';
    const color = success ? colors.green : colors.red;
    console.log(`${color}${icon} [${step}] ${msg}${colors.reset}`);
}

function warn(msg: string) {
    console.log(`${colors.yellow}⚠️  [WARNING] ${msg}${colors.reset}`);
}

async function createTestUser(role: 'user' | 'provider' | 'admin', name: string) {
    const id = randomUUID();
    // Check if user exists first to avoid dupes if re-running
    const existing = await db.query.users.findFirst({ where: eq(users.email, `${name.toLowerCase().replace(/\s/g, '')}@test.com`) });
    if (existing) return existing.id;

    await db.insert(users).values({
        id,
        email: `${name.toLowerCase().replace(/\s/g, '')}@test.com`,
        fullName: name,
        role: 'user',
        auraPoints: 100,
        auraLevel: 'bronze',
    });
    // Create wallet
    await db.insert(userWallets).values({ userId: id, balance: 0 });
    return id;
}

async function runHappyPath() {
    console.log(`\n${colors.cyan}=== SIMULATION A: The Happy Path ===${colors.reset}`);
    try {
        // 1. Setup Actors
        const clientId = await createTestUser('user', 'Maxi Client');
        const providerId = await createTestUser('provider', 'Bob Builder');
        const umarelId = await createTestUser('user', 'Uncle Joe');

        log('Setup', 'Actors created', true);

        // 2. Client Posts Request
        const requestId = randomUUID();
        await db.insert(requests).values({
            id: requestId,
            userId: clientId,
            title: 'Fix my Roof',
            description: 'My roof is leaking and needs urgent repair.',
            location: 'Test City',
            category: 'Construction',
            status: 'open'
        });
        log('Action', 'Request Posted', true);

        // 3. Wizard Splits (Mocking AI result)
        const sliceId = randomUUID();
        await db.insert(slices).values({
            id: sliceId,
            requestId: requestId,
            creatorId: clientId,
            title: 'Roof Repair',
            description: 'Replace damaged shingles.',
            status: 'proposed',
            marketPriceMin: 10000,
            marketPriceMax: 15000
        });
        log('Action', 'Wizard Created Slice "Roof Repair"', true);

        // 4. Builder Quotes
        const quoteId = randomUUID();
        await db.insert(quotes).values({
            id: quoteId,
            providerId: providerId,
            requestId: requestId,
            amount: 12000,
            status: 'pending',
            message: 'I can fix it'
        });
        log('Action', 'Builder Quoted $120', true);

        // 5. Client Accepts (Funding Escrow)
        // Simulate logic: Update quote, update slice, moving mock money? 
        await db.update(quotes).set({ status: 'accepted' }).where(eq(quotes.id, quoteId));
        await db.update(slices).set({ status: 'in_progress', assignedProviderId: providerId }).where(eq(slices.id, sliceId));
        log('Action', 'Client Accepted Quote -> Slice In Progress', true);

        // 6. Umarel Comments
        // Testing if comment creation is simple
        const commentId = randomUUID();
        await db.insert(comments).values({
            id: commentId,
            quoteId: quoteId, // Linking to quote or request? Schema says optionally both.
            requestId: requestId,
            userId: umarelId,
            content: 'Make sure to check the flashing!',
            isMarkedHelpful: true
        });
        log('Action', 'Umarel Commented', true);

        // 7. Completion & Release
        await db.update(slices).set({ status: 'completed' }).where(eq(slices.id, sliceId));
        log('Action', 'Work Marked Complete', true);

        log('Verify', 'Happy Path Completed without DB Constraint Errors', true);

    } catch (e) {
        log('Error', `Happy Path Failed: ${e}`, false);
    }
}

async function runDisputeScenario() {
    console.log(`\n${colors.cyan}=== SIMULATION B: The Dispute ===${colors.reset}`);
    try {
        const clientId = await createTestUser('user', 'Angry Client');
        const providerId = await createTestUser('provider', 'Sad Builder');

        const requestId = randomUUID();
        await db.insert(requests).values({
            id: requestId,
            userId: clientId,
            title: 'Bad Job',
            description: 'This job went wrong.',
            status: 'in_progress',
            category: 'General',
            location: 'Test'
        });

        const sliceId = randomUUID();
        await db.insert(slices).values({
            id: sliceId,
            requestId,
            creatorId: clientId,
            title: 'Bad Slice',
            description: 'The slice that caused the dispute.',
            status: 'in_progress',
            assignedProviderId: providerId
        });

        // 1. Client attempts to raise dispute
        log('Action', 'Client raising dispute...', true);
        try {
            await raiseDispute(sliceId, clientId, 'The work is terrible and incomplete.');
            log('Result', 'Dispute raised successfully', true);
        } catch (e) {
            log('Error', `Failed to raise dispute: ${e}`, false);
        }

        // 2. Verify Slice Status
        const updatedSlice = await db.query.slices.findFirst({ where: eq(slices.id, sliceId) });
        if (updatedSlice?.status === 'disputed' && updatedSlice.disputedAt) {
            log('Verify', 'Slice status is "disputed" and has timestamp', true);
        } else {
            log('Verify', `Slice status is ${updatedSlice?.status}`, false);
        }

    } catch (e) {
        log('Error', `Dispute Scenario Failed: ${e}`, false);
    }
}

async function runAbuseScenario() {
    console.log(`\n${colors.cyan}=== SIMULATION C: The Reward Gamer (Abuse) ===${colors.reset}`);

    const spamComments = [
        "Good job",
        "Nice", // Should be blocked by AI
        "ok",   // Should be blocked by AI
    ];

    log('Setup', 'Testing AI content filter...', true);
    let blockedCount = 0;
    for (const text of spamComments) {
        const isWorthAnalysis = shouldAnalyzeComment(text);
        if (!isWorthAnalysis) blockedCount++;
    }

    if (blockedCount >= 2) {
        log('Security', `AI Spam Filter blocked ${blockedCount} low-effort comments`, true);
    } else {
        warn(`Spam Filter too permissive! Only blocked ${blockedCount}`);
    }

    // Rate Limiting Test
    log('Setup', 'Testing Rate Limiting (Cooldown)...', true);
    const spammerId = await createTestUser('user', 'Spam Bot 3000');

    try {
        // First comment (Success)
        await checkSpamCooldown(spammerId);
        log('Action', 'First comment check passed', true);

        // Immediate second comment (Should Fail)
        await checkSpamCooldown(spammerId);
        log('Error', 'Second comment check SHOULD have failed but passed', false);
    } catch (e: any) {
        if (e.name === 'SafetyError') {
            log('Security', `Rate Limit blocked rapid action: ${e.message}`, true);
        } else {
            log('Error', `Unexpected error: ${e}`, false);
        }
    }
}


import { sql } from 'drizzle-orm';

async function checkColumnRaw() {
    try {
        const [connInfo] = await db.execute(sql`SELECT inet_server_addr(), inet_server_port(), current_database()`);
        console.log("DB Info:", connInfo);

        const [path] = await db.execute(sql`SHOW search_path`);
        console.log("Search Path:", path);
        const [schema] = await db.execute(sql`SELECT current_schema()`);
        console.log("Current Schema:", schema);

        const res = await db.execute(sql`SELECT last_comment_at FROM public.users LIMIT 1`);
        console.log("Raw Public Check Success:", res);
    } catch (e) {
        console.log("Raw Check Failed:", e);
    }
}

async function main() {
    console.log(`${colors.blue}🚀 STARTING BACKEND AUDIT SIMULATION...${colors.reset}`);
    await checkColumnRaw();


    await runHappyPath();
    await runDisputeScenario();
    await runAbuseScenario();

    console.log(`\n${colors.blue}🏁 SIMULATION COMPLETE${colors.reset}`);
    process.exit(0);
}

main().catch(console.error);
