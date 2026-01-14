import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { changeProposals, sliceCards, slices, users, contributionEvaluations, comments } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { calculateAuraLevel } from '@/lib/aura/calculations';
import { WizardAction } from '@/lib/ai/openai';
import { NotificationService } from '@/lib/services/notification-service';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, userId } = body; // userId here is the REQUEST OWNER who is accepting/rejecting

        if (!status || !['accepted', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // 1. Get the Proposal
        const [proposal] = await db.select().from(changeProposals).where(eq(changeProposals.id, id));

        if (!proposal) {
            return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
        }

        if (proposal.status !== 'pending') {
            return NextResponse.json({ error: 'Proposal already processed' }, { status: 400 });
        }

        // TODO: Verify userId owns the Request (requestId)

        // 2. Update Proposal Status
        await db.update(changeProposals)
            .set({
                status: status,
                reviewedAt: new Date(),
            })
            .where(eq(changeProposals.id, id));

        if (status === 'rejected') {
            return NextResponse.json({ message: 'Proposal rejected' });
        }

        // 3. IF ACCEPTED: Execute Actions
        const actions = proposal.proposedActions as WizardAction[];
        const requestId = proposal.requestId;
        // The Umarel (Expert) is the comment author
        // We can't access proposal.comment directly if `with` isn't set up in schema relations (it usually isn't in simple drizzle unless defined)
        // So let's fetch comment separately if needed, or rely on commentId

        let umarelId = '';
        const [commentData] = await db.select().from(comments).where(eq(comments.id, proposal.commentId));
        if (commentData) umarelId = commentData.userId;


        for (const action of actions) {
            if (action.type === 'UPDATE_CARD') {
                await db.update(sliceCards)
                    .set({
                        ...action.updates,
                        updatedAt: new Date(),
                        version: sql`version + 1`,
                    })
                    .where(eq(sliceCards.id, action.cardId));
            } else if (action.type === 'CREATE_CARD') {
                // Create slice + card
                const [newSlice] = await db.insert(slices).values({
                    requestId: requestId,
                    creatorId: umarelId || userId, // Attribute to Expert if known
                    title: action.data.title,
                    description: action.data.description,
                    status: 'proposed',
                }).returning();

                await db.insert(sliceCards).values({
                    sliceId: newSlice.id,
                    requestId: requestId,
                    title: action.data.title,
                    description: action.data.description,
                    skills: action.data.skills || [],
                    currency: 'ARS',
                });
            }
        }


        // 4. Award Aura to Umarel
        if (umarelId && proposal.aiImpact) {
            const impact = proposal.aiImpact as { qualityScore: number, impactType: string, estimatedSavings: number };
            const { qualityScore, impactType, estimatedSavings } = impact;

            let auraPoints = 0;

            if (impactType === 'risk_mitigation') {
                auraPoints = Math.pow(qualityScore, 2) * 5;
            } else if (impactType === 'savings') {
                auraPoints = Math.floor(estimatedSavings / 1000) + (qualityScore * 10);
            } else {
                auraPoints = qualityScore * 10;
            }



            if (qualityScore < 2) auraPoints = 0;

            if (auraPoints > 0) {
                const [currentUser] = await db.select().from(users).where(eq(users.id, umarelId));
                const newTotalPoints = (currentUser?.auraPoints || 0) + auraPoints;
                const newLevel = calculateAuraLevel(newTotalPoints);

                await db.update(users)
                    .set({
                        auraPoints: newTotalPoints,
                        auraLevel: newLevel,
                        totalSavingsGenerated: sql`total_savings_generated + ${estimatedSavings}`
                    })
                    .where(eq(users.id, umarelId));

                // Log Contribution
                await db.insert(contributionEvaluations).values({
                    sliceId: proposal.sliceId || null,
                    requestId: requestId,
                    evaluatorModel: 'gpt-4-turbo-preview', // or store 'system'
                    contributions: [{
                        userId: umarelId,
                        userName: 'Expert',
                        score: qualityScore,
                        reasoning: `Proposal Accepted. Impact: ${impactType}. Savings: ${estimatedSavings}`,
                        contributionType: impactType === 'risk_mitigation' ? 'risk_mitigation' :
                            impactType === 'savings' ? 'savings' : 'quality'
                    }],
                    totalScore: auraPoints
                });

                // NOTIFICATION: Notify the Expert that their proposal was accepted!
                if (currentUser?.email) {
                    // Try to get slice title from actions
                    const firstAction = actions[0];
                    let sliceTitle = 'Project Update';
                    if (firstAction.type === 'CREATE_CARD') {
                        sliceTitle = firstAction.data.title;
                    } else if (firstAction.type === 'UPDATE_CARD') {
                        sliceTitle = firstAction.updates?.title || 'Project Update';
                    }

                    // Using fire-and-forget for speed, but ideally imported from service
                    // Lazy import to avoid circular dep issues in some setups, but here import at top is better.
                    // I will add the import to the top of file in next step.
                    // For now, I'll use the service class name assuming I will add the import.

                    await NotificationService.notifyProposalAccepted(
                        currentUser.email,
                        currentUser.fullName || 'Expert',
                        sliceTitle,
                        proposal.sliceId || 'dashboard' // Link usage
                    );
                }
            }
        }

        return NextResponse.json({ message: 'Proposal accepted and changes applied' });

    } catch (error) {
        console.error('Error processing proposal:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
