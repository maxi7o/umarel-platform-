import { db } from '@/lib/db';
import { slices, requests } from '@/lib/db/schema';
import { eq, or, desc } from 'drizzle-orm';
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

export async function DisputesContent() {
    let disputeList: any[] = [];
    let errorMsg = null;

    try {
        disputeList = await db
            .select({
                id: slices.id,
                status: slices.status,
                refundStatus: slices.refundStatus,
                amount: slices.finalPrice,
                createdAt: slices.createdAt,
                disputedAt: slices.disputedAt,
                requestTitle: requests.title,
                creatorId: slices.creatorId,
                assignedProviderId: slices.assignedProviderId
            })
            .from(slices)
            .leftJoin(requests, eq(slices.requestId, requests.id))
            .where(
                or(
                    eq(slices.status, 'disputed'),
                    eq(slices.refundStatus, 'disputed'),
                    eq(slices.refundStatus, 'requested')
                )
            )
            .orderBy(desc(slices.disputedAt));

    } catch (e) {
        console.error("Fetch Disputes Error:", e);
        errorMsg = "Could not load disputes. Database connection error.";
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Gavel className="h-5 w-5 text-stone-900" />
                <h2 className="text-xl font-bold">Casos Abiertos (Tribunal)</h2>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID Caso</TableHead>
                            <TableHead>Contexto / Conflicto</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Tiempo Activo</TableHead>
                            <TableHead className="text-right">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {errorMsg ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-32 text-red-500 font-medium">
                                    Error de Conexión: {errorMsg}
                                </TableCell>
                            </TableRow>
                        ) : disputeList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-48 text-slate-500">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="bg-green-50 p-4 rounded-full">
                                            <ShieldAlert className="h-8 w-8 text-green-600 opacity-50" />
                                        </div>
                                        <p className="font-medium text-stone-900">No hay disputas activas.</p>
                                        <p className="text-xs">La paz reina en El Entendido.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            disputeList.map((dispute) => (
                                <TableRow key={dispute.id}>
                                    <TableCell className="font-mono text-xs text-slate-500">
                                        {dispute.id.substring(0, 8)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900 truncate max-w-[200px]">
                                                {dispute.requestTitle || 'Trabajo Sin Título'}
                                            </span>
                                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                                <User className="h-3 w-3" />
                                                <span className="bg-blue-50 text-blue-700 px-1 rounded">C: {dispute.creatorId.substring(0, 4)}</span>
                                                <span className="text-stone-300">vs</span>
                                                <span className="bg-orange-50 text-orange-700 px-1 rounded">P: {dispute.assignedProviderId?.substring(0, 4)}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={dispute.status === 'disputed' ? 'destructive' : 'outline'} className="uppercase text-[10px]">
                                            {dispute.status === 'disputed' ? 'En Disputa' : dispute.refundStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-bold font-mono">
                                        ${(dispute.amount || 0) / 100}
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-xs">
                                        {dispute.disputedAt ? formatDistanceToNow(new Date(dispute.disputedAt), { addSuffix: true, locale: undefined }) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/disputes/${dispute.id}`}>
                                            <Button size="sm" variant="outline" className="h-8 text-xs">
                                                <Eye className="h-3 w-3 mr-2" />
                                                Revisar
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

export async function getDisputeCount() {
    try {
        const results = await db
            .select({ id: slices.id })
            .from(slices)
            .where(
                or(
                    eq(slices.status, 'disputed'),
                    eq(slices.refundStatus, 'disputed'),
                    eq(slices.refundStatus, 'requested')
                )
            );
        return results.length;
    } catch (e) {
        return 0;
    }
}
