import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { escrowPayments, slices, communityRewards, comments, userWallets, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { distributeRewards, formatARS } from '@/lib/payments/calculations';

import { createClient } from '@/lib/supabase/server';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: sliceId } = await params;

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const clientId = user.id;

        // Get slice and escrow payment
        const slice = await db.query.slices.findFirst({
            where: eq(slices.id, sliceId),
        });

        if (!slice || !slice.escrowPaymentId) {
            return NextResponse.json({ error: 'Slice or escrow not found' }, { status: 404 });
        }

        const escrow = await db.query.escrowPayments.findFirst({
            where: eq(escrowPayments.id, slice.escrowPaymentId),
        });

        if (!escrow) {
            return NextResponse.json({ error: 'Escrow payment not found' }, { status: 404 });
        }

        // Verify client owns this request
        if (escrow.clientId !== clientId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Verify slice is completed
        if (slice.status !== 'completed') {
            return NextResponse.json(
                { error: 'Slice must be completed before approval' },
                { status: 400 }
            );
        }

        // Verify escrow is in correct state
        if (escrow.status !== 'in_escrow') {
            return NextResponse.json(
                { error: 'Payment not in escrow' },
                { status: 400 }
            );
        }

        // CAPTURE THE STRIPE PAYMENT (Release from escrow)
        if (escrow.paymentMethod === 'stripe' && escrow.stripePaymentIntentId) {
            await stripe.paymentIntents.capture(escrow.stripePaymentIntentId);
        }

        // Get helpful comments marked by client
        const helpfulComments = await db.query.comments.findMany({
            where: and(
                eq(comments.requestId, slice.requestId),
                eq(comments.isMarkedHelpful, true),
                eq(comments.markedHelpfulBy, clientId)
            ),
        });

        // Distribute community rewards (3%)
        if (helpfulComments.length > 0) {
            const rewardsDistribution = distributeRewards(
                escrow.communityRewardPool,
                helpfulComments.map(c => ({
                    commentId: c.id,
                    userId: c.userId,
                    hearts: c.heartsCount || 0,
                }))
            );

            // Create reward records and update wallets
            for (const reward of rewardsDistribution) {
                await db.insert(communityRewards).values({
                    userId: reward.userId,
                    sliceId: slice.id,
                    commentId: reward.commentId,
                    amount: reward.amount,
                    reason: 'Helpful optimization comment',
                    paidAt: new Date(),
                    paymentMethod: 'wallet_credit',
                });

                // Update or create user wallet
                const wallet = await db.query.userWallets.findFirst({
                    where: eq(userWallets.userId, reward.userId),
                });

                if (wallet) {
                    await db
                        .update(userWallets)
                        .set({
                            balance: (wallet.balance || 0) + reward.amount,
                            totalEarned: (wallet.totalEarned || 0) + reward.amount,
                            updatedAt: new Date(),
                        })
                        .where(eq(userWallets.userId, reward.userId));
                } else {
                    await db.insert(userWallets).values({
                        userId: reward.userId,
                        balance: reward.amount,
                        totalEarned: reward.amount,
                    });
                }
            }
        }

        // Update slice status
        await db
            .update(slices)
            .set({
                status: 'approved_by_client',
                approvedByClientAt: new Date(),
                paidAt: new Date(),
            })
            .where(eq(slices.id, sliceId));

        // Update escrow status
        await db
            .update(escrowPayments)
            .set({
                status: 'released',
                releasedAt: new Date(),
            })
            .where(eq(escrowPayments.id, escrow.id));

        // Send email notifications
        try {
            const { sendEmail, paymentReleasedEmail, communityRewardEmail } = await import(
                '@/lib/notifications/email'
            );

            // Fetch provider email
            const provider = await db.query.users.findFirst({
                where: eq(users.id, escrow.providerId),
            });

            if (provider?.email) {
                await sendEmail(
                    paymentReleasedEmail(
                        provider.email,
                        slice.title,
                        formatARS(escrow.sliceAmount)
                    )
                );
            }

            // Notify community members of rewards
            if (helpfulComments.length > 0) {
                const rewardsDistribution = distributeRewards(
                    escrow.communityRewardPool,
                    helpfulComments.map((c) => ({
                        commentId: c.id,
                        userId: c.userId,
                        hearts: c.heartsCount || 0,
                    }))
                );

                for (const reward of rewardsDistribution) {
                    const helper = await db.query.users.findFirst({
                        where: eq(users.id, reward.userId),
                    });

                    if (helper?.email) {
                        await sendEmail(
                            communityRewardEmail(
                                helper.email,
                                formatARS(reward.amount),
                                'Helpful optimization comment'
                            )
                        );
                    }
                }
            }
        } catch (emailError) {
            console.error('Failed to send email notifications:', emailError);
            // Don't fail the request if email fails
        }


        return NextResponse.json({
            success: true,
            message: 'Payment released successfully',
            providerAmount: escrow.sliceAmount,
            communityRewards: escrow.communityRewardPool,
        });
    } catch (error) {
        console.error('Error approving slice:', error);
        return NextResponse.json(
            { error: 'Failed to approve slice and release payment' },
            { status: 500 }
        );
    }
}
