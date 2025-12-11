'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Medal, Star, HardHat } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface User {
    id: string
    fullName: string
    email: string
    auraPoints: number
    role: string
    createdAt: Date | string
}

interface LeaderboardUser {
    id: string
    fullName: string
    auraPoints: number
    rank: string
}

interface ProfileClientProps {
    user: User
    leaderboard: LeaderboardUser[]
}

function getRank(points: number) {
    if (points >= 5000) return { title: 'Capo Umarel', icon: Trophy, color: 'text-yellow-500' }
    if (points >= 3000) return { title: 'Maestro dei Cantieri', icon: Medal, color: 'text-gray-400' }
    if (points >= 1000) return { title: 'Apprendista', icon: Star, color: 'text-orange-500' }
    return { title: 'Osservatore', icon: HardHat, color: 'text-blue-500' }
}

export function ProfileClient({ user, leaderboard }: ProfileClientProps) {
    const t = useTranslations()
    const rank = getRank(user.auraPoints)

    return (
        <div className="container py-10 space-y-8">
            {/* Profile Header */}
            <Card className="bg-gradient-to-r from-orange-50 to-white border-orange-100">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} />
                            <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left space-y-2 flex-1">
                            <h1 className="text-3xl font-bold font-outfit">{user.fullName}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                    {rank.title}
                                </Badge>
                                <span className="text-muted-foreground">{t("profile.memberSince} {new Date(user.createdAt).getFullYear()")}</span>
                            </div>
                        </div>
                        <div className="text-center md:text-right p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                            <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">{t("profile.auraPoints")}</div>
                            <div className="text-4xl font-bold text-orange-600 font-outfit">{user.auraPoints}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Stats / Progress */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>{t("profile.yourJourney")}</CardTitle>
                        <CardDescription>{t("profile.keepContributing")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>{t("profile.currentRank} {rank.title")}</span>
                                <span>{t("profile.nextRank")} Maestro dei Cantieri</span>
                            </div>
                            <Progress value={40} className="h-3" />
                            <p className="text-xs text-muted-foreground text-right">1750 {t("profile.pointsToGo")}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-muted/30 rounded-lg">
                                <div className="text-2xl font-bold">12</div>
                                <div className="text-xs text-muted-foreground">{t("profile.slicesCreated")}</div>
                            </div>
                            <div className="p-4 bg-muted/30 rounded-lg">
                                <div className="text-2xl font-bold">45</div>
                                <div className="text-xs text-muted-foreground">{t("profile.upvotesReceived")}</div>
                            </div>
                            <div className="p-4 bg-muted/30 rounded-lg">
                                <div className="text-2xl font-bold">3</div>
                                <div className="text-xs text-muted-foreground">{t("profile.slicesCompleted")}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Leaderboard */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            {t("profile.topUmarels")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {leaderboard.map((u, index) => (
                                <div key={u.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`font-bold w-6 text-center ${index < 3 ? 'text-orange-600 text-lg' : 'text-muted-foreground'}`}>
                                            #{index + 1}
                                        </div>
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.fullName}`} />
                                            <AvatarFallback>{u.fullName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{u.fullName}</span>
                                            <span className="text-[10px] text-muted-foreground">{u.rank}</span>
                                        </div>
                                    </div>
                                    <div className="font-bold text-sm">{u.auraPoints}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
