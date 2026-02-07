---
name: N8N Scout Workflow
description: A blueprint for an automated lead discovery workflow on n8n.
---

# The "Umarel Scout" Workflow (N8N)

This workflow is designed to automate the discovery of high-intent posts on social media and flag them for engagement in a Google Sheet or Notion database.

## Prerequisites

1.  **n8n Instance:** Self-hosted (via Docker) or Cloud.
2.  **Meta Developer App:**
    *   `Instagram Public Content Access` feature approved (hard to get).
    *   *Alternative:* Use rapidapi.com or apify.com scrapers for Instagram/Facebook if official API access is restricted.
3.  **OpenAI API Key** (for intent analysis).
4.  **Google Sheets / Notion** (for storing leads).
5.  **Telegram / Slack** (for notifications).

## Workflow Nodes Structure

### 1. Trigger: Scheduled Search (Every 1-4 Hours)
*   **Node:** `Schedule Trigger`
*   **Settings:** Interval: 60 minutes.

### 2. Source A: Instagram Hashtags (Official API or Apify)
*   **Node:** `HTTP Request` (or specific Instagram node if available).
*   **Action:** Search recent media for tags: `#albañil`, `#remodelacion`, `#obraencasa`, `#plomero`.
*   **Output:** List of posts with `caption`, `media_url`, `permalink`.

### 3. Source B: Twitter/X (Optional)
*   **Node:** `Twitter` (or HTTP Request to X API).
*   **Query:** `"busco albañil" near:"Buenos Aires" within:10km`.

### 4. Filter: Deduplication
*   **Node:** `Function` (Custom JS) or `If`.
*   **Logic:** Check against a database of previously processed Post IDs to avoid processing the same post twice.

### 5. AI Analysis: Intent Scoring (The "Brain")
*   **Node:** `OpenAI` (Chat Model).
*   **Model:** `gpt-4o-mini` or `gpt-3.5-turbo`.
*   **System Prompt:**
    > You are an intent classifier for a construction marketplace.
    > Analyze the following post caption.
    > Determine if the user is explicitly LOOKING for a service (scam risk, need help, asking for recommendations).
    > Return JSON: { "intent_score": 0-10, "reason": "...", "suggested_reply": "..." }
    > 
    > If intent_score < 7, stop.
    > If intent_score >= 7, write a helpful, non-salesy reply suggesting 'El Entendido' as a safe escrow platform.

### 6. Router: High Intent?
*   **Node:** `If`
*   **Condition:** `json.intent_score >= 7`.

### 7. Action: Store Lead
*   **Node:** `Google Sheets` / `Notion`.
*   **Action:** Add Row.
*   **Fields:**
    *   `Date`: {{ $now }}
    *   `Platform`: Instagram/Twitter
    *   `User`: {{ $json.username }}
    *   `Post Link`: {{ $json.permalink }}
    *   `Post Text`: {{ $json.caption }}
    *   `AI Reply`: {{ $json.suggested_reply }}
    *   `Status`: Pending Review

### 8. Notification: Alert Human
*   **Node:** `Telegram` / `Slack`.
*   **Message:** "🚨 New Lead Found! [Link] - {{ $json.reason }}"

## Implementation Steps

1.  **Install n8n:** `docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8n/n8n`
2.  **Set Credentials:** Add OpenAI and Google Sheets credentials in n8n.
3.  **Build Workflow:** Drag and drop the nodes as described above.
4.  **Test:** Run with a sample search query to verify AI output.

## Alternative: "Poor Man's Scout" (Browser Extension)
If APIs are blocked, use a browser automation tool like "Browserflow" or "Automa".
1.  Record a sequence: Go to Group -> Scroll -> Scrape Posts -> Send to Webhook (n8n).
2.  Process via Webhook in n8n starting from Step 5.
