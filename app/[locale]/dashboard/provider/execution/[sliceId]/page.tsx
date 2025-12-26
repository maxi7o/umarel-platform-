import { SliceWorksheet } from "@/components/execution/slice-worksheet";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ExecutionPage({ params }: { params: { sliceId: string | string[] } }) { // Adjusted params type safely
    const t = useTranslations('execution');
    const sliceIdStr = Array.isArray(params.sliceId) ? params.sliceId[0] : params.sliceId;

    return (
        <div className="min-h-screen bg-stone-950 py-8 px-4">
            <div className="max-w-3xl mx-auto mb-6">
                <Link href="/dashboard/provider" className="inline-flex items-center text-stone-400 hover:text-stone-200 transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('backToDashboard')}
                </Link>
            </div>
            <SliceWorksheet sliceId={sliceIdStr} />
        </div>
    );
}
