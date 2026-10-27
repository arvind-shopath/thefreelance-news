"use server";

import { revalidatePath, revalidateTag } from 'next/cache';
import { getPublicSupabase } from './supabase';

const API_BASE = process.env.INTERNAL_API_BASE || process.env.NEXT_PUBLIC_API_BASE || "https://thefreelance.in/api/v1";
const ADMIN_SECRET = process.env.ADMIN_API_SECRET || "tfl_master_internal_admin_token_2026_xyz9723338321";

// Helper for Supabase PostgREST direct query
async function tryFetchFromSupabase(endpoint: string) {
  const supabase = getPublicSupabase();
  if (!supabase) return null;

  try {
    // 1. Single article by slug (/articles/slug/:slug)
    if (endpoint.startsWith('/articles/slug/')) {
      const slug = decodeURIComponent(endpoint.replace('/articles/slug/', '').split('?')[0]);
      const { data, error } = await supabase
        .from('Post')
        .select('*, slides:StorySlide(*)')
        .or(`slug.eq."${slug}",slugEn.eq."${slug}"`)
        .eq('isPublished', true)
        .maybeSingle();

      if (!error && data) {
        if (Array.isArray(data.slides)) {
          data.slides.sort((a: any, b: any) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
        }
        return { data };
      }
      return null;
    }

    // 2. Categories (/categories)
    if (endpoint.startsWith('/categories')) {
      const { data, error } = await supabase
        .from('Category')
        .select('*')
        .order('name', { ascending: true });
      if (!error && data) return data;
      return null;
    }

    // 3. Homepage sections (/homepage/sections)
    if (endpoint.startsWith('/homepage/sections')) {
      const { data, error } = await supabase
        .from('HomepageSection')
        .select('*')
        .order('orderIndex', { ascending: true });
      if (!error && data) return data;
      return null;
    }

    // 4. Ads (/ads)
    if (endpoint.startsWith('/ads')) {
      const { data, error } = await supabase
        .from('AdPlacement')
        .select('*');
      if (!error && data) return data;
      return null;
    }

    // 5. Horoscopes (/feeds/horoscope)
    if (endpoint.startsWith('/feeds/horoscope')) {
      const { data, error } = await supabase
        .from('Horoscope')
        .select('*')
        .order('zodiacSign', { ascending: true });
      if (!error && data) return data;
      return null;
    }

    // 6. Articles list (/articles?...)
    if (endpoint.startsWith('/articles')) {
      const url = new URL(`https://dummy.local${endpoint}`);
      const cat = url.searchParams.get('category');
      const limit = parseInt(url.searchParams.get('limit') || '50', 10);
      const lang = url.searchParams.get('lang');
      const postType = url.searchParams.get('postType');
      const sortBy = url.searchParams.get('sortBy');

      let query = supabase.from('Post').select('*').eq('isPublished', true);

      if (cat && cat !== 'all') {
        query = query.eq('categoryStr', cat);
      }
      if (postType && postType !== 'all') {
        query = query.eq('postType', postType);
      }
      if (lang === 'en') {
        query = query.or('isEnglishOnly.eq.true,headlineEn.neq.""');
      } else if (lang === 'hi') {
        query = query.eq('isEnglishOnly', false);
      }

      if (sortBy === 'views') {
        query = query.order('views', { ascending: false });
      } else {
        query = query.order('createdAt', { ascending: false });
      }

      query = query.limit(limit);

      const { data, error } = await query;
      if (!error && data) {
        return { data, total: data.length };
      }
      return null;
    }

    // 7. AI Keys (/ai-keys)
    if (endpoint.startsWith('/ai-keys')) {
      const { data, error } = await supabase
        .from('AiKey')
        .select('*');
      if (!error && data) return data;
      return [];
    }
  } catch (err) {
    console.warn(`[Supabase Fetch Fallback] Endpoint: ${endpoint}`, err);
  }

  return null;
}

// Generic Fetcher with News Portal Caching Best Practice
export async function apiFetch(endpoint: string, options: any = {}) {
  const isGet = !options.method || options.method === 'GET';

  // For GET requests, check Supabase first if available
  if (isGet) {
    const supabaseData = await tryFetchFromSupabase(endpoint);
    if (supabaseData !== null) {
      return supabaseData;
    }
  }

  try {
    const fetchOptions: any = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': ADMIN_SECRET,
        ...options.headers,
      },
    };

    // Honor cache: 'no-store' for admin or real-time calls
    if (options.cache === 'no-store') {
      fetchOptions.cache = 'no-store';
    } else if (isGet) {
      // Stale-While-Revalidate best practice for high-traffic news portals
      fetchOptions.next = { revalidate: 60, tags: ['news-cache'] };
    } else {
      fetchOptions.cache = 'no-store';
    }

    const res = await fetch(`${API_BASE}${endpoint}`, fetchOptions);

    if (!res.ok) {
      // Extract real error message from backend
      let errMsg = `API Error ${res.status}: ${res.statusText}`;
      try {
        const errBody = await res.json();
        if (errBody?.message) {
          errMsg = Array.isArray(errBody.message) ? errBody.message.join(', ') : String(errBody.message);
        }
      } catch {}
      // Re-throw for mutations so the caller's catch block handles it
      if (!isGet) throw new Error(errMsg);
      console.error(`Fetch Error [${endpoint}]:`, errMsg);
      return null;
    }

    return await res.json();
  } catch (e: any) {
    console.error(`Fetch Error [${endpoint}]:`, e);
    // Re-throw for mutations so PostEditor / other callers show the error
    if (!isGet) throw e;
    return null;
  }
}


// Full Website Cache Invalidation Action
export async function clearAllWebsiteCacheAction() {
  try {
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/en');
    revalidatePath('/[category]', 'page');
    revalidatePath('/[category]/[slug]', 'page');
    try {
      (revalidateTag as any)('news-cache');
      (revalidateTag as any)('posts');
      (revalidateTag as any)('homepage');
    } catch {}
    return {
      success: true,
      message: 'वेबसाइट कैश सफलतापूर्वक क्लियर हो गया! पूरी वेबसाइट रीफ्रेश हो गई।',
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    console.error('[clearAllWebsiteCacheAction] Error:', err);
    return { success: false, error: err?.message || 'Cache clear error' };
  }
}

// Global DB / Initial Data
export async function getDb(lang: 'hi' | 'en' = 'hi') {
  const GUARANTEED_CATEGORIES = [
    'lifestyle',
    'religion',
    'education',
    'national',
    'states',
    'crime',
    'entertainment',
    'sports',
    'tech-auto',
    'business',
    'jobs',
    'international',
    'world',
  ];

  const categoryPromises = GUARANTEED_CATEGORIES.map(cat =>
    apiFetch(`/articles?compact=true&category=${cat}&limit=10&lang=${lang}`)
  );

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [
    articles,
    topViewed24hData,
    categories,
    homepage,
    ads,
    visualStoriesData,
    photoGalleriesData,
    ...categoryFeeds
  ] = await Promise.all([
    apiFetch(`/articles?compact=true&limit=160&lang=${lang}`), // Compact payloads safely bypass Next.js cache limit
    apiFetch(`/articles?compact=true&limit=25&sortBy=views&startDate=${oneDayAgo}&lang=${lang}`), // Guaranteed 24h most viewed
    apiFetch("/categories"),
    apiFetch("/homepage/sections"),
    apiFetch("/ads"),
    apiFetch(`/articles?postType=visual-story&limit=15&lang=${lang}`),
    apiFetch(`/articles?postType=gallery&limit=30&lang=${lang}`),
    ...categoryPromises
  ]);

  const rawPosts = articles?.data || [];
  const topViewedPosts = topViewed24hData?.data || [];
  const postMap = new Map();
  for (const p of rawPosts) postMap.set(p.id, p);
  for (const p of topViewedPosts) postMap.set(p.id, p);

  // Guarantee all homepage category sections have fresh, available candidates
  for (const catFeed of categoryFeeds) {
    const catPosts = catFeed?.data || [];
    for (const p of catPosts) {
      if (!postMap.has(p.id)) postMap.set(p.id, p);
    }
  }

  const posts = Array.from(postMap.values()).sort(
    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  console.log(`[getDb] Fetched ${posts.length} total posts across all guaranteed categories. Backend: ${API_BASE}`);
  const homepageSettings = homepage || [];

  // 1. Hero Data (Today's Topic)
  const heroSetting = homepageSettings.find((s: any) => s.sectionType === 'hero');
  const heroPosts = heroSetting ? posts.filter((p: any) => p.categoryStr === heroSetting.categorySlug) : [];

  // 2. Main Section Data (All Categories except excluded)
  const mainSetting = homepageSettings.find((s: any) => s.sectionType === 'main-section');
  const excludedSlugs = mainSetting?.excludeCategories?.split(',').map((s: string) => s.trim()) || [];
  const mainPosts = posts.filter((p: any) => !excludedSlugs.includes(p.categoryStr) && p.postType === 'general');

  // 3. Visual Stories: Newest first, strictly isolated by portal language
  const rawVisualStories = visualStoriesData?.data || [];
  const langFilteredStories = rawVisualStories.filter((s: any) =>
    lang === 'en'
      ? Boolean(s.isEnglishOnly || (s.headlineEn && s.headlineEn.trim() !== ''))
      : !s.isEnglishOnly
  );
  const combinedVisualStories = (langFilteredStories.length > 0 
    ? langFilteredStories 
    : posts.filter((p: any) => (p.postType === 'visual-story' || p.postType === 'story') && (lang === 'en' ? (p.isEnglishOnly || p.headlineEn) : !p.isEnglishOnly))
  ).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const now = new Date();
  const isToday = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  const utilityKeywords = ['मौसम', 'सोना', 'चांदी', 'पेट्रोल', 'डीजल', 'राशिफल', 'weather', 'gold', 'silver', 'petrol', 'diesel', 'rashifal'];
  const todayUtility = combinedVisualStories.filter((s: any) => isToday(s.createdAt) && utilityKeywords.some(kw => (s.headline?.includes(kw) || s.headlineEn?.toLowerCase().includes(kw) || s.slug?.includes(kw))));
  const todayOthers = combinedVisualStories.filter((s: any) => isToday(s.createdAt) && !utilityKeywords.some(kw => (s.headline?.includes(kw) || s.headlineEn?.toLowerCase().includes(kw) || s.slug?.includes(kw))));
  const olderStories = combinedVisualStories.filter((s: any) => !isToday(s.createdAt));

  const visualStories = [...todayUtility, ...todayOthers, ...olderStories].slice(0, 10);
  console.log(`[getDb][${lang}] Found ${visualStories.length} visual stories.`);

  // 4. Photo Galleries
  const fetchedPhotoGalleries = photoGalleriesData?.data || [];
  const photoGalleries = fetchedPhotoGalleries.length > 0 
    ? fetchedPhotoGalleries 
    : posts.filter((p: any) => p.postType === 'gallery');
  console.log(`[getDb] Found ${photoGalleries.length} photo galleries.`);

  // 5. Breaking News (All breaking/trending/latest posts for live carousel)
  const breakingCandidates = posts.filter((p: any) => p.isBreaking || p.isTrending || p.isFeatured);
  const breakingPosts = (breakingCandidates.length >= 3 ? breakingCandidates : posts.slice(0, 8)).slice(0, 8);
  const breakingNews = breakingPosts[0] || posts[0];

  // 6. Trending Tags — Only show tags that have at least 1 published article (prevents empty tag pages)
  const tagCounts: Map<string, number> = new Map();
  for (const p of posts) {
    if (!p.tags) continue;
    const postTags = p.tags.split(',').map((t: string) => t.trim().replace(/^#+/, ''));
    for (const t of postTags) {
      if (!t) continue;
      // Portal-specific language enforcement:
      if (lang === 'en') {
        // English portal: strictly English characters (no Devanagari)
        if (!/[\u0900-\u097F]/.test(t)) {
          tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
        }
      } else {
        // Hindi portal: prioritize Hindi Devanagari tags, do not show English Google Trends internal tags
        if (/[\u0900-\u097F]/.test(t)) {
          tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
        }
      }
    }
  }
  const excludedTags = [
    'todays-topic', 'today-topic', 'tmc-ec-symbol-decision', 'News', 'HindiNews', 'LatestNews', 'Breaking',
    'undefined', 'null', 'google-trends', 'international', 'world-affairs', 'US', 'GB', 'CA', 'IN', 'world-news'
  ];
  const trendingTags = Array.from(tagCounts.entries())
    .filter(([t, count]) => Boolean(
      t &&
      count >= 1 &&
      !excludedTags.some(ex => t.toLowerCase() === ex.toLowerCase()) &&
      !t.includes('चुनाव') &&
      t.length > 2
    ))
    .sort((a, b) => b[1] - a[1]) // Sort by frequency (most tagged first)
    .slice(0, 12)
    .map(([t]) => t);

  // 7. Horoscopes
  const horoscopes = await apiFetch("/feeds/horoscope") || [];

  return { 
    posts, 
    breakingNews,
    breakingPosts,
    trendingTags,
    horoscopes,
    visualStories,
    photoGalleries,
    categories: categories || [], 
    homepage: homepageSettings,
    ads: ads || [],
    heroPosts: heroPosts.length > 0 ? heroPosts : posts.slice(0, 10),
    mainPosts: mainPosts.length > 0 ? mainPosts : posts
  };
}

// Dedicated Dashboard Posts Fetcher with True Server-Side Pagination & Stats
export async function getDashboardPostsAction(params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  postType?: string;
  status?: string;
  portal?: string;
  source?: string;
  startDate?: string;
  endDate?: string;
} = {}) {
  const {
    page = 1,
    limit = 20,
    category = 'all',
    search = '',
    postType = 'all',
    status = 'all',
    portal = 'all',
    source = 'all',
    startDate = '',
    endDate = '',
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.set('page', String(page));
  queryParams.set('limit', String(limit));
  
  if (status === 'published') {
    queryParams.set('isPublished', 'true');
  } else if (status === 'draft') {
    queryParams.set('isPublished', 'false');
  } else {
    queryParams.set('isPublished', 'all'); // Admin dashboard shows all posts by default
  }
  
  if (category && category !== 'all') queryParams.set('category', category);
  if (postType && postType !== 'all') queryParams.set('postType', postType);
  if (search && search.trim()) queryParams.set('search', search.trim());
  if (portal && portal !== 'all') queryParams.set('portal', portal);
  if (source && source !== 'all') queryParams.set('source', source);
  if (startDate) queryParams.set('startDate', startDate);
  if (endDate) queryParams.set('endDate', endDate);
  queryParams.set('isEnglishOnly', 'all');

  const now = Date.now();
  queryParams.set('_t', String(now));

  const [articlesRes, statsRes, categoriesRes] = await Promise.all([
    apiFetch(`/articles?${queryParams.toString()}`, { cache: 'no-store' }),
    apiFetch(`/articles/stats/summary?_t=${now}`, { cache: 'no-store' }),
    apiFetch(`/categories?_t=${now}`, { cache: 'no-store' })
  ]);

  const posts = articlesRes?.data || [];
  const total = articlesRes?.total ?? posts.length;
  const totalPages = articlesRes?.totalPages ?? Math.max(1, Math.ceil(total / limit));
  const categories = categoriesRes || [];
  const stats = statsRes || {
    totalPosts: total,
    totalVisualStories: 0,
    totalGalleries: 0,
    avgSeoScore: 85
  };

  return {
    posts,
    total,
    page,
    limit,
    totalPages,
    stats,
    categories
  };
}

// Source Analytics & Velocity Fetcher
export async function getSourceStatsAction(params: {
  portal?: string;
  englishType?: string;
  startDate?: string;
  endDate?: string;
} = {}) {
  const queryParams = new URLSearchParams();
  if (params.portal && params.portal !== 'all') queryParams.set('portal', params.portal);
  if (params.englishType && params.englishType !== 'all') queryParams.set('englishType', params.englishType);
  if (params.startDate) queryParams.set('startDate', params.startDate);
  if (params.endDate) queryParams.set('endDate', params.endDate);
  queryParams.set('_t', String(Date.now()));
  return apiFetch(`/articles/stats/sources?${queryParams.toString()}`, { cache: 'no-store' });
}

// --- ARTICLE ACTIONS ---
export async function addPost(formData: FormData) {
  const data = Object.fromEntries(formData.entries()) as any;
  data.headline = data.title || data.headline;
  delete data.title;
  data.categoryStr = data.category || data.categoryStr || 'national';
  delete data.category;
  data.slug = data.slug || (data.headline ? data.headline.toLowerCase().replace(/[^a-z0-9\u0900-\u097F]+/g, '-').replace(/(^-|-$)+/g, '') : `post-${Date.now()}`);
  if (!data.slugEn && data.headlineEn) {
    data.slugEn = data.headlineEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-en';
  }
  data.isPublished = data.isPublished === 'on' || data.isPublished === true || data.isPublished === undefined;
  data.isFeatured = data.isFeatured === 'on' || data.isFeatured === true;
  data.isTrending = data.isTrending === 'on' || data.isTrending === true;
  data.isBreaking = data.isBreaking === 'on' || data.isBreaking === true;
  if (data.slides && typeof data.slides === 'string') {
    try { data.slides = JSON.parse(data.slides); } catch {}
  }

  const res = await apiFetch("/articles", {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  if (res) {
    revalidatePath('/tfl/dashboard/posts');
    revalidatePath('/');
    if (data.categoryStr) revalidatePath(`/${data.categoryStr}`);
  }
  return res;
}

export async function updatePost(id: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries()) as any;
  data.headline = data.title || data.headline;
  delete data.title;
  data.categoryStr = data.category || data.categoryStr;
  delete data.category;
  if (!data.slugEn && data.headlineEn) {
    data.slugEn = data.headlineEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-en';
  }
  data.isFeatured = data.isFeatured === 'on' || data.isFeatured === true;
  data.isTrending = data.isTrending === 'on' || data.isTrending === true;
  data.isBreaking = data.isBreaking === 'on' || data.isBreaking === true;
  data.isPublished = data.isPublished === 'on' || data.isPublished === true;
  if (data.slides && typeof data.slides === 'string') {
    try { data.slides = JSON.parse(data.slides); } catch {}
  }

  const res = await apiFetch(`/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  
  if (res) {
    revalidatePath('/tfl/dashboard/posts');
    revalidatePath('/');
    if (data.categoryStr) revalidatePath(`/${data.categoryStr}`);
    if (data.categoryStr && data.slug) revalidatePath(`/${data.categoryStr}/${data.slug}`);
  }
  return res;
}


export async function deletePost(id: string) {
  const res = await apiFetch(`/articles/${id}`, { method: 'DELETE' });
  if (res) {
    revalidatePath('/tfl/dashboard/posts');
    revalidatePath('/tfl/dashboard/bilingual');
    revalidatePath('/');
    revalidatePath('/en');
  }
  return res;
}

// --- CATEGORY ACTIONS ---
export async function updateCategory(id: string, data: any) {
  const res = await apiFetch(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (res) revalidatePath('/tfl/dashboard/categories');
}

export async function addCategory(data: any) {
  const res = await apiFetch(`/categories`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (res) revalidatePath('/tfl/dashboard/categories');
}

export async function deleteCategory(id: string) {
  const res = await apiFetch(`/categories/${id}`, {
    method: 'DELETE'
  });
  if (res) revalidatePath('/tfl/dashboard/categories');
}

// --- HOMEPAGE ACTIONS ---
export async function updateHomepageSection(id: string, data: any) {
  const res = await apiFetch(`/homepage/sections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (res) revalidatePath('/');
}

// --- AD ACTIONS ---
export async function updateAd(slot: string, data: any) {
  const res = await apiFetch(`/ads/${slot}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (res) revalidatePath('/');
}

// --- FEED ACTIONS ---
export async function addFeed(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    url: formData.get('url') as string,
    categoryStr: formData.get('category') as string,
    isActive: true
  };

  const res = await apiFetch("/feeds", {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (res) revalidatePath('/tfl/dashboard/rss');
}

export async function deleteFeed(id: string) {
  const res = await apiFetch(`/feeds/${id}`, { method: 'DELETE' });
  if (res) revalidatePath('/tfl/dashboard/rss');
}

export async function toggleFeedStatus(id: string, currentStatus: boolean) {
  const res = await apiFetch(`/feeds/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ isActive: !currentStatus })
  });
  if (res) revalidatePath('/tfl/dashboard/rss');
}

// --- HOROSCOPE ACTIONS ---
export async function getHoroscopes() {
  const res = await apiFetch("/feeds/horoscope");
  return res || [];
}

// --- AI KEYS ACTIONS ---
export async function getAiKeys() {
  const res = await apiFetch("/ai-keys");
  return res || [];
}

export async function addAiKey(formData: FormData) {
  const key = formData.get('key') as string;
  const label = formData.get('label') as string;
  if (!key) return { error: 'Key is required' };

  const res = await apiFetch("/ai-keys", {
    method: 'POST',
    body: JSON.stringify({ key, label }),
  });
  if (res) revalidatePath('/tfl/dashboard/ai-keys');
  return res;
}

export async function toggleAiKeyStatus(id: string, currentStatus: boolean) {
  const res = await apiFetch(`/ai-keys/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ isActive: !currentStatus }),
  });
  if (res) revalidatePath('/tfl/dashboard/ai-keys');
  return res;
}

export async function deleteAiKey(id: string) {
  const res = await apiFetch(`/ai-keys/${id}`, {
    method: 'DELETE',
  });
  if (res) revalidatePath('/tfl/dashboard/ai-keys');
  return res;
}

export async function testAiKeyAction(key: string) {
  const res = await apiFetch("/ai-keys/test", {
    method: 'POST',
    body: JSON.stringify({ key }),
  });
  return res;
}

// --- GOOGLE NEWS ACTIONS ---
export async function pullSingleNewsAction(feedUrl?: string, category?: string) {
  const res = await apiFetch("/feeds/pull-single", {
    method: 'POST',
    body: JSON.stringify({ feedUrl, category }),
  });
  if (res?.post) {
    revalidatePath('/');
    revalidatePath('/tfl/dashboard/posts');
    revalidatePath('/tfl/dashboard/rss');
  }
  return res;
}

export async function getGoogleNewsSourcesAction() {
  const res = await apiFetch("/feeds/google-news-sources");
  return res || [];
}



export async function getDbEn() {
  const db = await getDb('en');
  const isPostEnglish = (p: any) => {
    if (!p) return false;
    // Strictly exclude Indian Google Trends from English portal
    if (p.isGoogleTrends && (!p.trendsGeo || p.trendsGeo === 'IN')) return false;
    // Must have a valid English headline without Devanagari script
    const enHeadline = (p.headlineEn && p.headlineEn.trim()) || (!/[\u0900-\u097F]/.test(p.headline || '') ? p.headline : null);
    if (!enHeadline || /[\u0900-\u097F]/.test(enHeadline)) return false;
    // Must have English content available (or English summary), never purely Hindi content
    if (p.contentEn && /[\u0900-\u097F]/.test(p.contentEn.slice(0, 150))) return false;
    if (!p.contentEn && p.content && /[\u0900-\u097F]/.test(p.content.slice(0, 150))) return false;
    return true;
  };

  const mapPostEn = (p: any) => {
    const enHeadline = (p.headlineEn && p.headlineEn.trim() && !/[\u0900-\u097F]/.test(p.headlineEn))
      ? p.headlineEn
      : p.headline;
    const enSummary = (p.summaryEn && p.summaryEn.trim() && !/[\u0900-\u097F]/.test(p.summaryEn))
      ? p.summaryEn
      : p.summary;
    const enContent = (p.contentEn && p.contentEn.trim() && !/[\u0900-\u097F]/.test(p.contentEn.slice(0, 150)))
      ? p.contentEn
      : p.content;

    return {
      ...p,
      headline: enHeadline,
      summary: enSummary,
      content: enContent,
      slug: p.slugEn || p.slug,
    };
  };

  return {
    ...db,
    posts: db.posts.filter(isPostEnglish).map(mapPostEn),
    breakingNews: db.breakingNews && isPostEnglish(db.breakingNews) ? mapPostEn(db.breakingNews) : null,
    breakingPosts: (db.breakingPosts || []).filter(isPostEnglish).map(mapPostEn),
    heroPosts: db.heroPosts.filter(isPostEnglish).map(mapPostEn),
    mainPosts: db.mainPosts.filter(isPostEnglish).map(mapPostEn),
    visualStories: db.visualStories.filter(isPostEnglish).map(mapPostEn),
    photoGalleries: db.photoGalleries.filter(isPostEnglish).map(mapPostEn),
  };
}
