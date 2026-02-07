# 🔐 API Credentials Inventory
**Last Updated:** 2026-02-07  
**Purpose:** Persistent record of all API keys and service accounts for the Umarel/El Entendido platform

---

## ✅ **CONFIGURED & WORKING**

### 1. Supabase (Database & Auth)
- **Status:** ✅ Active
- **Project URL:** `https://fxclozsezqfyvxirorei.supabase.co`
- **Environment Variables:**
  - `NEXT_PUBLIC_SUPABASE_URL` ✅
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
  - `SUPABASE_SERVICE_ROLE_KEY` ✅
  - `DATABASE_URL` ✅
- **Location:** `.env`, `.env.test`
- **Notes:** Fully configured with pooled connection

### 2. OpenAI (AI Features)
- **Status:** ✅ Active
- **Environment Variables:**
  - `OPENAI_API_KEY` ✅
- **Location:** `.env`, `.env.test`
- **Usage:** Wizard AI, Expert Comments, Slice Optimization
- **Model:** GPT-4 Turbo Preview

### 3. Google Gemini (Alternative AI)
- **Status:** ✅ Active
- **Environment Variables:**
  - `GEMINI_API_KEY` ✅
  - `GOOGLE_GENERATIVE_AI_KEY` ✅ (same value)
- **Location:** `.env`, `.env.test`
- **Usage:** Backup AI provider, Experience Helper

### 4. MercadoPago (Argentina Payments)
- **Status:** ✅ Active
- **Environment Variables:**
  - `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` ✅
  - `MERCADOPAGO_ACCESS_TOKEN` ✅
- **Location:** `.env`, `.env.test`
- **Notes:** Primary payment processor for Argentina market

### 5. Meta Pixel (Analytics)
- **Status:** ✅ Active
- **Pixel ID:** `1888420661778370`
- **Domain Verification:** `japaa9urij6uagxze4jmi2djjvx4jt`
- **Location:** Hardcoded in `app/[locale]/layout.tsx`

### 6. Application URL
- **Status:** ✅ Configured
- **Environment Variables:**
  - `NEXT_PUBLIC_APP_URL=http://localhost:3000` ✅
- **Production URL:** `https://umarel.org` / `https://elentendido.ar`

### 7. Resend (Email Notifications)
- **Status:** ✅ Active
- **Environment Variables:**
  - `RESEND_API_KEY` ✅
- **Location:** `.env`, `.env.test`
- **Usage:** Transactional emails (earnings, approvals, payments, disputes)
- **Free Tier:** 100 emails/day
- **Configured:** 2026-02-07

### 8. MercadoPago Webhook Secret
- **Status:** ✅ Active
- **Environment Variables:**
  - `MERCADOPAGO_WEBHOOK_SECRET` ✅
- **Location:** `.env`, `.env.test`
- **Usage:** Secure webhook signature verification
- **Configured:** 2026-02-07
- **Notes:** Generated via MercadoPago developer panel

---

## ⚠️ **MISSING / NEEDS CONFIGURATION**

### 9. Stripe (International Payments)
- **Status:** ❌ Missing
- **Priority:** 🟡 Medium (if expanding beyond Argentina)
- **Environment Variables Needed:**
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - Regional account IDs (optional):
    - `STRIPE_ACCOUNT_AR` (Argentina)
    - `STRIPE_ACCOUNT_US` (USA)
    - `STRIPE_ACCOUNT_GB` (UK)
    - `STRIPE_ACCOUNT_DE` (Germany)
    - `STRIPE_ACCOUNT_FR` (France)
    - `STRIPE_ACCOUNT_ES` (Spain)
    - `STRIPE_ACCOUNT_IT` (Italy)
    - `STRIPE_ACCOUNT_CA` (Canada)
    - `STRIPE_ACCOUNT_AU` (Australia)
    - `STRIPE_ACCOUNT_JP` (Japan)
    - `STRIPE_ACCOUNT_SG` (Singapore)
    - `STRIPE_ACCOUNT_HK` (Hong Kong)
    - `STRIPE_ACCOUNT_IN` (India)
    - `STRIPE_ACCOUNT_MX` (Mexico)
    - `STRIPE_ACCOUNT_BR` (Brazil)
    - `STRIPE_ACCOUNT_NL` (Netherlands)
    - `STRIPE_ACCOUNT_IE` (Ireland)
    - `STRIPE_ACCOUNT_SE` (Sweden)
- **Action Required:** Create Stripe account at https://stripe.com
- **Notes:** Currently using mock key `sk_test_mock_key`

### 9. Redis (Queue & Cache)
- **Status:** ⚠️ Using default localhost
- **Priority:** 🟢 Medium (for production)
- **Environment Variables Needed:**
  - `REDIS_URL` (currently defaults to `redis://localhost:6379`)
- **Action Required:** 
  - For local dev: Install Redis locally (already working)
  - For production: Set up Upstash or similar cloud Redis
- **Recommended:** Upstash (free tier available) - https://upstash.com
- **Usage:** AI job queuing, caching

### 10. Google Analytics (GA4)
- **Status:** ⚠️ Placeholder
- **Priority:** 🟢 Medium
- **Current Value:** `G-MEASUREMENT_ID` (placeholder)
- **Action Required:** 
  1. Create GA4 property at https://analytics.google.com
  2. Replace placeholder in `app/[locale]/layout.tsx` (lines 130, 137)
- **Notes:** Meta Pixel is already tracking, GA4 is supplementary

### 11. Sentry (Error Tracking)
- **Status:** ❌ Optional
- **Priority:** 🟢 Low (nice to have)
- **Environment Variables Needed:**
  - `NEXT_PUBLIC_SENTRY_DSN`
- **Action Required:** Create account at https://sentry.io
- **Usage:** Production error monitoring
- **Notes:** Config files exist: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`

### 12. MercadoPago Webhook Secret
- **Status:** ⚠️ Needs configuration
- **Priority:** 🟡 High (for production)
- **Environment Variables Needed:**
  - `MERCADOPAGO_WEBHOOK_SECRET`
  - `MERCADOPAGO_REDIRECT_URI` (defaults to `${NEXT_PUBLIC_APP_URL}/api/auth/mercadopago/callback`)
- **Action Required:** Configure webhooks in MercadoPago dashboard
- **Notes:** Code references this in `lib/mercadopago.ts`

---

## 📋 **ENVIRONMENT FILE CHECKLIST**

### Current Files:
- ✅ `.env` - Main environment file (19 lines)
- ✅ `.env.test` - Test environment
- ✅ `.env.local` - Vercel OIDC token (auto-generated)

### Recommended Structure:
```bash
# Core (All environments)
.env                    # Shared defaults
.env.local              # Local overrides (gitignored)
.env.development        # Dev-specific
.env.production         # Production secrets (Vercel)
.env.test               # Test environment
```

---

## 🎯 **IMMEDIATE ACTION ITEMS**

### For Local Development (Already Working ✅):
- [x] Supabase
- [x] OpenAI
- [x] Gemini
- [x] MercadoPago
- [x] Database URL
- [x] App URL
- [x] Resend

### For Production Deployment:
1. [ ] **Redis** - Set up Upstash for production queue
3. [ ] **Google Analytics** - Replace placeholder ID
4. [ ] **MercadoPago Webhooks** - Configure secret and redirect URI
5. [ ] **Stripe** - Only if expanding beyond Argentina
6. [ ] **Sentry** - Optional error tracking

### For Marketing/Analytics:
1. [x] Meta Pixel configured
2. [ ] Google Analytics - needs real Measurement ID

---

## 🔒 **SECURITY NOTES**

1. **Never commit `.env` files to git** - Already in `.gitignore`
2. **Rotate keys if exposed** - All keys in this doc are from existing `.env` files
3. **Use different keys for test/prod** - Currently using same keys for `.env` and `.env.test`
4. **Vercel Environment Variables** - Production keys should be set in Vercel dashboard
5. **Service Role Key** - Supabase service role key has elevated permissions, keep secure

---

## 📝 **NOTES FOR ASSISTANT**

- **This file is the source of truth** for credentials status
- **Always check this file first** before asking user for API keys
- **Update this file** when new credentials are added
- **Reference this file** in future conversations to avoid re-asking

---

## 🔗 **Quick Links**

- Supabase Dashboard: https://supabase.com/dashboard/project/fxclozsezqfyvxirorei
- MercadoPago Dashboard: https://www.mercadopago.com.ar/developers
- OpenAI Platform: https://platform.openai.com/api-keys
- Google AI Studio: https://ai.google.dev/
- Meta Business Suite: https://business.facebook.com/

---

**Last Verified:** 2026-02-07 by AI Assistant
**Next Review:** When deploying to production or adding new services
