
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Wallet, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface UnifiedCheckoutButtonProps {
    sliceId: string;
    escrowId?: string; // Optional for migration
    userCountry: string; // 'AR', 'US', etc.
}

export function UnifiedCheckoutButton({ sliceId, userCountry }: UnifiedCheckoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/payments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sliceId,
                    userCountry,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Payment initiation failed');

            if (data.redirectUrl) {
                // Mercado Pago (or others)
                window.location.href = data.redirectUrl;
            } else if (data.transactionId) {
                // Mock or Stripe (if handled via redirects)
                toast.success("Payment Initiated", {
                    description: `Transaction ID: ${data.transactionId}`,
                });
                // In a real Stripe Elements flow, we'd mount the Element here using data.clientSecret
            }

        } catch (error) {
            console.error('Payment Error:', error);
            toast.error("Error", {
                description: "Failed to start payment. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Dynamic Label/Icon based on detected country
    const isLATAM = ['AR', 'BR', 'MX'].includes(userCountry);

    return (
        <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full h-auto py-4 justify-start"
            variant="default" // Primary action
        >
            <div className="flex items-center gap-3 w-full">
                {isLATAM ? <Wallet className="h-6 w-6 text-white" /> : <CreditCard className="h-6 w-6 text-white" />}

                <div className="text-left flex-1 text-white">
                    <p className="font-semibold">
                        {isLoading ? 'Processing...' : (isLATAM ? 'Pay with Mercado Pago' : 'Pay Securely')}
                    </p>
                    <p className="text-xs opacity-80">
                        {isLATAM ? 'Tarjetas, Efectivo, Transferencia' : 'Credit Card, Secure Checkout'}
                    </p>
                </div>

                {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : <CheckCircle2 className="h-5 w-5 text-white/50" />}
            </div>
        </Button>
    );
}
