'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

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

interface ProviderDashboardClientProps {
    opportunities: Opportunity[]
}

export function ProviderDashboardClient({ opportunities }: ProviderDashboardClientProps) {
    const t = useTranslations()

    return (
        <div className="container py-10 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-outfit">{t("dashboard.provider.title")}</h1>
                    <p className="text-muted-foreground mt-2">{t("dashboard.provider.subtitle")}</p>
                </div>
                <Button variant="outline">{t("dashboard.provider.updateProfile")}</Button>
            </div>

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
                                    <span>{slice.request.location}</span>
                                </div>
                                <div className="font-medium text-foreground">
                                    {t("dashboard.provider.project} {slice.request.title")}
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
        </div>
    )
}
