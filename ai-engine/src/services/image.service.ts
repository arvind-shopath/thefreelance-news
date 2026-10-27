import axios from 'axios';
import * as cheerio from 'cheerio';
import { getSupabase } from '../db/supabase.js';

// Strict banned watermark, graphic overlay, or placeholder keywords
const WATERMARK_PATTERNS = [
  '0cdb0e9f7ab3',
  'googleusercontent.com',
  'gstatic.com',
  'logo',
  'placeholder',
  'favicon',
  'watermark',
  'banner_ad',
  'default_image',
  'no-image',
  'breaking-banner',
  'vecteezy',
  'freepik',
  'clipart',
  'icon',
  '.svg',
  '.gif',
];

export class ImageService {
  /**
   * Verified High-Definition Stock Portraits for prominent entities
   */
  private readonly verifiedEntityPortraits: Record<string, string> = {
    'नरेंद्र मोदी': 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&q=80',
    'राहुल गांधी': 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&q=80',
    'संसद': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80',
    'सुप्रीम कोर्ट': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80',
    'चुनाव': 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&q=80',
    'शेयर बाजार': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    'क्रिकेट': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80',
    'फुटबॉल': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80',
    'इसरो': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
  };

  /**
   * Category Default Pools
   */
  private readonly categoryStockPools: Record<string, string[]> = {
    national: [
      'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80',
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80',
    ],
    world: [
      'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    ],
    business: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=80',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&q=80',
    ],
    sports: [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80',
    ],
    entertainment: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80',
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80',
    ],
    technology: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
    ],
  };

  /**
   * Check if an image URL is completely free from watermarks, logos, or banned domains
   */
  isStrictlyLogoFreeNewsImage(url?: string | null): boolean {
    if (!url || typeof url !== 'string') return false;
    const clean = url.trim().toLowerCase();

    if (!clean.startsWith('http://') && !clean.startsWith('https://')) return false;

    for (const pat of WATERMARK_PATTERNS) {
      if (clean.includes(pat)) return false;
    }

    return true;
  }

  /**
   * Scrape article webpage to find og:image or high-res lead photo
   */
  async scrapeWebpagePhoto(pageUrl: string): Promise<string | null> {
    try {
      const res = await axios.get(pageUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
        timeout: 6000,
        maxRedirects: 5,
      });

      const $ = cheerio.load(res.data);
      const candidates: string[] = [
        $('meta[property="og:image"]').attr('content') || '',
        $('meta[name="twitter:image"]').attr('content') || '',
        $('link[rel="image_src"]').attr('href') || '',
        $('article img').first().attr('src') || '',
      ];

      for (const cand of candidates) {
        if (cand && this.isStrictlyLogoFreeNewsImage(cand)) {
          return cand.trim();
        }
      }
    } catch {}
    return null;
  }

  /**
   * Query Pexels API for a dynamic pool of 20 photos matching query
   */
  async fetchPexelsImage(query: string, usedSet: Set<string>): Promise<string | null> {
    const apiKey = process.env.PEXELS_API_KEY;
    if (!apiKey) return null;

    try {
      const res = await axios.get('https://api.pexels.com/v1/search', {
        params: { query, per_page: 20, orientation: 'landscape' },
        headers: { Authorization: apiKey },
        timeout: 6000,
      });

      const photos = res.data?.photos || [];
      for (const p of photos) {
        const u = p.src?.large2x || p.src?.large || p.src?.original;
        if (u && !usedSet.has(u.toLowerCase()) && this.isStrictlyLogoFreeNewsImage(u)) {
          return u;
        }
      }
    } catch {}
    return null;
  }

  /**
   * 6-Step Editorial Photo Pipeline:
   * 1. Scrape Primary Publisher Webpage
   * 2. Scrape Google News Related Articles (4-5 sources)
   * 3. Hard-Ban Placeholder Logos
   * 4. Pexels Dynamic 20-photo category pool
   * 5. Verified Entity Portrait or Category Stock
   * 6. Strict 48-Hour Deduplication against Database
   */
  async resolveEditorialPhoto(options: {
    primaryUrl?: string;
    relatedUrls?: string[];
    headline: string;
    category: string;
    keywords?: string;
  }): Promise<string> {
    const supabase = getSupabase();

    // STEP 6: Get images used in last 48 hours for cross-deduplication
    const since48h = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
    const { data: recentPosts } = await supabase
      .from('Post')
      .select('image')
      .gte('createdAt', since48h);

    const usedSet = new Set<string>();
    (recentPosts || []).forEach(p => {
      if (p.image) usedSet.add(p.image.trim().toLowerCase());
    });

    // STEP 1: Scrape primary article webpage
    if (options.primaryUrl) {
      const primaryPhoto = await this.scrapeWebpagePhoto(options.primaryUrl);
      if (primaryPhoto && !usedSet.has(primaryPhoto.toLowerCase())) {
        return primaryPhoto;
      }
    }

    // STEP 2: Scrape Google News related articles
    if (options.relatedUrls && options.relatedUrls.length > 0) {
      for (const rUrl of options.relatedUrls.slice(0, 5)) {
        const relPhoto = await this.scrapeWebpagePhoto(rUrl);
        if (relPhoto && !usedSet.has(relPhoto.toLowerCase())) {
          return relPhoto;
        }
      }
    }

    // STEP 4: Query Pexels Dynamic Pool
    const pexelsPhoto = await this.fetchPexelsImage(options.keywords || options.category, usedSet);
    if (pexelsPhoto) return pexelsPhoto;

    // STEP 5: Check Verified Entity Portraits
    for (const [entity, portraitUrl] of Object.entries(this.verifiedEntityPortraits)) {
      if (options.headline.includes(entity) && !usedSet.has(portraitUrl.toLowerCase())) {
        return portraitUrl;
      }
    }

    // Category stock fallback
    const catPool = this.categoryStockPools[options.category] || this.categoryStockPools.national;
    for (const stockUrl of catPool) {
      if (!usedSet.has(stockUrl.toLowerCase())) {
        return stockUrl;
      }
    }

    return catPool[0];
  }
}

export const imageService = new ImageService();
