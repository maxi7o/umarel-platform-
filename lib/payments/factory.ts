
import { PaymentStrategy } from './strategy';
import { MockPaymentAdapter } from './mock-adapter';
import { StripePaymentAdapter } from './stripe-adapter';
import { MercadoPagoAdapter } from './mercadopago-adapter';

export function getPaymentStrategy(context?: { countryCode?: string }): PaymentStrategy {
    // Elastic switch based on Env or Context
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

