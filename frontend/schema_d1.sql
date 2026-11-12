CREATE TABLE IF NOT EXISTS Category (
  id TEXT PRIMARY KEY,
  name TEXT,
  nameEn TEXT,
  slug TEXT UNIQUE,
  color TEXT,
  icon TEXT,
  orderIndex INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Post (
  id TEXT PRIMARY KEY,
  headline TEXT NOT NULL,
  headlineEn TEXT,
  slug TEXT,
  slugEn TEXT,
  summary TEXT,
  summaryEn TEXT,
  content TEXT,
  contentEn TEXT,
  image TEXT,
  imageCaption TEXT,
  categoryStr TEXT,
  state TEXT,
  city TEXT,
  tags TEXT,
  author TEXT,
  postType TEXT DEFAULT 'article',
  sourceUrl TEXT,
  sourceName TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  isFeatured INTEGER DEFAULT 0,
  isTrending INTEGER DEFAULT 0,
  isBreaking INTEGER DEFAULT 0,
  isPublished INTEGER DEFAULT 1,
  isEnglishOnly INTEGER DEFAULT 0,
  isGoogleTrends INTEGER DEFAULT 0,
  trendsGeo TEXT,
  seoTitle TEXT,
  seoDesc TEXT,
  keywords TEXT,
  extraMeta TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

CREATE TABLE IF NOT EXISTS StorySlide (
  id TEXT PRIMARY KEY,
  postId TEXT,
  imageUrl TEXT,
  headline TEXT,
  caption TEXT,
  orderIndex INTEGER DEFAULT 0,
  createdAt TEXT
);

CREATE TABLE IF NOT EXISTS HomepageSection (
  id TEXT PRIMARY KEY,
  sectionType TEXT,
  categorySlug TEXT,
  orderIndex INTEGER DEFAULT 0,
  isActive INTEGER DEFAULT 1,
  excludeCategories TEXT
);

CREATE TABLE IF NOT EXISTS AdPlacement (
  id TEXT PRIMARY KEY,
  slot TEXT,
  adCode TEXT,
  imageUrl TEXT,
  targetUrl TEXT,
  isActive INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS Horoscope (
  id TEXT PRIMARY KEY,
  zodiacSign TEXT,
  zodiacSignEn TEXT,
  prediction TEXT,
  predictionEn TEXT,
  luckyNumber TEXT,
  luckyColor TEXT,
  date TEXT
);

CREATE INDEX IF NOT EXISTS idx_post_slug ON Post(slug);
CREATE INDEX IF NOT EXISTS idx_post_slugEn ON Post(slugEn);
CREATE INDEX IF NOT EXISTS idx_post_categoryStr ON Post(categoryStr);
CREATE INDEX IF NOT EXISTS idx_post_createdAt ON Post(createdAt);
CREATE INDEX IF NOT EXISTS idx_post_postType ON Post(postType);
CREATE INDEX IF NOT EXISTS idx_post_isPublished ON Post(isPublished);
