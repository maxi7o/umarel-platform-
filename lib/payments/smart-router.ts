import { z } from 'zod';

// ==========================================
// 1. Core Definitions
// ==========================================

export enum PaymentProvider {
    STRIPE_US = 'stripe_us',
    STRIPE_MX = 'stripe_mx',
    MERCADO_PAGO = 'mercado_pago',
    DLOCAL = 'dlocal',
    EBANX = 'ebanx',
    CRYPTO = 'crypto',
    PAYPAL = 'paypal',
}

export enum Region {
    GLOBAL = 'global',
    US = 'us',
    EU = 'eu',
    BRAZIL = 'br',
    ARGENTINA = 'ar',
    MEXICO = 'mx',
    COLOMBIA = 'co',
    CHILE = 'cl',
    PERU = 'pe',
}

export interface PaymentContext {
    amountCents: number;
    currency: string;
    buyerCountryCode: string; // ISO 2-letter (e.g., 'AR', 'BR', 'US')
    buyerId: string;
    isCryptoPreferred?: boolean;
}

export interface ProcessingOption {
    provider: PaymentProvider;
    estimatedFeePercent: number;
    estimatedFeeFixed: number; // in cents
    settlementTimeDays: number;
    reason: string;
    priority: number; // 1 = highest
}

// ==========================================
// 2. Strategy Logic
// ==========================================

export class SmartPaymentRouter {

    /**
     * Determines the best payment processors for a given transaction
     * based on the Strategic Payment Decision Matrix.
     */
    static getOptions(ctx: PaymentContext): ProcessingOption[] {
        const country = ctx.buyerCountryCode.toUpperCase();
        const options: ProcessingOption[] = [];

        // 1. Crypto Override (User preference or specific use case)
        if (ctx.isCryptoPreferred) {
            options.push({
                provider: PaymentProvider.CRYPTO,
                estimatedFeePercent: 1.0,
                estimatedFeeFixed: 0,
                settlementTimeDays: 0,
                reason: 'User preferred crypto. Lowest fees, instant settlement.',
                priority: 1
            });
            return options; // If crypto is forced, return only crypto
        }

        // 2. Region-Specific Routing
        switch (country) {
            case 'AR': // Argentina
                options.push(
                    {
                        provider: PaymentProvider.MERCADO_PAGO,
                        estimatedFeePercent: 6.99, // Approx high fee but local
                        estimatedFeeFixed: 0,
                        settlementTimeDays: 14,
                        reason: 'Local cards & consistency for Argentine buyers.',
                        priority: 1
                    },
                    {
                        provider: PaymentProvider.DLOCAL,
                        estimatedFeePercent: 5.0,
                        estimatedFeeFixed: 0,
                        settlementTimeDays: 7,
                        reason: 'Alternative for local APMs.',
                        priority: 2
                    }
                );
                break;

            case 'BR': // Brazil
                options.push(
                    {
                        provider: PaymentProvider.DLOCAL, // or EBANX
                        estimatedFeePercent: 4.5,
                        estimatedFeeFixed: 20, // cents approx
                        settlementTimeDays: 7,
                        reason: 'Best for PIX and Boleto support.',
                        priority: 1
                    },
                    {
                        provider: PaymentProvider.MERCADO_PAGO,
                        estimatedFeePercent: 4.99,
                        estimatedFeeFixed: 0,
                        settlementTimeDays: 14,
                        reason: 'Strong brand recognition in Brazil.',
                        priority: 2
                    }
                );
                break;

            case 'MX': // Mexico
                options.push(
                    {
                        provider: PaymentProvider.STRIPE_MX,
                        estimatedFeePercent: 3.6,
                        estimatedFeeFixed: 300, // 3 MXN approx
                        settlementTimeDays: 7,
                        reason: 'Stripe MX offers local processing rates.',
                        priority: 1
                    },
                    {
                        provider: PaymentProvider.DLOCAL,
                        estimatedFeePercent: 4.5,
                        estimatedFeeFixed: 0,
                        reason: 'Essential for OXXO cash payments.',
                        settlementTimeDays: 7,
                        priority: 2
                    }
                );
                break;

            case 'US':
            case 'ES':
            case 'GB':
            case 'DE':
            case 'FR':
                // Global / Western Markets
                options.push(
                    {
                        provider: PaymentProvider.STRIPE_US,
                        estimatedFeePercent: 2.9,
                        estimatedFeeFixed: 30, // 30 cents
                        settlementTimeDays: 2,
                        reason: 'Gold standard for credit card acceptance and speed.',
                        priority: 1
                    },
                    {
                        provider: PaymentProvider.PAYPAL,
                        estimatedFeePercent: 3.49,
                        estimatedFeeFixed: 49,
                        settlementTimeDays: 1,
                        reason: 'High trust wallet for western buyers.',
                        priority: 2
                    }
                );
                break;

            default:
                // Rest of World / LatAm (CO, PE, CL, etc.)
                // Default to dLocal for LatAm coverage or Stripe US for global
                if (['CO', 'CL', 'PE', 'UY', 'PY'].includes(country)) {
                    options.push({
                        provider: PaymentProvider.DLOCAL,
                        estimatedFeePercent: 5.0,
                        estimatedFeeFixed: 0,
                        settlementTimeDays: 7,
                        reason: 'Deep local APM coverage in LatAm (PSE, WebPay, etc).',
                        priority: 1
                    });
                }

                // Fallback for everyone
                options.push({
                    provider: PaymentProvider.STRIPE_US,
                    estimatedFeePercent: 2.9, // +1.5% international maybe
                    estimatedFeeFixed: 30,
                    settlementTimeDays: 2,
                    reason: 'Global fallback for international cards.',
                    priority: 3
                });
                break;
        }

        return options.sort((a, b) => a.priority - b.priority);
    }
}

// ==========================================
// 3. usage Example
// ==========================================
/*
const context = {
    amountCents: 5000, // $50.00
    currency: 'BRL',
    buyerCountryCode: 'BR',
    buyerId: 'user_123'
};

const routingOptions = SmartPaymentRouter.getOptions(context);
const bestOption = routingOptions[0];

console.log(`Routing to: ${bestOption.provider} because: ${bestOption.reason}`);
*/
