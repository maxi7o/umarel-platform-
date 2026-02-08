import { UniversalSliceIDE } from '@/components/ide/universal-slice-ide';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function IdeDemoPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="h-screen w-screen overflow-hidden">
            {/* Force full screen, bypass layout if needed */}
            <UniversalSliceIDE
                initialMode="EXPERIENCE_DESIGN"
                userRole="provider"
            />
        </div>
    );
}
