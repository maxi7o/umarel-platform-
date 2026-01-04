import { AdminDisputeControls } from '@/components/admin/dispute-controls';
import { db } from '@/lib/db';
import { disputes, disputeJurors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default async function AdminDisputePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch Dispute with Relations
    const dispute = await db.query.disputes.findFirst({
        where: eq(disputes.id, id),
        with: {
            slice: true,
            evidence: true,
            initiator: true
        }
    });

    if (!dispute) return notFound();

    // Fetch Jurors
    const jurors = await db.query.disputeJurors.findMany({
        where: eq(disputeJurors.disputeId, id),
        with: { user: true }
    });

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Dispute Analysis</h1>
                    <div className="flex gap-2 items-center mt-2">
                        <Badge variant="outline">{id}</Badge>
                        <Badge className={(dispute.status || 'open').includes('resolved') ? 'bg-green-600' : 'bg-orange-500'}>
                            {dispute.status || 'open'}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT: Context */}
                <div className="lg:col-span-2 space-y-6">
                    {/* ... (Unchanged Content) ... */}
                </div>

                {/* ... (Unchanged Content) ... */}

                {/* RIGHT: Judgment */}
                <div className="space-y-6">
                    {/* 1. AI Verdict */}
                    <Card className="border-purple-200 dark:border-purple-900 border-l-4">
                        <CardHeader>
                            <CardTitle className="text-purple-700">AI Council Verdict</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {dispute.aiVerdict ? (
                                <>
                                    <div className="flex justify-between font-bold">
                                        <span>Decision:</span>
                                        <span className="uppercase">{(dispute.aiVerdict as any).decision}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Confidence:</span>
                                        <span>{(dispute.aiVerdict as any).confidence}%</span>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded text-xs mt-2">
                                        {(dispute.aiVerdict as any).reasoning}
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">AI analysis pending...</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* 2. Jury Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Jury Protocol</CardTitle>
                            <CardDescription>Status: {dispute.juryStatus || 'Inactive'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[200px]">
                                <div className="space-y-2">
                                    {jurors.map(juror => (
                                        <div key={juror.id} className="flex justify-between items-center text-sm border p-2 rounded">
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{juror.user.fullName}</span>
                                                <span className="text-xs text-muted-foreground uppercase">{juror.user.auraLevel || 'Bronze'}</span>
                                            </div>
                                            <div className="text-right">
                                                {juror.status === 'voted' ? (
                                                    <Badge className={juror.vote === 'resolved_release' ? 'bg-blue-500' : 'bg-red-500'}>
                                                        {juror.vote === 'resolved_release' ? 'RELEASE' : 'REFUND'}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline">Pending</Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {jurors.length === 0 && <p className="text-sm text-muted-foreground">No jury summoned.</p>}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* 3. CONTROLS */}
                    <AdminDisputeControls disputeId={id} status={dispute.status || 'open'} />
                </div>
            </div>
        </div>
    );
}
