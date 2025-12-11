'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, FileText, CheckCircle } from 'lucide-react'
import { PayButton } from '@/components/pay-button'
import { useTranslations } from 'next-intl'

interface Request {
    id: string
    title: string
    createdAt: Date
    status: string
    sliceCount: number
    quoteCount: number
}

interface CustomerDashboardClientProps {
    myRequests: Request[]
}

export function CustomerDashboardClient({ myRequests }: CustomerDashboardClientProps) {
    const t = useTranslations()

    return (
        <div className="container py-10 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-outfit">{t("dashboard.customer.title")}</h1>
                    <p className="text-muted-foreground mt-2">{t("dashboard.customer.subtitle")}</p>
                </div>
                <Link href="/requests/create">
                    <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
                        <PlusCircle className="h-4 w-4" /> {t("dashboard.customer.postNew")}
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6">
                {myRequests.map((req) => (
                    <Card key={req.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">{req.title}</CardTitle>
                                    <CardDescription>{t("dashboard.customer.postedOn} {req.createdAt.toLocaleDateString()")}</CardDescription>
                                </div>
                                <Badge>{req.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-8 text-sm">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span>{req.sliceCount} {t("dashboard.customer.slicesDefined")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                    <span>{req.quoteCount} {t("dashboard.customer.quotesReceived")}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/30 flex justify-end gap-2">
                            <Link href={`/requests/${req.id}`}>
                                <Button variant="outline">{t("dashboard.customer.viewDetails")}</Button>
                            </Link>
                            <PayButton quoteId="mock-quote" amount={5000} title={req.title} />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
