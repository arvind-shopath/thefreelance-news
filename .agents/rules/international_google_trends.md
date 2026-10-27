# Google Trends International English Automation Rule

- **Quota:** Exactly 5 articles published every hour to the English portal (`/en/`).
- **Sources:** Google Trends US, CA, UK (4-hour real-time surge + 24-hour daily peak).
- **Language Isolation:** Must set `isEnglishOnly: true` on every post created from trends. Hindi feed (`/`) strictly filters `isEnglishOnly: false`.
- **Fallback:** If Gemini returns fewer than 5 stories, direct Google News RSS fallback fills the remaining slots to guarantee 5 stories.
- **Schedule:** `@Cron('10 * * * *')` in `AutomationService`.
