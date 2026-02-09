import { CreateOfferingForm } from '@/components/offering/create-offering-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function CreateOfferingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations('createOffering');
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/${locale}/ingresar?next=/${locale}/crear-talento`);
    }

    return (
        <div className="container mx-auto max-w-3xl py-10 px-6">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold font-archivo mb-2">{t('pageTitle')}</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    {t('pageSubtitle')}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('cardTitle')}</CardTitle>
                    <CardDescription>
                        {t('cardDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateOfferingForm userId={user.id} />
                </CardContent>
            </Card>
        </div>
    );
}
