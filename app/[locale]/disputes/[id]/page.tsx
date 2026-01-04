import { db } from '@/lib/db';
import { disputes, contracts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { EvidenceRoom } from '@/components/disputes/evidence-room';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DisputePage({ params }: { params: { id: string } }) {
    const { id } = params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Dispute & Evidence
    const dispute = await db.query.disputes.findFirst({
        where: eq(disputes.id, id),
        with: {
            evidence: true,
            slice: true,
            initiator: true
        }
    });

    if (!dispute) notFound();

    // Fetch Contract Snapshot for Context (if exists)
    const contract = await db.query.contracts.findFirst({
        where: eq(contracts.sliceId, dispute.sliceId)
    });

    // Determine Role
    // In real logic, check if user is providerId or clientId from contract/slice
    // For now, default to 'admin' if unknown or actual logic
    let role: 'client' | 'provider' | 'admin' = 'client';
    if (contract) {
        if (user?.id === contract.providerId) role = 'provider';
        if (user?.id === contract.clientId) role = 'client';
    }
    // Also check for real admin role

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container max-w-5xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 font-outfit">CASE #{dispute.id.slice(0, 8)}</h1>
                    <p className="text-slate-500">
                        {contract ? (contract.snapshotJson as any).sliceTitle : 'Unknown Task'}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Evidence Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                Live Evidence Room
                            </h2>
                            <EvidenceRoom
                                disputeId={dispute.id}
                                existingEvidence={dispute.evidence}
                                status={dispute.status || 'open'}
                                aiVerdict={dispute.aiVerdict}
                                userRole={role}
                            />
                        </div>
                    </div>

                    {/* Sidebar / Context */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 text-slate-300 p-6 rounded-xl">
                            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Dispute Context</h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <span className="block text-slate-500 text-xs uppercase">Reason</span>
                                    <p className="text-white">{dispute.reason}</p>
                                </div>

                                {contract && (
                                    <>
                                        <div>
                                            <span className="block text-slate-500 text-xs uppercase">Agreed Value</span>
                                            <p className="text-white font-mono">
                                                {(contract.snapshotJson as any).currency || 'USD'} {(contract.snapshotJson as any).agreedPrice}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="block text-slate-500 text-xs uppercase">Criteria</span>
                                            <p className="text-slate-400 italic">"{(contract.snapshotJson as any).acceptanceCriteria || 'Standard'}"</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
