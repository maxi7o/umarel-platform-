import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/lib/db';
import { users, requests, slices, sliceEvidence, escrowPayments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { POST as completeSlice } from '@/app/api/slices/[id]/complete/route';
import { analyzeDisputeAction } from '@/app/admin/actions';
import { randomUUID } from 'crypto';

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn()
}));

vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn().mockResolvedValue({
        auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user: null } })
        }
    })
}));

// Mock OpenAI
vi.mock('@/lib/ai/openai', () => ({
    openai: {
        chat: {
            completions: {
                create: vi.fn().mockResolvedValue({
                    choices: [{
                        message: {
                            content: JSON.stringify({
                                recommendation: 'release_to_provider',
                                confidenceScore: 95,
                                reasoning: 'Evidence matches description perfectly',
                                keyObservations: ['Clean work area', 'Completed verified']
                            })
                        }
                    }]
                })
            }
        }
    }
}));

// Conditionally run tests only if API Key is present (or mocked properly to avoid init issues)
// Logic: If verifying locally without keys, skip.
const runIfAiAvailable = process.env.OPENAI_API_KEY ? describe : describe.skip;

runIfAiAvailable('Dispute & AI Integration', () => {
    let sliceId: string;
    let escrowId: string;
    let providerId: string;

    beforeEach(async () => {
        // Setup User & Provider
        try {
            const [prov] = await db.insert(users).values({
                email: `prov-${randomUUID()}@test.com`,
                fullName: 'Provider AI',
                role: 'user'
            }).returning();
            providerId = prov.id;
        } catch (error) {
            console.error('FULL DB ERROR:', JSON.stringify(error, null, 2));
            console.error(error);
            throw error;
        }

        const [client] = await db.insert(users).values({
            email: `client-${randomUUID()}@test.com`,
            fullName: 'Client AI',
            role: 'user'
        }).returning();

        // Setup Request & Slice
        const [req] = await db.insert(requests).values({
            userId: client.id,
            title: 'Test AI Request',
            description: 'Fix the roof'
        }).returning();

        const [slice] = await db.insert(slices).values({
            requestId: req.id,
            creatorId: client.id,
            assignedProviderId: providerId,
            title: 'Roof Repair',
            description: 'Fix leak',
            status: 'accepted',
            finalPrice: 10000
        }).returning();
        sliceId = slice.id;

        // Setup Escrow
        const [escrow] = await db.insert(escrowPayments).values({
            sliceId: slice.id,
            clientId: client.id,
            providerId: providerId,
            totalAmount: 11500,
            sliceAmount: 10000,
            platformFee: 1500,
            communityRewardPool: 300,
            paymentMethod: 'stripe',
            status: 'disputed', // Start in disputed state for testing AI
            disputeReason: 'Work not done'
        }).returning();
        escrowId = escrow.id;
    });

    it('should block completion without evidence', async () => {
        // Mock Request for API
        const req = new Request(`http://localhost/api/slices/${sliceId}/complete`, {
            method: 'POST',
            headers: { 'x-user-id': providerId }
        });

        const res = await completeSlice(req as any, { params: Promise.resolve({ id: sliceId }) });
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.error).toContain('Proof of work');
    });

    it('should allow completion WITH evidence', async () => {
        // Add Evidence
        await db.insert(sliceEvidence).values({
            sliceId: sliceId,
            providerId: providerId,
            fileUrl: 'http://test.com/image.jpg',
            description: 'Work done'
        });

        // Retry Completion
        const req = new Request(`http://localhost/api/slices/${sliceId}/complete`, {
            method: 'POST',
            headers: { 'x-user-id': providerId }
        });

        const res = await completeSlice(req as any, { params: Promise.resolve({ id: sliceId }) });
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
    });

    it('should analyze dispute using AI', async () => {
        // Add Evidence first so AI has something to analyze
        await db.insert(sliceEvidence).values({
            sliceId: sliceId,
            providerId: providerId,
            fileUrl: 'http://test.com/image.jpg',
            description: 'Before Analysis'
        });

        const result = await analyzeDisputeAction(escrowId);

        expect(result.success).toBe(true);
        expect(result.analysis).toBeDefined();
        expect(result.analysis?.recommendation).toBe('release_to_provider');
        expect(result.analysis?.confidenceScore).toBe(95);

        // Verify DB update
        const updatedEscrow = await db.query.escrowPayments.findFirst({
            where: eq(escrowPayments.id, escrowId)
        });
        expect(updatedEscrow?.aiDisputeAnalysis).toMatchObject({
            recommendation: 'release_to_provider'
        });
    });
});
