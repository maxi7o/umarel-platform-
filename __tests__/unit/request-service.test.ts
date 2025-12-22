
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRequest } from '@/lib/services/request-service';

// Hoist mocks
const { mockDb, mockTx, mockInsert } = vi.hoisted(() => {
    const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{
            id: 'req-123',
            status: 'open',
            title: 'Bathroom Renovation'
        }])
    };

    const mockDb = {
        insert: vi.fn().mockReturnValue(mockInsert),
    };

    return { mockDb, mockTx: {}, mockInsert };
});

vi.mock('@/lib/db', () => ({
    db: mockDb,
}));

vi.mock('@/lib/db/schema', () => ({
    requests: {
        userId: 'user_id',
        title: 'title',
        description: 'description',
        status: 'status',
    },
}));

describe('Request Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockInsert.values.mockReturnThis();
        mockInsert.returning.mockResolvedValue([{
            id: 'req-123',
            status: 'open',
            title: 'Bathroom Renovation'
        }]);
    });

    describe('createRequest', () => {
        it('should create a new request with open status', async () => {
            const requestData = {
                userId: 'user-1',
                title: 'Bathroom Renovation',
                description: 'I want to renovate my bathroom',
                category: 'renovation'
            };

            const result = await createRequest(requestData);

            expect(mockDb.insert).toHaveBeenCalled();
            expect(mockInsert.values).toHaveBeenCalledWith(expect.objectContaining({
                userId: 'user-1',
                title: 'Bathroom Renovation',
                status: 'open'
            }));

            expect(result).toEqual(expect.objectContaining({
                id: 'req-123',
                status: 'open'
            }));
        });
    });
});
