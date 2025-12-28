
import { describe, it, expect, beforeEach } from 'vitest';
import { escrowService } from '@/lib/services/escrow-service';
import { db } from '@/lib/db';
import { escrowPayments, users, slices, requests } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Conditionally run tests only if MP Token is present
const runIfMpAvailable = process.env.MERCADOPAGO_ACCESS_TOKEN ? describe : describe.skip;

runIfMpAvailable('Dispute Resolution System', () => {
    let testEscrowId: string;
    let clientId: string;
    let providerId: string;
    let adminId: string;

    beforeEach(async () => {
        // Setup Test Data
        clientId = uuidv4();
        providerId = uuidv4();
        adminId = uuidv4();
        const requestId = uuidv4();
        const sliceId = uuidv4();
        testEscrowId = uuidv4();

        // Need user records for foreign keys
        await db.insert(users).values([
            { id: clientId, email: `client-${clientId}@test.com`, fullName: 'Test Client', role: 'user' },
            { id: providerId, email: `provider-${providerId}@test.com`, fullName: 'Test Provider', role: 'user' },
            { id: adminId, email: `admin-${adminId}@test.com`, fullName: 'Test Admin', role: 'admin' }
        ]);

        await db.insert(requests).values({ id: requestId, userId: clientId, title: 'Dispute Test', description: 'Test', status: 'open' });
        await db.insert(slices).values({ id: sliceId, requestId, creatorId: clientId, title: 'Slice', description: 'Desc', status: 'in_progress' });

        await db.insert(escrowPayments).values({
            id: testEscrowId,
            sliceId, clientId, providerId,
            totalAmount: 11500, sliceAmount: 10000, platformFee: 1500, communityRewardPool: 300,
            paymentMethod: 'stripe',
            status: 'in_escrow'
        });
    });

    it('should allow raising a dispute', async () => {
        await escrowService.raiseDispute(testEscrowId, 'Work not done', clientId);

        const [updated] = await db.select().from(escrowPayments).where(eq(escrowPayments.id, testEscrowId));
        expect(updated.status).toBe('disputed');
        expect(updated.disputeReason).toBe('Work not done');
    });

    it('should allow admin to resolve dispute by refunding', async () => {
        // First raise
        await escrowService.raiseDispute(testEscrowId, 'Bad work', clientId);

        // Then resolve
        await escrowService.resolveDispute(testEscrowId, 'refund', 'Refund granted', adminId);

        const [resolved] = await db.select().from(escrowPayments).where(eq(escrowPayments.id, testEscrowId));
        expect(resolved.status).toBe('refunded');
        expect(resolved.resolutionNotes).toBe('Refund granted');
        expect(resolved.resolvedBy).toBe(adminId);
        expect(resolved.refundedAt).toBeDefined();
    });

    it('should allow admin to resolve dispute by releasing funds', async () => {
        // First raise
        await escrowService.raiseDispute(testEscrowId, 'Client unresponsive', providerId);

        // Then resolve
        await escrowService.resolveDispute(testEscrowId, 'release', 'Work verified', adminId);

        const [resolved] = await db.select().from(escrowPayments).where(eq(escrowPayments.id, testEscrowId));
        expect(resolved.status).toBe('released');
        expect(resolved.resolutionNotes).toBe('Work verified');
        expect(resolved.resolvedBy).toBe(adminId);
        expect(resolved.releasedAt).toBeDefined();
    });
});
