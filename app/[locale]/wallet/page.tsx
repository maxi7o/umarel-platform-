
import { db } from '@/lib/db';
import { users, userWallets, contributionEvaluations, quotes, requests } from '@/lib/db/schema';
import { eq, desc, ne, and } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Plus, ShieldCheck, Zap, Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Helper components for the new design
function StatCard({ title, value, icon: Icon, subtext }: { title: string, value: string, icon: any, subtext?: string }) {
    return (
        <div className="border border-stone-200 bg-white p-6 flex flex-col justify-between hover:border-stone-900 transition-colors duration-300 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold tracking-widest text-stone-500 uppercase">{title}</span>
                <Icon className="w-5 h-5 text-stone-700" />
            </div>
            <div>
                <div className="text-3xl font-black text-stone-900 font-archivo tracking-tight">{value}</div>
                {subtext && <div className="text-xs text-stone-500 mt-1 font-mono">{subtext}</div>}
            </div>
        </div>
    );
}

function ProjectCard({ request }: { request: any }) {
    return (
        <div className="group border border-stone-200 bg-stone-50 p-6 hover:bg-white hover:border-stone-900 transition-all duration-200 cursor-pointer h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className="bg-white text-stone-900 border-stone-900 rounded-none font-bold text-[10px] uppercase tracking-wide">
                        {request.status}
                    </Badge>
                    <span className="text-xs text-stone-400 font-mono">
                        {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                </div>
                <h3 className="font-bold text-xl text-stone-900 mb-2 group-hover:underline decoration-2 underline-offset-2 leading-tight">
                    {request.title}
                </h3>
                <p className="text-sm text-stone-500 line-clamp-2 mb-4">
                    {request.description || 'Sin descripción'}
                </p>
            </div>
            <div className="flex items-center text-xs font-bold text-stone-900 mt-4">
                VER DETALLES <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    )
}

function QuoteItem({ quote }: { quote: any }) {
    return (
        <div className="flex items-center justify-between p-4 border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors group">
            <div>
                <div className="font-bold text-stone-900 group-hover:text-stone-700">{quote.requestTitle}</div>
                <div className="text-xs text-stone-500 font-mono mt-0.5">
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: quote.currency }).format(quote.amount)}
                </div>
            </div>
            <Badge variant={quote.status === 'accepted' ? 'default' : 'secondary'} className="rounded-none font-bold uppercase text-[10px] bg-stone-100 text-stone-600 border border-stone-200">
                {quote.status}
            </Badge>
        </div>
    )
}

function ContributionItem({ contribution: c }: { contribution: any }) {
    return (
        <div className="flex gap-4 items-start p-4 bg-white border border-stone-200 hover:border-stone-400 transition-colors">
            <div className="p-2 bg-stone-100 text-stone-900 shrink-0">
                <Zap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <div className="font-bold text-stone-900 text-sm uppercase tracking-wide">
                        {c.contributionType?.replace('_', ' ')}
                    </div>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed mb-2">
                    {c.reasoning}
                </p>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-none text-[10px] bg-emerald-100 text-emerald-800 font-bold border-emerald-200">
                        +{c.score} AURA
                    </Badge>
                    <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default async function WalletPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const userId = user.id;

    // Initialize with explicit ANY types to avoid build errors during fast iteration
    let dbUser: any, wallet: any, activeQuotes: any[] = [], suggestedRequests: any[] = [], contributions: any[] = [], myRequests: any[] = [];

    try {
        // 2. Fetch User & Wallet
        const userResult = await db.select().from(users).where(eq(users.id, userId));
        dbUser = userResult[0];

        const walletResult = await db.select().from(userWallets).where(eq(userWallets.userId, userId));
        wallet = walletResult[0];

        // 3. Fetch My Requests (CLIENT ROLE)
        myRequests = await db.select()
            .from(requests)
            .where(eq(requests.userId, userId))
            .orderBy(desc(requests.createdAt))
            .limit(5);

        // 4. Fetch Active Quotes (PROVIDER ROLE)
        activeQuotes = await db.select({
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

        // 5. Fetch Suggested Requests (PROVIDER ROLE)
        suggestedRequests = await db.select({
            id: requests.id,
            title: requests.title,
            location: requests.location,
            category: requests.category,
            createdAt: requests.createdAt,
            description: requests.description
        })
            .from(requests)
            .where(and(
                eq(requests.status, 'open'),
                ne(requests.userId, userId)
            ))
            .orderBy(desc(requests.createdAt))
            .limit(3);

        // 6. Fetch History (ENTENDIDO ROLE)
        const rawEvals = await db.select()
            .from(contributionEvaluations)
            .orderBy(desc(contributionEvaluations.createdAt))
            .limit(50);

        contributions = rawEvals
            .map(e => {
                const contribArray = Array.isArray(e.contributions) ? e.contributions : [];
                const myContrib = contribArray.find((c: any) => c.userId === userId);
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

    } catch (error) {
        console.error("Dashboard Data Fetch Error:", error);
    }

    const balance = wallet?.balance ?? 0; // Default to 0 for real app, mock only if needed
    const currency = 'ARS';
    const formattedBalance = new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(balance / 100);
    const auraLevel = dbUser?.auraLevel || 'bronze';
    const auraPoints = dbUser?.auraPoints || 0;

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-20">
            {/* HER0 / HEADER SECTION */}
            <div className="bg-white border-b border-stone-200 pt-10 pb-8 px-4 shadow-sm">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="text-xs font-bold tracking-widest text-stone-400 mb-2 uppercase">Panel de Control</div>
                            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight font-archivo uppercase">
                                HOLA, <span className="text-stone-500">{dbUser?.fullName?.split(' ')[0] || 'CRACK'}</span>
                            </h1>
                            <p className="text-stone-500 font-medium max-w-md text-lg">
                                Tu centro de comando para construir, cotizar y opinar.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/create-offering">
                                <Button className="h-12 px-6 rounded-none bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm tracking-wider uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all border border-stone-900">
                                    <Plus className="w-4 h-4 mr-2" /> Nuevo Proyecto
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN DASHBOARD GRID */}
            <div className="container mx-auto max-w-6xl px-4 -mt-8 relative z-10">

                {/* 1. STATS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard
                        title="Tu Billetera"
                        value={formattedBalance}
                        icon={Wallet}
                        subtext="Disponible para retirar"
                    />
                    <StatCard
                        title="Nivel de Aura"
                        value={`${auraPoints} PTS`}
                        icon={ShieldCheck}
                        subtext={`Rango Actual: ${auraLevel.toUpperCase()}`}
                    />
                    <StatCard
                        title="Proyectos Activos"
                        value={myRequests.length.toString()}
                        icon={Briefcase}
                        subtext="Solicitudes en curso"
                    />
                </div>

                {/* 2. TABS & CONTENT */}
                <Tabs defaultValue="overview" className="space-y-8">
                    <TabsList className="bg-transparent border-b border-stone-200 w-full justify-start h-auto p-0 rounded-none gap-8 overflow-x-auto">
                        <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-stone-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 font-bold text-stone-400 data-[state=active]:text-stone-900 uppercase tracking-widest text-sm hover:text-stone-600 transition-colors">
                            Resumen General
                        </TabsTrigger>
                        <TabsTrigger value="client" className="rounded-none border-b-2 border-transparent data-[state=active]:border-stone-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 font-bold text-stone-400 data-[state=active]:text-stone-900 uppercase tracking-widest text-sm hover:text-stone-600 transition-colors">
                            Mis Proyectos (Cliente)
                        </TabsTrigger>
                        <TabsTrigger value="provider" className="rounded-none border-b-2 border-transparent data-[state=active]:border-stone-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 font-bold text-stone-400 data-[state=active]:text-stone-900 uppercase tracking-widest text-sm hover:text-stone-600 transition-colors">
                            Oportunidades (Proveedor)
                        </TabsTrigger>
                    </TabsList>

                    {/* OVERVIEW TAB */}
                    <TabsContent value="overview" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* A. CLIENTE SECTION */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black font-archivo flex items-center gap-3 uppercase tracking-tight">
                                    <span className="w-4 h-4 bg-stone-900 inline-block" />
                                    Tus Proyectos
                                </h2>
                                <Link href="/create-offering" className="text-xs font-bold underline decoration-2 underline-offset-4 hover:text-stone-600 uppercase tracking-wider">
                                    Ver Todos
                                </Link>
                            </div>

                            {myRequests.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {myRequests.map((req: any) => (
                                        <ProjectCard key={req.id} request={req} />
                                    ))}
                                </div>
                            ) : (
                                <div className="border border-dashed border-stone-300 bg-stone-50/50 p-12 text-center">
                                    <p className="text-stone-500 font-medium mb-4">No tenés proyectos activos.</p>
                                    <Link href="/create-offering">
                                        <Button variant="outline" className="rounded-none border-stone-900 text-stone-900 font-bold hover:bg-stone-900 hover:text-white uppercase tracking-wider">
                                            Publicar Solicitud
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </section>

                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* B. PROVEEDOR - Cotizaciones */}
                            <section>
                                <h2 className="text-2xl font-black font-archivo mb-6 flex items-center gap-3 uppercase tracking-tight">
                                    <span className="w-4 h-4 bg-stone-400 inline-block" />
                                    Tus Cotizaciones
                                </h2>
                                <div className="border border-stone-200 bg-white shadow-sm">
                                    {activeQuotes.length > 0 ? (
                                        activeQuotes.map((quote: any) => (
                                            <QuoteItem key={quote.id} quote={quote} />
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-stone-500 text-sm font-medium">
                                            No has enviado presupuestos recientemente.
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Oportunidades Sugeridas</h3>
                                    <div className="grid gap-4">
                                        {suggestedRequests.map((req: any) => (
                                            <Link href={`/requests/${req.id}`} key={req.id} className="block p-5 bg-white border border-stone-200 hover:border-stone-900 hover:shadow-md transition-all group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-bold text-stone-900 group-hover:text-stone-700 text-lg">{req.title}</div>
                                                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 transition-colors" />
                                                </div>
                                                <div className="flex gap-2 text-xs font-mono text-stone-500">
                                                    <span className="uppercase bg-stone-100 px-2 py-0.5">{req.category}</span>
                                                    <span>•</span>
                                                    <span>{req.location || 'Remoto'}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* C. ENTENDIDO - Impacto */}
                            <section>
                                <h2 className="text-2xl font-black font-archivo mb-6 flex items-center gap-3 uppercase tracking-tight">
                                    <span className="w-4 h-4 bg-orange-500 inline-block" />
                                    Impacto & Earnings
                                </h2>
                                <div className="space-y-4">
                                    {contributions.length > 0 ? (
                                        contributions.map((c: any) => (
                                            <ContributionItem key={c.id} contribution={c} />
                                        ))
                                    ) : (
                                        <div className="p-6 bg-orange-50/50 border border-orange-100 text-orange-800 text-sm font-medium">
                                            Participá opinando en proyectos para ganar Aura y dividendos. Tus comentarios hacen la diferencia.
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </TabsContent>

                    <TabsContent value="client">
                        <div className="text-center py-24 bg-stone-50 border border-stone-200">
                            <h3 className="text-xl font-bold text-stone-900 mb-2">Tablero de Cliente Detallado</h3>
                            <p className="text-stone-500 mb-6 max-w-md mx-auto">Próximamente podrás ver el estado detallado de cada hito, aprobar pagos y gestionar contratos.</p>
                            <Link href="/create-offering">
                                <Button className="font-bold rounded-none bg-stone-900 text-white hover:bg-stone-800 uppercase tracking-wider">
                                    Crear Nuevo Proyecto
                                </Button>
                            </Link>
                        </div>
                    </TabsContent>

                    <TabsContent value="provider">
                        <div className="text-center py-24 bg-stone-50 border border-stone-200">
                            <h3 className="text-xl font-bold text-stone-900 mb-2">Buscador Avanzado</h3>
                            <p className="text-stone-500 mb-6">Filtrá oportunidades por ubicación, presupuesto y rubro.</p>
                            <Button variant="outline" className="font-bold rounded-none border-stone-300 text-stone-500 cursor-not-allowed">Próximamente</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
