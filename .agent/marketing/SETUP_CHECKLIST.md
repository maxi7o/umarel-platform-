# 🚀 Scout Agent - Full Automation Checklist

## Phase 1: Account Setup (15 mins)

### ✅ Apify
- [ ] Sign up at https://apify.com
- [ ] Verify email
- [ ] Go to Settings → Integrations
- [ ] Copy API Token
- [ ] Paste in `.agent/marketing/.env` as `APIFY_API_TOKEN`

### ✅ Telegram Bot
- [ ] Open Telegram, search for @BotFather
- [ ] Send `/newbot`
- [ ] Follow prompts to create bot
- [ ] Copy the token
- [ ] Paste in `.env` as `TELEGRAM_BOT_TOKEN`
- [ ] Search for @userinfobot
- [ ] Send `/start` to get your chat ID
- [ ] Paste in `.env` as `TELEGRAM_CHAT_ID`

### ✅ Supabase Database
- [ ] Go to your Supabase project
- [ ] Click "SQL Editor"
- [ ] Copy contents of `.agent/marketing/schema.sql`
- [ ] Paste and run
- [ ] Verify `scout_leads` table exists in Table Editor
- [ ] Go to Settings → API
- [ ] Copy `URL` and `service_role` key
- [ ] Paste in `.env`

---

## Phase 2: VPS Setup (30 mins)

### ✅ Hostinger VPS
- [ ] Purchase VPS (minimum 1GB RAM)
- [ ] Note the IP address
- [ ] SSH into server: `ssh root@YOUR_IP`

### ✅ Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
docker --version  # Should show version
```

### ✅ Upload Files
```bash
mkdir -p /opt/scout-agent
cd /opt/scout-agent
```

Upload these files from `.agent/marketing/`:
- `docker-compose.yml`
- `.env.example` → rename to `.env`

### ✅ Configure Environment
```bash
nano .env
```

Fill in ALL the values:
- `N8N_PASSWORD` - Choose a strong password
- `N8N_HOST` - Your domain or IP
- `POSTGRES_PASSWORD` - Another strong password
- `OPENAI_API_KEY` - Already provided
- `APIFY_API_TOKEN` - From Phase 1
- `SUPABASE_URL` - From Phase 1
- `SUPABASE_SERVICE_KEY` - From Phase 1
- `TELEGRAM_BOT_TOKEN` - From Phase 1
- `TELEGRAM_CHAT_ID` - From Phase 1

### ✅ Start Services
```bash
docker-compose up -d
docker-compose logs -f  # Check for errors
```

### ✅ Access n8n
- Open browser: `http://YOUR_IP:5678`
- Login with credentials from `.env`
- You should see the n8n dashboard

---

## Phase 3: Configure n8n Workflow (20 mins)

### ✅ Import Workflow
- [ ] In n8n, click "Workflows" → "Add workflow" → "Import from File"
- [ ] Upload `.agent/marketing/workflow-scout-full.json`
- [ ] Workflow should appear

### ✅ Configure Credentials
Click on each node and add credentials:

**Apify nodes:**
- [ ] Click "Apify Instagram Scraper"
- [ ] Add credential → Paste your Apify API token
- [ ] Repeat for "Apify Facebook Scraper"

**OpenAI node:**
- [ ] Click "OpenAI Analysis"
- [ ] Add credential → Paste OpenAI API key

**Supabase nodes:**
- [ ] Click "Check if Exists"
- [ ] Add credential → Paste Supabase URL and service key
- [ ] Repeat for "Insert to Supabase"

**Telegram node:**
- [ ] Click "Telegram Notification"
- [ ] Add credential → Paste bot token

### ✅ Configure Apify Actors
- [ ] In "Apify Instagram Scraper" node:
  - Actor ID: `apify/instagram-hashtag-scraper`
  - Hashtags: `["reformas", "albañil", "plomero"]`
  - Results limit: `50`

- [ ] In "Apify Facebook Scraper" node:
  - Actor ID: `apify/facebook-groups-scraper`
  - Group URLs: Add public groups (find via Facebook search)
  - Results limit: `30`

### ✅ Test Workflow
- [ ] Click "Execute Workflow" button
- [ ] Wait 2-3 minutes
- [ ] Check for errors in execution log
- [ ] Check Supabase `scout_leads` table for new entries
- [ ] Check Telegram for notification

### ✅ Enable Schedule
- [ ] Click "Schedule Trigger" node
- [ ] Set to run every 4 hours
- [ ] Save workflow
- [ ] Activate workflow (toggle switch at top)

---

## Phase 4: Admin Dashboard (5 mins)

### ✅ Deploy to Production
The admin interfaces are already built:
- [ ] Push code to GitHub (already done)
- [ ] Vercel will auto-deploy
- [ ] Access `/admin/scout` for manual analysis
- [ ] Access `/admin/scout-queue` for automated queue

### ✅ Test Queue Interface
- [ ] Go to https://elentendido.ar/admin/scout-queue
- [ ] You should see leads from n8n
- [ ] Try approving/rejecting a lead
- [ ] Status should update

---

## Phase 5: Monitor & Tune (Ongoing)

### ✅ First 48 Hours
- [ ] Check Telegram notifications
- [ ] Review lead quality in `/admin/scout-queue`
- [ ] Adjust intent score threshold if needed (in n8n workflow)
- [ ] Add/remove hashtags and groups

### ✅ Weekly Review
- [ ] Check Apify usage (should stay in free tier)
- [ ] Check OpenAI costs (should be ~$2-5/month)
- [ ] Review conversion rate (approved leads → actual engagement)

---

## Troubleshooting

### n8n won't start
```bash
docker-compose logs n8n
# Look for errors, usually missing env vars
```

### No leads appearing
- Check n8n execution log for errors
- Verify Apify actors are running (check Apify dashboard)
- Verify Supabase credentials are correct

### Telegram not sending
- Verify bot token is correct
- Verify chat ID is correct
- Send a message to your bot first to activate it

---

## Next Steps After Setup

1. **Week 1:** Monitor quality, don't post yet
2. **Week 2:** Start manually posting approved replies
3. **Week 3:** Build auto-poster (I can help with this)
4. **Week 4:** Full automation with human oversight

---

## Support

If you get stuck:
1. Check n8n logs: `docker-compose logs -f`
2. Check Supabase logs in dashboard
3. Check Apify run history
4. Ask me for help with specific errors

---

**Estimated Total Setup Time:** 1-2 hours
**Monthly Cost:** $7-15
**Expected Leads:** 20-50 high-intent leads/week
