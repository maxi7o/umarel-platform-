import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slices, transactions, quotes, requests, questions, answers, users, providerMetrics } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Calculate Umarel rewards based on question-answer contributions
 */
async function calculateUmarelRewards(sliceId: string, transactionAmount: number) {
    // Get the slice and its request
    const [slice] = await db.select().from(slices).where(eq(slices.id, sliceId));
    if (!slice) return [];

    // Get all questions for this request
    const requestQuestions = await db
        .select()
        .from(questions)
        .where(eq(questions.requestId, slice.requestId));

    // Filter questions that influenced this slice
    const relevantQuestions = requestQuestions.filter(q =>
        q.relatedSliceIds &&
        Array.isArray(q.relatedSliceIds) &&
        q.relatedSliceIds.includes(sliceId)
    );

    if (relevantQuestions.length === 0) return [];

    // Get all answers for these questions
    const allAnswers = await Promise.all(
        relevantQuestions.map(q =>
            db.select().from(answers).where(eq(answers.questionId, q.id))
        )
    );
    const flatAnswers = allAnswers.flat();

    if (flatAnswers.length === 0) return [];

    // Calculate contribution scores
    const answersWithScores = flatAnswers.map(answer => {
        let score = 10; // Base score

        if (answer.isAccepted) score += 20;
        score += (answer.upvotes || 0) * 2;

        const question = relevantQuestions.find(q => q.id === answer.questionId);
        if (question?.forwardedToCommunity) score += 15;

        return { ...answer, calculatedScore: score };
    });

    // Total Umarel pool = 5% of transaction amount
    const umarelPool = Math.floor(transactionAmount * 0.05);
    const totalScore = answersWithScores.reduce((sum, a) => sum + a.calculatedScore, 0);

    // Distribute rewards proportionally
    return answersWithScores.map(answer => ({
        answererId: answer.answererId,
        answerId: answer.id,
        reward: Math.floor((answer.calculatedScore / totalScore) * umarelPool),
        contributionScore: answer.calculatedScore
    }));
}

/**
 * Update provider metrics after successful transaction
 */
async function updateProviderMetrics(providerId: string, amount: number, onTime: boolean) {
    // Get or create provider metrics
    const [existing] = await db
        .select()
        .from(providerMetrics)
        .where(eq(providerMetrics.providerId, providerId));

    if (existing) {
        await db
            .update(providerMetrics)
            .set({
                totalSlicesCompleted: existing.totalSlicesCompleted + 1,
                totalSlicesOnTime: existing.totalSlicesOnTime + (onTime ? 1 : 0),
                totalEarnings: existing.totalEarnings + amount,
                updatedAt: new Date(),
            })
            .where(eq(providerMetrics.providerId, providerId));
    } else {
        await db.insert(providerMetrics).values({
            providerId,
            totalSlicesCompleted: 1,
            totalSlicesOnTime: onTime ? 1 : 0,
            totalEarnings: amount,
            rating: 80, // Default starting rating
        });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: sliceId } = await params;
        const body = await request.json();
        const { requesterId, quoteId, rating, onTime = true } = body;

        if (!requesterId || !quoteId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get slice details
        const [slice] = await db
            .select()
            .from(slices)
            .where(eq(slices.id, sliceId));

        if (!slice) {
            return NextResponse.json(
                { error: 'Slice not found' },
                { status: 404 }
            );
        }

        if (slice.status !== 'completed') {
            return NextResponse.json(
                { error: 'Slice must be marked as completed first' },
                { status: 400 }
            );
        }

        if (!slice.assignedProviderId) {
            return NextResponse.json(
                { error: 'Slice has no assigned provider' },
                { status: 400 }
            );
        }

        // Get quote to determine amount
        const [quote] = await db
            .select()
            .from(quotes)
            .where(eq(quotes.id, quoteId));

        if (!quote) {
            return NextResponse.json(
                { error: 'Quote not found' },
                { status: 404 }
            );
        }

        // Calculate transaction amounts
        const transactionAmount = quote.amount;
        const platformFee = Math.floor(transactionAmount * 0.10); // 10% platform fee
        const umarelRewardsTotal = Math.floor(transactionAmount * 0.05); // 5% for Umarels
        const providerEarnings = transactionAmount - platformFee - umarelRewardsTotal;

        // Calculate Umarel reward distribution
        const umarelRewards = await calculateUmarelRewards(sliceId, transactionAmount);

        // Create transaction record
        const [transaction] = await db.insert(transactions).values({
            sliceId,
            quoteId,
            providerId: slice.assignedProviderId,
            requesterId,
            amount: transactionAmount,
            platformFee,
            umarelRewards: umarelRewardsTotal,
            status: 'confirmed',
            completedAt: new Date(),
            confirmedAt: new Date(),
        }).returning();

        // Distribute rewards to Umarels
        for (const reward of umarelRewards) {
            // Update answer's total rewards
            await db
                .update(answers)
                .set({
                    totalRewardsEarned: reward.reward,
                    contributionScore: reward.contributionScore
                })
                .where(eq(answers.id, reward.answerId));

            // Update user's aura points (already done in answer creation, but track money)
            const [user] = await db.select().from(users).where(eq(users.id, reward.answererId));
            if (user) {
                // In a real system, this would trigger a payout
                console.log(`Umarel ${user.fullName} earned $${(reward.reward / 100).toFixed(2)}`);
            }
        }

        // Update provider metrics
        await updateProviderMetrics(slice.assignedProviderId, providerEarnings, onTime);

        return NextResponse.json({
            transaction,
            umarelRewards,
            providerEarnings,
            message: `Transaction confirmed. ${umarelRewards.length} Umarels rewarded.`
        });
    } catch (error) {
        console.error('Error confirming slice:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
