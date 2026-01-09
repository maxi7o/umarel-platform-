"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScanFace, CheckCircle, ShieldAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function BiometricVerification({
    userId,
    isVerified,
    onComplete
}: {
    userId: string;
    isVerified: boolean;
    onComplete?: () => void;
}) {
    const [status, setStatus] = useState<'idle' | 'scanning' | 'verifying' | 'success' | 'error'>('idle');
    const router = useRouter();

    const startVerification = async () => {
        setStatus('scanning');

        // Mock Scanning Delay
        setTimeout(() => {
            setStatus('verifying');

            // Mock Verification Delay & API Call
            setTimeout(async () => {
                try {
                    // Update DB (Mocked via Client for now, in real app use Server Action)
                    // Since we can't easily update DB from client component without an API,
                    // we'll assume the parent component handles the data re-fetch visual
                    // or we'd call an API here.
                    // For MVP Demo, we just show success state.
                    setStatus('success');
                    if (onComplete) onComplete();
                    router.refresh();
                } catch (e) {
                    setStatus('error');
                }
            }, 2000);
        }, 3000);
    };

    if (isVerified) {
        return (
            <Card className="border-green-200 bg-green-50/50">
                <CardContent className="pt-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-900">Identity Verified</h4>
                        <p className="text-sm text-green-700">Biometric check completed.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ScanFace className="h-5 w-5" />
                    Biometric Verification
                </CardTitle>
                <CardDescription>
                    Verify your identity to unlock higher capacity and trust badges.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {status === 'idle' && (
                    <div className="text-center py-6 space-y-4">
                        <div className="mx-auto h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-slate-200">
                            <ScanFace className="h-10 w-10 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">
                            We use facial recognition to ensure every provider is real.
                        </p>
                        <Button onClick={startVerification} className="w-full">
                            Start Face Scan
                        </Button>
                    </div>
                )}

                {status === 'scanning' && (
                    <div className="text-center py-6 space-y-4">
                        <div className="mx-auto h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center border-4 border-blue-500 border-t-transparent animate-spin">
                        </div>
                        <p className="font-medium animate-pulse">Scanning face...</p>
                        <p className="text-xs text-slate-400">Please look at the camera</p>
                    </div>
                )}

                {status === 'verifying' && (
                    <div className="text-center py-6 space-y-4">
                        <div className="mx-auto h-24 w-24 rounded-full bg-yellow-50 flex items-center justify-center">
                            <ShieldAlert className="h-10 w-10 text-yellow-500 animate-bounce" />
                        </div>
                        <p className="font-medium">Verifying against database...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center py-6 space-y-4">
                        <div className="mx-auto h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <h3 className="font-bold text-lg text-green-700">Verification Successful!</h3>
                        <p className="text-sm text-slate-500">Your profile is now verified.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
