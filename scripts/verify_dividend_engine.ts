
import { db, sql } from '../lib/db';
import { slices, requests, escrowPayments, users, answers, comments, communityRewards, userWallets } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { PayrollService } from '../lib/services/payroll-service';

async function main() {
    console.log("🚀 Starting Dividend Engine Verification...");

    const service = new PayrollService();
    const userId = '11111111-1111-1111-1111-111111111111'; // Demo User (Beneficiary)

    // Clean up
    await sql`DELETE FROM community_rewards WHERE user_id = ${userId}`;
    // Reset wallet for clean test
    await sql`UPDATE user_wallets SET balance = 0, total_earned = 0 WHERE user_id = ${userId}`;

    // 1. Verify Pool Calculation
    console.log("Step 1: Calculating Pool...");
    const pool = await service.calculateWeeklyPool();
    console.log(`Current Pool: $${pool / 100}`);

    if (pool < 30) {
        console.warn("⚠️ Pool is low. Ensure 'verify_fund_release.ts' ran successfully to seed a released payment.");
        // We could seed more here if needed, but let's rely on the previous state for now to verify integration.
    }

    // 2. Seed User Activity (to ensure they have a score)
    // 2. Seed User Activity (to ensure they have a score)
    console.log("Step 2: Seeding User Activity...");
    // Insert a dummy answer to give points
    const dummyQuestionId = crypto.randomUUID();

    // Ensure question exists first (conceptually) - or just insert answer linearly
    // We need a valid question ID. Let's create a dummy question.
    const requestId = crypto.randomUUID();
    await sql`INSERT INTO requests (id, user_id, title, description) VALUES (${requestId}, ${userId}, 'Dummy', 'Dummy')`;

    await sql`INSERT INTO questions (id, request_id, asker_id, content) VALUES (${dummyQuestionId}, ${requestId}, ${userId}, 'Dummy Q')`;

    await sql`
        INSERT INTO answers (question_id, answerer_id, content, is_accepted) 
        VALUES (${dummyQuestionId}, ${userId}, 'Helpful answer', true)
    `;

    // 3. Generate Preview
    console.log("Step 3: Generating Preview...");
    const preview = await service.generatePayoutPreview();
    console.log("Preview:", JSON.stringify(preview, null, 2));

    const userPayout = preview.payouts.find(p => p.userId === userId);
    if (!userPayout) {
        console.error("❌ User not found in payout preview.");
        process.exit(1);
    }

    // 4. Execute Payout
    console.log("Step 4: Executing Payout...");
    const result = await service.executePayout();
    console.log("Execution Result:", result);

    if (!result.success) {
        console.error("❌ Execution failed.");
        process.exit(1);
    }

    // 5. Verify Wallet Update
    console.log("Step 5: Verifying Ledger...");
    const [wallet] = await db.select().from(userWallets).where(eq(userWallets.userId, userId));
    const [reward] = await db.select().from(communityRewards).where(eq(communityRewards.userId, userId));

    console.log("Wallet Balance:", wallet?.balance);
    console.log("Reward Record:", reward?.amount);

    if (wallet?.balance === userPayout.amount && reward?.amount === userPayout.amount) {
        console.log("🎉 SUCCESS: Dividend Engine Verified!");
    } else {
        console.error("❌ FAILURE: Wallet balance does not match payout.");
        process.exit(1);
    }
}

main();
