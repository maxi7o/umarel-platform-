'use client'

import { AddSliceDialog } from './add-slice-dialog'
import { VoteButtons } from './vote-buttons'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MapPin, Calendar, User, ThumbsUp, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

interface Request {
    id: string
    title: string
    description: string
    location: string | null
    createdAt: Date | string | null
    user?: { fullName: string }
}

interface Slice {
    id: string
    title: string
    description: string
    estimatedEffort: string
    createdAt: Date | string
    creator?: { fullName: string }
    upvotes?: number
}

interface RequestDetailClientProps {
    request: Request
    requestSlices: Slice[]
    requestId: string
}

export function RequestDetailClient({ request, requestSlices, requestId }: RequestDetailClientProps) {
    const t = useTranslations()

    return (
        <div className="container py-10 space-y-8">
            {/* Request Header */}
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-outfit">{request.title}</h1>
                        <div className="flex items-center gap-4 text-muted-foreground mt-2">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{request.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{t("requestDetail.postedBy} {request.user?.fullName || 'User'")}</span>
                            </div>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-lg px-4 py-1 border-orange-200 bg-orange-50 text-orange-700">
                        {t("requestDetail.openForSlicing")}
                    </Badge>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <p className="text-lg leading-relaxed">{request.description}</p>
                    </CardContent>
                </Card>
            </div>

            <Separator />

            {/* Umarel Splitting Zone */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <span className="text-3xl">🚧</span> {t("requestDetail.splittingZone")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("requestDetail.splittingZoneDesc")}
                        </p>
                    </div>
                    <AddSliceDialog requestId={requestId} />
                </div>

                <div className="grid gap-6">
                    {requestSlices.map((slice: Slice) => (
                        <Card key={slice.id} className="border-l-4 border-l-orange-500">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">{slice.title}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {t("requestDetail.suggestedBy} {slice.creator?.fullName || 'Umarel'")} • {t("requestDetail.est} {slice.estimatedEffort")}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-sm font-medium">
                                        <ThumbsUp className="h-4 w-4 text-orange-600" />
                                        <span>{slice.upvotes || 0} Aura</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p>{slice.description}</p>
                            </CardContent>
                            <CardFooter className="bg-muted/30 flex justify-between py-3">
                                <VoteButtons sliceId={slice.id} />
                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                    <MessageSquare className="h-4 w-4" /> {t("requestDetail.discuss")}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}

                    {requestSlices.length === 0 && (
                        <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed">
                            <p className="text-muted-foreground mb-4">{t("requestDetail.noSlices")}</p>
                            <AddSliceDialog requestId={requestId} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
