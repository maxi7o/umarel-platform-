'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ShieldAlert, DollarSign, LayoutDashboard } from 'lucide-react';

interface AdminDashboardTabsProps {
    overviewContent: React.ReactNode;
    disputesContent: React.ReactNode;
    payoutsContent: React.ReactNode;
    disputeCount: number;
    pendingPayoutCount: number;
}

export function AdminDashboardTabs({
    overviewContent,
    disputesContent,
    payoutsContent,
    disputeCount,
    pendingPayoutCount
}: AdminDashboardTabsProps) {

    return (
        <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-stone-100 p-1 rounded-lg">
                <TabsTrigger value="overview" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Resumen
                </TabsTrigger>

                <TabsTrigger value="disputes" className="gap-2 relative">
                    <ShieldAlert className="w-4 h-4" />
                    Tribunal
                    {disputeCount > 0 && (
                        <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                            {disputeCount}
                        </Badge>
                    )}
                </TabsTrigger>

                <TabsTrigger value="payouts" className="gap-2">
                    <DollarSign className="w-4 h-4" />
                    Tesorería
                    {pendingPayoutCount > 0 && (
                        <Badge variant="secondary" className="ml-1 bg-green-100 text-green-800 hover:bg-green-200">
                            {pendingPayoutCount}
                        </Badge>
                    )}
                </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="animate-in fade-in-50">
                {overviewContent}
            </TabsContent>

            <TabsContent value="disputes" className="animate-in fade-in-50">
                {disputesContent}
            </TabsContent>

            <TabsContent value="payouts" className="animate-in fade-in-50">
                {payoutsContent}
            </TabsContent>
        </Tabs>
    );
}
