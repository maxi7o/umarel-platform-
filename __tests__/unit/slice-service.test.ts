
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOpenSlicesForProvider } from '@/lib/services/slice-service';

// Hoist the mock variable so it can be used inside vi.mock factory
const { mockDb } = vi.hoisted(() => {
    return {
        mockDb: {
            select: vi.fn(),
        }
    }
});

vi.mock('@/lib/db', () => ({
    db: mockDb,
}));

// Mock schema
vi.mock('@/lib/db/schema', () => ({
    slices: {
        requestId: 'request_id',
        status: 'status',
    },
}));

describe('Slice Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getOpenSlicesForProvider', () => {
        it('should return only accepted slices', async () => {
            const requestId = 'req-123';

            // Mock data response
            const mockSlices = [
                { id: '1', status: 'accepted', title: 'Visible Slice' },
                { id: '2', status: 'proposed', title: 'Hidden Slice' },
                { id: '3', status: 'completed', title: 'Hidden Slice' },
            ];

            // Setup chainable mock for db.select().from().where()
            const fromMock = vi.fn().mockReturnValue({
                where: vi.fn().mockResolvedValue(mockSlices),
            });
            mockDb.select.mockReturnValue({ from: fromMock });

            const result = await getOpenSlicesForProvider(requestId);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('1');
            expect(result[0].status).toBe('accepted');
        });
    });
});
