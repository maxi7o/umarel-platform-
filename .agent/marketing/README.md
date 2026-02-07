# 🤖 Scout Agent - Confidence-Based Auto-Post System

## ✅ What's Been Built

You now have a **fully autonomous lead generation and engagement system** with intelligent confidence-based routing.

---

## 🎯 How It Works

### **Automated Flow (Every 4 Hours)**

```
1. SCRAPE
   ├─ Instagram: #reformas, #albañil, #plomero
   └─ Facebook: Public groups
   
2. ANALYZE (OpenAI)
   ├─ Intent Score: 0-10
   ├─ Reason: Why this score?
   └─ Reply: AI-generated response
   
3. ROUTE BY CONFIDENCE
   ├─ Score 9-10 → AUTO-POST ✅ (No review needed)
   ├─ Score 7-8  → QUEUE ⏸️ (Manual approval)
   └─ Score <7   → REJECT ❌ (Auto-discard)
   
4. NOTIFY
   ├─ Auto-posted → Telegram: "✅ Posted"
   └─ Needs review → Telegram: "⏸️ Review needed"
```

---

## 📊 Expected Performance

### Volume (per week)
- **Total posts scanned**: ~500-800
- **High-intent detected**: ~30-50
- **Auto-posted (9-10)**: ~10-15 (60-70% of high-intent)
- **Manual review (7-8)**: ~15-20 (30-40% of high-intent)

### Engagement Rate
- **Expected replies**: 5-10% of auto-posts
- **Expected conversions**: 1-2% to platform visits
- **ROI**: 2-5 new users/week

---

## 🚀 Deployment Checklist

### Phase 1: Core Setup (1 hour)
- [ ] Create Apify account → Get API token
- [ ] Create Telegram bot → Get token & chat ID
- [ ] Run Supabase schema → Create `scout_leads` table
- [ ] Set up Hostinger VPS → Install Docker
- [ ] Deploy n8n → Upload files, configure `.env`
- [ ] Import workflow → Use `workflow-scout-auto.json`
- [ ] Test run → Verify leads appear in Supabase

### Phase 2: Auto-Posting (Optional - 30 mins)
- [ ] Read `API_SETUP.md`
- [ ] Create Meta Developer App → Get access token
- [ ] (Optional) Apply for Twitter API → Get bearer token
- [ ] Add tokens to `.env`
- [ ] Restart n8n
- [ ] Test auto-post on a real post

### Phase 3: Monitor & Tune (Ongoing)
- [ ] Week 1: Monitor auto-posts, adjust if needed
- [ ] Week 2: Review manual queue, approve/reject
- [ ] Week 3: Tune intent threshold (raise to 8 if too many false positives)
- [ ] Week 4: Analyze conversion rate, optimize messaging

---

## 📁 File Structure

```
.agent/marketing/
├── DEPLOYMENT.md           # Technical deployment guide
├── SETUP_CHECKLIST.md      # Step-by-step setup
├── API_SETUP.md            # Social media API credentials
├── docker-compose.yml      # n8n server config
├── schema.sql              # Supabase database schema
├── workflow-scout-auto.json # n8n workflow (auto-post)
├── workflow-scout-full.json # n8n workflow (manual only)
└── .env.example            # Environment variables template

app/admin/
├── scout/                  # Manual analysis tool
│   ├── page.tsx
│   └── client.tsx
└── scout-queue/            # Automated queue dashboard
    ├── page.tsx
    └── client.tsx

app/api/admin/scout/
├── analyze/route.ts        # Manual analysis API
├── auto-post/route.ts      # Auto-posting API
└── queue/
    ├── route.ts            # Fetch leads
    └── [id]/route.ts       # Update lead status
```

---

## 🎛️ Admin Interfaces

### `/admin/scout` - Manual Analysis
- Paste any social media post
- Get AI intent score + suggested reply
- Copy reply to clipboard
- Use for one-off analysis

### `/admin/scout-queue` - Automated Queue
- View all detected leads
- Filter by: Pending / Approved / Rejected / Posted
- Approve/reject with one click
- See auto-posted leads with timestamps

---

## 🔐 Security & Safety

### Rate Limiting
- **Auto-posts**: Max 10-15/day (score 9-10 only)
- **Manual review**: 15-20/day (score 7-8)
- **Total engagement**: ~25-35/day

### Spam Prevention
- Duplicate detection (same post never processed twice)
- Confidence threshold (only 9-10 auto-posts)
- Human-like delays (5-30 min random wait)
- Platform rate limits respected

### Fallback Mode
If API credentials are missing:
- System runs in **simulation mode**
- Leads marked as "approved" (not "posted")
- You get Telegram notification to post manually
- No errors, just graceful degradation

---

## 💰 Cost Breakdown

| Service | Monthly Cost | Purpose |
|---------|-------------|---------|
| Hostinger VPS | $5-10 | n8n hosting |
| Apify | $0 (free tier) | Scraping (~$5 credit) |
| OpenAI | $2-5 | Intent analysis |
| Meta API | $0 | Free (posting) |
| Twitter API | $0 | Free (Elevated tier) |
| **Total** | **$7-15/month** | Full automation |

---

## 📈 Optimization Tips

### Week 1-2: Calibration
- Monitor auto-posts for quality
- Check if score 9-10 is too aggressive
- Adjust threshold in n8n if needed

### Week 3-4: Scaling
- Add more hashtags if quality is good
- Add more Facebook groups
- Increase scraping frequency (2 hours instead of 4)

### Month 2+: Advanced
- A/B test different reply styles
- Track which platforms convert best
- Build custom reply templates per category

---

## 🆘 Support

### Quick Troubleshooting
- **No leads appearing**: Check n8n logs, verify Apify credentials
- **Auto-post failing**: Check API tokens, verify platform permissions
- **Telegram not notifying**: Verify bot token, send a message to bot first

### Next Steps
1. **Start with SETUP_CHECKLIST.md** (step-by-step guide)
2. **Deploy core system first** (without auto-posting)
3. **Monitor quality for 1 week**
4. **Enable auto-posting** once confident

---

## 🎯 Success Metrics

Track these in `/admin/scout-queue`:

- **Detection accuracy**: % of leads that are actually relevant
- **Auto-post quality**: % of auto-posts that get positive engagement
- **Conversion rate**: % of engaged users who visit the site
- **Time saved**: Hours/week not spent manually searching

**Target**: 20-30 high-quality leads/week, 2-5 new users/week, 5-10 hours saved/week.

---

**Ready to launch?** Open `SETUP_CHECKLIST.md` and start checking boxes! 🚀
