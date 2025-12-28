
import { db } from '../lib/db';
import {
    users, requests, slices, quotes, userWallets, comments, serviceOfferings,
    serviceRatings, notifications, questions, answers, transactions, messages,
    conversations, profiles, savedItems, experienceParticipants, experiences,
    withdrawals, communityRewards, commentHearts, wizardMessages, sliceEvidence,
    escrowPayments, sliceBids, providerMetrics
} from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const NEW_USER_ID = '25a7bf55-790e-48e3-b22a-f9bc9f2b068b'; // The REAL User
const OLD_USER_ID = '2ba7bf5b-790e-48e3-b22a-f9bc9f2b068b'; // The Incorrect ID containing the data

async function main() {
    console.log(`Linking Old ID ${OLD_USER_ID} to New ID ${NEW_USER_ID}...`);

    // 1. Check entries
    const [oldUser] = await db.select().from(users).where(eq(users.id, OLD_USER_ID));
    const [newUser] = await db.select().from(users).where(eq(users.id, NEW_USER_ID));

    if (!oldUser) {
        console.log('Old user not found. Cleanup might be already complete.');
    } else {
        console.log('Old user found.');
    }

    if (!newUser) {
        if (!oldUser) {
            console.error('Neither old nor new user found! Cannot proceed.');
            process.exit(1);
        }
        console.log('New User missing. Inserting clone...');
        // Insert New User (Clone)
        try {
            await db.insert(users).values({
                ...oldUser,
                id: NEW_USER_ID,
                email: 'carlos@demo.com' // Ensure correct email
            });
        } catch (e: any) {
            if (e.code === '23505') { // Unique violation
                console.log('Email taken, swapping old user email...');
                await db.update(users).set({ email: `temp_${Date.now()}_old` }).where(eq(users.id, OLD_USER_ID));
                // Retry insert
                await db.insert(users).values({
                    ...oldUser,
                    id: NEW_USER_ID,
                    email: 'carlos@demo.com'
                });
            } else {
                throw e;
            }
        }
    } else {
        console.log('New User already exists.');
    }

    console.log('Updating references...');

    // Helper to update
    const update = async (table: any, col: any, name: string) => {
        const result = await db.update(table).set({ [name]: NEW_USER_ID }).where(eq(col, OLD_USER_ID));
        // console.log(`- Updated ${name} in table`);
    };

    // 3. Update References (Exhaustive)
    await update(requests, requests.userId, 'userId');

    await update(slices, slices.creatorId, 'creatorId');
    await update(slices, slices.assignedProviderId, 'assignedProviderId');

    await update(quotes, quotes.providerId, 'providerId');

    // Wallets: New user might already have a wallet?
    // If so, we should probably keep the OLD wallet data (balance) and delete the new empty one?
    // Or just move the old one.
    const [oldWallet] = await db.select().from(userWallets).where(eq(userWallets.userId, OLD_USER_ID));
    if (oldWallet) {
        // Check if new user has wallet
        const [newWallet] = await db.select().from(userWallets).where(eq(userWallets.userId, NEW_USER_ID));
        if (newWallet) {
            // Merge? Or just delete new and move old?
            // Assuming old wallet has the money.
            await db.delete(userWallets).where(eq(userWallets.userId, NEW_USER_ID));
        }
        await update(userWallets, userWallets.userId, 'userId');
    }

    await update(comments, comments.userId, 'userId');
    await update(comments, comments.markedHelpfulBy, 'markedHelpfulBy');

    await update(serviceOfferings, serviceOfferings.providerId, 'providerId');

    await update(notifications, notifications.userId, 'userId');

    await update(questions, questions.askerId, 'askerId');
    await update(answers, answers.answererId, 'answererId');

    // MISSED TABLES
    await update(serviceRatings, serviceRatings.providerId, 'providerId');
    await update(serviceRatings, serviceRatings.clientId, 'clientId');
    // resolvedBy?
    // await update(serviceRatings, serviceRatings.resolvedBy, 'resolvedBy'); // Not in schema

    await update(messages, messages.senderId, 'senderId');

    await update(conversations, conversations.participant1Id, 'participant1Id');
    await update(conversations, conversations.participant2Id, 'participant2Id');

    await update(profiles, profiles.userId, 'userId');
    await update(savedItems, savedItems.userId, 'userId');

    await update(experienceParticipants, experienceParticipants.userId, 'userId');
    await update(experiences, experiences.providerId, 'providerId');

    await update(withdrawals, withdrawals.userId, 'userId');
    await update(communityRewards, communityRewards.userId, 'userId');

    await update(commentHearts, commentHearts.userId, 'userId');

    await update(wizardMessages, wizardMessages.userId, 'userId');
    await update(wizardMessages, wizardMessages.markedHelpfulBy, 'markedHelpfulBy');

    await update(sliceEvidence, sliceEvidence.providerId, 'providerId');

    await update(escrowPayments, escrowPayments.clientId, 'clientId');
    await update(escrowPayments, escrowPayments.providerId, 'providerId');
    await update(escrowPayments, escrowPayments.resolvedBy, 'resolvedBy');

    await update(sliceBids, sliceBids.providerId, 'providerId');

    await update(providerMetrics, providerMetrics.providerId, 'providerId');

    await update(transactions, transactions.providerId, 'providerId');
    await update(transactions, transactions.requesterId, 'requesterId');

    console.log('All references updated.');

    // 4. Delete Old User
    if (oldUser) {
        console.log('Deleting Old User...');
        await db.delete(users).where(eq(users.id, OLD_USER_ID));
    }

    console.log('SUCCESS! Account linked fully.');
    process.exit(0);
}

main().catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
});
