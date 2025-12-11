import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key', {
    apiVersion: '2025-11-17.clover' as any, // Cast to any to avoid version mismatch issues if types are newer/older
    typescript: true,
});
