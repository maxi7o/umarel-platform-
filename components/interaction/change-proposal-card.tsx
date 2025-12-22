'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Helper to format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount / 100);
};

interface ChangeProposalCardProps {
    proposal: any;
    onRespond: (id: string, status: 'accepted' | 'rejected') => Promise<void>;
}

export function ChangeProposalCard({ proposal, onRespond }: ChangeProposalCardProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const { proposedActions, aiImpact } = proposal;

    const handleAction = async (status: 'accepted' | 'rejected') => {
        setIsProcessing(true);
        try {
            await onRespond(proposal.id, status);
            toast.success(status === 'accepted' ? 'Changes applied successfully!' : 'Proposal rejected.');
        } catch (error) {
            toast.error('Failed to process proposal.');
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Card className="border-orange-200 bg-orange-50/30 dark:bg-orange-950/10 dark:border-orange-800">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        Update Proposal
                    </CardTitle>
                    <Badge variant="outline" className="bg-white dark:bg-black">
                        {proposal.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                    {proposedActions.map((action: any, idx: number) => (
                        <div key={idx} className="p-3 bg-white dark:bg-black/20 rounded-md border text-sm">
                            {action.type === 'CREATE_CARD' && (
                                <>
                                    <div className="font-semibold text-green-600 mb-1">+ New Slice Proposed</div>
                                    <div className="font-medium">{action.data.title}</div>
                                    <div className="text-muted-foreground mt-1">{action.data.description}</div>
                                </>
                            )}
                            {action.type === 'UPDATE_CARD' && (
                                <>
                                    <div className="font-semibold text-blue-600 mb-1">Update Existing Slice</div>
                                    {Object.entries(action.updates).map(([key, value]) => (
                                        <div key={key} className="flex gap-2">
                                            <span className="font-medium capitalize">{key}:</span>
                                            <span className="text-muted-foreground">{String(value)}</span>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {aiImpact && (
                    <div className="flex gap-4 text-xs text-muted-foreground">
                        {aiImpact.estimatedSavings > 0 && (
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                                <span>💰 Potential Savings: {formatCurrency(aiImpact.estimatedSavings)}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <span>✨ Impact: {aiImpact.impactType}</span>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end gap-3 pt-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAction('rejected')}
                    disabled={isProcessing}
                    className="text-red-900 hover:text-red-700 hover:bg-red-100"
                >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
                    Reject
                </Button>
                <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAction('accepted')}
                    disabled={isProcessing}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                    Accept & Apply
                </Button>
            </CardFooter>
        </Card>
    );
}
