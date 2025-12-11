import { Card, CardContent } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentFailurePage({
    searchParams,
}: {
    searchParams: { escrowId?: string };
}) {
    return (
        <div className="container mx-auto max-w-2xl px-6 py-20">
            <Card className="border-2 border-red-500/20 bg-red-50/50 dark:bg-red-950/20">
                <CardContent className="pt-12 pb-12 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-red-600 rounded-full">
                            <XCircle className="h-12 w-12 text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>

                    <p className="text-lg text-muted-foreground mb-8">
                        We couldn't process your payment. Please try again or use a different payment method.
                    </p>

                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 text-left">
                        <h3 className="font-semibold mb-3">Common reasons for payment failure:</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                            <li>Insufficient funds</li>
                            <li>Card declined by bank</li>
                            <li>Incorrect card details</li>
                            <li>Payment limit exceeded</li>
                        </ul>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Link href={`/checkout/${searchParams.escrowId}`}>
                            <Button size="lg">Try Again</Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button size="lg" variant="outline">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
