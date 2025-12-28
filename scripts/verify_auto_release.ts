
import { db } from '@/lib/db';
import { slices, users, requests, escrowPayments } from '@/lib/db/schema';
import { PayoutService } from '@/lib/services/payout-service';
import { eq } from 'drizzle-orm';
import { PaymentFactory } from '@/lib/payments/payment-factory';

async function main() {
    console.log('🧪 Verifying Auto-Release Logic...');

    // 1. Setup Mock Data
    console.log('1. Creating Mock Slice needing release...');

    // Get a user
    const user = await db.query.users.findFirst();
    if (!user) throw new Error('No users found');

    // Create completed slice with autoReleaseAt in the PAST
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 25); // 25 hours ago

    // Mock Request
    const [request] = await db.insert(requests).values({
        userId: user.id,
        title: 'Auto-Release Test Request',
        description: 'Test',
        category: 'test'
    }).returning();

    // Mock Escrow Payment
    const [escrow] = await db.insert(escrowPayments).values({
        // id will be generated
        clientId: user.id,
        providerId: user.id,
        totalAmount: 10000,
        sliceAmount: 9000,
        platformFee: 1000,
        communityRewardPool: 300,
        paymentMethod: 'mercado_pago',
        status: 'in_escrow'
    }).returning();

    // Mock Slice
    const [slice] = await db.insert(slices).values({
        requestId: request.id,
        creatorId: user.id,
        title: 'Auto-Release Slice',
        description: 'Testing auto release',
        status: 'completed',
        autoReleaseAt: pastDate, // Eligible!
        escrowPaymentId: escrow.id // Link correctly to the UUID
    }).returning();

    console.log(`   Slice ${slice.id} created with autoReleaseAt: ${pastDate.toISOString()}`);

    // 2. Run Auto-Release
    console.log('2. Running PayoutService.processAutoReleases()...');
    const result = await PayoutService.processAutoReleases();
    console.log('   Result:', result);

    // 3. Verify
    const updated = await db.query.escrowPayments.findFirst({
        where: eq(escrowPayments.id, escrow.id)
    });

    if (updated?.status === 'released') {
        console.log('✅ SUCCESS: Payment status changed to RELEASED');
    } else {
        console.error('❌ FAILURE: Payment status is', updated?.status);
    }

    process.exit(0);
}

main().catch(console.error);
