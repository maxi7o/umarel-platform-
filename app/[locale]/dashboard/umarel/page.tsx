import { db } from "@/lib/db";
import { users, requests, answers, wizardMessages } from "@/lib/db/schema";
import { count, eq, sql, desc } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { StatsHeader } from "@/components/dashboard/umarel/stats-header";
import { ActivityMap } from "@/components/dashboard/umarel/activity-map";
import { QualityReview } from "@/components/dashboard/umarel/quality-review";
import { MarketDemand } from "@/components/dashboard/umarel/market-demand";
import { redirect } from "next/navigation";

// Hardcoded user ID for the "Umarel" demo persona if no auth
// In a real app we'd use getSession()
const DEMO_UMAREL_EMAIL = "umarel0@example.com";

export default async function UmarelDashboardPage() {
    const t = await getTranslations('dashboard.umarel');

    // 1. Get Current User (Simulated for Demo)
    // 1. Get Current User (Simulated for Demo)
    // We try by ID first for robustness, then email
    const TARGET_ID = "838bc8ad-0300-468d-9faf-59ba931abdb3";
    const user = await db.query.users.findFirst({
        where: (users, { eq, or }) => or(eq(users.id, TARGET_ID), eq(users.email, DEMO_UMAREL_EMAIL))
    });

    if (!user) {
        // Fallback or redirect if seeded user missing
        return (
            <div className="p-8 text-red-600">
                <h2 className="font-bold">User Not Found</h2>
                <p>Could not find user with ID: {TARGET_ID} or Email: {DEMO_UMAREL_EMAIL}</p>
                <p className="text-sm mt-2">Please run: <code>npx tsx scripts/seed_demo_dashboard.ts</code></p>
            </div>
        );
    }

    // 2. Fetch Stats
    // Aura, Earnings, Impact (Mocked calculation for impact)
    const impactScore = Math.floor(user.auraPoints! * 1.5) + (user.totalSavingsGenerated || 0) / 1000;

    // 3. Fetch Activity Data (Hot Zones)
    // Aggregating requests by location (simple visualization)
    const hotZones = await db
        .select({
            location: requests.location,
            count: count(),
            trendingCategory: sql<string>`MAX(${requests.category})`
        })
        .from(requests)
        .groupBy(requests.location)
        .orderBy(desc(count()))
        .limit(5);

    const activityZones = hotZones.map(z => ({
        name: z.location || "Unknown",
        activeRequests: z.count,
        trendingCategory: z.trendingCategory || "General",
        intensity: z.count > 5 ? 'high' : z.count > 2 ? 'medium' : 'low'
    } as const));

    // 4. Fetch Market Demand (Top Categories)
    const demandStats = await db
        .select({
            category: requests.category,
            count: count()
        })
        .from(requests)
        .groupBy(requests.category)
        .orderBy(desc(count()))
        .limit(5);

    const demands = demandStats.map(d => ({
        category: d.category || "General",
        count: d.count,
        trend: 'up' as const // Mock trend
    }));

    // 5. Fetch Quality Review (Recent Contributions)
    // Combining answers and wizard messages
    const recentAnswers = await db.query.answers.findMany({
        where: eq(answers.answererId, user.id),
        orderBy: desc(answers.createdAt),
        limit: 5,
        with: {
            question: {
                with: {
                    request: true
                }
            }
        }
    });

    // Transform for UI
    const contributions = recentAnswers.map(a => ({
        id: a.id,
        content: a.content,
        type: 'answer' as const,
        hearts: a.upvotes || 0, // Mapping upvotes to hearts for simplicity
        upvotes: a.upvotes || 0,
        savingsGenerated: 0, // Answers don't track savings yet directly in this schema
        context: "Community Question",
        date: a.createdAt?.toLocaleDateString() || ""
    }));


    return (
        <div className="container mx-auto px-6 py-8 min-h-screen bg-stone-50/30">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-stone-900 mb-2">Buongiorno, {user.fullName}! 👴</h1>
                <p className="text-stone-500">Here is your daily report from the construction sites.</p>
            </div>

            <StatsHeader
                auraPoints={user.auraPoints || 0}
                auraLevel={user.auraLevel || 'bronze'}
                totalEarnings={0} // Wallet table is source of truth, mocked 0 for now
                impactScore={Math.floor(impactScore)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Left Column: Map & Demand */}
                <div className="space-y-8">
                    <ActivityMap zones={activityZones} />
                    <MarketDemand demands={demands} />
                </div>

                {/* Right Column: Contributions */}
                <div className="h-full">
                    <QualityReview contributions={contributions} />
                </div>
            </div>
        </div>
    );
}
