# TFL AI Engine (Standalone Serverless Automation Pipeline)

This module is a completely decoupled, standalone AI pipeline designed to run on **GitHub Actions (Free Tier)** on a 24/7 schedule, or locally via CLI.

## Requirements
- Node.js 20+
- Google Gemini API Key(s)
- Supabase Project URL & Service Role Key

## Local Setup & Test

1. Navigate to `ai-engine`:
   ```bash
   cd ai-engine
   npm install
   ```

2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `GEMINI_API_KEYS`.

3. Run any pipeline:
   ```bash
   # Run Google Trends Hindi Pipeline
   npm run run:trends-hi

   # Run Google Trends International Pipeline (English Portal)
   npm run run:trends-en

   # Run Visual Stories Pipeline (10 Stories)
   npm run run:visual-stories

   # Run Daily Horoscope
   npm run run:horoscope
   ```
