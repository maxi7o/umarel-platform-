import { describe, it, expect, vi, beforeEach } from 'vitest';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { POST as commentPost } from '@/app/api/requests/[id]/comments/route';
import { POST as proposalRespond } from '@/app/api/proposals/[id]/respond/route';
import { db } from '@/lib/db';
import { users, requests, slices, changeProposals, comments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import * as openai from '@/lib/ai/openai';

// Mock OpenAI processing to avoid API calls and ensure deterministic results
vi.mock('@/lib/ai/openai', async () => {
    const actual = await vi.importActual('@/lib/ai/openai');
    return {
        ...actual,
        processExpertComment: vi.fn().mockResolvedValue({
            message: 'Mocked AI suggestion',
            wizardQuestion: null,
            qualityScore: 8,
            impactType: 'savings',
            estimatedSavings: 5000,
            actions: [
                {
                    type: 'CREATE_CARD',
                    data: {
                        title: 'New Mock Slice',
                        description: 'Created via feedback loop',
                        skills: ['mock-skill']
                    }
                }
            ]
        })
    };
});

// Mock NextRequest/Response is tricky, simpler to pass objects that look like them if using node-mocks-http or just simple objects casted
// But route handlers expect `Request`.
// compatible Request mock:
const createMockRequest = (body: any) => {
    return new Request('http://localhost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
};

describe('Feedback Loop Integration', () => {
    let ownerId: string;
    let expertId: string;
    let requestId: string;

    beforeEach(async () => {
        // Setup Data
        // 1. Create Owner
        const [owner] = await db.insert(users).values({
            email: `owner-${Date.now()}@test.com`,
            fullName: 'Test Owner',
            role: 'user'
        }).returning();
        ownerId = owner.id;

        // 2. Create Expert
        const [expert] = await db.insert(users).values({
            email: `expert-${Date.now()}@test.com`,
            fullName: 'Test Expert',
            role: 'user',
            auraPoints: 100
        }).returning();
        expertId = expert.id;

        // 3. Create Request
        const [req] = await db.insert(requests).values({
            userId: ownerId,
            title: 'Test Request',
            description: 'Testing feedback loop'
        }).returning();
        requestId = req.id;

        // 4. Create Initial Slice
        await db.insert(slices).values({
            requestId: requestId,
            creatorId: ownerId,
            title: 'Initial Slice',
            description: 'Something'
        });
    });

    it('should create a change proposal when expert comments', async () => {
        // Act: Post Comment
        const body = {
            content: "You should add a new slice for testing.",
            userId: expertId,
            type: "text"
        };
        const req = createMockRequest(body);
        const params = Promise.resolve({ id: requestId });

        await commentPost(req, { params });

        // Assert: Check Proposal Created
        const props = await db.select().from(changeProposals).where(eq(changeProposals.requestId, requestId));
        expect(props.length).toBe(1);
        expect(props[0].status).toBe('pending');
        expect(props[0].aiImpact).toEqual({
            qualityScore: 8,
            impactType: 'savings',
            estimatedSavings: 5000
        });

        // Assert: Check Slices NOT yet created (Action deferred)
        const allSlices = await db.select().from(slices).where(eq(slices.requestId, requestId));
        // Should only be the initial one
        expect(allSlices.length).toBe(1);
    });

    it('should apply changes and award aura when owner accepts proposal', async () => {
        // Setup: Create a pending proposal manually (or via comment)
        const [comment] = await db.insert(comments).values({
            requestId, userId: expertId, content: 'Test Comment'
        }).returning();

        const [proposal] = await db.insert(changeProposals).values({
            requestId,
            commentId: comment.id,
            status: 'pending',
            proposedActions: [
                {
                    type: 'CREATE_CARD',
                    data: {
                        title: 'Accepted Slice',
                        description: 'This should exist now',
                        skills: []
                    }
                }
            ],
            aiImpact: { qualityScore: 10, impactType: 'quality', estimatedSavings: 0 }
        }).returning();

        // Act: Respond Accept
        const body = { status: 'accepted', userId: ownerId };
        const req = createMockRequest(body);
        const params = Promise.resolve({ id: proposal.id });

        await proposalRespond(req, { params });

        // Assert: Proposal Updated
        const [updatedProp] = await db.select().from(changeProposals).where(eq(changeProposals.id, proposal.id));
        expect(updatedProp.status).toBe('accepted');
        expect(updatedProp.reviewedAt).toBeDefined();

        // Assert: Slice Created
        const allSlices = await db.select().from(slices).where(eq(slices.requestId, requestId));
        const newSlice = allSlices.find(s => s.title === 'Accepted Slice');
        expect(newSlice).toBeDefined();

        // Assert: Aura Awarded (Base 100 + (10 * 10) = 200)
        // Original expert had 100.
        // Formula in code: quality 10 -> 10*10 = 100 points. total should be 200.
        const [updatedExpert] = await db.select().from(users).where(eq(users.id, expertId));
        expect(updatedExpert.auraPoints).toBe(200);
    });
});
