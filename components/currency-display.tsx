import { useMemo } from 'react';

interface CurrencyDisplayProps {
    amount: number; // in cents
    currency: string;
    locale?: string;
    className?: string; // for styling
}

export function CurrencyDisplay({ amount, currency, locale = 'es-AR', className }: CurrencyDisplayProps) {
    const formatted = useMemo(() => {
        try {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2,
            }).format(amount / 100);
        } catch (e) {
            console.warn('Currency formatting failed', e);
            return `${currency} ${(amount / 100).toFixed(2)}`;
        }
    }, [amount, currency, locale]);

    return <span className={className}>{formatted}</span>;
}
