import { useMemo } from 'react';
import { useMarket } from '@/lib/market-context';

export function useCurrency() {
    const { market } = useMarket();

    const formatter = useMemo(() => {
        const locale = market?.locale || 'en-US';
        const currency = market?.currency || 'USD';

        try {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        } catch (error) {
            console.error('Failed to create currency formatter:', error);
            // Fallback
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });
        }
    }, [market]);

    /**
     * Formats an amount in cents to the current market's currency string.
     * @param amountInCents The amount to format, in cents (integer).
     */
    const format = (amountInCents: number) => {
        return formatter.format(amountInCents / 100);
    };

    return {
        format,
        currency: market?.currency || 'USD',
        locale: market?.locale || 'en-US',
    };
}
