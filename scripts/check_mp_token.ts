
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const token = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!token) {
    console.log('❌ MERCADOPAGO_ACCESS_TOKEN is missing');
} else if (token.startsWith('TEST-')) {
    console.log('✅ Mercado Pago is in SANDBOX mode (Token starts with TEST-)');
} else if (token.startsWith('APP_USR-')) {
    console.log('⚠️ Mercado Pago is in PRODUCTION mode (Token starts with APP_USR-)');
} else {
    console.log('❓ Mercado Pago Token has unknown prefix:', token.substring(0, 5) + '...');
}
