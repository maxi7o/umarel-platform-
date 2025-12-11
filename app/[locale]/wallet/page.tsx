
import { db } from '@/lib/db';
import { users, userWallets, contributionEvaluations } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { GrandpaFeedback } from '@/components/wallet/grandpa-feedback';
import { TheStash } from '@/components/wallet/the-stash';
import { ImpactFeed } from '@/components/wallet/impact-feed';
import { getUser } from '@/lib/auth/get-user'; // Assuming this exists or similar

export default async function WalletPage() {
    // 1. Get Current User
    // For MVP, we hardcode the dev user if auth not ready, but we should use real ID
    const userId = "00000000-0000-0000-0000-000000000001"; // Dev User

    // 2. Fetch User & Wallet
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    const [wallet] = await db.select().from(userWallets).where(eq(userWallets.userId, userId));

    // 3. Fetch History (Inefficient JSON filter for now)
    const rawEvals = await db.select()
        .from(contributionEvaluations)
        .orderBy(desc(contributionEvaluations.createdAt))
        .limit(50);

    let contributions = rawEvals
        .map(e => {
            const myContrib = e.contributions?.find((c: any) => c.userId === userId);
            if (!myContrib) return null;
            return {
                id: e.id,
                score: myContrib.score,
                contributionType: myContrib.contributionType,
                reasoning: myContrib.reasoning,
                createdAt: e.createdAt,
                sliceId: e.sliceId,
                totalScore: e.totalScore || 0
            };
        })
        .filter(Boolean) as any[];

    // --- MOCK DATA FOR DEMO IF EMPTY ---
    if (contributions.length === 0) {
        contributions = [
            {
                id: 'mock-1',
                score: 10,
                contributionType: 'risk_mitigation',
                reasoning: 'Impact: Risk Mitigation. Detected major safety hazard (Asbestos) before work began.',
                createdAt: new Date(),
                totalScore: 500
            },
            {
                id: 'mock-2',
                score: 8,
                contributionType: 'clarity',
                reasoning: 'Impact: Clarity. Clarified dimensions for rug cleaning, preventing wrong quote.',
                createdAt: new Date(Date.now() - 86400000), // Yesterday
                totalScore: 80
            },
            {
                id: 'mock-3',
                score: 9,
                contributionType: 'savings',
                reasoning: 'Impact: Savings. Suggested material alternative saving $15,000 ARS.',
                createdAt: new Date(Date.now() - 172800000), // 2 days ago
                totalScore: 105
            }
        ];
    }

    // Mock Balance for Demo if empty
    const balance = wallet?.balance ?? 1250000; // 12,500 ARS default for demo
    const currency = 'ARS';

    return (
        <div className="container mx-auto max-w-4xl py-8 px-4 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Mi Billetera Umarel</h1>
                <p className="text-muted-foreground">Gestiona tus ganancias y tu reputación en la obra.</p>
            </div>

            {/* Top Row: Feedback + Stash */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GrandpaFeedback
                    auraLevel={user?.auraLevel || 'bronze'}
                    auraPoints={user?.auraPoints || 0}
                />
                <TheStash balance={balance} currency={currency} />
            </div>

            {/* Impact Feed */}
            <ImpactFeed contributions={contributions} />
        </div>
    );
}
