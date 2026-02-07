# 🚀 Quick Setup Guide - Missing Credentials

## ✅ **YOU ALREADY HAVE (No action needed)**
- Supabase (Database & Auth)
- OpenAI (AI Features)
- Google Gemini (Backup AI)
- MercadoPago (Argentina Payments)
- Meta Pixel (Analytics)

---

## 📋 **WHAT YOU NEED TO PROVIDE**

### 🔴 **HIGH PRIORITY (For Production)**

#### 1. Resend (Email Service)
**Why:** Send transactional emails (payment confirmations, notifications)  
**Action:** 
1. Go to https://resend.com
2. Sign up (free tier: 100 emails/day)
3. Create API key
4. Provide: `RESEND_API_KEY`

**Cost:** Free tier sufficient for testing, $20/mo for 50k emails

---

#### 2. MercadoPago Webhook Configuration
**Why:** Secure payment webhooks  
**Action:**
1. Go to MercadoPago Developer Dashboard
2. Configure webhook endpoint: `https://umarel.org/api/webhooks/mercadopago`
3. Get webhook secret
4. Provide: `MERCADOPAGO_WEBHOOK_SECRET`

**Cost:** Free (part of existing MercadoPago account)

---

### 🟡 **MEDIUM PRIORITY (For Production)**

#### 3. Redis (Cloud Queue)
**Why:** Background job processing in production  
**Action:**
1. Go to https://upstash.com
2. Create free Redis database
3. Copy connection URL
4. Provide: `REDIS_URL`

**Cost:** Free tier available (10k commands/day)  
**Note:** Local Redis works for development

---

#### 4. Google Analytics 4
**Why:** Website analytics (Meta Pixel already tracking)  
**Action:**
1. Go to https://analytics.google.com
2. Create GA4 property
3. Get Measurement ID (format: `G-XXXXXXXXXX`)
4. Provide: `G-XXXXXXXXXX` to replace placeholder

**Cost:** Free

---

### 🟢 **LOW PRIORITY (Optional)**

#### 5. Stripe (International Payments)
**Why:** Accept payments outside Argentina  
**Action:**
1. Go to https://stripe.com
2. Create account
3. Get API keys
4. Provide: `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Cost:** Free to set up, 2.9% + $0.30 per transaction  
**Note:** Only needed if expanding beyond Argentina

---

#### 6. Sentry (Error Tracking)
**Why:** Monitor production errors  
**Action:**
1. Go to https://sentry.io
2. Create project
3. Get DSN
4. Provide: `NEXT_PUBLIC_SENTRY_DSN`

**Cost:** Free tier (5k events/month)

---

## 📝 **HOW TO PROVIDE CREDENTIALS**

Just paste them in chat like this:
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
REDIS_URL=redis://default:xxxxx@xxxxx.upstash.io:6379
G-MEASUREMENT_ID=G-XXXXXXXXXX
```

I'll automatically update your `.env` file.

---

## ⚡ **RECOMMENDED ORDER**

**For immediate production launch:**
1. ✅ Resend (emails are critical)
2. ✅ MercadoPago Webhook Secret (payment security)
3. ⏭️ Google Analytics (nice to have)
4. ⏭️ Redis/Upstash (can use local for now)

**Can wait:**
- Stripe (only if going international)
- Sentry (helpful but not critical)
