'use client';

import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { ImageIcon, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

interface PortfolioItem {
    id: string;
    fileUrl: string;
    description: string | null;
    isVerified: boolean;
}

interface PortfolioGridProps {
    items: PortfolioItem[];
}

export function PortfolioGrid({ items }: PortfolioGridProps) {
    if (items.length === 0) {
        return (
            <Card className="border-dashed border-2 bg-slate-50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                    <p className="font-medium">No verified evidence yet.</p>
                    <p className="text-sm">This user hasn't uploaded any project photos.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
                <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0 relative">
                        <AspectRatio ratio={4 / 3}>
                            <Image
                                src={item.fileUrl}
                                alt={item.description || 'Project Evidence'}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </AspectRatio>

                        {item.isVerified && (
                            <Badge className="absolute top-2 right-2 bg-green-500/90 hover:bg-green-500 backdrop-blur-sm gap-1">
                                <ShieldCheck className="h-3 w-3" />
                                Verified
                            </Badge>
                        )}

                        {item.description && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white text-sm font-medium line-clamp-2">
                                    {item.description}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
