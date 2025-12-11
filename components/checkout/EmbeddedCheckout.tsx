'use client';

import { loadStripe } from '@stripe/stripe-js';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { useCallback } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutForm({ priceId }: { priceId: string }) {
    const fetchClientSecret = useCallback(async () => {
        // Create a Checkout Session
        const res = await fetch('/api/checkout/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                priceId: priceId, // e.g., 'price_123' or pass dynamic amount
                mode: 'payment', // or 'subscription'
            }),
        });
        const data = await res.json();
        return data.clientSecret;
    }, [priceId]);

    const options = { fetchClientSecret };

    return (
        <div id="checkout" className="w-full max-w-4xl mx-auto p-4">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                <EmbeddedCheckout className="min-h-[600px]" />
            </EmbeddedCheckoutProvider>
        </div>
    );
}
