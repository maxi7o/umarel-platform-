
import { db } from '@/lib/db';
import { slices, users, wizardMessages } from '@/lib/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { FeedCard } from '@/components/feed/feed-card';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
    title: 'Live Feed | Umarel',
    description: 'Watch construction happening in real-time.',
};

export default async function FeedPage() {
    // Fetch recent active slices
    // In a real app we'd paginate this
    const feedItems = await db
        .select({
            id: slices.id,
            title: slices.title,
            description: slices.description,
            imageUrl: slices.imageUrl,
            status: slices.status,
            createdAt: slices.createdAt,
            authorId: users.id,
            authorName: users.fullName,
            authorAvatar: users.avatarUrl,
        })
        .from(slices)
        .leftJoin(users, eq(users.id, slices.requestorId)) // showing requestor as "author" of the slice need
        .orderBy(desc(slices.createdAt))
        .limit(20);

    return (
        <div className="min-h-screen bg-neutral-50/50 dark:bg-black">
            <div className="container max-w-lg mx-auto py-6 px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold font-heading">Activity Feed 🏗️</h1>
                        <p className="text-sm text-muted-foreground">Real-time updates from sites near you</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {feedItems.map(item => (
                        <FeedCard
                            key={item.id}
                            item={{
                                ...item,
                                author: {
                                    id: item.authorId || 'unknown',
                                    fullName: item.authorName || 'Anonymous',
                                    avatarUrl: item.authorAvatar
                                },
                                // Mock stats for now until we query real counts
                                stats: {
                                    likes: Math.floor(Math.random() * 20),
                                    comments: Math.floor(Math.random() * 5)
                                }
                            }}
                        />
                    ))}

                    {feedItems.length === 0 && (
                        <div className="text-center py-12">
                            <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                            <h3 className="text-lg font-medium">All Quiet on the Western Front</h3>
                            <p className="text-muted-foreground">No active slices found right now.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
