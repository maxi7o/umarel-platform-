'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Hammer, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SliceProposalProps {
    slice: {
        id: string; // Temporarily just an ID or partial object for display
        title: string;
        description: string;
        estimatedEffort?: string;
        skills?: string[];
    };
    onAccept?: () => void;
    isAccepted?: boolean;
}

export function SliceProposal({ slice, onAccept, isAccepted = false }: SliceProposalProps) {
    return (
        <Card className={cn(
            "w-full max-w-sm mt-2 border-2 transition-all",
            isAccepted
                ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800"
                : "bg-white border-blue-100 dark:bg-gray-800 dark:border-blue-900"
        )}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Hammer size={16} className={isAccepted ? "text-green-600" : "text-blue-600"} />
                        {slice.title}
                    </CardTitle>
                    {isAccepted && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">Accepted</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pb-3 space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {slice.description}
                </p>
                {slice.skills && slice.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {slice.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="text-[10px] px-1 py-0 h-5">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
            {!isAccepted && onAccept && (
                <CardFooter className="pt-0 pb-3">
                    <Button
                        size="sm"
                        className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={onAccept}
                    >
                        <CheckCircle2 size={14} />
                        Review & Accept Slice
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
