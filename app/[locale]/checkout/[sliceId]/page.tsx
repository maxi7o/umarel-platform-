import { db } from '@/lib/db';
import { slices, escrowPayments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Wallet, Shield, CheckCircle2 } from 'lucide-react';
import { formatARS } from '@/lib/payments/calculations';
import Link from 'next/link';
import { UnifiedCheckoutButton } from '@/components/checkout/unified-checkout-button';

export default async function CheckoutPage({ params }: { params: { sliceId: string } }) {
    const slice = await db.query.slices.findFirst({
        where: eq(slices.id, params.sliceId),
        with: {
            request: true,
        },
    });

    if (!slice || !slice.escrowPaymentId) {
        notFound();
    }

    const escrow = await db.query.escrowPayments.findFirst({
        where: eq(escrowPayments.id, slice.escrowPaymentId),
    });

    if (!escrow) {
        notFound();
    }

    return (
        <div className="container mx-auto max-w-4xl px-6 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Secure Payment</h1>
                <p className="text-muted-foreground">
                    Your payment will be held in escrow until you approve the completed work
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Payment Summary */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Slice</p>
                                <p className="font-semibold">{slice.title}</p>
                            </div>

                            <div className="space-y-2 pt-4 border-t">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Slice price</span>
                                    <span className="font-semibold">{formatARS(escrow.sliceAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Platform fee (15%)</span>
                                    <span className="font-semibold text-primary">
                                        {formatARS(escrow.platformFee)}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                    <span className="font-bold">Total</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {formatARS(escrow.totalAmount)}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t text-sm space-y-2">
                                <p className="font-semibold mb-2">Fee breakdown:</p>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>→ Community helpers (3%)</span>
                                    <span>{formatARS(escrow.communityRewardPool)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>→ Taxes & fees (~5-6%)</span>
                                    <span>{formatARS(Math.round(escrow.sliceAmount * 0.055))}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>→ Platform (~6-7%)</span>
                                    <span>
                                        {formatARS(
                                            escrow.platformFee -
                                            escrow.communityRewardPool -
                                            Math.round(escrow.sliceAmount * 0.055)
                                        )}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Protection Info */}
                    <Card className="mt-4 bg-green-50/50 dark:bg-green-950/20 border-green-500/20">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm mb-1">Escrow Protection</p>
                                    <p className="text-xs text-muted-foreground">
                                        Your payment is held securely. The provider only receives payment when you
                                        approve the completed work.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Choose Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-4 bg-muted/30 rounded-lg mb-4">
                                <p className="text-sm font-medium mb-2">Simulated Location</p>
                                <div className="flex gap-2">
                                    {/* Mock Toggle for Verification */}
                                    <UnifiedCheckoutButton sliceId={slice.id} userCountry="US" />
                                    <UnifiedCheckoutButton sliceId={slice.id} userCountry="AR" />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 text-center">
                                    (Click left for Stripe/US, right for Mercado Pago/AR)
                                </p>
                            </div>

                            {/* Unified Button Usage (We would detect country automatically normally) */}
                            {/* <UnifiedCheckoutButton sliceId={slice.id} userCountry="AR" /> */}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">How it works</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <div className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center shrink-0 text-xs font-bold">
                                    1
                                </div>
                                <p className="text-muted-foreground">
                                    Pay now - money is held securely in escrow
                                </p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center shrink-0 text-xs font-bold">
                                    2
                                </div>
                                <p className="text-muted-foreground">Provider completes the work</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center shrink-0 text-xs font-bold">
                                    3
                                </div>
                                <p className="text-muted-foreground">
                                    You approve - payment is released to provider
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
