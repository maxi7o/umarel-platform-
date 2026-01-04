import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { contracts } from '@/lib/db/schema'; // users imported implicitly via relations
import { eq } from 'drizzle-orm';
import { ContractCertificate } from '@/components/contracts/contract-certificate';

interface Props {
    params: {
        id: string;
        locale: string;
    };
}

export const dynamic = 'force-dynamic';

export default async function ContractPage({ params }: Props) {
    const { id, locale } = params;

    // Use query builder to fetch contract with relations
    // Note: Drizzle relations must be properly set up for 'provider' and 'client'
    const contract = await db.query.contracts.findFirst({
        where: eq(contracts.id, id),
        with: {
            provider: true,
            client: true
        }
    });

    if (!contract) {
        notFound();
    }

    const snapshot = contract.snapshotJson as any;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 print:bg-white print:p-0">
            <div className="container mx-auto">
                <div className="mb-8 text-center print:hidden">
                    <p className="text-sm text-slate-500 mb-2">Immutable Record View</p>
                    <p className="text-xs text-slate-400">
                        This digital certificate matches the cryptographic hash stored in the Umarel database.
                    </p>
                </div>
                <ContractCertificate
                    id={contract.id}
                    contractHash={contract.contractHash}
                    snapshot={snapshot}
                    providerName={contract.provider?.fullName || 'Unknown Provider'}
                    clientName={contract.client?.fullName || 'Unknown Client'}
                    createdAt={contract.createdAt || new Date()}
                    locale={locale}
                />
            </div>
        </div>
    );
}
