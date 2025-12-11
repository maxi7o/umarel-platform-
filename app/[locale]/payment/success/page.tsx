import { db } from '@/lib/db';
import { escrowPayments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatARS } from '@/lib/payments/calculations';

export default async function PaymentSuccessPage({
    searchParams,
}: {
    searchParams: { escrowId?: string };
}) {
    const escrowId = searchParams.escrowId;

    if (!escrowId) {
        return (
            <div className="container mx-auto max-w-2xl px-6 py-20 text-center">
                <p className="text-muted-foreground">Invalid payment reference</p>
            </div>
        );
    }

    const escrow = await db.query.escrowPayments.findFirst({
        where: eq(escrowPayments.id, escrowId),
    });

    if (!escrow) {
        return (
            <div className="container mx-auto max-w-2xl px-6 py-20 text-center">
                <p className="text-muted-foreground">Payment not found</p>
            </div>
        );
    }

    // Update status if still pending
    if (escrow.status === 'pending_escrow') {
        await db
            .update(escrowPayments)
            .set({ status: 'in_escrow' })
            .where(eq(escrowPayments.id, escrowId));
    }

    return (
        <div className="container mx-auto max-w-2xl px-6 py-20">
            <Card className="border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
                <CardContent className="pt-12 pb-12 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-green-600 rounded-full">
                            <CheckCircle2 className="h-12 w-12 text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>

                    <p className="text-lg text-muted-foreground mb-8">
                        Your payment of <strong>{formatARS(escrow.totalAmount)}</strong> has been received
                        and is being held securely in escrow.
                    </p>

                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8 text-left">
                        <h3 className="font-semibold mb-4">What happens next?</h3>
                        <ol className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex gap-3">
                                <span className="font-bold text-primary">1.</span>
                                <span>The provider will complete the work</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-primary">2.</span>
                                <span>You'll be notified to review and approve</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-primary">3.</span>
                                <span>Once approved, payment is released to the provider</span>
                            </li>
                        </ol>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Link href="/dashboard">
                            <Button size="lg">Go to Dashboard</Button>
                        </Link>
                        <Link href={`/requests/${escrow.sliceId}`}>
                            <Button size="lg" variant="outline">
                                View Request
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
