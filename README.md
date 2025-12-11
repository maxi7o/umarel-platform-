# Umarel 🚧👴🏻

**Get things done with wisdom.**

Umarel is a marketplace where experienced "Umarels" help you break down complex tasks into manageable "Service Slices".

## Features

- **Post a Need**: Describe your task and get help breaking it down.
- **Umarel Splitting Zone**: Community-driven task decomposition.
- **Service Slices**: Small, payable units of work.
- **Aura Points**: Gamification for helpful contributors.
- **Provider Dashboard**: Find work near you.
- **Customer Dashboard**: Manage requests and payments.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (Postgres)
- **ORM**: Drizzle ORM
- **Auth**: Supabase Auth
- **Payments**: Stripe

## Getting Started

1. **Clone the repo**
2. **Install dependencies**: `npm install`
3. **Set up Environment Variables**: Copy `.env.example` to `.env.local` and fill in your Supabase and Stripe keys.
4. **Run Migrations**: `npm run db:push` (using Drizzle Kit)
5. **Run Development Server**: `npm run dev`

## Deployment

Ready for Vercel. Just connect your repo and set the environment variables.

## License

MIT
