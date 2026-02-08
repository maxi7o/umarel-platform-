import { db } from './db';
import { slices, escrowPayments, transactions, users, requests } from './db/schema';
import { eq, and, or, inArray } from 'drizzle-orm';

export class DisputeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DisputeError';
    }
}

export async function raiseDispute(sliceId: string, userId: string, reason: string) {
    if (!reason || reason.length < 10) {
        throw new DisputeError("Dispute reason must be at least 10 characters long.");
    }

    // 1. Fetch Slice
    const slice = await db.query.slices.findFirst({
        where: eq(slices.id, sliceId),
    });

    if (!slice) {
        throw new DisputeError("Slice not found.");
    }

    if (!slice.requestId) {
        throw new DisputeError("Slice has no associated request.");
    }

    // 1b. Fetch Request for Authorization Check
    const request = await db.query.requests.findFirst({
        where: eq(requests.id, slice.requestId),
    });

    if (!request) {
        throw new DisputeError("Request associated with slice not found.");
    }

    // 2. Verify User Authorization (Must be Client or Provider)
    const isClient = request.userId === userId;
    const isProvider = slice.assignedProviderId === userId;

    if (!isClient && !isProvider) {
        throw new DisputeError("Unauthorized: Only the Client or Assigned Provider can raise a dispute.");
    }

    // 3. Verify Slice Status
    // Disputes can be raised during work, after completion, or even after client approval (before final payout release)
    const validStatuses = ['in_progress', 'completed', 'approved_by_client'];
    if (!validStatuses.includes(slice.status || '')) {
        throw new DisputeError(`Cannot dispute a slice in '${slice.status}' status.`);
    }

    // 4. Perform Updates Transactionally
    await db.transaction(async (tx) => {
        // Update Slice
        await tx.update(slices)
            .set({
                status: 'disputed',
                disputedAt: new Date()
            })
            .where(eq(slices.id, sliceId));

        // Update Escrow Payment (if exists)
        await tx.update(escrowPayments)
            .set({
                status: 'disputed',
                disputeReason: reason,
                // We don't set resolvedBy yet
            })
            .where(eq(escrowPayments.sliceId, sliceId));

        // Update Transaction (if exists)
        await tx.update(transactions)
            .set({ status: 'disputed' })
            .where(eq(transactions.sliceId, sliceId));
    });

    return { success: true, message: "Dispute raised successfully. Support team has been notified." };
}
