
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MercadoPagoConnectProps {
    isConnected: boolean;
}

export function MercadoPagoConnect({ isConnected }: MercadoPagoConnectProps) {
    const router = useRouter();

    const handleConnect = () => {
        router.push('/api/auth/mercadopago/connect');
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    MercadoPago
                </CardTitle>
                <CardDescription>
                    Conectá tu cuenta para recibir pagos directamente.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isConnected ? (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-md border border-green-100">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Cuenta Conectada</span>
                    </div>
                ) : (
                    <Button
                        onClick={handleConnect}
                        className="w-full bg-[#009EE3] hover:bg-[#008ED0] text-white"
                    >
                        Conectar MercadoPago
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
