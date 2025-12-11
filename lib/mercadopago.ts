import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    console.warn('MERCADOPAGO_ACCESS_TOKEN is not set - Mercado Pago will not work');
}

export const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
    options: {
        timeout: 5000,
    },
});

export const payment = new Payment(mercadopago);
export const preference = new Preference(mercadopago);

export const MERCADOPAGO_WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET || '';
