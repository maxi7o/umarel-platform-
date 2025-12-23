import { useCurrency } from '@/hooks/use-currency';

interface CurrencyDisplayProps {
    amount: number; // in cents
    currency?: string; // Optional override
    locale?: string; // Optional override
    className?: string; // for styling
}

export function CurrencyDisplay({ amount, currency, locale, className }: CurrencyDisplayProps) {
    const { format: formatContext, currency: contextCurrency, locale: contextLocale } = useCurrency();

    // If currency/locale are explicitly provided, use discrete formatter
    if (currency || locale) {
        const customFormat = new Intl.NumberFormat(locale || contextLocale, {
            style: 'currency',
            currency: currency || contextCurrency,
            minimumFractionDigits: 2,
        }).format(amount / 100);

        return <span className={className}>{customFormat}</span>;
    }

    return <span className={className}>{formatContext(amount)}</span>;
}
