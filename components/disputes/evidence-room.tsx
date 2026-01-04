'use client'

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, AlertTriangle, CheckCircle, XCircle, Gavel, Cpu, Scale } from 'lucide-react';
import Image from 'next/image';

interface EvidenceRoomProps {
    disputeId: string;
    existingEvidence: any[];
    userRole: 'provider' | 'client' | 'admin';
    status: string;
    aiVerdict?: any; // CouncilVerdict
}

export function EvidenceRoom({ disputeId, existingEvidence, userRole, status, aiVerdict }: EvidenceRoomProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);
        await new Promise(r => setTimeout(r, 1500));
        setUploading(false);
        window.location.reload();
    };

    const isResolved = status.startsWith('resolved');

    // Helper to render a single model's opinion
    const renderVerdictCard = (v: any) => (
        <div key={v.model} className="bg-white/5 rounded p-3 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Cpu size={12} /> {v.model}
                </span>
                <Badge className={
                    v.decision === 'resolved_release' ? 'bg-emerald-500/20 text-emerald-300 border-none' :
                        v.decision === 'resolved_refund' ? 'bg-red-500/20 text-red-300 border-none' :
                            'bg-yellow-500/20 text-yellow-300 border-none'
                }>
                    {v.decision === 'resolved_release' && 'RELEASE'}
                    {v.decision === 'resolved_refund' && 'REFUND'}
                    {v.decision === 'appealed' && 'APPEAL/ERR'}
                </Badge>
            </div>
            <p className="text-xs text-slate-300 leading-snug line-clamp-4">
                {v.reasoning}
            </p>
            <div className="text-[10px] text-slate-500 text-right">
                Conf: {v.confidence}%
            </div>
        </div>
    );

    const verdicts = aiVerdict?.verdicts || (aiVerdict ? [aiVerdict] : []);
    const consensus = aiVerdict?.consensus || aiVerdict?.decision;

    return (
        <div className="space-y-6">
            {/* EVIDENCE GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingEvidence.map((ev: any) => (
                    <div key={ev.id} className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                        <Image src={ev.mediaUrl} alt="Evidence" fill className="object-cover" />
                        <Badge variant="secondary" className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white backdrop-blur-sm border-0">
                            by {ev.uploaderRole === 'provider' ? 'Provider' : 'Client'}
                        </Badge>
                    </div>
                ))}

                {!isResolved && (
                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-orange-400 transition-colors">
                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-xs text-slate-500 font-medium">
                            {uploading ? 'Uploading...' : 'Add Evidence'}
                        </span>
                    </label>
                )}
            </div>

            {/* AI COUNCIL PANEL */}
            {aiVerdict && (
                <Card className="bg-slate-900 text-slate-200 border-none relative overflow-hidden ring-1 ring-white/10">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Scale size={120} />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-400 font-serif">
                            <Gavel className="w-5 h-5" />
                            AI Council Verdict
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={
                                consensus === 'resolved_release' ? 'text-emerald-400 border-emerald-400' :
                                    consensus === 'resolved_refund' ? 'text-red-400 border-red-400' :
                                        'text-yellow-400 border-yellow-400'
                            }>
                                CONSENSUS: {consensus === 'split_decision' ? 'SPLIT DECISION' :
                                    consensus?.replace('resolved_', '').toUpperCase()}
                            </Badge>
                            <span className="text-xs text-slate-500 ml-auto">
                                Analyzing models: {verdicts.length}
                            </span>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 relative z-10">
                        {/* Summary */}
                        <p className="text-sm text-slate-400 italic font-mono bg-black/20 p-2 rounded">
                            "{aiVerdict.summary || 'Consensus reached.'}"
                        </p>

                        {/* Model Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {verdicts.map(renderVerdictCard)}
                        </div>
                    </CardContent>

                    {!isResolved && userRole === 'admin' && (
                        <CardFooter className="border-t border-white/10 pt-4 flex gap-2">
                            <Button variant="outline" className="text-emerald-400 border-emerald-900 hover:bg-emerald-900/20 flex-1">
                                Accept Release
                            </Button>
                            <Button variant="outline" className="text-red-400 border-red-900 hover:bg-red-900/20 flex-1">
                                Accept Refund
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            )}

            {!aiVerdict && !isResolved && existingEvidence.length > 0 && (
                <div className="bg-blue-50 text-blue-800 p-4 rounded-md text-sm flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent"></div>
                    <div>
                        <span className="font-bold">Council is deliberating...</span>
                        <p className="text-xs">Running parallel inference on GPT-4o and Gemini 1.5 Pro</p>
                    </div>
                </div>
            )}
        </div>
    );
}
