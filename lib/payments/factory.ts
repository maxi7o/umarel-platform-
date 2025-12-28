
import { PaymentStrategy } from './strategy';
import { MockPaymentAdapter } from './mock-adapter';
import { StripePaymentAdapter } from './stripe-adapter';
import { MercadoPagoAdapter } from './mercadopago-adapter';

export function getPaymentStrategy(context?: { countryCode?: string; provider?: 'stripe' | 'mercadopago' | 'mock' }): PaymentStrategy {
    // Explicit provider selection
    if (context?.provider === 'mercadopago') return new MercadoPagoAdapter();
    if (context?.provider === 'stripe') return new StripePaymentAdapter();

    // Elastic switch based on Env or Context
    if (process.env.USE_MOCK_PAYMENTS === 'true') {
        return new MockPaymentAdapter();
    }

    const useRealStripe = process.env.USE_REAL_PAYMENTS === 'true';

    // LATAM Countries check
    const latamCountries = ['AR', 'BR', 'MX', 'CO', 'CL', 'PE', 'UY'];
    if (context?.countryCode && latamCountries.includes(context.countryCode)) {
        return new MercadoPagoAdapter();
    }

    if (useRealStripe) {
        // Here we could implement the "Brazil Strategy" logic
        // if (context?.countryCode === 'BR') return new StripePixAdapter();
        return new StripePaymentAdapter();
    }

    // Default to Mock for Dev
    return new MockPaymentAdapter();
}

