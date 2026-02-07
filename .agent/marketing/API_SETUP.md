# 🔐 Social Media API Setup for Auto-Posting

## Overview
To enable auto-posting, you need API credentials for each platform. This guide covers the setup for Instagram, Facebook, and Twitter/X.

---

## 📸 Instagram + Facebook (Meta Graph API)

Both Instagram and Facebook use the same Meta Graph API.

### Prerequisites
- Facebook Business Page
- Instagram Business Account (linked to Facebook Page)
- Meta Developer Account

### Step 1: Create Meta App
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Click "My Apps" → "Create App"
3. Choose "Business" type
4. Fill in app details

### Step 2: Add Instagram Graph API
1. In your app dashboard, click "Add Product"
2. Find "Instagram" → Click "Set Up"
3. Go to "Instagram Basic Display" → "Create New App"
4. Fill in required URLs (use your domain)

### Step 3: Get Access Token
1. Go to "Tools" → "Graph API Explorer"
2. Select your app
3. Click "Generate Access Token"
4. Grant permissions:
   - `instagram_basic`
   - `instagram_manage_comments`
   - `pages_read_engagement`
   - `pages_manage_posts`
5. Copy the token

### Step 4: Convert to Long-Lived Token
Short-lived tokens expire in 1 hour. Convert to long-lived (60 days):

```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
```

Copy the `access_token` from the response.

### Step 5: Add to Environment
In your n8n `.env` file:
```bash
META_ACCESS_TOKEN=your_long_lived_token_here
```

### Step 6: Test
Test posting a comment:
```bash
curl -X POST "https://graph.facebook.com/v18.0/MEDIA_ID/comments" \
  -d "access_token=YOUR_TOKEN" \
  -d "message=Test comment"
```

---

## 🐦 Twitter/X API

### Prerequisites
- Twitter/X account
- Elevated API access (required for posting)

### Step 1: Apply for Developer Account
1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Click "Sign up" → "Apply for a developer account"
3. Choose "Hobbyist" → "Making a bot"
4. Fill in the application (mention it's for lead engagement)
5. Wait for approval (usually 1-2 days)

### Step 2: Create Project & App
1. Once approved, go to Developer Portal
2. Create a new Project
3. Create an App within the project
4. Note your API Key and API Secret

### Step 3: Request Elevated Access
1. In your app settings, click "Elevated"
2. Fill in the use case form
3. Mention: "Automated customer service responses to construction-related inquiries"
4. Wait for approval (1-3 days)

### Step 4: Generate Bearer Token
1. Go to your app → "Keys and tokens"
2. Click "Generate" under "Bearer Token"
3. Copy the token

### Step 5: Add to Environment
In your n8n `.env` file:
```bash
TWITTER_BEARER_TOKEN=your_bearer_token_here
```

### Step 6: Test
Test posting a reply:
```bash
curl -X POST "https://api.twitter.com/2/tweets" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Test reply","reply":{"in_reply_to_tweet_id":"TWEET_ID"}}'
```

---

## 🚨 Important Notes

### Rate Limits
- **Instagram**: 200 comments/hour
- **Facebook**: 200 comments/hour
- **Twitter**: 300 tweets/3 hours (Elevated), 50/24h (Free)

### Best Practices
1. **Start slow**: Even with auto-post, limit to 5-10 posts/day initially
2. **Monitor spam flags**: If you get flagged, reduce frequency
3. **Rotate messages**: Don't post identical replies
4. **Human-like timing**: Add random delays (5-30 mins)

### Fallback Mode
If API credentials are not set, the auto-poster will:
- Log the attempt
- Mark lead as "approved" (not "posted")
- Send you a Telegram notification to post manually

---

## 🧪 Testing Auto-Post

### Test in Simulation Mode
The auto-post API will simulate posting if credentials are missing:

```bash
curl -X POST "https://elentendido.ar/api/admin/scout/auto-post" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "test-123",
    "platform": "instagram",
    "postUrl": "https://instagram.com/p/test",
    "replyText": "Test reply"
  }'
```

Response (without credentials):
```json
{
  "success": true,
  "posted": false,
  "simulated": true,
  "platform": "instagram"
}
```

### Test with Real Credentials
Once credentials are set, test on a real post:
1. Find a test post (your own or a friend's)
2. Manually trigger the auto-post API
3. Verify the comment appears
4. Check Telegram notification

---

## 🔄 Token Refresh

### Meta Tokens
Long-lived tokens expire after 60 days. Set a calendar reminder to refresh:
1. Go to Graph API Explorer
2. Generate new token
3. Update `.env` file
4. Restart n8n: `docker-compose restart`

### Twitter Tokens
Bearer tokens don't expire, but can be revoked. If posting fails:
1. Regenerate token in Developer Portal
2. Update `.env`
3. Restart n8n

---

## 🛡️ Security

- **Never commit tokens** to git
- Store tokens in `.env` file only
- Use environment variables in n8n
- Rotate tokens every 30-60 days
- Monitor API usage in platform dashboards

---

## ❓ Troubleshooting

### "Invalid Access Token"
- Token expired → Regenerate
- Wrong permissions → Re-grant scopes
- App not approved → Check app status

### "Rate Limit Exceeded"
- Reduce posting frequency in n8n
- Add delays between posts
- Check platform dashboard for limits

### "Comment Not Appearing"
- Post may be private
- User may have blocked comments
- Platform spam filter triggered

---

## 📊 Monitoring

Track auto-post performance:
1. Check Supabase `scout_leads` table
2. Filter by `status = 'posted'`
3. Review `engagement_result` field
4. Adjust strategy based on response rates

---

Ready to set up? Start with **Meta API** (covers both Instagram and Facebook), then add Twitter if needed.
