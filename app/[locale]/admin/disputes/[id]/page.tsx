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
                        <Badge className={dispute.status.includes('resolved') ? 'bg-green-600' : 'bg-orange-500'}>
                            {dispute.status}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT: Context */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 1. Request Context */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contract Context</CardTitle>
                            <CardDescription>What was agreed upon</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm">Slice Title</h4>
                                <p>{dispute.slice.title}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Description</h4>
                                <p className="text-muted-foreground text-sm bg-muted p-2 rounded">{dispute.slice.description}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Quality Standard</h4>
                                <Badge variant="secondary">{dispute.slice.qualityLevel || 'Standard'}</Badge>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold text-sm mb-2 text-red-600">Dispute Reason</h4>
                                <p className="italic">"{dispute.reason}"</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Initiated by: {dispute.initiator.fullName} ({dispute.initiator.email})
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Evidence */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Evidence Locker</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {dispute.evidence.map((ev: any) => (
                                    <div key={ev.id} className="relative group aspect-square rounded overflow-hidden border">
                                        {/* Simple visualization */}
                                        <img src={ev.mediaUrl} alt="Evidence" className="object-cover w-full h-full" />
                                        <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs p-1 truncate">
                                            {new Date(ev.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                                {dispute.evidence.length === 0 && (
                                    <p className="text-muted-foreground text-sm col-span-3">No evidence submitted.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

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
                                        <span className="uppercase">{dispute.aiVerdict.decision}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Confidence:</span>
                                        <span>{dispute.aiVerdict.confidence}%</span>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded text-xs mt-2">
                                        {dispute.aiVerdict.reasoning}
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
