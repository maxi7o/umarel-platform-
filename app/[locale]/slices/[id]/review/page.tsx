
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { slices, sliceEvidence } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { EvidenceViewer } from '@/components/interaction/evidence-viewer';
import { ApprovalActions } from '@/components/interaction/approval-actions';
import { Badge } from '@/components/ui/badge';

interface ReviewPageProps {
    params: Promise<{ id: string; locale: string }>;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
    const { id } = await params;

    const [slice] = await db.select().from(slices).where(eq(slices.id, id));
    if (!slice) return notFound();

    const evidence = await db.query.sliceEvidence.findFirst({
        where: eq(sliceEvidence.sliceId, id),
        orderBy: (evidence, { desc }) => [desc(evidence.createdAt)]
    });

    // Mock amount if not set ( MVP flow often skips setting finalPrice explicitly properly)
    // Use marketPriceMin or fallback
    const amount = slice.finalPrice || slice.marketPriceMin || 5000000;

    return (
        <div className="container mx-auto py-12 px-4 max-w-3xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-serif mb-2">Revisar Trabajo</h1>
                    <p className="text-muted-foreground">Verificá que todo esté en orden antes de pagar.</p>
                </div>
                <Badge variant={slice.status === 'paid' ? 'default' : 'outline'} className="text-sm px-3 py-1">
                    Estado: {slice.status === 'paid' ? 'PAGADO ✅' : 'PENDIENTE ⏳'}
                </Badge>
            </div>

            <div className="grid gap-8">
                {/* 1. The Evidence */}
                <EvidenceViewer
                    evidence={evidence ? {
                        fileUrl: evidence.fileUrl,
                        description: evidence.description,
                        createdAt: evidence.createdAt,
                        providerName: "Experto" // Could join users table
                    } : null}
                />

                {/* 2. Actions (Only show if not paid yet) */}
                {slice.status !== 'paid' && slice.status !== 'completed' && slice.status !== 'approved_by_client' ? (
                    // Wait, logic check: if status IS completed (provider done), we show verify.
                    // If paid, we hide actions.
                    // If 'completed', we SHOW actions.
                    null
                ) : null}

                {/* Correct Logic: Show actions if status is 'completed' (which implies waiting for verification) */}
                {slice.status === 'completed' && (
                    <ApprovalActions
                        sliceId={slice.id}
                        amount={amount}
                        currency="ARS"
                    />
                )}

                {slice.status === 'paid' && (
                    <div className="p-6 bg-green-50 dark:bg-green-900/10 border border-green-200 rounded-lg text-center">
                        <h3 className="text-green-800 dark:text-green-400 font-semibold text-lg">
                            ¡Gracias! El pago ha sido liberado.
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-500 mt-2">
                            Tu satisfacción ayuda a construir el Aura de la comunidad.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
