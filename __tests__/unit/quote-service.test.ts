
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitQuote } from '@/lib/services/quote-service';

// Hoist mocks
const { mockDb, mockTx, mockInsert } = vi.hoisted(() => {
    const mockInsert = {
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockReturnValue([{ id: 'quote-1' }])
    };

    // For quoteItems, returning might return array
    mockInsert.returning.mockImplementation((opts) => {
        // rudimentary check if it's quotes or quoteItems based on prior usage, but mock logic is shared
        return Promise.resolve([{ id: 'uuid' }]);
    });

    const mockTx = {
        insert: vi.fn().mockReturnValue(mockInsert),
        rollback: vi.fn(),
    };

    const mockDb = {
        transaction: vi.fn(async (callback) => {
            return callback(mockTx);
        }),
        insert: vi.fn().mockReturnValue(mockInsert),
    };

    return { mockDb, mockTx, mockInsert };
});

vi.mock('@/lib/db', () => ({
    db: mockDb,
}));

vi.mock('@/lib/db/schema', () => ({
    quotes: {
        providerId: 'provider_id',
        requestId: 'request_id',
        amount: 'amount',
    },
    quoteItems: {
        quoteId: 'quote_id',
        sliceId: 'slice_id',
    }
}));

describe('Quote Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Reset default mock behavior
        mockInsert.values.mockReturnThis();
        mockInsert.returning.mockResolvedValue([{ id: 'quote-1' }]);
    });

    describe('submitQuote', () => {
        it('should create a quote and link it to slices inside a transaction', async () => {
            const quoteData = {
                providerId: 'provider-1',
                requestId: 'req-1',
                amount: 50000, // cents
                message: 'I can do this',
                sliceIds: ['slice-1', 'slice-2']
            };

            await submitQuote(quoteData);

            // Expect transaction to be called
            expect(mockDb.transaction).toHaveBeenCalled();

            // Expect insert into quotes
            expect(mockTx.insert).toHaveBeenCalledWith(expect.objectContaining({ providerId: 'provider_id' }));

            // Expect insert into quoteItems (called once if batch insert or twice if loop)
            // Assuming batch insert for array of items
            expect(mockTx.insert).toHaveBeenCalledWith(expect.objectContaining({ quoteId: 'quote_id' }));

            // Verify values passed
            // We can inspect the calls to .values()
            // First call for quote
            const firstInsertValues = mockInsert.values.mock.calls[0][0];
            expect(firstInsertValues).toEqual(expect.objectContaining({
                providerId: 'provider-1',
                amount: 50000
            }));

            // Second call for quote items
            const secondInsertValues = mockInsert.values.mock.calls[1][0];
            expect(secondInsertValues).toHaveLength(2); // 2 slices
            expect(secondInsertValues[0]).toEqual(expect.objectContaining({
                sliceId: 'slice-1'
            }));
        });
    });
});
