
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleWizardMessage } from '@/lib/services/wizard-service';

// Hoist mocks
const { mockDb, mockTx, mockInsert, mockFindMany, mockFindFirst, mockUpdate, mockAwardAura } = vi.hoisted(() => {
    const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{ id: 'new-id-123' }]),
        onConflictDoNothing: vi.fn().mockResolvedValue({})
    };

    const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{ id: 'updated-id-123' }])
    };

    const mockFindMany = vi.fn().mockResolvedValue([]);
    const mockFindFirst = vi.fn().mockResolvedValue(null);

    const mockDb = {
        insert: vi.fn().mockReturnValue(mockInsert),
        update: vi.fn().mockReturnValue(mockUpdate),
        query: {
            slices: {
                findFirst: mockFindFirst
            },
            sliceCards: {
                findFirst: mockFindFirst,
                findMany: mockFindMany
            },
            wizardMessages: {
                findMany: mockFindMany
            }
        }
    };

    // Aura actions mock
    const mockAwardAura = vi.fn();

    return { mockDb, mockTx: {}, mockInsert, mockFindMany, mockFindFirst, mockUpdate, mockAwardAura };
});

vi.mock('@/lib/db', () => ({
    db: mockDb,
}));

vi.mock('@/lib/aura/actions', () => ({
    awardAura: mockAwardAura
}));

vi.mock('@/lib/db/schema', () => ({
    slices: { id: 'slices', requestId: 'req_id', title: 'title' },
    sliceCards: { id: 'sliceCards', sliceId: 'slice_id', requestId: 'req_id' },
    wizardMessages: { id: 'wizardMessages', sliceCardId: 'card_id', createdAt: 'date' },
    users: { id: 'users' }
}));

// Mock AI
vi.mock('@/lib/ai/openai', () => ({
    processWizardMessage: vi.fn().mockResolvedValue({
        message: "I have split the project.",
        actions: [
            {
                type: 'CREATE_CARD',
                data: {
                    title: 'Demolition',
                    description: 'Remove tiles',
                    skills: ['demolition']
                }
            }
        ],
        qualityScore: 8, // High enough for Aura
        refusalReason: null
    })
}));

describe('Wizard Service (Full Logic)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockInsert.values.mockReturnThis();
    });

    it('should full flow: find slice, call AI, create new card, award aura', async () => {
        // Setup Mocks for Finding Data
        // 1. Find Slice (Initial Call)
        mockDb.query.slices.findFirst.mockResolvedValueOnce({
            id: 'slice-1',
            requestId: 'req-1',
            title: 'My Project',
            description: 'Fix it',
            finalPrice: 100
        });

        // 2. Find Primary Card (Exists)
        mockDb.query.sliceCards.findFirst.mockResolvedValueOnce({
            id: 'card-1',
            sliceId: 'slice-1',
            requestId: 'req-1',
            version: 1
        });

        // 3. Find All Cards
        mockDb.query.sliceCards.findMany.mockResolvedValueOnce([
            { id: 'card-1', title: 'My Project' }
        ]);

        // 4. Find Messages
        mockDb.query.wizardMessages.findMany.mockResolvedValueOnce([]);

        // execute
        const result = await handleWizardMessage('slice-1', 'user-1', 'I need demolition');

        // Verify:
        // 1. User Message Saved
        expect(mockDb.insert).toHaveBeenCalledTimes(5); // UserMsg, Slices, SliceCards, AI User, AI Msg (wait, 4 or 5?)
        // Let's check specific insertions

        // 2. Aura Awarded (Quality Score 8)
        expect(mockAwardAura).toHaveBeenCalledWith('user-1', 'VALID_SLICE_CREATION');

        // 3. New Slice Created (Action Executed)
        expect(mockInsert.values).toHaveBeenCalledWith(expect.objectContaining({
            requestId: 'req-1',
            title: 'Demolition',
            status: 'proposed'
        }));

        // 4. Return correct structure
        expect(result.aiMessage).toBeDefined();
        expect(result.sliceCards).toHaveLength(2); // Original + New
    });
});
