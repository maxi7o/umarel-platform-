'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Clock, Loader2, Users, X, Check, Image as ImageIcon, Briefcase, DollarSign, ArrowRight, LayoutGrid, Calendar } from 'lucide-react';
import { IdeMode } from './universal-slice-ide';
import { createSlice } from '@/lib/actions/slice-actions';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

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
        <div className="space-y-6 h-full flex flex-col">
            {/* WORKSPACE HEADER */}
            <div className="flex items-center justify-between pb-4 border-b border-border/40">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        {getIcon(mode)}
                        {getTitle(mode)}
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Workspace for {mode.toLowerCase().replace('_', ' ')}
                    </p>
                </div>

                <div className="flex gap-2">
                    {mode === 'REQUEST_CREATION' && (
                        <Button size="sm" onClick={handleCreateSlice} disabled={isCreating} className="bg-stone-900 hover:bg-stone-800 text-white shadow-sm">
                            {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Add Slice
                        </Button>
                    )}
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto pr-2">
                {/* MOCK CONTENT based on Mode (Dynamic in real app) */}
                {slices.length === 0 ? (
                    renderMockContent(mode)
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

// --- ICONS & TITLES ---

function getIcon(mode: IdeMode) {
    switch (mode) {
        case 'REQUEST_CREATION': return <Briefcase className="w-5 h-5 text-blue-500" />;
        case 'QUOTE_PROPOSAL': return <DollarSign className="w-5 h-5 text-green-500" />;
        case 'EXPERIENCE_DESIGN': return <Calendar className="w-5 h-5 text-purple-500" />;
        case 'CRITIQUE_REVIEW': return <Check className="w-5 h-5 text-orange-500" />;
        default: return <LayoutGrid className="w-5 h-5" />;
    }
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

// --- MOCK CONTENT RENDERING ---

function renderMockContent(mode: IdeMode) {
    switch (mode) {
        case 'REQUEST_CREATION':
            return (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    <SliceCard title="1. Diagnosis & Check" status="draft" type="Standard" description="Identify the source of the leak and assess damage." />
                    <SliceCard title="2. Pipe Replacement" status="draft" type="Standard" description="Replace 2m of lead pipe with thermofusion." />
                    <SliceCard title="3. Plaster & Paint" status="draft" type="Optional" description="Repair wall surface and paint 4m2 area." />

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-2 border-dashed border-muted rounded-xl flex flex-col items-center justify-center p-6 text-center text-muted-foreground hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                        <Plus className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-sm font-medium">Add another slice</span>
                    </motion.div>
                </div>
            );
        case 'QUOTE_PROPOSAL':
            return (
                <div className="space-y-6 max-w-3xl mx-auto">
                    <div className="flex items-center justify-between bg-stone-50 text-stone-900 px-4 py-2 rounded-lg text-sm border border-stone-200">
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Estimated Duration: <strong>2 Days</strong></span>
                        <span>Start Recommendation: <strong>Next Monday</strong></span>
                    </div>

                    <div className="space-y-3">
                        <QuoteRow title="1. Diagnosis & Check" estimated="2h" price={15000} />
                        <QuoteRow title="2. Pipe Replacement" estimated="4h" price={45000} />
                        <QuoteRow title="3. Plaster & Paint" estimated="6h" price={30000} />
                    </div>

                    <div className="flex flex-col items-end pt-6 border-t gap-2">
                        <div className="flex items-center gap-8">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-mono">$90.000</span>
                        </div>
                        <div className="flex items-center gap-8">
                            <span className="text-muted-foreground">Umarel Fee (5%)</span>
                            <span className="font-mono">-$4.500</span>
                        </div>
                        <div className="flex items-center gap-8 mt-2 pt-2 border-t border-dashed min-w-[200px] justify-between">
                            <span className="font-semibold">You Receive</span>
                            <span className="text-2xl font-bold text-green-600">$85.500</span>
                        </div>
                        <Button className="mt-4 w-full sm:w-auto bg-green-600 hover:bg-green-700">
                            Submit Proposal <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            );
        case 'EXPERIENCE_DESIGN':
            return (
                <div className="relative pl-8 border-l-2 border-primary/20 space-y-8 ml-4">
                    <TimelineItem time="19:00" title="Check-in & Welcome" capacity={50} type="Base" color="bg-blue-500" />
                    <TimelineItem time="20:00" title="Main Show" capacity={50} type="Base" color="bg-purple-500" />
                    <TimelineItem time="22:00" title="VIP Backstage Access" capacity={10} type="Optional Upgrade" color="bg-amber-500" />

                    <button className="absolute -left-[19px] bottom-0 w-10 h-10 rounded-full bg-white border-2 border-dashed border-muted flex items-center justify-center hover:border-sidebar-primary-foreground hover:scale-110 transition-all">
                        <Plus className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
            );
        case 'CRITIQUE_REVIEW':
            return (
                <div className="grid gap-6 md:grid-cols-2">
                    <EvidenceCard
                        title="Wall Painting Finish"
                        imgUrl="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop"
                        status="pending"
                        confidence={88}
                    />
                    <EvidenceCard
                        title="Pipe Connection"
                        imgUrl="https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=2074&auto=format&fit=crop"
                        status="approved"
                        confidence={98}
                    />
                </div>
            );
        default:
            return <div className="text-muted-foreground italic">Select a mode to begin.</div>;
    }
}

// --- SUB COMPONENTS ---

function SliceCard({ title, status, type, description }: { title: string, status: string, type: string, description?: string }) {
    return (
        <Card className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-blue-500">
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-[10px] font-normal">{type}</Badge>
                    <Badge variant="outline" className={`text-[10px] capitalize ${status === 'active' ? 'text-green-600 border-green-200' : 'text-orange-500 border-stone-300'}`}>
                        {status}
                    </Badge>
                </div>
                <h3 className="font-semibold text-base mb-1 group-hover:text-stone-900 transition-colors">{title}</h3>
                {description && <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>}
            </CardContent>
        </Card>
    );
}

function QuoteRow({ title, estimated, price }: { title: string, estimated: string, price: number }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card border rounded-lg hover:border-primary/50 transition-colors group">
            <div className="mb-2 sm:mb-0">
                <h3 className="font-medium text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Est: {estimated}
                </p>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <input
                        type="number"
                        defaultValue={price}
                        className="pl-6 w-28 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono text-right"
                    />
                </div>
            </div>
        </div>
    );
}

function TimelineItem({ time, title, capacity, type, color }: { time: string, title: string, capacity: number, type: string, color: string }) {
    return (
        <div className="relative group">
            <div className={`absolute -left-[45px] top-4 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${color}`} />
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="font-mono text-xs font-bold text-muted-foreground w-12 pt-1">{time}</span>
                <Card className="flex-1 p-4 hover:shadow-md transition-shadow cursor-move">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold text-sm">{title}</h4>
                            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded mt-1 inline-block">{type}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                            <Users className="w-3 h-3" />
                            <span>{capacity}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function EvidenceCard({ title, imgUrl, status, confidence }: { title: string, imgUrl: string, status: 'pending' | 'approved' | 'rejected', confidence: number }) {
    return (
        <Card className="overflow-hidden border-0 shadow-md">
            <div className="aspect-video bg-muted relative group overflow-hidden">
                <img src={imgUrl} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="destructive" className="h-8"><X className="w-4 h-4 mr-1" /> Reject</Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8"><Check className="w-4 h-4 mr-1" /> Approve</Button>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                    AI Confidence: {confidence}%
                </div>
            </div>
            <div className="p-3 bg-card border-t">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium text-sm">{title}</h3>
                    <Badge variant={status === 'approved' ? 'default' : status === 'rejected' ? 'destructive' : 'secondary'} className="capitalize text-[10px] h-5">
                        {status}
                    </Badge>
                </div>
            </div>
        </Card>
    );
}

