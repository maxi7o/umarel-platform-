
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { getPaymentStrategy } from '@/lib/payments/factory';
import { MercadoPagoAdapter } from '@/lib/payments/mercadopago-adapter';
import { MockPaymentAdapter } from '@/lib/payments/mock-adapter';
import { StripePaymentAdapter } from '@/lib/payments/stripe-adapter';

// Mock adapters
vi.mock('@/lib/payments/mercadopago-adapter', () => ({
    MercadoPagoAdapter: vi.fn(),
}));
vi.mock('@/lib/payments/mock-adapter', () => ({
    MockPaymentAdapter: vi.fn(),
}));
vi.mock('@/lib/payments/stripe-adapter', () => ({
    StripePaymentAdapter: vi.fn(),
}));

describe('Payment Factory', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.clearAllMocks();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should return MercadoPagoAdapter for Argentina (AR)', () => {
        getPaymentStrategy({ countryCode: 'AR' });
        expect(MercadoPagoAdapter).toHaveBeenCalled();
    });

    it('should return MercadoPagoAdapter for Brazil (BR)', () => {
        getPaymentStrategy({ countryCode: 'BR' });
        expect(MercadoPagoAdapter).toHaveBeenCalled();
    });

    it('should return MockAdapter by default if no country code and ENV not set', () => {
        process.env.USE_REAL_PAYMENTS = 'false';
        getPaymentStrategy();
        expect(MockPaymentAdapter).toHaveBeenCalled();
    });

    it('should return StripePaymentAdapter if USE_REAL_PAYMENTS is true and no LATAM country', () => {
        process.env.USE_REAL_PAYMENTS = 'true';
        getPaymentStrategy({ countryCode: 'US' });
        expect(StripePaymentAdapter).toHaveBeenCalled();
    });
});
