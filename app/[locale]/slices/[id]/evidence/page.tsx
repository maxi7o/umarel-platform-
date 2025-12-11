
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { slices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { EvidenceUploader } from '@/components/interaction/evidence-uploader';

interface EvidencePageProps {
    params: Promise<{ id: string; locale: string }>;
}

export default async function EvidencePage({ params }: EvidencePageProps) {
    const { id } = await params;

    const [slice] = await db.select().from(slices).where(eq(slices.id, id));
    if (!slice) return notFound();

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-serif mb-2">Finalizar Trabajo</h1>
                <p className="text-muted-foreground">Subí las pruebas para liberar el pago.</p>
            </div>

            <EvidenceUploader
                sliceId={slice.id}
                sliceTitle={slice.title}
            />
        </div>
    );
}
