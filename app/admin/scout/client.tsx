'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Copy, Check, ExternalLink } from 'lucide-react';

interface ScoutResult {
    intentScore: number;
    reason: string;
    suggestedReply?: string;
    source: string;
}

export default function ScoutClient() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ScoutResult | null>(null);
    const [copied, setCopied] = useState(false);

    const analyzeLead = async () => {
        if (!input.trim()) return;

        setIsLoading(true);
        setResult(null);
        setCopied(false);

        try {
            const response = await fetch('/api/admin/scout/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: input })
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Failed to analyze:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyReply = () => {
        if (result?.suggestedReply) {
            navigator.clipboard.writeText(result.suggestedReply);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'bg-green-100 text-green-800 border-green-200';
        if (score >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-slate-100 text-slate-800 border-slate-200';
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Scout Agent</h1>
                <p className="text-slate-500">Paste a social media post to analyze intent and generate a reply.</p>
            </div>

            <Card className="mb-8">
                <CardContent className="pt-6">
                    <Textarea
                        placeholder="Paste post content here..."
                        className="min-h-[120px] mb-4 text-base"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <Button
                            onClick={analyzeLead}
                            disabled={isLoading || !input.trim()}
                            className="bg-slate-900 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                                </>
                            ) : (
                                'Analyze Intent'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {result && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className={`border-l-4 ${result.intentScore >= 7 ? 'border-l-green-500' : 'border-l-slate-300'}`}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-3">
                                        Analysis Result
                                        <Badge variant="outline" className={`${getScoreColor(result.intentScore)} font-bold`}>
                                            Score: {result.intentScore}/10
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription className="mt-2 text-slate-600">
                                        {result.reason}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        {result.suggestedReply && (
                            <CardContent>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                                    <p className="text-slate-800 font-medium pr-8 font-mono text-sm leading-relaxed">
                                        {result.suggestedReply}
                                    </p>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2 text-slate-400 hover:text-slate-900"
                                        onClick={copyReply}
                                    >
                                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2 text-right">
                                    Click icon to copy, then paste on social platform.
                                </p>
                            </CardContent>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
}
