
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as mpWebhookHandler } from '@/app/api/webhooks/mercadopago/route';
import { POST as stripeWebhookHandler } from '@/app/api/webhooks/stripe/route';
import { escrowService } from '@/lib/services/escrow-service';
import { payment } from '@/lib/mercadopago';
import { stripe } from '@/lib/stripe';
import { NextRequest } from 'next/server';

// Mock Dependencies
vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue({
        get: (key: string) => key === 'stripe-signature' ? 'mock-sig' : null
    })
}));

vi.mock('@/lib/services/escrow-service', () => ({
    escrowService: {
        updateStatusByEscrowId: vi.fn(),
    }
}));

vi.mock('@/lib/mercadopago', () => ({
    payment: {
        get: vi.fn()
    }
}));

vi.mock('@/lib/stripe', () => ({
    stripe: {
        webhooks: {
            constructEvent: vi.fn()
        }
    }
}));


describe('Payment Webhooks', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Mercado Pago: Should update escrow to in_escrow on approved payment', async () => {
        const mockBody = { type: 'payment', data: { id: '12345' } };
        const req = new NextRequest('http://localhost/api/webhooks/mercadopago', {
            method: 'POST',
            body: JSON.stringify(mockBody)
        });

        // Mock MP API response
        (payment.get as any).mockResolvedValue({
            id: '12345',
            status: 'approved',
            external_reference: 'escrow-uuid-123'
        });

        await mpWebhookHandler(req);

        expect(payment.get).toHaveBeenCalledWith({ id: '12345' });
        expect(escrowService.updateStatusByEscrowId).toHaveBeenCalledWith('escrow-uuid-123', 'in_escrow', '12345');
    });

    it('Stripe: Should update escrow to in_escrow on payment_intent.succeeded', async () => {
        const req = new NextRequest('http://localhost/api/webhooks/stripe', {
            method: 'POST',
            body: 'mock-raw-body',
            headers: { 'stripe-signature': 'mock-sig' }
        });

        // Mock Stripe Event Construction
        (stripe.webhooks.constructEvent as any).mockReturnValue({
            type: 'payment_intent.succeeded',
            data: {
                object: {
                    id: 'pi_123',
                    metadata: { escrowId: 'escrow-uuid-789' }
                }
            }
        });

        process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock';

        await stripeWebhookHandler(req);

        expect(escrowService.updateStatusByEscrowId).toHaveBeenCalledWith('escrow-uuid-789', 'in_escrow');
    });

});
