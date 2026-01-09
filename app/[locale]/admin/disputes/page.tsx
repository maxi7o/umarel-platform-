import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { slices, users, serviceOfferings, requests } from '@/lib/db/schema';
import { eq, or, desc, and } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Eye, User, Gavel } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function AdminDisputesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Admin Check
    const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));
    if (dbUser?.role !== 'admin' && user.email !== 'carlos@demo.com') {
        redirect('/');
    }

    // Fetch Disputed Slices
    const disputeList = await db
        .select({
            id: slices.id,
            status: slices.status,
            refundStatus: slices.refundStatus,
            amount: slices.finalPrice, // corrected from totalPrice
            createdAt: slices.createdAt,
            disputedAt: slices.disputedAt,
            requestTitle: requests.title,
            offeringTitle: serviceOfferings.title,
            creatorId: slices.creatorId,
            assignedProviderId: slices.assignedProviderId
        })
        .from(slices)
        .leftJoin(requests, eq(slices.requestId, requests.id))
        .leftJoin(serviceOfferings, eq(slices.id, serviceOfferings.id))
        .where(
            or(
                eq(slices.status, 'disputed'),
                eq(slices.refundStatus, 'disputed'),
                eq(slices.refundStatus, 'requested')
            )
        )
        .orderBy(desc(slices.disputedAt));

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Gavel className="h-8 w-8 text-red-600" />
                    <h1 className="text-3xl font-bold tracking-tight">Dispute Tribunal</h1>
                </div>
                <p className="text-muted-foreground">
                    Adjudicate conflicts between Clients and Providers.
                </p>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Case ID</TableHead>
                            <TableHead>Context</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Last Update</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {disputeList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-32 text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <ShieldAlert className="h-8 w-8 opacity-20" />
                                        <p>No active disputes. Peace reigns in Umarel.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            disputeList.map((dispute) => (
                                <TableRow key={dispute.id}>
                                    <TableCell className="font-mono text-xs text-slate-500">
                                        {dispute.id.substring(0, 8)}...
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900">
                                                {dispute.requestTitle || dispute.offeringTitle || 'Untitled Job'}
                                            </span>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                <User className="h-3 w-3" />
                                                <span>Client: {dispute.creatorId.substring(0, 6)}...</span>
                                                <span>vs</span>
                                                <span>Provider: {dispute.assignedProviderId?.substring(0, 6) || 'None'}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={dispute.status === 'disputed' ? 'destructive' : 'outline'}>
                                            {dispute.status === 'disputed' ? 'Disputed' : dispute.refundStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-bold">
                                        ${(dispute.amount || 0) / 100}
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-sm">
                                        {dispute.disputedAt ? formatDistanceToNow(dispute.disputedAt, { addSuffix: true }) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/disputes/${dispute.id}`}>
                                            <Button size="sm" variant="outline">
                                                <Eye className="h-4 w-4 mr-2" />
                                                Review Case
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
