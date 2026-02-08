
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { users, profiles, sliceEvidence, providerMetrics, wizardMessages } from '@/lib/db/schema';
import { eq, desc, and, gte, sql } from 'drizzle-orm';
import { ProfileHeader } from '@/components/profile/profile-header';
import { AuraCard } from '@/components/profile/aura-card';
import { PortfolioGrid } from '@/components/profile/portfolio-grid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, ShieldCheck, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ImageIcon } from 'lucide-react';
import { getProviderStats } from '@/lib/recommendations';
import { BiometricVerification } from '@/components/profile/biometric-verification';

export const dynamic = 'force-dynamic';

interface ProfilePageProps {
    params: {
        id: string;
        locale: string;
    };
}

export async function generateMetadata({ params }: ProfilePageProps) {
    const { id } = await params;
    const [user] = await db.select({ fullName: users.fullName }).from(users).where(eq(users.id, id));
    if (!user) return { title: 'User Not Found' };
    return { title: `${user.fullName} | Umarel Profile` };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { id } = await params;

    // Check Authentication state
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    const isOwner = currentUser?.id === id;

    // 1. Fetch User Base Data
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) notFound();

    // 2. Fetch Profile Details (Optional)
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, id));

    // 3. Fetch Provider Metrics (Optional)
    const [metrics] = await db.select().from(providerMetrics).where(eq(providerMetrics.providerId, id));
    const stats = await getProviderStats(id);

    // 4. Fetch Portfolio Evidence
    const evidence = await db
        .select()
        .from(sliceEvidence)
        .where(eq(sliceEvidence.providerId, id))
        .orderBy(desc(sliceEvidence.createdAt))
        .limit(6);

    // 5. Calculate Weekly Score (Real Data)
    // Sum of savings generated in the last 7 days from helpful messages
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [weeklyStats] = await db
        .select({
            score: sql<number>`sum(${wizardMessages.savingsGenerated})`
        })
        .from(wizardMessages)
        .where(
            and(
                eq(wizardMessages.userId, id),
                eq(wizardMessages.isMarkedHelpful, true),
                gte(wizardMessages.createdAt, sevenDaysAgo)
            )
        );

    const weeklyScore = Number(weeklyStats?.score) || 0;

    return (
        <div className="container mx-auto py-8 space-y-8 max-w-5xl">
            {/* Header Section */}
            <ProfileHeader
                userId={user.id}
                isOwner={isOwner}
                fullName={user.fullName || 'Anonymous Umarel'}
                avatarUrl={user.avatarUrl || ''}
                tagline={profile?.tagline || 'Community Contributor'}
                bio={profile?.bio || undefined}
                location={profile?.location || undefined}
                website={profile?.website || undefined}
                socialLinks={profile?.socialLinks ? (profile.socialLinks as any) : undefined}
                auraLevel={user.auraLevel || 'bronze'}
                biometricStatus={user.biometricStatus || 'none'}
            />

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Stats & Reputation */}
                <div className="space-y-6">
                    <BiometricVerification
                        userId={user.id}
                        isVerified={user.biometricStatus === 'verified'}
                    />

                    <AuraCard
                        points={user.auraPoints || 0}
                        level={user.auraLevel || 'bronze'}
                        totalSavings={user.totalSavingsGenerated || 0}
                        weeklyScore={weeklyScore}
                    />

                    {/* Provider Stats (if applicable) */}
                    {(metrics || stats.totalRatings > 0) && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                                    Provider Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Jobs Completed</span>
                                    <span className="font-bold">{metrics?.totalSlicesCompleted || stats.totalRatings}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">On-Time Rate</span>
                                    <span className="font-bold text-green-600">
                                        {metrics && metrics.totalSlicesCompleted && metrics.totalSlicesCompleted > 0
                                            ? Math.round(((metrics.totalSlicesOnTime || 0) / metrics.totalSlicesCompleted) * 100)
                                            : 100}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Rating</span>
                                    <div className="flex items-center gap-1 font-bold text-yellow-600">
                                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                        {stats.avgRating.toFixed(1)} <span className="text-xs text-muted-foreground font-normal">({stats.totalRatings})</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarDays className="h-4 w-4" />
                                <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Content Tabs */}
                <div className="md:col-span-2">
                    <Tabs defaultValue="portfolio" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="portfolio">Portfolio & Evidence</TabsTrigger>
                            <TabsTrigger value="skills">Skills & Expertise</TabsTrigger>
                        </TabsList>

                        <TabsContent value="portfolio" className="mt-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                Verified Work
                            </h3>
                            <PortfolioGrid items={evidence.map(e => ({
                                id: e.id,
                                fileUrl: e.fileUrl,
                                description: e.description,
                                isVerified: e.isVerified || false
                            }))} />
                        </TabsContent>

                        <TabsContent value="skills" className="mt-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-muted-foreground text-center py-8">
                                        Skill verification matrix coming soon...
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
