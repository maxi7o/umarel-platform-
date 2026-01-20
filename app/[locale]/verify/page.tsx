import { setRequestLocale } from 'next-intl/server';
import { VerificationWizard } from '@/components/verification/verification-wizard';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function VerifyPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
                <VerificationWizard />
            </main>

            <Footer />
        </div>
    );
}
