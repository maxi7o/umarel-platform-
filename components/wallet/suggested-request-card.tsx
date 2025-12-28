
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

interface SuggestedRequestCardProps {
    request: {
        id: string;
        title: string;
        location: string | null;
        category: string | null;
        createdAt: Date | null;
    }
}

export function SuggestedRequestCard({ request }: SuggestedRequestCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-base font-semibold line-clamp-1" title={request.title}>
                        {request.title}
                    </CardTitle>
                    {request.category && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                            {request.category}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[200px]">{request.location || 'Virtual'}</span>
                </div>
            </CardHeader>
            <CardFooter className="pt-2 pb-4">
                <Link
                    href={`/requests/${request.id}`}
                    className="w-full text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center justify-end gap-1"
                >
                    Cotizar <ArrowRight className="w-3 h-3" />
                </Link>
            </CardFooter>
        </Card>
    );
}
