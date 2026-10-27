import axios from 'axios';
import Parser from 'rss-parser';
import { getSupabase } from '../db/supabase.js';
import { gemini } from '../services/gemini.service.js';
import { imageService } from '../services/image.service.js';
import { dedupService } from '../services/dedup.service.js';

const parser = new Parser();
const TARGET_GEOS = ['US', 'CA', 'GB', 'SG'];

export async function runInternationalTrendsPipeline() {
  console.log('\n🌍 [International Trends Pipeline] Starting English Portal Trends Ingestion (Target: 5 stories)...');
  const supabase = getSupabase();

  // 1. Fetch Candidates across target countries
  const candidateTopics: Array<{ title: string; geo: string; sourceUrl?: string }> = [];

  for (const geo of TARGET_GEOS) {
    try {
      const feedUrl = `https://trends.google.com/trending/rss?geo=${geo}`;
      const feed = await parser.parseURL(feedUrl).catch(() => null);
      if (feed?.items) {
        for (const it of feed.items.slice(0, 10)) {
          const title = (it.title || '').trim();
          if (title && !candidateTopics.some(c => c.title.toLowerCase() === title.toLowerCase())) {
            candidateTopics.push({ title, geo, sourceUrl: it.link });
          }
        }
      }
    } catch {}
  }

  // Also query Google News World RSS for US/Global as fallback pool
  try {
    const worldFeed = await parser.parseURL('https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-US&gl=US&ceid=US:en');
    if (worldFeed?.items) {
      for (const it of worldFeed.items.slice(0, 15)) {
        const title = (it.title || '').replace(/\s*-\s*[^-]+$/, '').trim();
        if (title && !candidateTopics.some(c => c.title.toLowerCase() === title.toLowerCase())) {
          candidateTopics.push({ title, geo: 'GLOBAL', sourceUrl: it.link });
        }
      }
    }
  } catch {}

  console.log(`[Intl Trends] Fetched ${candidateTopics.length} candidates. Filtering 72h duplicates...`);

  // Fetch recent posts for deduplication
  const since72h = new Date(Date.now() - 72 * 3600 * 1000).toISOString();
  const { data: recentPosts } = await supabase
    .from('Post')
    .select('headline, headlineEn, trendsKeyword')
    .gte('createdAt', since72h);

  const freshTopics: Array<{ title: string; geo: string; sourceUrl?: string }> = [];
  for (const cand of candidateTopics) {
    const isDup = await dedupService.isDuplicateStory(cand.title, recentPosts || []);
    if (!isDup) {
      freshTopics.push(cand);
    }
  }

  console.log(`[Intl Trends] Fresh unwritten international topics: ${freshTopics.length}`);
  const targetQuota = 5;
  let publishedCount = 0;

  for (const topic of freshTopics) {
    if (publishedCount >= targetQuota) break;
    console.log(`\n🌐 Processing International Topic [${topic.geo}]: "${topic.title}"`);

    // Fetch related articles
    const searchUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic.title)}+when:1d&hl=en-US&gl=US&ceid=US:en`;
    const relatedArticles: Array<{ title: string; snippet: string; link: string }> = [];

    try {
      const searchFeed = await parser.parseURL(searchUrl).catch(() => null);
      if (searchFeed?.items) {
        for (const it of searchFeed.items.slice(0, 5)) {
          const t = (it.title || '').replace(/\s*-\s*[^-]+$/, '').trim();
          const s = (it.contentSnippet || it.content || '').replace(/<[^>]*>/g, '').trim();
          if (t) relatedArticles.push({ title: t, snippet: s.slice(0, 300), link: it.link || '' });
        }
      }
    } catch {}

    const sourceContext = relatedArticles
      .map((r, i) => `[Source ${i + 1}]: ${r.title} | ${r.snippet}`)
      .join('\n');

    const prompt = `
You are a senior international correspondent for "The FreeLance" English Global Portal (news.thefreelance.in/en/).
Topic: "${topic.title}" (Region: ${topic.geo})

Source Reports:
${sourceContext || topic.title}

Instructions:
1. Write an authoritative, insightful, high-CPM global news report (350-500 words).
2. The language must be crisp, engaging, native English.
3. Also provide Hindi headline and summary for bilingual indexing.
4. Output STRICT JSON format:
{
  "headlineEn": "Engaging, high-CTR English headline (60-90 chars)",
  "summaryEn": "Crisp executive summary in English (1-2 sentences)",
  "contentEn": "Full analytical article in HTML paragraphs (<p>...</p>, <h3>...</h3>)",
  "headlineHi": "तथ्यात्मक हिंदी शीर्षक",
  "summaryHi": "संक्षिप्त हिंदी सारांश",
  "category": "world|business|technology|sports|entertainment|lifestyle",
  "tags": "tag1, tag2, tag3",
  "keywords": "SEO keywords comma separated"
}
`;

    try {
      const article = await gemini.generateJson<{
        headlineEn: string;
        summaryEn: string;
        contentEn: string;
        headlineHi: string;
        summaryHi: string;
        category: string;
        tags: string;
        keywords: string;
      }>(prompt);

      const imageUrl = await imageService.resolveEditorialPhoto({
        primaryUrl: topic.sourceUrl,
        relatedUrls: relatedArticles.map(r => r.link).filter(Boolean),
        headline: article.headlineEn,
        category: article.category || 'world',
        keywords: article.keywords,
      });

      const uniqueSuffix = Date.now().toString(36);
      const slugEn = article.headlineEn
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 80) + `-${uniqueSuffix}`;

      const slug = (article.headlineHi || 'intl-story')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 80) + `-${uniqueSuffix}`;

      const { error } = await supabase.from('Post').insert({
        headline: article.headlineHi,
        slug,
        summary: article.summaryHi,
        content: article.contentEn,
        headlineEn: article.headlineEn,
        slugEn,
        summaryEn: article.summaryEn,
        contentEn: article.contentEn,
        image: imageUrl,
        categoryStr: article.category || 'world',
        language: 'en',
        sourceName: `The FreeLance International (${topic.geo})`,
        sourceUrl: topic.sourceUrl || null,
        isGoogleTrends: true,
        trendsKeyword: topic.title,
        trendsGeo: topic.geo,
        trendsTimeframe: '24h',
        isEnglishOnly: true, // Strict isolation: Visible ONLY on /en/
        isPublished: true,
        seoTitle: article.headlineEn,
        seoDesc: article.summaryEn,
        tags: article.tags,
        keywords: article.keywords,
      });

      if (error) {
        console.error(`❌ [Supabase Insert Error]: ${error.message}`);
      } else {
        publishedCount++;
        console.log(`✅ [Published Intl]: "${article.headlineEn}" -> ${slugEn}`);
        console.log(`   📸 Image: ${imageUrl}`);
      }
    } catch (err: any) {
      console.error(`❌ Error generating intl story for "${topic.title}": ${err.message}`);
    }
  }

  console.log(`\n🎉 [International Trends Complete] Published ${publishedCount}/${targetQuota} stories.\n`);
  return { success: true, count: publishedCount };
}
