import { useTranslations } from 'next-intl';

export default function NotFound() {
    const t = useTranslations('NotFound');
    return (
        <div className="container mx-auto max-w-7xl py-20 text-center">
            <h1 className="text-4xl font-bold mb-4">404 - {t('title')}</h1>
            <p className="text-muted-foreground">{t('description')}</p>
        </div>
    );
}
