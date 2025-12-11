"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardUser {
    id: string;
    name: string;
    avatarUrl: string | null;
    auraLevel: 'bronze' | 'silver' | 'gold' | 'diamond';
    totalSavings: number;
    rank: number;
}

interface AuraLeaderboardProps {
    users: LeaderboardUser[];
}

export function AuraLeaderboard({ users }: AuraLeaderboardProps) {
    const getLevelColor = (level: string) => {
        switch (level) {
            case 'diamond': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
            case 'gold': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
            case 'silver': return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
            default: return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0,
        }).format(amount / 100);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Top Umarels of the Week
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {users.map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                        index === 1 ? 'bg-gray-100 text-gray-700' :
                                            index === 2 ? 'bg-orange-100 text-orange-700' :
                                                'bg-white text-gray-500'
                                    }`}>
                                    {index + 1}
                                </div>
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarImage src={user.avatarUrl || undefined} />
                                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{user.name}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getLevelColor(user.auraLevel)}`}>
                                        {user.auraLevel.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm">{formatCurrency(user.totalSavings)}</p>
                                <p className="text-xs text-muted-foreground">saved</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
