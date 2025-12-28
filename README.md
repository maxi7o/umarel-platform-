# Umarel Platform

**Community Wisdom for Every Project**

Umarel is a trust-based marketplace that connects clients with skilled providers through transparent project execution, escrow-protected payments, and community-driven quality assurance.

---

## 🎯 Core Philosophy

**"Experts you can trust. Projects you can verify."**

Umarel reimagines the gig economy by:
- **Eliminating information asymmetry** through AI-assisted task breakdown
- **Protecting all parties** with escrow payments and dispute resolution
- **Rewarding community wisdom** through the Aura system and daily dividends
- **Ensuring quality** through verified evidence and transparent execution

---

## 🏗️ Platform Architecture

### **1. Request-Slice-Evidence Model**

**Why:** Traditional freelance platforms treat projects as monolithic contracts, leading to scope creep, disputes, and payment delays.

**How it works:**
- **Requests** are broken down into **Slices** (atomic, verifiable tasks)
- Each Slice has clear deliverables, deadlines, and escrow-protected payment
- Providers submit **Evidence** (photos, videos, documents) to prove completion
- Clients review and release funds, or open disputes if needed

**Benefits:**
- Reduces project risk through incremental delivery
- Creates a portfolio of verified work for providers
- Enables precise pricing and time estimation

### **2. Escrow Payment System**

**Why:** Payment disputes are the #1 source of friction in freelance work.

**Implementation:**
```
Total Payment = Slice Price + Platform Fee (12%)
├─ Slice Amount (89%) → Held in escrow → Released to provider
├─ Platform Fee (8%) → Covers payment gateway fees + operations
└─ Community Pool (3%) → Distributed daily to top Umarels
```

**Key Features:**
- **Auto-release**: Funds automatically release 24 hours after completion if no dispute
- **Mock payments**: `USE_MOCK_PAYMENTS=true` for testing without real transactions
- **Multi-gateway**: Supports Stripe, Mercado Pago, and dLocal based on user location

**Files:**
- `lib/payments/factory.ts` - Payment provider selection
- `lib/payments/mock-adapter.ts` - Testing adapter
- `app/api/slices/[id]/release/route.ts` - Fund release logic

### **3. AI-Powered Wizard**

**Why:** Clients often struggle to articulate requirements, leading to mismatched expectations.

**How it works:**
1. Client describes their need in natural language
2. AI Wizard asks clarifying questions (budget, timeline, location, etc.)
3. System generates recommended Slices with market-based pricing
4. Client can edit, merge, or approve the breakdown

**Benefits:**
- Reduces back-and-forth negotiation
- Provides realistic cost estimates
- Creates structured, actionable tasks

**Files:**
- `app/api/wizard/message/route.ts` - AI conversation handler
- `lib/ai/wizard-service.ts` - Slice generation logic

### **4. Aura & Reputation System**

**Why:** Traditional 5-star ratings are easily gamed and don't reflect actual value creation.

**How Aura is earned:**
- **Providers**: Complete slices on time, receive positive client reviews
- **Umarels** (Community): Provide helpful advice that saves money or improves outcomes
- **Clients**: Timely payments, clear communication

**Aura Levels:**
- 🥉 Bronze (0-999 points)
- 🥈 Silver (1,000-4,999 points)
- 🥇 Gold (5,000-19,999 points)
- 💎 Diamond (20,000+ points)

**Weekly Score:**
Calculated from helpful contributions in the last 7 days (comments, Q&A, dispute resolutions)

**Files:**
- `app/[locale]/profile/[id]/page.tsx` - Profile display
- `components/profile/aura-card.tsx` - Aura visualization

### **5. Daily Dividend Engine**

**Why:** To incentivize community participation and reward those who add value beyond transactions.

**How it works:**
1. Every released payment contributes 3% to the Community Pool
2. Daily at midnight (UTC), the system:
   - Identifies top contributors (by savings generated, helpful comments)
   - Distributes the pool proportionally to their impact
   - Updates user balances

**Cron Jobs:**
- `/api/cron/daily-payout` - Runs daily at 00:00 UTC
- `/api/cron/auto-release` - Runs hourly to release eligible escrows

**Files:**
- `app/api/cron/daily-payout/route.ts` - Distribution logic
- `lib/services/payroll-service.ts` - Calculation engine
- `vercel.json` - Cron schedule configuration

### **6. Dispute Resolution & AI Judge**

**Why:** Manual dispute resolution doesn't scale and is prone to bias.

**Process:**
1. Client or Provider opens a dispute (pauses auto-release timer)
2. AI Judge analyzes:
   - Original request description
   - Slice requirements
   - Submitted evidence (images, videos)
   - Chat history
3. Generates a recommendation (Pay Provider / Refund Client / Split)
4. Admin reviews and makes final decision

**Product Insights:**
Every dispute generates structured feedback stored in `product_insights` table for continuous improvement.

**Files:**
- `app/api/slices/[id]/dispute/route.ts` - Dispute creation
- `lib/ai/admin-helper.ts` - AI analysis
- `app/admin/disputes/page.tsx` - Admin dashboard

### **7. Proof of Arrival**

**Why:** Service providers (plumbers, electricians) often face "no-show" accusations.

**How it works:**
- Provider clicks "Start Job" and uploads a photo/video with GPS metadata
- Evidence is timestamped and verified
- Creates an immutable record of job commencement

**Files:**
- `app/api/slices/[id]/start/route.ts` - Start job endpoint
- `components/slice/slice-card.tsx` - UI for starting work

---

## 🌍 Internationalization

**Supported Languages:** 20+ (English, Spanish, Chinese, Hindi, Arabic, Portuguese, etc.)

**Implementation:**
- `next-intl` for server and client-side translations
- Locale detection via `Accept-Language` header
- User can manually switch languages via `LanguageSwitchPrompt`

**Files:**
- `i18n/config.ts` - Locale configuration
- `messages/` - Translation files (JSON)
- `middleware.ts` - Locale routing

---

## 🔐 Authentication & Security

**Provider:** Supabase Auth
- Email/Password login
- Magic link authentication
- OAuth providers (Google, GitHub) ready to enable

**Security Features:**
- Row-level security (RLS) on database
- CSRF protection via Next.js
- Environment-based secrets (never committed to git)

**Files:**
- `lib/supabase/` - Auth utilities
- `app/[locale]/login/` - Login UI

---

## 💳 Payment Integration

### **Supported Gateways:**

1. **Stripe** (Global, default for non-LATAM)
2. **Mercado Pago** (Argentina, Brazil, Mexico, etc.)
3. **dLocal** (Emerging markets - planned)

### **Smart Router:**
Automatically selects the best payment provider based on:
- User's country
- Transaction amount
- Currency

**Files:**
- `lib/payments/smart-router.ts` - Provider selection
- `app/api/checkout/route.ts` - Unified checkout

---

## 📊 Admin Dashboard

**Features:**
- Dispute management with AI recommendations
- Manual payout triggers for testing
- User metrics and platform health

**Access:**
Run `npx tsx scripts/make_admin.ts <user-email>` to grant admin role.

**Routes:**
- `/admin/disputes` - Dispute war room
- `/admin/umarel-launch` - Dividend engine controls

---

## 🚀 Deployment

### **Environments:**

1. **Production** (`main` branch)
   - Domain: `umarel-platform.vercel.app`
   - Database: Production Supabase
   - Payments: Live mode

2. **Staging** (`staging` branch)
   - Domain: `umarel.org` (for UAT)
   - Database: Production Supabase (shared)
   - Payments: **Mock mode** (`USE_MOCK_PAYMENTS=true`)

### **Environment Variables:**

**Required:**
```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=https://umarel.org
```

**Optional (for full functionality):**
```bash
OPENAI_API_KEY=sk-...          # AI Wizard
RESEND_API_KEY=re_...          # Email notifications
STRIPE_SECRET_KEY=sk_live_...  # Stripe payments
MERCADOPAGO_ACCESS_TOKEN=...   # Mercado Pago
DISCORD_WEBHOOK_URL=...        # Internal alerts
```

**Testing:**
```bash
USE_MOCK_PAYMENTS=true         # Enable mock payment flow
```

### **Deployment Process:**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "feat: your feature"
   git push origin main
   ```

2. **Vercel Auto-Deploy:**
   - Monitors `main` and `staging` branches
   - Runs `npm run build`
   - Executes tests (`npm test`)
   - Deploys on success

3. **Cron Jobs:**
   Configured in `vercel.json`:
   - Daily Payout: 00:00 UTC
   - Auto-Release: Every hour

---

## 🧪 Testing

### **Unit Tests:**
```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
```

**Coverage:**
- Payment adapters
- Wizard logic
- Dispute resolution
- Escrow calculations

### **Integration Tests:**
```bash
npx tsx scripts/verify_auto_release.ts
npx tsx scripts/verify_dividend_engine.ts
```

### **UAT Checklist:**

**As Client:**
1. ✅ Post a request
2. ✅ Go through Wizard questions
3. ✅ Review AI-generated slices
4. ✅ Accept a provider's bid
5. ✅ Pay via mock checkout
6. ✅ Review evidence
7. ✅ Release funds

**As Provider:**
1. ✅ Browse requests
2. ✅ Submit a bid
3. ✅ Start job (upload proof of arrival)
4. ✅ Complete job (upload evidence)
5. ✅ Receive payment

**As Umarel (Community):**
1. ✅ Answer questions
2. ✅ Provide helpful comments
3. ✅ Earn Aura points
4. ✅ Receive daily dividends

---

## 📁 Project Structure

```
umarel.org/
├── app/
│   ├── [locale]/              # Internationalized pages
│   │   ├── page.tsx          # Landing page
│   │   ├── profile/[id]/     # User profiles
│   │   ├── requests/[id]/    # Request detail
│   │   └── slices/[id]/      # Slice detail
│   ├── api/                  # API routes
│   │   ├── checkout/         # Payment initiation
│   │   ├── slices/[id]/      # Slice actions (start, complete, release)
│   │   ├── cron/             # Scheduled jobs
│   │   └── webhooks/         # Payment provider callbacks
│   └── admin/                # Admin dashboard
├── components/
│   ├── landing/              # Marketing pages
│   ├── profile/              # Aura & portfolio
│   ├── payments/             # Checkout UI
│   └── ui/                   # Shadcn components
├── lib/
│   ├── ai/                   # AI services (Wizard, Judge)
│   ├── payments/             # Payment adapters
│   ├── services/             # Business logic
│   ├── db/                   # Database schema & queries
│   └── notifications/        # Email & Discord
├── scripts/                  # Utility scripts
├── __tests__/                # Test suites
└── messages/                 # i18n translations
```

---

## 🎨 Design System

**Fonts:**
- **Sans:** Inter (body text)
- **Display:** Outfit (headings)
- **Serif:** Instrument Serif (quotes, emphasis)
- **Handwriting:** Caveat (personality touches)

**Colors:**
- **Primary:** Orange (#FF6B35) - Energy, trust
- **Secondary:** Stone (#78716C) - Stability, craftsmanship
- **Accent:** Blue (#3B82F6) - Professionalism

**Components:**
Built with Shadcn UI + Radix primitives for accessibility.

---

## 🔄 Recent Changes (Dec 2024)

### **Build Fixes:**
- ✅ Resolved TypeScript errors in Stripe API integration
- ✅ Fixed Drizzle ORM query chaining issues
- ✅ Added null checks for metrics calculations
- ✅ Corrected payment method enum values

### **Infrastructure:**
- ✅ Configured DNS (Squarespace → Vercel)
- ✅ Set up staging environment on `umarel.org`
- ✅ Enabled mock payments for UAT
- ✅ Deployed cron jobs for auto-release and dividends

### **Features Completed:**
- ✅ User profiles with Aura display
- ✅ Portfolio grid with verified evidence
- ✅ Weekly score calculation
- ✅ Auto-release fund logic
- ✅ AI dispute resolution
- ✅ Email notifications (Resend)

---

## 🚧 Roadmap

### **Q1 2025:**
- [ ] Skills verification matrix
- [ ] Advanced search & filters
- [ ] Mobile app (React Native)
- [ ] Video evidence support

### **Q2 2025:**
- [ ] Referral program
- [ ] Provider insurance
- [ ] Multi-currency support
- [ ] API for third-party integrations

---

## 📞 Support

**For Developers:**
- GitHub Issues: [Report bugs](https://github.com/maxi7o/umarel-platform/issues)
- Documentation: `/docs` folder

**For Users:**
- Help Center: `/help` (coming soon)
- Email: support@umarel.org

---

## 📄 License

Proprietary - All rights reserved.

---

**Built with ❤️ by the Umarel team**

*Last updated: December 28, 2024*
