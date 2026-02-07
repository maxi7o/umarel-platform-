'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, ExternalLink, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Lead {
    id: string;
    created_at: string;
    platform: string;
    post_url: string;
    post_content: string;
    username: string;
    intent_score: number;
    analysis_reason: string;
    suggested_reply: string;
    status: 'pending' | 'approved' | 'rejected' | 'posted';
}

export default function ScoutQueueClient() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        fetchLeads();
    }, [activeTab]);

    const fetchLeads = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/scout/queue?status=${activeTab}`);
            const data = await response.json();
            setLeads(data);
        } catch (error) {
            console.error('Failed to fetch leads:', error);
            toast.error('Failed to load leads');
        } finally {
            setIsLoading(false);
        }
    };

    const updateLeadStatus = async (leadId: string, status: 'approved' | 'rejected') => {
        try {
            await fetch(`/api/admin/scout/queue/${leadId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            toast.success(`Lead ${status}`);
            fetchLeads();
        } catch (error) {
            toast.error('Failed to update lead');
        }
    };

    const copyReply = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Reply copied to clipboard');
    };

    const getScoreBadge = (score: number) => {
        if (score >= 9) return 'bg-green-100 text-green-800 border-green-300';
        if (score >= 7) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        return 'bg-slate-100 text-slate-800 border-slate-300';
    };

    const getPlatformBadge = (platform: string) => {
        const colors = {
            instagram: 'bg-pink-100 text-pink-800',
            facebook: 'bg-blue-100 text-blue-800',
            twitter: 'bg-sky-100 text-sky-800'
        };
        return colors[platform as keyof typeof colors] || 'bg-slate-100 text-slate-800';
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Lead Queue</h1>
                <p className="text-slate-500">Review and approve automated lead discoveries</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    <TabsTrigger value="posted">Posted</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        </div>
                    ) : leads.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-slate-500">
                                No {activeTab} leads found
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {leads.map((lead) => (
                                <Card key={lead.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getPlatformBadge(lead.platform)}>
                                                        {lead.platform}
                                                    </Badge>
                                                    <Badge variant="outline" className={getScoreBadge(lead.intent_score)}>
                                                        Score: {lead.intent_score}/10
                                                    </Badge>
                                                    <span className="text-sm text-slate-500">
                                                        @{lead.username}
                                                    </span>
                                                </div>
                                                <CardTitle className="text-lg">{lead.analysis_reason}</CardTitle>
                                            </div>
                                            <a
                                                href={lead.post_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-400 hover:text-slate-900"
                                            >
                                                <ExternalLink className="h-5 w-5" />
                                            </a>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="bg-slate-50 p-4 rounded-lg">
                                            <p className="text-sm text-slate-700 italic">
                                                "{lead.post_content}"
                                            </p>
                                        </div>

                                        {lead.suggested_reply && (
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 relative">
                                                <p className="text-sm text-blue-900 font-medium pr-8">
                                                    {lead.suggested_reply}
                                                </p>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => copyReply(lead.suggested_reply)}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}

                                        {lead.status === 'pending' && (
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => updateLeadStatus(lead.id, 'rejected')}
                                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Reject
                                                </Button>
                                                <Button
                                                    onClick={() => updateLeadStatus(lead.id, 'approved')}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <Check className="h-4 w-4 mr-2" />
                                                    Approve
                                                </Button>
                                            </div>
                                        )}

                                        <div className="text-xs text-slate-400">
                                            Detected: {new Date(lead.created_at).toLocaleString()}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
