
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

interface QuoteCardProps {
    quote: {
        id: string;
        requestTitle: string;
        amount: number;
        currency: string;
        status: 'pending' | 'accepted' | 'rejected';
        createdAt: Date | null;
    }
}

export function QuoteCard({ quote }: QuoteCardProps) {
    const t = useTranslations('dashboard.provider'); // Assuming we add this namespace later or use existing keys

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        accepted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-base font-semibold truncate max-w-[200px]" title={quote.requestTitle}>
                            {quote.requestTitle}
                        </CardTitle>
                        <CardDescription className="text-xs">
                            {formatCurrency(quote.amount / 100, quote.currency)}
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className={`capitalize ${statusColors[quote.status]}`}>
                        {quote.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <Link href={`/requests/${quote.id}`} className="flex items-center gap-1 text-primary hover:underline">
                        Ver <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
