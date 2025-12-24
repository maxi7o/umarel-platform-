'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { analyzeDisputeAction } from '@/app/admin/actions';
import { Loader2, Sparkles } from 'lucide-react';

export function AIAnalysisButton({ escrowId, analysis }: { escrowId: string, analysis?: any }) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(analysis);

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const res = await analyzeDisputeAction(escrowId);
            if (res.error) {
                alert(res.error);
            } else {
                setResult(res.analysis);
            }
        } finally {
            setLoading(false);
        }
    };

    if (result) {
        return (
            <div className="mt-2 p-3 bg-indigo-50 border border-indigo-100 rounded text-sm text-indigo-900">
                <div className="flex items-center gap-2 font-bold mb-1">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    AI Recommendation:
                    <span className={
                        result.recommendation === 'release_to_provider' ? 'text-green-600' :
                            result.recommendation === 'refund_client' ? 'text-red-600' : 'text-yellow-600'
                    }>
                        {result.recommendation.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-normal opacity-70">({result.confidenceScore}% confidence)</span>
                </div>
                <p className="opacity-90">{result.reasoning}</p>
            </div>
        );
    }

    return (
        <Button
            onClick={handleAnalyze}
            disabled={loading}
            variant="outline"
            size="sm"
            className="w-full mt-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Analyze with AI
        </Button>
    );
}
