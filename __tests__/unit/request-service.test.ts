
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initializeRequest } from '@/lib/services/request-service';

// Hoist mocks
const { mockDb, mockSql } = vi.hoisted(() => {
    // Mock the sql helper function (template literal tag)
    const sqlMock: any = vi.fn();

    // Add transaction support
    sqlMock.begin = vi.fn(async (cb) => {
        return cb(sqlMock);
    });

    // Mock individual query responses based on call order or logic
    // For initializeRequest, it calls:
    // 1. INSERT requests
    // 2. INSERT slices
    // 3. INSERT slice_cards

    sqlMock
        .mockResolvedValueOnce([{ id: 'req-1', user_id: 'user-1' }]) // 1. Create Request
        .mockResolvedValueOnce([{ id: 'slice-1' }]) // 2. Create Initial Slice
        .mockResolvedValueOnce([]); // 3. Create Slice Card (no return)

    const mockDb = {}; // Not used anymore for this logic but kept if existing imports break

    return { mockDb, mockSql: sqlMock };
});

vi.mock('@/lib/db', () => ({
    db: mockDb,
    sql: mockSql,
}));

vi.mock('@/lib/db/schema', () => ({
    requests: { userId: 'uid' },
    slices: { requestId: 'rid' },
    sliceCards: { sliceId: 'sid' }
}));

describe('Request Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset responses
        mockSql.begin = vi.fn(async (cb) => cb(mockSql));

        // Re-queue return values
        mockSql
            .mockResolvedValueOnce([{ id: 'req-1', user_id: 'user-1' }])
            .mockResolvedValueOnce([{ id: 'slice-1' }])
            .mockResolvedValueOnce([]);
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
            expect(mockSql.begin).toHaveBeenCalled();

            // 2. Three queries executed (Request, Slice, Card)
            // Note: sql`...` calls the function 3 times inside the transaction
            expect(mockSql).toHaveBeenCalledTimes(3);

            // 3. Result contains needed IDs
            expect(result).toEqual({
                request: { id: 'req-1', userId: 'user-1', user_id: 'user-1' },
                initialSliceId: 'slice-1'
            });
        });
    });
});
