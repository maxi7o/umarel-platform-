# Umarel-First Launch Guide 🚀

This version is optimized for the "Umarel-First" launch, focusing on community earnings and viral growth.

## 1. Database Updates
Run the following command to update your database schema with the new Aura and Wallet tables:

```bash
npx drizzle-kit push
```

## 2. Seed Data
Populate the database with 250 realistic requests and active Umarels to simulate a buzzing community:

```bash
# Install dependencies for seed script
npm install @faker-js/faker uuid @types/uuid

# Run the seed script
npx tsx scripts/seed_umarel_launch.ts
```

## 3. Daily Payouts
The daily payout system runs automatically at 00:00 UTC via Vercel Cron.
To trigger it manually for testing:

1. Go to `/admin/umarel-launch`
2. Click "Trigger Now"

## 4. Key Features Enabled

### 🧙 Wizard-First Flow
- All new requests redirect immediately to the Wizard.
- "Help the community earn money" banner is active.
- Earnings banner shows "$1,250,000" (placeholder) to drive FOMO.

### 💰 Wallet & Aura
- Users have a public Aura Level (Bronze -> Diamond).
- Wallet page (`/wallet`) shows earnings and a "Top Umarels" leaderboard.
- Withdraw button is prominent.

### 🌍 Landing Page
- New Hero text focusing on Umarel earnings.
- "Start earning as an umarel" CTA.

## 5. Deployment
Ensure the following environment variables are set in Vercel:
- `CRON_SECRET`: A secure random string for the daily payout job.
- `OPENAI_API_KEY`: For the Wizard AI.
- `DATABASE_URL`: Your PostgreSQL connection string.

## 6. Admin Dashboard
Visit `/admin/umarel-launch` to monitor the daily pool and top contributors.

---
**Ready to Launch!** 🚀
