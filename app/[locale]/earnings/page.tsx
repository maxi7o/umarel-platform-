import { db } from '@/lib/db';
import { escrowPayments, slices, providerMetrics } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { formatARS } from '@/lib/payments/calculations';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProviderEarningsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const providerId = user.id;

    // Get all escrow payments for this provider
    const escrowPaymentsList = await db.query.escrowPayments.findMany({
        where: eq(escrowPayments.providerId, providerId),
        orderBy: (payments, { desc }) => [desc(payments.createdAt)],
    });

    // Calculate totals
    const pendingEscrow = escrowPaymentsList
        .filter((p) => p.status === 'in_escrow')
        .reduce((sum, p) => sum + p.sliceAmount, 0);

    const releasedThisMonth = escrowPaymentsList
        .filter((p) => {
            if (p.status !== 'released' || !p.releasedAt) return false;
            const releaseDate = new Date(p.releasedAt);
            const now = new Date();
            return (
                releaseDate.getMonth() === now.getMonth() &&
                releaseDate.getFullYear() === now.getFullYear()
            );
        })
        .reduce((sum, p) => sum + p.sliceAmount, 0);

    const completedSlices = escrowPaymentsList.filter((p) => p.status === 'released').length;

    return (
        <div className="container mx-auto max-w-6xl px-6 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Earnings Dashboard</h1>
                <p className="text-muted-foreground">Track your payments and escrow status</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="border-2 border-orange-500/20">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                            Pending in Escrow
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-orange-600">{formatARS(pendingEscrow)}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Awaiting client approval
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-green-500/20">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            Released This Month
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">
                            {formatARS(releasedThisMonth)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">Payments received</p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-blue-500/20">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                            Completed Slices
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-600">{completedSlices}</p>
                        <p className="text-sm text-muted-foreground mt-1">Total approved work</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Payments */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    {escrowPaymentsList.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="font-semibold">No payments yet</p>
                            <p className="text-sm mt-2">Complete slices to start earning!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {escrowPaymentsList.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="text-lg font-bold">{formatARS(payment.sliceAmount)}</p>
                                            <span
                                                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${payment.status === 'released'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                    : payment.status === 'in_escrow'
                                                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                                    }`}
                                            >
                                                {(payment.status || 'pending').replace(/_/g, ' ').toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>
                                                {payment.paymentMethod === 'stripe' ? '💳 Stripe' : '💰 Mercado Pago'}
                                            </span>
                                            <span>•</span>
                                            <span>{new Date(payment.createdAt || new Date()).toLocaleDateString('es-AR')}</span>
                                        </div>
                                    </div>
                                    {payment.releasedAt && (
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-green-600">✓ Released</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(payment.releasedAt).toLocaleDateString('es-AR')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
