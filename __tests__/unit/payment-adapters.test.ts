
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MercadoPagoAdapter } from '@/lib/payments/mercadopago-adapter';
import { payment } from '@/lib/mercadopago';

// Mock the mercadopago library
vi.mock('@/lib/mercadopago', () => ({
    preference: {
        create: vi.fn(),
    },
    payment: {
        create: vi.fn(),
        search: vi.fn(),
        cancel: vi.fn(),
        refund: vi.fn(),
        get: vi.fn(),
    },
}));

describe('MercadoPagoAdapter', () => {
    let adapter: MercadoPagoAdapter;

    beforeEach(() => {
        adapter = new MercadoPagoAdapter();
        vi.clearAllMocks();
    });

    describe('refund', () => {
        it('should call refund with full amount when no amount is specified', async () => {
            (payment as any).refund.mockResolvedValue({ status: 'approved' });

            const result = await adapter.refund('tx-123');

            expect((payment as any).refund).toHaveBeenCalledWith({ payment_id: 'tx-123' });
            expect(result.success).toBe(true);
        });

        it('should call refund with specific amount when provided', async () => {
            (payment as any).refund.mockResolvedValue({ status: 'approved' });

            const result = await adapter.refund('tx-123', 50.50);

            expect((payment as any).refund).toHaveBeenCalledWith({
                payment_id: 'tx-123',
                amount: 50.50
            });
            expect(result.success).toBe(true);
        });

        it('should throw error if refund status is not approved/refunded', async () => {
            (payment as any).refund.mockResolvedValue({ status: 'rejected' });

            await expect(adapter.refund('tx-123')).rejects.toThrow('Refund status: rejected');
        });
    });

    describe('releaseFunds', () => {
        it('should return success if payment is approved', async () => {
            (payment as any).get.mockResolvedValue({
                status: 'approved',
                date_approved: '2023-01-01T10:00:00Z'
            });

            const result = await adapter.releaseFunds('tx-123');

            expect(payment.get).toHaveBeenCalledWith({ id: 'tx-123' });
            expect(result.success).toBe(true);
            expect(result.releasedAt).toEqual(new Date('2023-01-01T10:00:00Z'));
        });

        it('should return success if payment is accredited', async () => {
            (payment as any).get.mockResolvedValue({
                status: 'accredited',
                date_approved: '2023-01-01T10:00:00Z'
            });

            const result = await adapter.releaseFunds('tx-123');

            expect(result.success).toBe(true);
        });

        it('should return failure if payment is pending', async () => {
            (payment as any).get.mockResolvedValue({
                status: 'pending'
            });

            const result = await adapter.releaseFunds('tx-123');

            expect(result.success).toBe(false);
        });
    });
});
