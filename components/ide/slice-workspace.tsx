'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Clock, Loader2, Users, X, Check, Image as ImageIcon } from 'lucide-react';
import { IdeMode } from './universal-slice-ide';
import { createSlice } from '@/lib/actions/slice-actions';
import { useRouter } from 'next/navigation';

interface SliceWorkspaceProps {
    mode: IdeMode;
    contextId?: string; // e.g. RequestId or ExperienceId
    existingSlices?: any[]; // Passed from server
}

export function SliceWorkspace({ mode, contextId, existingSlices = [] }: SliceWorkspaceProps) {
    const [slices, setSlices] = useState(existingSlices);
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const handleCreateSlice = async () => {
        setIsCreating(true);
        try {
            const newSlice = await createSlice({
                requestId: contextId, // Ensure contextId is passed correctly
                title: 'New Draft Slice',
                description: 'Created via IDE',
                status: 'draft',
            });
            setSlices([...slices, newSlice]);
            router.refresh();
        } catch (error) {
            console.error('Failed to create slice', error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {getTitle(mode)}
                </h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Clock className="w-4 h-4 mr-2" /> History
                    </Button>
                    {mode === 'REQUEST_CREATION' && (
                        <Button size="sm" onClick={handleCreateSlice} disabled={isCreating}>
                            {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Add Slice
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6">
                {slices.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        No slices yet. Describe your problem to the AI or click "Add Slice".
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {slices.map((slice) => (
                            <SliceCard
                                key={slice.id}
                                title={slice.title}
                                status={slice.status}
                                type={slice.sliceType}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function getTitle(mode: IdeMode): string {
    switch (mode) {
        case 'REQUEST_CREATION': return "Draft Slices";
        case 'QUOTE_PROPOSAL': return "Pricing Proposal";
        case 'EXPERIENCE_DESIGN': return "Experience Timeline";
        case 'CRITIQUE_REVIEW': return "Quality Verification";
        default: return "Workspace";
    }
}

function renderContent(mode: IdeMode) {
    switch (mode) {
        case 'REQUEST_CREATION':
            return (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <SliceCard title="Diagnose Leak" status="draft" type="Standard" />
                    <SliceCard title="Replace Pipe" status="draft" type="Standard" />
                    <SliceCard title="Paint Wall" status="draft" type="Optional" />
                </div>
            );
        case 'QUOTE_PROPOSAL':
            return (
                <div className="space-y-4">
                    <QuoteRow title="Diagnose Leak" estimated="1h" price={5000} />
                    <QuoteRow title="Replace Pipe" estimated="2h" price={12000} />
                    <QuoteRow title="Paint Wall" estimated="4h" price={8000} />
                    <div className="flex justify-end pt-4 border-t">
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-2xl font-bold text-primary">$25,000</p>
                        </div>
                    </div>
                </div>
            );
        case 'EXPERIENCE_DESIGN':
            return (
                <div className="space-y-8 relative pl-8 border-l border-border/50">
                    <TimelineItem time="19:00" title="Check-in & Welcome" capacity={50} type="Base" />
                    <TimelineItem time="20:00" title="Main Show" capacity={50} type="Base" />
                    <TimelineItem time="22:00" title="VIP Backstage Access" capacity={10} type="Optional Upgrade" />
                </div>
            );
        case 'CRITIQUE_REVIEW':
            return (
                <div className="grid gap-6 md:grid-cols-2">
                    <EvidenceCard
                        title="Wall Painting Finish"
                        imgUrl="/placeholder-wall.jpg"
                        status="pending"
                    />
                    <EvidenceCard
                        title="Pipe Connection"
                        imgUrl="/placeholder-pipe.jpg"
                        status="approved"
                    />
                </div>
            );
        default:
            return <div>Select a mode to begin.</div>;
    }
}

// Sub-components for mock UI
function SliceCard({ title, status, type }: { title: string, status: string, type: string }) {
    return (
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer relative group">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">{type}</span>
                <span className="text-xs font-semibold text-orange-500 capitalize">{status}</span>
            </div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">AI-suggested based on description.</p>
        </Card>
    );
}

function QuoteRow({ title, estimated, price }: { title: string, estimated: string, price: number }) {
    return (
        <Card className="p-4 flex items-center justify-between">
            <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-xs text-muted-foreground">Est: {estimated}</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <input
                        type="number"
                        defaultValue={price}
                        className="pl-6 w-24 h-9 rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>
            </div>
        </Card>
    );
}

function TimelineItem({ time, title, capacity, type }: { time: string, title: string, capacity: number, type: string }) {
    return (
        <div className="relative mb-8 last:mb-0">
            <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="font-mono text-sm text-muted-foreground w-16">{time}</span>
                <Card className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold">{title}</h4>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{type}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full">
                            <Users className="w-3 h-3" />
                            <span>{capacity}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function EvidenceCard({ title, imgUrl, status }: { title: string, imgUrl: string, status: 'pending' | 'approved' | 'rejected' }) {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-video bg-muted relative flex items-center justify-center group">
                <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="destructive"><X className="w-4 h-4 mr-2" /> Reject</Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4 mr-2" /> Approve</Button>
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium">{title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize
                        ${status === 'approved' ? 'bg-green-100 text-green-700' :
                            status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {status}
                    </span>
                </div>
            </div>
        </Card>
    );
}
