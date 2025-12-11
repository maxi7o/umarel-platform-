# Environment Variables Setup

## Required Variables

Copy this to your `.env.local` file:

```env
# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here

# Mercado Pago (Test Mode)
MERCADOPAGO_ACCESS_TOKEN=APP_USR_your_token_here
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR_your_key_here

# Email Service
RESEND_API_KEY=re_your_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Platform Settings
PLATFORM_FEE_PERCENTAGE=15
COMMUNITY_REWARD_PERCENTAGE=3
MIN_WITHDRAWAL_AMOUNT=50000
```

## Getting API Keys

### Stripe
1. Sign up at https://dashboard.stripe.com/register
2. Go to Developers → API keys
3. Copy test keys (starts with `sk_test_` and `pk_test_`)
4. For webhooks: Developers → Webhooks → Add endpoint

### Mercado Pago
1. Sign up at https://www.mercadopago.com.ar
2. Go to Your integrations → Credentials
3. Copy test credentials
4. For webhooks: Notifications → Webhooks

### Resend
1. Sign up at https://resend.com
2. Create API key
3. Verify domain (for production)

## Production Variables

For production, use live keys and update `NEXT_PUBLIC_APP_URL` to your domain.
