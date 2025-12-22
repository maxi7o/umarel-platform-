
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitInsight } from '@/lib/services/insight-service';

// Hoist mocks
const { mockDb, mockTx, mockInsert } = vi.hoisted(() => {
    const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{ id: 'comment-1' }])
    };

    const mockDb = {
        insert: vi.fn().mockReturnValue(mockInsert),
        query: {
            sliceCards: {
                findMany: vi.fn().mockResolvedValue([{ id: 'card-1', title: 'Tile Work' }])
            }
        }
    };

    return { mockDb, mockTx: {}, mockInsert };
});

vi.mock('@/lib/db', () => ({
    db: mockDb,
}));

vi.mock('@/lib/db/schema', () => ({
    comments: { id: 'id' },
    sliceCards: { requestId: 'requestId' },
    changeProposals: { id: 'id' },
    wizardMessages: { id: 'id' }
}));

vi.mock('@/lib/ai/openai', () => ({
    processExpertComment: vi.fn().mockResolvedValue({
        wizardQuestion: null,
        actions: [{ type: 'CREATE_CARD', data: {} }],
        qualityScore: 8,
        impactType: 'savings',
        estimatedSavings: 1000
    })
}));

describe('Insight Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockInsert.values.mockReturnThis();
        mockInsert.returning.mockResolvedValue([{ id: 'comment-1' }]);
    });

    describe('submitInsight', () => {
        it('should process insight and generate proposals if AI validates it', async () => {
            await submitInsight({
                requestId: 'req-1',
                userId: 'user-1',
                content: 'You should add insulation.',
                locale: 'en'
            });

            // 1. Comment Created
            expect(mockDb.insert).toHaveBeenCalled(); // At least once for comment

            // 2. Proposal Created (because AI returned actions)
            // We expect a second insert call for changeProposals
            expect(mockInsert.values).toHaveBeenCalledWith(expect.objectContaining({
                commentId: 'comment-1',
                status: 'pending'
            }));

            // 3. Wizard Notification
            // We might expect a wizard message too
        });
    });
});
