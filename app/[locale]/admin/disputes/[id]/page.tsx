import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { slices, users, requests, serviceOfferings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MessageSquareQuote, ShieldCheck, ShieldAlert, Gavel, FileText } from 'lucide-react';
import Link from 'next/link';
import { DisputeResolutionPanel } from '@/components/admin/dispute-resolution-panel';

export const dynamic = 'force-dynamic';

export default async function AdminDisputeDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Admin Check
    const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));
    if (dbUser?.role !== 'admin' && user.email !== 'carlos@demo.com') {
        redirect('/');
    }

    // Fetch Slice Details
    const [slice] = await db
        .select({
            id: slices.id,
            status: slices.status,
            refundStatus: slices.refundStatus,
            amount: slices.finalPrice,
            createdAt: slices.createdAt,
            // disputeReason/Description do not exist in Slices schema. Using refundReason.
            refundReason: slices.refundReason,
            disputeEvidence: slices.disputeEvidence,
            requestTitle: requests.title,
            offeringTitle: serviceOfferings.title,
            creatorId: slices.creatorId,
            assignedProviderId: slices.assignedProviderId
        })
        .from(slices)
        .leftJoin(requests, eq(slices.requestId, requests.id))
        .leftJoin(serviceOfferings, eq(slices.id, serviceOfferings.id))
        .where(eq(slices.id, id));

    if (!slice) notFound();

    // Fetch Parties
    const [client] = await db.select().from(users).where(eq(users.id, slice.creatorId));
    let provider = null;
    if (slice.assignedProviderId) {
        [provider] = await db.select().from(users).where(eq(users.id, slice.assignedProviderId));
    }

    // Map legacy/schema fields to UI
    const disputeReason = slice.refundReason || 'No reason specified';
    const disputeDescription = 'See evidence or chat logs.'; // Slices schema doesn't have description field for dispute, only refundReason.
    const disputeEvidence = JSON.stringify(slice.disputeEvidence) || 'No evidence attached.';

    return (
        <div className="container mx-auto py-10 space-y-8 max-w-5xl">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link href="/admin/disputes" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tribunal
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            Case #{slice.id.substring(0, 8)}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {slice.requestTitle || slice.offeringTitle}
                        </p>
                    </div>
                    <Badge variant={slice.status === 'disputed' ? 'destructive' : 'outline'} className="text-lg px-4 py-1">
                        {slice.status === 'disputed' ? 'Active Dispute' : slice.status}
                    </Badge>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Evidence & Context */}
                <div className="md:col-span-2 space-y-6">
                    {/* Parties Involved */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium uppercase tracking-wide text-slate-500">Parties Involved</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-xs font-bold text-slate-400 mb-1">CLIENT (PLAINTIFF)</p>
                                <p className="font-semibold text-lg">{client?.fullName || 'Unknown'}</p>
                                <p className="text-sm text-slate-500">{client?.email}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-xs font-bold text-slate-400 mb-1">PROVIDER (DEFENDANT)</p>
                                <p className="font-semibold text-lg">{provider?.fullName || 'Unknown'}</p>
                                <p className="text-sm text-slate-500">{provider?.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Claims & Evidence */}
                    <Card className="border-red-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-700">
                                <FileText className="h-5 w-5" />
                                Official Complaint
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-slate-900">Primary Reason</h3>
                                <div className="bg-red-50 p-3 rounded-md border border-red-100 text-red-900">
                                    "{disputeReason}"
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-slate-900">Detailed Statement</h3>
                                <div className="prose prose-sm text-slate-700">
                                    {disputeDescription}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                    <MessageSquareQuote className="h-4 w-4" />
                                    Evidence Submitted
                                </h3>
                                <div className="bg-slate-50 p-4 rounded-md border border-slate-200 text-sm font-mono text-slate-600 break-all">
                                    {disputeEvidence}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-6">
                    <Card className="border-slate-300 shadow-md">
                        <CardHeader className="bg-slate-900 text-white rounded-t-lg">
                            <CardTitle className="flex items-center gap-2">
                                <Gavel className="h-5 w-5 text-yellow-500" />
                                Final Judgment
                            </CardTitle>
                            <CardDescription className="text-slate-300">
                                This action is irreversible. Funds will be moved immediately.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="mb-6 text-center">
                                <p className="text-sm text-slate-500 mb-1">Total Amount in Escrow</p>
                                <p className="text-4xl font-extrabold text-slate-900">
                                    ${((slice.amount || 0) / 100).toFixed(2)}
                                </p>
                            </div>

                            <DisputeResolutionPanel sliceId={slice.id} />

                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Admin Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-500 italic">
                                Check external communications before ruling. Remember: Umarel.org aims for fair, quick resolutions to keep trust high.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
