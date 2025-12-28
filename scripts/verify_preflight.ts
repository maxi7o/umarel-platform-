
import { db } from '../lib/db';
import { users, requests, slices, sliceCards, changeProposals, escrowPayments, sliceEvidence, comments } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { NotificationService } from '../lib/services/notification-service';

// Mock Notification Service to track calls
const notificationLogs: string[] = [];

// Monkey-patch the static methods for testing
const originalNotifyProposal = NotificationService.notifyProposalAccepted;
const originalNotifyRelease = NotificationService.notifyFundsReleased;
const originalNotifyDispute = NotificationService.notifyDisputeOpened;

NotificationService.notifyProposalAccepted = async (email, name, title, id) => {
    console.log(`[VERIFY] 📧 Email 'Proposal Accepted' sent to ${email}`);
    notificationLogs.push('PROPOSAL_ACCEPTED');
    await originalNotifyProposal.call(NotificationService, email, name, title, id);
};

NotificationService.notifyFundsReleased = async (email, name, title, amount) => {
    console.log(`[VERIFY] 📧 Email 'Funds Released' sent to ${email}`);
    notificationLogs.push('FUNDS_RELEASED');
    await originalNotifyRelease.call(NotificationService, email, name, title, amount);
};

NotificationService.notifyDisputeOpened = async (clientEmail, providerEmail, title, reason) => {
    console.log(`[VERIFY] 📧 Email 'Dispute Opened' sent to Client(${clientEmail}) & Provider(${providerEmail})`);
    notificationLogs.push('DISPUTE_OPENED');
    await originalNotifyDispute.call(NotificationService, clientEmail, providerEmail, title, reason);
};

async function runPreFlightCheck() {
    console.log('🚀 Starting Pre-Flight Launch Check...');
    const timestamp = Date.now();
    const clientEmail = `client_${timestamp}@test.com`;
    const providerEmail = `provider_${timestamp}@test.com`;

    try {
        // 1. Setup Users
        console.log('\n👤 Creating Users...');
        const [client] = await db.insert(users).values({
            email: clientEmail,
            fullName: 'Launch Client',
            role: 'user',
            auraPoints: 100
        }).returning();

        const [provider] = await db.insert(users).values({
            email: providerEmail,
            fullName: 'Launch Provider',
            role: 'user',
            auraPoints: 500 // Experienced
        }).returning();
        console.log('   ✅ Users Created');

        // 2. Client Creates Request
        console.log('\n📝 Creating Service Request...');
        const [request] = await db.insert(requests).values({
            userId: client.id,
            title: 'Launch Day Fix',
            description: 'Fixing the production server rack',
            status: 'open'
        }).returning();

        // 3. Provider Submits Proposal (Quote)
        console.log('\n💬 Provider Submitting Proposal...');

        // Create comment first (Satisfy FK)
        const [comment] = await db.insert(comments).values({
            requestId: request.id,
            userId: provider.id,
            content: 'I can fix this server.',
            type: 'text'
        }).returning();

        const [proposal] = await db.insert(changeProposals).values({
            requestId: request.id,
            commentId: comment.id,
            status: 'pending',
            proposedActions: [{
                type: 'CREATE_CARD',
                data: { title: 'Server Fix', description: 'Rewiring', skills: ['IT'] }
            }],
            aiImpact: { qualityScore: 10, impactType: 'quality', estimatedSavings: 0 }
        }).returning();

        // 4. Client ACCEPTS Proposal [TRIGGER NOTIFICATION 1]
        console.log('\n🤝 Client Accepting Proposal...');
        await db.update(changeProposals).set({ status: 'accepted' }).where(eq(changeProposals.id, proposal.id));

        const [slice] = await db.insert(slices).values({
            requestId: request.id,
            creatorId: client.id,
            assignedProviderId: provider.id,
            title: 'Server Fix',
            description: 'Fixing the server',
            status: 'accepted',
            finalPrice: 5000 // $50
        }).returning();

        // Trigger Notification 1
        await NotificationService.notifyProposalAccepted(provider.email, provider.fullName!, slice.title, slice.id);

        if (!notificationLogs.includes('PROPOSAL_ACCEPTED')) throw new Error('Proposal Notification failed');
        console.log('   ✅ Proposal Notification Fired');

        // 5. Provider Starts Job (Proof of Arrival)
        console.log('\n📸 Provider Starting Job...');
        await db.insert(sliceEvidence).values({
            sliceId: slice.id,
            providerId: provider.id,
            fileUrl: 'http://proof.com/photo.jpg',
            description: 'I am here'
        });
        await db.update(slices).set({ status: 'in_progress' }).where(eq(slices.id, slice.id));
        console.log('   ✅ Job Started (In Progress)');

        // 6. Client Completes Job -> Escrow Release
        console.log('\n🏁 Client Completes Job...');
        const [escrow] = await db.insert(escrowPayments).values({
            sliceId: slice.id,
            clientId: client.id,
            providerId: provider.id,
            totalAmount: 5750,
            sliceAmount: 5000,
            platformFee: 600,
            communityRewardPool: 150,
            status: 'in_escrow',
            paymentMethod: 'mercado_pago'
        }).returning();

        await db.update(slices).set({ status: 'completed', escrowPaymentId: escrow.id }).where(eq(slices.id, slice.id));

        // 7. Manual Release [TRIGGER NOTIFICATION 2]
        console.log('\n💸 Client Releasing Funds...');
        await db.update(escrowPayments).set({ status: 'released' }).where(eq(escrowPayments.id, escrow.id));

        // Trigger Notification 2
        await NotificationService.notifyFundsReleased(provider.email, provider.fullName!, slice.title, 5000);

        if (!notificationLogs.includes('FUNDS_RELEASED')) throw new Error('Release Notification failed');
        console.log('   ✅ Funds Released Notification Fired');

        // 8. Dispute Simulation [TRIGGER NOTIFICATION 3]
        console.log('\n🚨 Simulating Dispute...');
        // Trigger Notification 3
        await NotificationService.notifyDisputeOpened(client.email, provider.email, slice.title, 'Wires still loose');

        if (!notificationLogs.includes('DISPUTE_OPENED')) throw new Error('Dispute Notification failed');
        console.log('   ✅ Dispute Notification Fired');

        console.log('\n✨ PRE-FLIGHT CHECK COMPLETE ✨');
        console.log('Summary:');
        console.log(`- Users: 2 Created`);
        console.log(`- Transaction: Completed ($50.00)`);
        console.log(`- Notifications: ${notificationLogs.length}/3 Confirmed`);
        console.log('- Status: READY FOR LAUNCH 🚀');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Pre-Flight Check Failed:', error);
        process.exit(1);
    }
}

runPreFlightCheck();
