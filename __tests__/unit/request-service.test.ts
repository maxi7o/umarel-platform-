
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initializeRequest } from '@/lib/services/request-service';

// Hoist mocks
const { mockDb, mockTx, mockInsert } = vi.hoisted(() => {
    const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn()
            .mockResolvedValueOnce([{ id: 'req-1' }]) // Request
            .mockResolvedValueOnce([{ id: 'slice-1' }]) // Slice
            .mockResolvedValueOnce([{ id: 'card-1' }]) // Card
    };

    const mockTx = {
        insert: vi.fn().mockReturnValue(mockInsert),
    };

    const mockDb = {
        transaction: vi.fn(async (cb) => cb(mockTx)),
        insert: vi.fn().mockReturnValue(mockInsert),
    };

    return { mockDb, mockTx, mockInsert };
});

vi.mock('@/lib/db', () => ({
    db: mockDb,
}));

vi.mock('@/lib/db/schema', () => ({
    requests: { userId: 'uid' },
    slices: { requestId: 'rid' },
    sliceCards: { sliceId: 'sid' }
}));

describe('Request Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockInsert.values.mockReturnThis();
        // Reset mock implementations sequence
        mockInsert.returning
            .mockResolvedValueOnce([{ id: 'req-1' }])
            .mockResolvedValueOnce([{ id: 'slice-1' }])
            .mockResolvedValueOnce([{ id: 'card-1' }]);
    });

    describe('initializeRequest', () => {
        it('should create request, slice, and card in transaction', async () => {
            const result = await initializeRequest({
                userId: 'user-1',
                title: 'New Project',
                description: 'Description',
                location: 'NYC'
            });

            // 1. Transaction started
            expect(mockDb.transaction).toHaveBeenCalled();

            // 2. Three inserts occurred in transaction
            expect(mockTx.insert).toHaveBeenCalledTimes(3);

            // 3. Result contains needed IDs
            expect(result).toEqual({
                request: { id: 'req-1' },
                initialSliceId: 'slice-1'
            });
        });
    });
});
