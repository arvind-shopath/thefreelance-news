# The FreeLance (news.thefreelance.in) - Master Architecture & Deployment Guide

## 1. GitHub Repository
- **Repository URL:** https://github.com/arvind-shopath/thefreelance-news
- **Visibility:** Public (Provides unlimited free GitHub Actions minutes 24/7)
- **Branch:** `main`

## 2. GitHub Actions Secrets (Encrypted & Active)
The following secrets are already encrypted and active in your GitHub repository:
- `SUPABASE_URL`: `https://gtykamxacxgftmjyinyc.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY`: Configured
- `GEMINI_API_KEYS`: All 6 active Gemini keys configured with automatic rotation

## 3. GitHub Actions Workflows (Active 24/7 Crons)
1. **Google Trends Hindi Automation (`trends-hindi.yml`):** Runs every 30 minutes.
2. **Google Trends International (`trends-en.yml`):** Runs hourly at minute 10 for US, CA, GB, SG.
3. **Daily Visual Stories (`visual-stories.yml`):** Runs daily at 8:25 AM IST.
4. **Manual Trigger (`manual-trigger.yml`):** Trigger any pipeline on-demand from the GitHub Actions tab.

## 4. Netlify Deployment (Frontend)
To deploy the reader layer to Netlify ($0 cost):
1. Go to [netlify.com](https://netlify.com) and click **"Add new site" -> "Import an existing project" -> "GitHub"**.
2. Select repository: `arvind-shopath/thefreelance-news`.
3. Configure Build Settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/.next`
4. In **Environment variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://gtykamxacxgftmjyinyc.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eWthbXhhY3hnZnRtanlpbnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMDc1OTcsImV4cCI6MjEwODY4MzU5N30.2-Y7kgITjX9ml5x7FEDrnid5EpVAsqLbk5wwBitpinc`
   - `NEXT_PUBLIC_SITE_URL` = `https://news.thefreelance.in`
5. Connect Custom Domain:
   - In Netlify: **Domain management -> Add domain alias -> `news.thefreelance.in`**
   - In DNS: Add a `CNAME` record for `news` pointing to your Netlify site.
