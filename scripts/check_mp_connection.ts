
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    console.log('🔌 Checking MercadoPago Connection...');
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) {
        console.error('❌ MERCADOPAGO_ACCESS_TOKEN not found in env');
        process.exit(1);
    }

    console.log('Key found:', token.substring(0, 10) + '...');

    const client = new MercadoPagoConfig({ accessToken: token });
    const preference = new Preference(client);

    try {
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: 'test-item',
                        title: 'Test Connection',
                        quantity: 1,
                        unit_price: 10
                    }
                ]
            }
        });

        console.log('✅ Connection Successful!');
        console.log('Preference ID:', result.id);
        console.log('Sandbox Init Point:', result.sandbox_init_point);

    } catch (e: any) {
        console.error('❌ Connection Failed:', e.message);
        if (e.cause) console.error('Cause:', e.cause);
        process.exit(1);
    }
}

main();
