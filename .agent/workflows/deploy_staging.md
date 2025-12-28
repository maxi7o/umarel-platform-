---
description: How to deploy Umarel to Vercel with a Staging/Preview environment.
---

# Deploying Staging & Production Environments

This workflow describes how to set up a robust "Staging" environment using Vercel Previews and Supabase.

## 1. Vercel Configuration

1.  **Install Vercel CLI** (Optional, or use Dashboard):
    ```bash
    npm i -g vercel
    ```

2.  **Link Project:**
    In your terminal, run:
    ```bash
    vercel link
    ```
    - Follow the prompts to link to your Vercel account/team.
    - Create a new project named `umarel-platform` (or similar).

3.  **Environment Variables:**
    Go to Vercel Dashboard -> Settings -> Environment Variables.
    Add the following variables. Note clearly which are for **Production** vs **Preview/Development**.

    | Variable | Production Value | Preview / Staging Value |
    | :--- | :--- | :--- |
    | `NEXT_PUBLIC_SUPABASE_URL` | Your **PROD** URL | Your **STAGING** URL |
    | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your **PROD** Anon Key | Your **STAGING** Anon Key |
    | `SUPABASE_SERVICE_ROLE_KEY` | Your **PROD** Service Key | Your **STAGING** Service Key |
    | `DATABASE_URL` | **Pooler URL** (Transaction/5432) | **Pooler URL** (Transaction/5432) |
    | `MERCADOPAGO_APP_ID` | **PROD** Client ID | **SANDBOX** Client ID |
    | `MERCADOPAGO_CLIENT_SECRET` | **PROD** Secret | **SANDBOX** Secret |

    *Tip: uncheck "Production" when adding the Staging/Sandbox keys, and vice versa.*

## 2. Supabase Configuration (Staging)

### Option A: Two Projects (Recommended for simplicity)
1.  Create a second project in Supabase named `umarel-staging`.
2.  Use its URL/Keys for the **Preview** environment in Vercel.
3.  Keep your original project (`fxcloz...`) as **Production**.

### Option B: Supabase Branching (Pro Plan)
1.  Enable "Branching" in Supabase settings.
2.  Connect to your GitHub repo.
3.  Supabase will automatically create a database branch for every Pull Request.

## 3. Deployment Workflow

1.  **Develop features** on a local branch (e.g., `feature/refunds`).
2.  **Push** to GitHub:
    ```bash
    git push origin feature/refunds
    ```
3.  **Open Pull Request (PR)**.
4.  **Vercel** will automatically build a **Preview URL** (e.g., `umarel-git-feature-refunds.vercel.app`).
    - This URL will use the **Preview** environment variables (Staging DB + Sandbox Payments).
5.  **Test** your changes on that URL.
6.  **Merge** to `main`.
7.  **Vercel** automatically deploys to **Production** (`umarel.org`).

## 4. Verification

After setting up, run this check locally or in the Vercel console to confirm:
```bash
# Verify you are linked
vercel whoami

# Check env vars (requires login)
vercel env ls
```
