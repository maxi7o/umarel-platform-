
import { db } from '@/lib/db';
import { users, userWallets, contributionEvaluations, quotes, requests } from '@/lib/db/schema';
import { eq, desc, ne, and, or } from 'drizzle-orm';
import { GrandpaFeedback } from '@/components/wallet/grandpa-feedback';
import { TheStash } from '@/components/wallet/the-stash';
import { ImpactFeed } from '@/components/wallet/impact-feed';
import { MercadoPagoConnect } from '@/components/wallet/mercadopago-connect';
import { QuoteCard } from '@/components/wallet/quote-card';
import { SuggestedRequestCard } from '@/components/wallet/suggested-request-card';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function WalletPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const userId = user.id;

    // 2. Fetch User & Wallet
    const [dbUser] = await db.select().from(users).where(eq(users.id, userId));
    const [wallet] = await db.select().from(userWallets).where(eq(userWallets.userId, userId));

    // 3. Fetch Active Quotes
    // Join with requests to get the title
    const activeQuotes = await db.select({
        id: quotes.id,
        requestTitle: requests.title,
        amount: quotes.amount,
        currency: quotes.currency,
        status: quotes.status,
        createdAt: quotes.createdAt,
    })
        .from(quotes)
        .innerJoin(requests, eq(quotes.requestId, requests.id))
        .where(eq(quotes.providerId, userId))
        .orderBy(desc(quotes.createdAt))
        .limit(5);

    // 4. Fetch Suggested Requests
    // Open requests, not created by user
    // In a real app, we'd filter by location/skills
    const suggestedRequests = await db.select({
        id: requests.id,
        title: requests.title,
        location: requests.location,
        category: requests.category,
        createdAt: requests.createdAt,
    })
        .from(requests)
        .where(and(
            eq(requests.status, 'open'),
            ne(requests.userId, userId)
        ))
        .orderBy(desc(requests.createdAt))
        .limit(3);

    // 5. Fetch History (Inefficient JSON filter for now)
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

    const isConnected = !!wallet?.mercadoPagoAccessToken;

    return (
        <div className="container mx-auto max-w-4xl py-8 px-4 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Mi Billetera Umarel</h1>
                <p className="text-muted-foreground">Gestiona tus ganancias y tu reputación en la obra.</p>
            </div>

            {/* Top Grid: Stash (Balance) & Grandpa (Status) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* LEFT COLUMN */}
                <div className="space-y-6">
                    <GrandpaFeedback
                        auraLevel={dbUser?.auraLevel || 'bronze'}
                        auraPoints={dbUser?.auraPoints || 0}
                    />

                    {/* Active Quotes Section */}
                    <div className="bg-white dark:bg-stone-900 rounded-xl p-4 shadow-sm border border-stone-100 dark:border-stone-800">
                        <h3 className="font-serif font-semibold text-lg mb-3 flex items-center gap-2">
                            📄 Mis Presupuestos Activos
                        </h3>
                        {activeQuotes.length > 0 ? (
                            <div className="space-y-3">
                                {activeQuotes.map(quote => (
                                    <QuoteCard key={quote.id} quote={quote as any} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg bg-stone-50/50">
                                No tenés presupuestos activos. <br /> ¡Explorá oportunidades para cotizar!
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                    <TheStash balance={balance} currency={currency} />

                    {/* MercadoPago */}
                    <MercadoPagoConnect isConnected={isConnected} />

                    {/* Suggested Requests Section */}
                    {suggestedRequests.length > 0 && (
                        <div className="bg-stone-50 dark:bg-stone-900/50 rounded-xl p-4 border border-stone-200 dark:border-stone-800">
                            <h3 className="font-serif font-semibold text-lg mb-3 text-stone-700 dark:text-stone-300">
                                🔭 Oportunidades Cercanas
                            </h3>
                            <div className="grid gap-3">
                                {suggestedRequests.map(req => (
                                    <SuggestedRequestCard key={req.id} request={req} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Impact Feed */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
                <h2 className="text-xl font-bold font-serif mb-4 text-stone-800 dark:text-stone-100">
                    Impacto en Obras
                </h2>
                <ImpactFeed contributions={contributions} />
            </div>
        </div>
    );
}
