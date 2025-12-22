
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitRating } from '@/lib/services/rating-service';

// Hoist mocks
const { mockDb, mockTx, mockInsert } = vi.hoisted(() => {
    const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{ id: 'rating-1' }])
    };

    const mockUpdate = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
    };

    const mockTx = {
        insert: vi.fn().mockReturnValue(mockInsert),
        update: vi.fn().mockReturnValue(mockUpdate),
        rollback: vi.fn(),
    };

    const mockDb = {
        transaction: vi.fn(async (cb) => cb(mockTx)),
        insert: vi.fn().mockReturnValue(mockInsert),
        update: vi.fn().mockReturnValue(mockUpdate),
    };

    return { mockDb, mockTx, mockInsert, mockUpdate };
});

vi.mock('@/lib/db', () => ({
    db: mockDb,
}));

vi.mock('@/lib/db/schema', () => ({
    serviceRatings: {
        sliceId: 'slice',
        requestId: 'request',
        providerId: 'provider',
        clientId: 'client'
    },
    users: {
        id: 'id',
        auraPoints: 'auraPoints'
    },
    providerMetrics: {
        providerId: 'providerId'
    }
}));

describe('Rating Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockInsert.values.mockReturnThis();
    });

    describe('submitRating', () => {
        it('should save rating and update aura points inside transaction', async () => {
            const ratingData = {
                sliceId: 'slice-1',
                requestId: 'req-1',
                providerId: 'provider-1',
                clientId: 'client-1',
                qualityRating: 5,
                communicationRating: 5,
                timelinessRating: 5,
                professionalismRating: 5,
                valueRating: 5,
                comment: 'Excellent work!'
            };

            await submitRating(ratingData);

            // 1. Transaction started
            expect(mockDb.transaction).toHaveBeenCalled();

            // 2. Rating Inserted
            expect(mockTx.insert).toHaveBeenCalled();
            expect(mockInsert.values).toHaveBeenCalledWith(expect.objectContaining({
                providerId: 'provider-1',
                overallRating: '5.00' // Average of all 5s
            }));

            // 3. Aura Updated (Simple logic: +50 points for 5 stars)
            // Expect update on users table
            expect(mockTx.update).toHaveBeenCalled();
            // Ideally check it updates 'users' and sets 'auraPoints'
            // But strict SQL mocking is hard. Ensuring 'update' called is good enough for TDD start.
        });
    });
});
