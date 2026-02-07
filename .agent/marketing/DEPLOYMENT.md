# 🤖 Scout Agent - Full Automation Setup Guide

## Overview
This guide will help you deploy a fully automated lead generation system that:
1. **Scrapes** Instagram/Facebook for relevant posts every 4 hours
2. **Analyzes** intent using OpenAI
3. **Stores** high-quality leads in Supabase
4. **Notifies** you via Telegram
5. **Allows approval** via admin dashboard
6. **Auto-posts** replies (with your approval)

---

## Prerequisites

### 1. Apify Account (Free Tier)
- Sign up at [apify.com](https://apify.com)
- Get your API token from Settings → Integrations
- Free tier: $5 credit (enough for ~10,000 posts/month)

### 2. Hostinger VPS (or any VPS)
- Minimum: 1GB RAM, 1 CPU core
- Ubuntu 22.04 recommended
- Cost: ~$5-10/month

### 3. Domain/Subdomain (Optional but recommended)
- Point `scout.elentendido.ar` to your VPS IP
- Or use IP directly (less secure)

### 4. Telegram Bot (For notifications)
- Talk to [@BotFather](https://t.me/botfather)
- Create a new bot, get the token
- Get your chat ID from [@userinfobot](https://t.me/userinfobot)

---

## Step 1: Deploy n8n to Hostinger

### SSH into your VPS
```bash
ssh root@your-vps-ip
```

### Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### Create deployment directory
```bash
mkdir -p /opt/scout-agent
cd /opt/scout-agent
```

### Upload files
Upload these files from `.agent/marketing/` to `/opt/scout-agent/`:
- `docker-compose.yml`
- `.env.example` (rename to `.env` and fill in your values)

### Configure environment
```bash
nano .env
```
Fill in:
- `N8N_PASSWORD`: Your admin password
- `N8N_HOST`: Your domain (e.g., scout.elentendido.ar)
- `POSTGRES_PASSWORD`: Database password
- `OPENAI_API_KEY`: (already provided)
- `APIFY_API_TOKEN`: From Apify dashboard
- `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`: From Supabase project settings
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`: From BotFather

### Start n8n
```bash
docker-compose up -d
```

### Check logs
```bash
docker-compose logs -f n8n
```

---

## Step 2: Configure Supabase

1. Go to your Supabase project
2. Open SQL Editor
3. Run the contents of `schema.sql`
4. Verify the `scout_leads` table was created

---

## Step 3: Import n8n Workflow

1. Access n8n at `https://scout.elentendido.ar:5678` (or your domain)
2. Login with credentials from `.env`
3. Click "Workflows" → "Import from File"
4. Upload `workflow-scout-full.json` (I'll create this next)

---

## Step 4: Configure Apify Scrapers

### Instagram Scraper
1. Go to [Apify Store](https://apify.com/store)
2. Find "Instagram Hashtag Scraper"
3. Try it with hashtag: `#reformas`
4. Note the Actor ID for n8n

### Facebook Groups Scraper
1. Find "Facebook Groups Scraper"
2. Test with a public group URL
3. Note the Actor ID

---

## Step 5: Test the System

1. In n8n, manually trigger the workflow
2. Check Supabase `scout_leads` table for new entries
3. Check Telegram for notification
4. Go to `/admin/scout-queue` (I'll build this next) to approve/reject

---

## Workflow Logic

```
Every 4 hours:
  ├─ Apify: Scrape Instagram #reformas, #albañil, #plomero
  ├─ Apify: Scrape Facebook groups
  ├─ For each post:
  │   ├─ Check if already in DB (skip duplicates)
  │   ├─ OpenAI: Analyze intent
  │   ├─ If score >= 7:
  │   │   ├─ Insert to Supabase
  │   │   └─ Send Telegram notification
  │   └─ Else: Discard
  └─ End
```

---

## Next Steps After Setup

1. **Monitor for 48 hours** - Check quality of leads
2. **Tune the filters** - Adjust intent score threshold
3. **Build approval queue** - I'll create `/admin/scout-queue` page
4. **Enable auto-posting** - Once you trust the system

---

## Costs Breakdown

| Service | Cost/Month | Purpose |
|---------|-----------|---------|
| Hostinger VPS | $5-10 | n8n hosting |
| Apify | $0 (free tier) | Scraping (up to $5 credit) |
| OpenAI | ~$2-5 | Intent analysis (~500 posts/month) |
| **Total** | **~$7-15/month** | Full automation |

---

## Security Notes

- n8n is password-protected
- Use HTTPS (Let's Encrypt via Caddy/Nginx)
- Supabase RLS policies restrict access
- Never commit `.env` to git

---

Ready to proceed? I'll now create the n8n workflow JSON file.
