# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables

Create `.env.production`:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/umarel_prod

# Stripe (LIVE KEYS)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Mercado Pago (PRODUCTION)
MERCADOPAGO_ACCESS_TOKEN=APP_USR_...
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR_...

# Email Service
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=https://umarel.com
NODE_ENV=production

# Platform Config
PLATFORM_FEE_PERCENTAGE=15
COMMUNITY_REWARD_PERCENTAGE=3
MIN_WITHDRAWAL_AMOUNT=50000
```

### 2. Database Migration

```bash
# Backup production database first!
pg_dump umarel_prod > backup_$(date +%Y%m%d).sql

# Run migration
psql -d umarel_prod -f migrations/add_payment_system.sql

# Verify tables created
psql -d umarel_prod -c "\dt"
```

### 3. Webhook Configuration

**Stripe**:
1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://umarel.com/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
4. Copy webhook secret to `.env.production`

**Mercado Pago**:
1. Go to https://www.mercadopago.com.ar/developers/panel/notifications/webhooks
2. Add URL: `https://umarel.com/api/webhooks/mercadopago`
3. Select topic: `payment`

### 4. Email Service Setup

**Using Resend** (Recommended):
```bash
npm install resend
```

Update `lib/notifications/email.ts`:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(notification: EmailNotification) {
  await resend.emails.send({
    from: 'Umarel <noreply@umarel.com>',
    to: notification.to,
    subject: notification.subject,
    html: notification.html,
  });
}
```

### 5. Build & Deploy

```bash
# Install dependencies
npm ci --production

# Build
npm run build

# Start production server
npm start
```

---

## Testing Procedures

### Manual Testing Checklist

#### Payment Flow (Stripe)
- [ ] Navigate to `/checkout/:sliceId`
- [ ] Click "Pay with Stripe"
- [ ] Enter test card: `4242 4242 4242 4242`
- [ ] Verify redirect to success page
- [ ] Check database: `escrow_payments.status = 'in_escrow'`
- [ ] Verify email sent to provider

#### Payment Flow (Mercado Pago)
- [ ] Navigate to `/checkout/:sliceId`
- [ ] Click "Pay with Mercado Pago"
- [ ] Complete MP checkout
- [ ] Verify redirect to success page
- [ ] Check database: `escrow_payments.status = 'in_escrow'`

#### Approval Flow
- [ ] Provider marks slice complete
- [ ] Client receives email notification
- [ ] Client clicks "Approve & Release Payment"
- [ ] Verify payment captured
- [ ] Check database: `escrow_payments.status = 'released'`
- [ ] Verify provider receives email
- [ ] Check community rewards distributed

#### Wallet & Withdrawal
- [ ] Navigate to `/wallet`
- [ ] Verify balance displays correctly
- [ ] Click "Withdraw"
- [ ] Enter amount and Mercado Pago email
- [ ] Verify withdrawal processes
- [ ] Check database: wallet balance updated

#### Heart System
- [ ] Navigate to request with comments
- [ ] Click heart button on comment
- [ ] Verify hearts count increments
- [ ] Check database: `comment_hearts` record created

---

## Load Testing

### Using Artillery

```bash
npm install -g artillery

# Create artillery.yml
artillery run artillery.yml
```

**artillery.yml**:
```yaml
config:
  target: 'https://umarel.com'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Browse and checkout"
    flow:
      - get:
          url: "/browse"
      - get:
          url: "/pricing"
      - get:
          url: "/wallet"
```

### Expected Performance
- Page load: < 2s
- API response: < 500ms
- Webhook processing: < 1s

---

## Monitoring Setup

### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

**sentry.client.config.ts**:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Logging

Add to critical routes:
```typescript
console.log('[PAYMENT] Escrow created:', { escrowId, amount });
console.error('[PAYMENT] Failed to capture:', error);
```

### Metrics to Track
- Payment success rate
- Average escrow duration
- Community reward distribution
- Email delivery rate
- API response times

---

## Security Hardening

### 1. Rate Limiting

```bash
npm install express-rate-limit
```

### 2. CORS Configuration

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://umarel.com' },
        ],
      },
    ];
  },
};
```

### 3. Environment Variables

Never commit `.env.production` to git!

Add to `.gitignore`:
```
.env.production
.env.local
```

---

## Rollback Plan

### If Issues Occur

1. **Revert Database Migration**:
```sql
DROP TABLE IF EXISTS comment_hearts;
DROP TABLE IF EXISTS user_wallets;
DROP TABLE IF EXISTS community_rewards;
DROP TABLE IF EXISTS escrow_payments;

-- Restore from backup
psql -d umarel_prod < backup_YYYYMMDD.sql
```

2. **Revert Code**:
```bash
git revert HEAD
npm run build
pm2 restart umarel
```

3. **Disable Payment Features**:
- Comment out payment routes in `app/api`
- Hide pricing page
- Show maintenance message

---

## Go-Live Checklist

### Pre-Launch
- [ ] All tests passing
- [ ] Database migrated
- [ ] Webhooks configured
- [ ] Email service working
- [ ] Monitoring setup
- [ ] Backup created
- [ ] Team notified

### Launch
- [ ] Deploy to production
- [ ] Verify health checks
- [ ] Test one real transaction
- [ ] Monitor logs for errors
- [ ] Check webhook deliveries

### Post-Launch
- [ ] Monitor for 24 hours
- [ ] Review error logs
- [ ] Check payment success rate
- [ ] Gather user feedback
- [ ] Document any issues

---

## Support Contacts

**Stripe Support**: https://support.stripe.com
**Mercado Pago Support**: https://www.mercadopago.com.ar/ayuda
**Resend Support**: https://resend.com/support

---

## Emergency Procedures

### Payment Not Processing
1. Check Stripe/MP dashboard
2. Verify webhook delivery
3. Check server logs
4. Contact payment provider support

### Database Issues
1. Check connection pool
2. Review slow queries
3. Check disk space
4. Contact database admin

### Email Not Sending
1. Check Resend dashboard
2. Verify API key
3. Check email templates
4. Review bounce rate

---

**Status**: Ready for Production ✅  
**Last Updated**: 2025-11-30  
**Version**: 1.0.0
