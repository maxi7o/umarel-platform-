'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ShareButton } from '@/components/common/share-button';

interface FeedItem {
    id: string;
    title: string;
    description: string;
    imageUrl?: string | null;
    status: string;
    createdAt: Date;
    author: {
        id: string;
        fullName: string;
        avatarUrl?: string | null;
    };
    stats: {
        likes: number;
        comments: number;
    };
}

export function FeedCard({ item }: { item: FeedItem }) {
    return (
        <Card className="overflow-hidden mb-6 border-none shadow-md bg-white dark:bg-neutral-900">
            <CardHeader className="p-4 flex flex-row items-center gap-3">
                <Avatar className="h-10 w-10 border">
                    <AvatarImage src={item.author.avatarUrl || undefined} />
                    <AvatarFallback>{item.author.fullName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm">{item.author.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                        Posted {formatDistanceToNow(new Date(item.createdAt))} ago
                    </span>
                </div>
                <div className="ml-auto">
                    <Badge variant="secondary" className="text-xs capitalize">
                        {item.status.replace('_', ' ')}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {item.imageUrl && (
                    <div className="relative aspect-video w-full bg-neutral-100 dark:bg-neutral-800">
                        {/* Use standard img for now to simplify, ideally Next/Image */}
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}
                <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">
                        <Link href={`/slice/${item.id}`} className="hover:underline">
                            {item.title}
                        </Link>
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                        {item.description}
                    </p>
                </div>
            </CardContent>

            <CardFooter className="p-3 border-t flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50">
                <div className="flex gap-4">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Heart className="h-4 w-4" />
                        <span className="text-xs font-medium">{item.stats.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-neutral-100">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-xs font-medium">{item.stats.comments}</span>
                    </Button>
                </div>
                <ShareButton
                    title={`Check out this slice: ${item.title}`}
                    text={item.description}
                    url={`/slice/${item.id}`}
                    size="sm"
                    variant="ghost"
                />
            </CardFooter>
        </Card>
    );
}
