
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/payments/create/route';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getPaymentStrategy } from '@/lib/payments/factory';

// Mock dependencies
vi.mock('@/lib/db', () => ({
    db: {
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn()
    }
}));

vi.mock('@/lib/payments/factory', () => ({
    getPaymentStrategy: vi.fn()
}));

vi.mock('next/server', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        NextResponse: {
            json: vi.fn((body, init) => ({ body, init, status: init?.status || 200 }))
        }
    };
});

describe('POST /api/payments/create', () => {
    let mockStrategy: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup mock DB chain helper
        const mockWhere = vi.fn();
        const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
        (db.select as any).mockReturnValue({ from: mockFrom });

        // Setup insert mock
        const mockReturning = vi.fn();
        const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
        (db.insert as any).mockReturnValue({ values: mockValues });

        // Setup update mock
        const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
        (db.update as any).mockReturnValue({ set: mockSet });

        // Setup Strategy Mock
        mockStrategy = {
            createEscrow: vi.fn().mockResolvedValue({
                transactionId: 'pref_123',
                status: 'pending_escrow',
                redirectUrl: 'http://foo'
            })
        };
        (getPaymentStrategy as any).mockReturnValue(mockStrategy);
    });

    it('should create escrow record with correct fees', async () => {
        // Mock Data
        const mockSlice = {
            id: 'slice-1',
            requestId: 'req-1',
            finalPrice: 10000, // $100.00
            assignedProviderId: 'prov-1'
        };
        const mockRequest = { userId: 'client-1' };
        const mockEscrow = { id: 'escrow-uuid-1' };

        // 1. Setup DB responses
        // First select (fetch slice)
        const mockWhereSlice = vi.fn().mockResolvedValue([mockSlice]);
        const mockFromSlice = vi.fn().mockReturnValue({ where: mockWhereSlice });
        (db.select as any).mockReturnValueOnce({ from: mockFromSlice });

        // Second select (fetch request)
        const mockWhereReq = vi.fn().mockResolvedValue([mockRequest]);
        const mockFromReq = vi.fn().mockReturnValue({ where: mockWhereReq });
        (db.select as any).mockReturnValueOnce({ from: mockFromReq });

        // Insert return
        const mockReturningInsert = vi.fn().mockResolvedValue([mockEscrow]);
        const mockValuesInsert = vi.fn().mockReturnValue({ returning: mockReturningInsert });
        (db.insert as any).mockReturnValue({ values: mockValuesInsert });

        // 2. Call API
        const req = new NextRequest('http://localhost', {
            method: 'POST',
            body: JSON.stringify({ sliceId: 'slice-1' })
        });

        const response: any = await POST(req);

        // 3. Verify Response
        expect(response.status).toBe(200);
        expect(response.body.transactionId).toBe('pref_123');
        expect(response.body.escrowId).toBe('escrow-uuid-1');

        // 4. Verify DB Insert (Fees!)
        // Expected: 15% Platform, 3% Community
        // 10000 * 0.15 = 1500
        // 10000 * 0.03 = 300
        expect(mockValuesInsert).toHaveBeenCalledWith(expect.objectContaining({
            sliceId: 'slice-1',
            totalAmount: 10000,
            platformFee: 1500,
            communityRewardPool: 300,
            status: 'pending_escrow'
        }));

        // 5. Verify Strategy Call with Escrow ID
        expect(mockStrategy.createEscrow).toHaveBeenCalledWith(
            'slice-1',
            10000,
            'ARS',
            'client-1',
            'prov-1',
            'escrow-uuid-1' // Crucial Check
        );
    });
});
