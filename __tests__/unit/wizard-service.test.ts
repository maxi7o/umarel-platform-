
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleWizardMessage } from '@/lib/services/wizard-service';

// Hoist mocks
const { mockDb, mockTx, mockInsert } = vi.hoisted(() => {
    const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{ id: 'slice-1' }])
    };

    const mockDb = {
        insert: vi.fn().mockReturnValue(mockInsert),
        select: vi.fn().mockReturnValue({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockResolvedValue([]),
                limit: vi.fn().mockResolvedValue([])
            })
        }),
    };

    return { mockDb, mockTx: {}, mockInsert };
});

vi.mock('@/lib/db', () => ({
    db: mockDb,
}));

// Mock schema
vi.mock('@/lib/db/schema', () => ({
    slices: {
        requestId: 'request_id',
        title: 'title',
        description: 'description',
        status: 'status',
        skillsRequired: 'skills'
    },
    wizardMessages: {
        sliceCardId: 'slice_card_id'
    }
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
        ]
    })
}));

describe('Wizard Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockInsert.values.mockReturnThis();
    });

    describe('handleWizardMessage', () => {
        it('should create slices when AI returns CREATE_CARD action', async () => {
            const result = await handleWizardMessage('req-123', 'user-1', 'I need demolition');

            // Expect AI to be called (implicitly mocked behavior)

            // Expect DB insert for Slices
            expect(mockDb.insert).toHaveBeenCalled();
            expect(mockInsert.values).toHaveBeenCalledWith(expect.objectContaining({
                requestId: 'req-123',
                title: 'Demolition',
                status: 'proposed'
            }));

            expect(result.message).toBe("I have split the project.");
            expect(result.actions).toHaveLength(1);
        });
    });
});
