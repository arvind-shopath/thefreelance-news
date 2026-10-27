-- ==============================================================================
-- THE FREELANCE (TFL) - SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Complete $0-Cost Modular Architecture
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. POSTS TABLE (Main News & Articles Table - Bilingual)
CREATE TABLE IF NOT EXISTS public."Post" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "headline" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "summary" TEXT NOT NULL,
    "content" TEXT,
    "image" TEXT,
    "categoryStr" TEXT NOT NULL,
    "subCategory" TEXT,
    "postType" TEXT NOT NULL DEFAULT 'general', -- 'general', 'gallery', 'visual_story', 'video'

    -- Bilingual / English Portal Fields
    "headlineEn" TEXT,
    "summaryEn" TEXT,
    "contentEn" TEXT,
    "slugEn" TEXT UNIQUE,
    "language" TEXT NOT NULL DEFAULT 'hi', -- 'hi', 'en', 'both'

    -- Source & Attribution
    "sourceFeedId" TEXT,
    "sourceName" TEXT,
    "sourceUrl" TEXT,

    -- SEO & Discover Metadata
    "seoScore" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDesc" TEXT,
    "keywords" TEXT,
    "tags" TEXT,

    -- Status Flags
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isTrending" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isBreaking" BOOLEAN NOT NULL DEFAULT false,

    -- View Counts (Human vs Bot split)
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "viewCountEn" INTEGER NOT NULL DEFAULT 0,
    "humanViewCount" INTEGER NOT NULL DEFAULT 0,
    "botViewCount" INTEGER NOT NULL DEFAULT 0,
    "humanViewCountEn" INTEGER NOT NULL DEFAULT 0,
    "botViewCountEn" INTEGER NOT NULL DEFAULT 0,

    -- Google Trends Fields
    "isGoogleTrends" BOOLEAN NOT NULL DEFAULT false,
    "trendsGeo" TEXT, -- 'IN', 'US', 'CA', 'GB', 'SG', 'GLOBAL'
    "trendsKeyword" TEXT,
    "trendsTimeframe" TEXT, -- '4h' or '24h'
    "isEnglishOnly" BOOLEAN NOT NULL DEFAULT false, -- Strict isolation for /en/

    -- Indexing Status
    "googleIndexedAt" TIMESTAMPTZ,
    "indexNowIndexedAt" TIMESTAMPTZ,
    "indexingStatus" TEXT, -- 'success', 'skipped_quota', 'failed', 'pending'

    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for ultra-fast reading on Netlify ISR
CREATE INDEX IF NOT EXISTS "idx_post_created_at" ON public."Post" ("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_post_category" ON public."Post" ("categoryStr");
CREATE INDEX IF NOT EXISTS "idx_post_slug" ON public."Post" ("slug");
CREATE INDEX IF NOT EXISTS "idx_post_slug_en" ON public."Post" ("slugEn");
CREATE INDEX IF NOT EXISTS "idx_post_english_only" ON public."Post" ("isEnglishOnly");
CREATE INDEX IF NOT EXISTS "idx_post_published" ON public."Post" ("isPublished");
CREATE INDEX IF NOT EXISTS "idx_post_trends_keyword" ON public."Post" ("trendsKeyword");
CREATE INDEX IF NOT EXISTS "idx_post_post_type" ON public."Post" ("postType");

-- 2. STORY SLIDES TABLE (Web Stories / Visual Stories)
CREATE TABLE IF NOT EXISTS public."StorySlide" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "order" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "image" TEXT,
    "postId" UUID NOT NULL REFERENCES public."Post"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "idx_story_slide_post" ON public."StorySlide" ("postId", "order");

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public."Category" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "color" TEXT DEFAULT 'bg-red-600',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "parentId" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "idx_category_slug" ON public."Category" ("slug");

-- 4. HOMEPAGE SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public."HomepageSection" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "order" INTEGER NOT NULL UNIQUE,
    "sectionType" TEXT NOT NULL, -- 'category-grid', 'visual-stories', 'hero', 'photo-gallery', 'main-section'
    "title" TEXT,
    "categorySlug" TEXT,
    "excludeCategories" TEXT,
    "limit" INTEGER NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. AD PLACEMENTS TABLE
CREATE TABLE IF NOT EXISTS public."AdPlacement" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "slotName" TEXT NOT NULL UNIQUE,
    "adHtml" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. HOROSCOPES TABLE
CREATE TABLE IF NOT EXISTS public."Horoscope" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "sign" TEXT NOT NULL, -- 'aries', 'taurus', etc.
    "prediction" TEXT NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "uniq_horoscope_sign_date" UNIQUE ("sign", "date")
);
CREATE INDEX IF NOT EXISTS "idx_horoscope_date" ON public."Horoscope" ("date" DESC);

-- 7. AI KEYS TABLE (Optional backup pool storage)
CREATE TABLE IF NOT EXISTS public."AiKey" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "key" TEXT NOT NULL UNIQUE,
    "label" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsed" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public."ContactMessage" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "department" TEXT NOT NULL DEFAULT 'editorial',
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. MEDIA & ASSETS TABLE
CREATE TABLE IF NOT EXISTS public."Media" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filePath" TEXT,
    "mimeType" TEXT NOT NULL DEFAULT 'image/jpeg',
    "fileSize" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER,
    "height" INTEGER,
    "category" TEXT NOT NULL DEFAULT 'general',
    "tags" TEXT,
    "source" TEXT NOT NULL DEFAULT 'upload',
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "idx_media_category" ON public."Media" ("category");
CREATE INDEX IF NOT EXISTS "idx_media_created_at" ON public."Media" ("createdAt" DESC);

-- 10. ELECTION CONFIG TABLE
CREATE TABLE IF NOT EXISTS public."ElectionConfig" (
    "id" TEXT PRIMARY KEY DEFAULT 'default',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "headerTitle" TEXT NOT NULL DEFAULT 'चुनाव परिणाम 2026: ताज़ा रुझान व नतीजे',
    "headerBadge" TEXT DEFAULT '🔴 LIVE RESULT DESK',
    "statesData" JSONB,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Security Architecture:
-- 1. Public Reader (anon key): Read published content only.
-- 2. Automation / Admin (service_role key): Full CRUD access.
-- ==============================================================================

ALTER TABLE public."Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."StorySlide" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."HomepageSection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AdPlacement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Horoscope" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Media" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ElectionConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ContactMessage" ENABLE ROW LEVEL SECURITY;

-- Post Policies
DROP POLICY IF EXISTS "Public readers can read published posts" ON public."Post";
CREATE POLICY "Public readers can read published posts"
ON public."Post" FOR SELECT
TO anon, authenticated
USING ("isPublished" = true);

DROP POLICY IF EXISTS "Service role full access to posts" ON public."Post";
CREATE POLICY "Service role full access to posts"
ON public."Post" FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- StorySlide Policies
DROP POLICY IF EXISTS "Public readers can read story slides" ON public."StorySlide";
CREATE POLICY "Public readers can read story slides"
ON public."StorySlide" FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Service role full access to story slides" ON public."StorySlide";
CREATE POLICY "Service role full access to story slides"
ON public."StorySlide" FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Category Policies
DROP POLICY IF EXISTS "Public readers can read visible categories" ON public."Category";
CREATE POLICY "Public readers can read visible categories"
ON public."Category" FOR SELECT
TO anon, authenticated
USING ("isVisible" = true);

DROP POLICY IF EXISTS "Service role full access to categories" ON public."Category";
CREATE POLICY "Service role full access to categories"
ON public."Category" FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- HomepageSection Policies
DROP POLICY IF EXISTS "Public readers can read active sections" ON public."HomepageSection";
CREATE POLICY "Public readers can read active sections"
ON public."HomepageSection" FOR SELECT
TO anon, authenticated
USING ("isActive" = true);

DROP POLICY IF EXISTS "Service role full access to sections" ON public."HomepageSection";
CREATE POLICY "Service role full access to sections"
ON public."HomepageSection" FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- AdPlacement Policies
DROP POLICY IF EXISTS "Public readers can read active ads" ON public."AdPlacement";
CREATE POLICY "Public readers can read active ads"
ON public."AdPlacement" FOR SELECT
TO anon, authenticated
USING ("isActive" = true);

DROP POLICY IF EXISTS "Service role full access to ads" ON public."AdPlacement";
CREATE POLICY "Service role full access to ads"
ON public."AdPlacement" FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Horoscope Policies
DROP POLICY IF EXISTS "Public readers can read horoscopes" ON public."Horoscope";
CREATE POLICY "Public readers can read horoscopes"
ON public."Horoscope" FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Service role full access to horoscopes" ON public."Horoscope";
CREATE POLICY "Service role full access to horoscopes"
ON public."Horoscope" FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Contact Message Policy: Public can insert their contact message
DROP POLICY IF EXISTS "Public can submit contact messages" ON public."ContactMessage";
CREATE POLICY "Public can submit contact messages"
ON public."ContactMessage" FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access to contact messages" ON public."ContactMessage";
CREATE POLICY "Service role full access to contact messages"
ON public."ContactMessage" FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ElectionConfig Policy
DROP POLICY IF EXISTS "Public can read election config" ON public."ElectionConfig";
CREATE POLICY "Public can read election config"
ON public."ElectionConfig" FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Service role full access to election config" ON public."ElectionConfig";
CREATE POLICY "Service role full access to election config"
ON public."ElectionConfig" FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
