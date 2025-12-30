'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, ArrowRight, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Opportunity {
    id: string
    title: string
    description: string
    estimatedEffort: string
    status: string
    request: {
        title: string
        location: string
    }
}

// Reuse UnifiedCard or similar for consistency?
import { UnifiedCard } from '@/components/browse/unified-card'

import { CurrencyDisplay } from '@/components/currency-display'
import { Sparkles, DollarSign, Wallet } from 'lucide-react'

interface ProviderDashboardStats {
    totalEarnings: number
    pendingEarnings: number
    auraScore: number
}

interface ProviderDashboardClientProps {
    opportunities: Opportunity[]
    stats?: ProviderDashboardStats
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    offerings?: any[]
}

export function ProviderDashboardClient({ opportunities, stats, offerings = [] }: ProviderDashboardClientProps) {
    const t = useTranslations()

    return (
        <div className="container py-10 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-outfit">{t("dashboard.provider.title")}</h1>
                    <p className="text-muted-foreground mt-2">{t("dashboard.provider.subtitle")}</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/create-offering">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            {t("nav.offerServices")}
                        </Button>
                    </Link>
                    <Button variant="outline">{t("dashboard.provider.updateProfile")}</Button>
                </div>
            </div>

            {/* Stats Overview */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Earnings
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                <CurrencyDisplay amount={stats.totalEarnings} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                +20.1% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Payouts
                            </CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                <CurrencyDisplay amount={stats.pendingEarnings} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Available on next cycle
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Aura Score
                            </CardTitle>
                            <Sparkles className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {stats.auraScore} <span className="text-sm font-normal text-muted-foreground">/ 100</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Top rated provider (Gold Tier)
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Tabs defaultValue="opportunities" className="w-full">
                <TabsList>
                    <TabsTrigger value="opportunities">Recent Opportunities</TabsTrigger>
                    <TabsTrigger value="offerings">My Services ({offerings.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="opportunities" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {opportunities.map((slice: Opportunity) => (
                            <Card key={slice.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                                            {slice.estimatedEffort}
                                        </Badge>
                                        <Badge variant="outline">{slice.status}</Badge>
                                    </div>
                                    <CardTitle className="text-xl">{slice.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{slice.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>{slice.request.title}</span>
                                        </div>
                                        <div className="font-medium text-foreground">
                                            {t("dashboard.provider.project")} {slice.request.location}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link href={`/requests/demo`} className="w-full">
                                        <Button className="w-full gap-2">
                                            {t("dashboard.provider.viewDetails")} <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="offerings" className="mt-6">
                    {offerings.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {offerings.map((offering) => (
                                <UnifiedCard
                                    key={offering.id}
                                    item={offering}
                                    type="offering"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
                            <h3 className="text-lg font-semibold mb-2">No active services</h3>
                            <p className="text-muted-foreground mb-6">Create a service offering to start getting booked directly.</p>
                            <Link href="/create-offering">
                                <Button>Create Service</Button>
                            </Link>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
