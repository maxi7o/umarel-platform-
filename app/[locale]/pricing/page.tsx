import { Metadata } from 'next';
import { CheckCircle2, Heart, TrendingDown, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Pricing - Umarel',
    description: 'We only charge 15% when the job is done and you approve it. Everything else is 100% free forever.',
};

export default function PricingPage() {
    return (
        <div className="container mx-auto max-w-6xl px-6 py-16">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold font-outfit mb-4">
                    Simple, Honest Pricing
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    We only charge <span className="font-bold text-primary">15%</span> when the job is done and you approve it.
                    <br />
                    Everything else is <span className="font-bold text-green-600">100% free forever</span>.
                </p>
            </div>

            {/* Free Features */}
            <Card className="mb-12 border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                        Always Free
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                                <p className="font-semibold">Post Requests</p>
                                <p className="text-sm text-muted-foreground">Describe your project, no limits</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                                <p className="font-semibold">Get Quotes</p>
                                <p className="text-sm text-muted-foreground">Receive unlimited provider quotes</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                                <p className="font-semibold">Chat & Contact</p>
                                <p className="text-sm text-muted-foreground">Message providers directly</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                                <p className="font-semibold">Community Help</p>
                                <p className="text-sm text-muted-foreground">Get expert advice from Umarels</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 15% Fee Breakdown */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Our 15% Fee (Only on Completed Slices)
                </h2>
                <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                    When you approve a completed slice, we charge 15% on top of the agreed price.
                    Here's exactly where that money goes:
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Community Rewards */}
                    <Card className="border-2 border-orange-500/20">
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                <Heart className="h-8 w-8 text-orange-600" />
                                <span className="text-3xl font-bold text-orange-600">3%</span>
                            </div>
                            <CardTitle>Community Helpers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Rewarded to Umarels who helped optimize your project and save you money.
                                They get paid when you approve the work.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Taxes & Fees */}
                    <Card className="border-2 border-blue-500/20">
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                <Shield className="h-8 w-8 text-blue-600" />
                                <span className="text-3xl font-bold text-blue-600">5-6%</span>
                            </div>
                            <CardTitle>Taxes & Payment Fees</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Covers payment processing fees (Stripe, Mercado Pago), taxes, and regulatory compliance.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Platform Revenue */}
                    <Card className="border-2 border-green-500/20">
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                <TrendingDown className="h-8 w-8 text-green-600" />
                                <span className="text-3xl font-bold text-green-600">6-7%</span>
                            </div>
                            <CardTitle>Platform Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Keeps Umarel running: servers, support, development, and continuous improvements.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Example Calculation */}
            <Card className="mb-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-2xl">Example: How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-muted-foreground">Slice price (agreed with provider)</span>
                            <span className="text-xl font-semibold">$10,000 ARS</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-muted-foreground">Platform fee (15%)</span>
                            <span className="text-xl font-semibold text-primary">+ $1,500 ARS</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="font-bold text-lg">You pay (total)</span>
                            <span className="text-2xl font-bold text-primary">$11,500 ARS</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t space-y-3">
                        <p className="font-semibold mb-2">How the $1,500 fee is distributed:</p>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">→ Provider receives</span>
                            <span className="font-semibold">$10,000 ARS (100% of slice price)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">→ Community helpers</span>
                            <span className="font-semibold text-orange-600">$450 ARS (3%)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">→ Taxes & payment fees</span>
                            <span className="font-semibold text-blue-600">~$600 ARS (5-6%)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">→ Platform keeps</span>
                            <span className="font-semibold text-green-600">~$450 ARS (6-7%)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Protection */}
            <Card className="mb-12">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        Your Money is Protected
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-semibold">Escrow Protection</p>
                            <p className="text-sm text-muted-foreground">
                                Your payment is held securely until you approve the completed work. The provider only gets paid when you're satisfied.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-semibold">Multiple Payment Options</p>
                            <p className="text-sm text-muted-foreground">
                                Pay with Stripe (international cards) or Mercado Pago (Argentina). Choose what works best for you.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-semibold">No Hidden Fees</p>
                            <p className="text-sm text-muted-foreground">
                                The 15% fee is clearly shown before you pay. What you see is what you pay. No surprises.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-muted-foreground mb-6">
                    Post your first request for free and see how Umarel can help you.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/requests/create">
                        <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                            Post a Request
                        </Button>
                    </Link>
                    <Link href="/browse">
                        <Button size="lg" variant="outline">
                            Browse Services
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
