import axios from 'axios';
import Parser from 'rss-parser';
import { getSupabase } from '../db/supabase.js';
import { gemini } from '../services/gemini.service.js';
import { imageService } from '../services/image.service.js';
import { dedupService } from '../services/dedup.service.js';

const parser = new Parser();

export async function runHindiTrendsPipeline() {
  console.log('\n🚀 [Hindi Trends Pipeline] Starting High-Velocity Trends Ingestion...');
  const supabase = getSupabase();

  // 1. Fetch Candidates from Google Trends India (4H & 24H)
  const candidateTopics: Array<{ title: string; sourceUrl?: string }> = [];

  try {
    const rssFeed = await parser.parseURL('https://trends.google.com/trending/rss?geo=IN');
    if (rssFeed?.items) {
      for (const it of rssFeed.items.slice(0, 25)) {
        const title = (it.title || '').trim();
        if (title && !candidateTopics.some(c => c.title.toLowerCase() === title.toLowerCase())) {
          candidateTopics.push({ title, sourceUrl: it.link });
        }
      }
    }
  } catch (err: any) {
    console.warn(`[Trends-IN] RSS error: ${err.message}`);
  }

  // Also fetch Google News India Top Breaking Headlines
  try {
    const gnFeed = await parser.parseURL('https://news.google.com/rss?hl=hi&gl=IN&ceid=IN:hi');
    if (gnFeed?.items) {
      for (const it of gnFeed.items.slice(0, 15)) {
        const title = (it.title || '').replace(/\s*-\s*[^-]+$/, '').trim();
        if (title && !candidateTopics.some(c => c.title.toLowerCase() === title.toLowerCase())) {
          candidateTopics.push({ title, sourceUrl: it.link });
        }
      }
    }
  } catch (err: any) {
    console.warn(`[News-IN] RSS error: ${err.message}`);
  }

  console.log(`[Hindi Trends] Found ${candidateTopics.length} raw candidates. Checking 72h deduplication...`);

  // Fetch recent posts for deduplication
  const since72h = new Date(Date.now() - 72 * 3600 * 1000).toISOString();
  const { data: recentPosts } = await supabase
    .from('Post')
    .select('headline, headlineEn')
    .gte('createdAt', since72h);

  const freshTopics: Array<{ title: string; sourceUrl?: string }> = [];
  for (const cand of candidateTopics) {
    const isDup = await dedupService.isDuplicateStory(cand.title, recentPosts || []);
    if (!isDup) {
      freshTopics.push(cand);
    }
  }

  console.log(`[Hindi Trends] Fresh unwritten topics: ${freshTopics.length}`);
  if (freshTopics.length === 0) {
    console.log('✅ All trending topics are already covered in the database. Zero duplicates allowed.');
    return { success: true, count: 0 };
  }

  let publishedCount = 0;

  // Process fresh candidates (limit to 10 per run to respect API quotas)
  for (const topic of freshTopics.slice(0, 10)) {
    console.log(`\n📰 Processing Topic: "${topic.title}"`);

    // STEP A: Fetch related articles from Google News RSS for multi-source synthesis
    const searchUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic.title)}+when:1d&hl=hi&gl=IN&ceid=IN:hi`;
    const relatedArticles: Array<{ title: string; snippet: string; link: string; source: string }> = [];

    try {
      const searchFeed = await parser.parseURL(searchUrl).catch(() => null);
      if (searchFeed?.items) {
        for (const item of searchFeed.items.slice(0, 5)) {
          const itemTitle = (item.title || '').replace(/\s*-\s*[^-]+$/, '').trim();
          const itemSnippet = (item.contentSnippet || item.content || '').replace(/<[^>]*>/g, '').trim();
          if (itemTitle) {
            relatedArticles.push({
              title: itemTitle,
              snippet: itemSnippet.slice(0, 300),
              link: item.link || '',
              source: (item as any).source?._ || 'Media Source',
            });
          }
        }
      }
    } catch {}

    const sourceContext = relatedArticles
      .map((r, i) => `[Source ${i + 1} - ${r.source}]: ${r.title} | ${r.snippet}`)
      .join('\n');

    // STEP B: Gemini Multi-Source Cross-Synthesis (Senior On-the-Ground Reporter Voice)
    const prompt = `
आप "The FreeLance" के वरिष्ठ फील्ड रिपोर्टर व खोजी पत्रकार हैं।
ट्रेंडिंग विषय: "${topic.title}"

विभिन्न मीडिया स्रोतों से प्राप्त प्राथमिक जानकारी:
${sourceContext || topic.title}

निर्देश:
1. उपरोक्त तथ्यों, बयानों और घटनाक्रम को मिलाकर एक सर्वथा नई, व्यापक और संपूर्ण खोजी रिपोर्ट (400-600 शब्द) लिखें।
2. टोन: गंभीर, तटस्थ, खोजी पत्रकारिता। भाषा शुद्ध व स्वाभाविक हिंदी होनी चाहिए।
3. जीरो फॉल्स-होक्स डिनायल रूल: यदि किसी हस्ती के निधन की पुष्टि हो, तो बिना आधिकारिक खंडन के फर्जी अफवाह न कहें।
4. आउटपुट केवल वैध JSON में दें:
{
  "headline": "आकर्षक, गंभीर व तथ्यात्मक हिंदी शीर्षक (60-90 अक्षर)",
  "summary": "150-180 अक्षरों का सटीक सार",
  "content": "संपूर्ण लेख HTML पैराग्राफ्स (<p>...</p>, <h3>...</h3>) में (400+ शब्द)",
  "headlineEn": "English Headline for International & SEO indexing",
  "summaryEn": "English Summary (1-2 sentences)",
  "category": "national|politics|business|sports|entertainment|tech-auto|lifestyle|religion|crime|states",
  "tags": "टैग1, टैग2, टैग3, टैग4",
  "keywords": "SEO Keywords comma separated"
}
`;

    try {
      const article = await gemini.generateJson<{
        headline: string;
        summary: string;
        content: string;
        headlineEn: string;
        summaryEn: string;
        category: string;
        tags: string;
        keywords: string;
      }>(prompt);

      // STEP C: Resolve 6-Step Editorial Photo
      const imageUrl = await imageService.resolveEditorialPhoto({
        primaryUrl: topic.sourceUrl,
        relatedUrls: relatedArticles.map(r => r.link).filter(Boolean),
        headline: article.headline,
        category: article.category || 'national',
        keywords: article.keywords,
      });

      // STEP D: Create Slugs
      const baseSlug = article.headline
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 80);
      const uniqueSuffix = Date.now().toString(36);
      const slug = `${baseSlug}-${uniqueSuffix}`;

      const slugEn = (article.headlineEn || 'story')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 80) + `-${uniqueSuffix}`;

      // STEP E: Save Directly to Supabase
      const { data, error } = await supabase.from('Post').insert({
        headline: article.headline,
        slug,
        summary: article.summary,
        content: article.content,
        image: imageUrl,
        categoryStr: article.category || 'national',
        headlineEn: article.headlineEn,
        summaryEn: article.summaryEn,
        slugEn,
        sourceName: 'The FreeLance ब्यूरो (Google Trends)',
        sourceUrl: topic.sourceUrl || null,
        isGoogleTrends: true,
        trendsGeo: 'IN',
        isEnglishOnly: false, // 100% visible on Hindi portal
        isPublished: true,
        seoTitle: article.headline,
        seoDesc: article.summary,
        tags: article.tags,
        keywords: article.keywords,
      });

      if (error) {
        console.error(`❌ [Supabase Insert Error]: ${error.message}`);
      } else {
        publishedCount++;
        console.log(`✅ [Published]: "${article.headline}" -> ${slug}`);
        console.log(`   📸 Image: ${imageUrl}`);
      }
    } catch (genErr: any) {
      console.error(`❌ Generation error on "${topic.title}": ${genErr.message}`);
    }
  }

  console.log(`\n🎉 [Hindi Trends Pipeline Complete] Successfully published ${publishedCount} new stories.\n`);
  return { success: true, count: publishedCount };
}
