'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2 } from 'lucide-react';

// Separate component for reading search params
function SimulationLogic() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'processing' | 'success'>('processing');

    const provider = searchParams.get('provider');
    const amount = parseInt(searchParams.get('amount') || '0');
    const ref = searchParams.get('ref') || 'unknown';

    useEffect(() => {
        // Simulate processing delay
        const timer = setTimeout(() => {
            setStatus('success');

            // Simulate redirect back to merchant after success
            setTimeout(() => {
                // In real life this would be a callback to the unified webhook
                // For now we just redirect to the success page
                router.push(`/offerings/${ref}?success=true`);
            }, 1000);
        }, 2000);

        return () => clearTimeout(timer);
    }, [router, ref]);

    const providerName = provider === 'mercado_pago' ? 'Mercado Pago' :
        provider === 'dlocal' ? 'dLocal' : provider;

    const colorClass = provider === 'mercado_pago' ? 'text-blue-500' : 'text-orange-500';

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-md w-full border">
            {status === 'processing' ? (
                <>
                    <h1 className="text-2xl font-bold">Simulating Payment</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">via</span>
                        <span className={`text-xl font-bold ${colorClass}`}>{providerName}</span>
                    </div>

                    <div className="py-8">
                        <Loader2 className={`h-16 w-16 animate-spin ${colorClass}`} />
                    </div>

                    <p className="text-muted-foreground text-center">
                        Processing transaction of <b>${(amount / 100).toFixed(2)}</b>...
                        <br />
                        <span className="text-xs">(Dev Mode: No money is being moved)</span>
                    </p>
                </>
            ) : (
                <>
                    <h1 className="text-2xl font-bold text-green-600">Payment Approved!</h1>
                    <CheckCircle2 className="h-20 w-20 text-green-500" />
                    <p className="text-center text-muted-foreground">Redirecting you back to Umarel...</p>
                </>
            )}
        </div>
    );
}

export default function SimulatePaymentPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <SimulationLogic />
            </Suspense>
        </div>
    );
}
