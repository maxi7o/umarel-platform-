import { CreateOfferingForm } from '@/components/offering/create-offering-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

// Mock user for demo - in real app, get from session
const MOCK_USER_ID = 'user-123';

export default function CreateOfferingPage() {
    const t = useTranslations('createOffering');

    return (
        <div className="container mx-auto max-w-3xl py-10 px-6">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold font-outfit mb-2">{t('pageTitle')}</h1>
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
                    <CreateOfferingForm userId={MOCK_USER_ID} />
                </CardContent>
            </Card>
        </div>
    );
}
