import axios from 'axios';
import { getSupabase } from '../db/supabase.js';
import { gemini } from '../services/gemini.service.js';

interface TwitterMedia {
  type: string;
  media_url_https: string;
  video_info?: {
    variants?: Array<{
      bitrate?: number;
      content_type: string;
      url: string;
    }>;
  };
}

interface TweetItem {
  id_str: string;
  full_text?: string;
  text?: string;
  created_at?: string;
  user?: {
    screen_name: string;
    name: string;
  };
  extended_entities?: {
    media?: TwitterMedia[];
  };
  entities?: {
    media?: TwitterMedia[];
  };
}

interface VideoCandidate {
  tweetId: string;
  handle: string;
  authorName: string;
  tweetText: string;
  tweetUrl: string;
  posterImage: string;
  mp4Url: string;
  isEnglishOnly: boolean;
  beat: string;
}

const AUTHORIZED_ACCOUNTS: Array<{ handle: string; isEnglishOnly: boolean; beat: string }> = [
  // Hindi Portal Handles
  { handle: 'VishalMYadav_', isEnglishOnly: false, beat: 'नागरिक मुद्दे व जनहित वायरल' },
  { handle: 'viralanimalcuts', isEnglishOnly: false, beat: 'दुर्लभ वन्यजीव व प्रकृति क्लिप्स' },
  { handle: 'rameshofficial0', isEnglishOnly: false, beat: 'रोचक सामाजिक घटनाएं' },
  { handle: 'gharkekalesh', isEnglishOnly: false, beat: 'सार्वजनिक नागरिक विवाद व वायरल क्लिप्स' },
  { handle: 'PTI_News', isEnglishOnly: false, beat: 'दुर्घटनाएं व जन-समस्याएं ग्राउंड फुटेज' },
  { handle: 'the_hindu', isEnglishOnly: false, beat: 'घटना-आधारित राष्ट्रीय वीडियो फुटेज' },
  { handle: 'ANI', isEnglishOnly: false, beat: 'घटनाक्रम, दुर्घटना व आपदा फुटेज' },
  { handle: 'HateDetectors', isEnglishOnly: false, beat: 'नागरिक सतर्कता व अपराध क्लिप्स' },
  { handle: 'motordave2', isEnglishOnly: false, beat: 'ऑटोमोबाइल, सड़क सुरक्षा व स्टंट' },
  { handle: 'indiain24hr', isEnglishOnly: false, beat: 'देशभर की वायरल हलचल' },
  { handle: 'NCIBHQ', isEnglishOnly: false, beat: 'साइबर सतर्कता, पुलिस कार्रवाई व अपराध' },
  { handle: 'IndianExpress', isEnglishOnly: false, beat: 'ग्राउंड विजुअल्स व जनहित' },

  // English Portal Handles
  { handle: 'visegrad24', isEnglishOnly: true, beat: 'Global geopolitics & world viral' },
  { handle: 'TheInsiderPaper', isEnglishOnly: true, beat: 'International breaking & viral footage' },
  { handle: 'CBSNews', isEnglishOnly: true, beat: 'US & Global dramatic events' },
];

export async function runViralVideosPipeline(): Promise<{ success: boolean; published: number }> {
  console.log('\n======================================================');
  console.log('🚀 Starting Twitter / X Viral Videos Editorial Engine');
  console.log('======================================================\n');

  const supabase = getSupabase();

  // 1. Fetch existing video / X URLs to guarantee zero duplication
  const { data: existingPosts } = await supabase
    .from('Post')
    .select('sourceUrl, headline')
    .order('createdAt', { ascending: false })
    .limit(200);

  const existingUrlSet = new Set<string>();
  const existingHeadlineSet = new Set<string>();
  (existingPosts || []).forEach(p => {
    if (p.sourceUrl) existingUrlSet.add(p.sourceUrl.trim().toLowerCase());
    if (p.headline) existingHeadlineSet.add(p.headline.trim().toLowerCase());
  });

  const candidates: VideoCandidate[] = [];

  // 2. Fetch live tweets from authorized handles
  for (const acc of AUTHORIZED_ACCOUNTS) {
    const syndicationUrl = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${acc.handle}`;
    try {
      const res = await axios.get(syndicationUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
        timeout: 7000,
      });

      const match = res.data.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
      if (!match) continue;

      const data = JSON.parse(match[1]);
      const entries = data.props?.pageProps?.timeline?.entries || [];

      for (const entry of entries) {
        const tweet: TweetItem = entry.content?.tweet;
        if (!tweet || !tweet.id_str) continue;

        const tweetUrl = `https://x.com/${acc.handle}/status/${tweet.id_str}`;
        if (existingUrlSet.has(tweetUrl.toLowerCase())) continue;

        const mediaList = tweet.extended_entities?.media || tweet.entities?.media || [];
        const videoMedia = mediaList.find(m => m.type === 'video' || m.type === 'animated_gif');
        if (!videoMedia) continue;

        // Extract best MP4 variant
        const mp4Variants = (videoMedia.video_info?.variants || [])
          .filter(v => v.content_type === 'video/mp4' && v.url)
          .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

        const bestMp4 = mp4Variants[0]?.url || videoMedia.video_info?.variants?.[0]?.url;
        if (!bestMp4) continue;

        const posterImage = videoMedia.media_url_https;
        const rawText = (tweet.full_text || tweet.text || '')
          .replace(/https:\/\/t\.co\/\S+/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        // Reject too-short captions or trivial retweets
        if (rawText.length < 25) continue;

        // Reject political speeches or talking heads if from agency accounts
        const textLower = rawText.toLowerCase();
        if (
          (acc.handle === 'ANI' || acc.handle === 'PTI_News') &&
          (textLower.includes('press conference') ||
            textLower.includes('bjp leader') ||
            textLower.includes('congress leader') ||
            textLower.includes('addresses media') ||
            textLower.includes('says,'))
        ) {
          continue;
        }

        candidates.push({
          tweetId: tweet.id_str,
          handle: acc.handle,
          authorName: tweet.user?.name || acc.handle,
          tweetText: rawText,
          tweetUrl,
          posterImage,
          mp4Url: bestMp4,
          isEnglishOnly: acc.isEnglishOnly,
          beat: acc.beat,
        });

        // Limit to 2 candidates per handle per run
        if (candidates.filter(c => c.handle === acc.handle).length >= 2) break;
      }
    } catch (e: any) {
      console.warn(`[ViralVideos] Error fetching @${acc.handle}:`, e.message);
    }
  }

  console.log(`[ViralVideos] Eligible unwritten video candidates found: ${candidates.length}`);

  let publishedCount = 0;

  // Process up to 5 video stories per run to avoid model quota spikes while giving continuous fresh coverage
  for (const item of candidates.slice(0, 6)) {
    console.log(`\n📹 Processing Video from @${item.handle}: "${item.tweetText.slice(0, 70)}..."`);

    try {
      let prompt = '';
      if (!item.isEnglishOnly) {
        prompt = `
आप "The FreeLance" के वरिष्ठ पत्रकार और डिजिटल वीडियो डेस्क के संपादक हैं।
सोशल मीडिया (X/@${item.handle}) पर वायरल हुआ यह वीडियो क्लिप प्राप्त हुआ है:
विवरण / कैप्शन: "${item.tweetText}"
श्रेणी / बीट: ${item.beat}
वीडियो स्रोत URL: ${item.tweetUrl}

निर्देश:
1. इस वीडियो घटना पर एक गंभीर, रोचक, 400-500 शब्दों की तथ्यात्मक व खोजी रिपोर्ट लिखें।
2. केवल कैप्शन को दोहराएं नहीं; घटना के सामाजिक संदर्भ, सड़क सुरक्षा / नागरिक सतर्कता / वन्यजीव व्यवहार, और प्रशासनिक नियमों पर भी विस्तार से प्रकाश डालें।
3. शीर्षक नियम (Non-formulaic Diverse Headline):
   - 'का वीडियो हुआ वायरल, जानिए क्या है पूरा मामला' जैसा घिसा-पिटा फॉर्मूला कतई न लिखें।
   - शीर्षक में ट्विटर हैंडल (@...) न लिखें।
   - शीर्षक की शुरुआत या संरचना स्वाभाविक रखें:
     * 'वायरल वीडियो: [घटना का ठोस विवरण]'
     * '[Video] [सीधे घटना का एक्शन]'
     * '(वीडियो) [प्रशासनिक एक्शन / जनहित खबर]'
4. आउटपुट केवल वैध JSON में दें:
{
  "headline": "स्वाभाविक, आकर्षक और ठोस हिंदी शीर्षक (60-90 अक्षर)",
  "summary": "150-180 अक्षरों का सटीक सार",
  "content": "HTML पैराग्राफ्स (<p>...</p>, <h3>...</h3>) में 400+ शब्दों की विस्तृत रिपोर्ट",
  "headlineEn": "English Headline for SEO & Bilingual indexing",
  "summaryEn": "English Summary (1-2 sentences)",
  "category": "viral|national|crime|lifestyle|states",
  "tags": "वायरल वीडियो, सोशल मीडिया, जनहित, ताज़ा खबर",
  "keywords": "viral video, trending footage, video news"
}
`;
      } else {
        prompt = `
You are a Senior Video Journalist at "The FreeLance" International English Portal.
A trending viral video from X/@${item.handle} has been detected:
Caption / Context: "${item.tweetText}"
Beat: ${item.beat}
Source URL: ${item.tweetUrl}

Instructions:
1. Write a comprehensive, factual, 400-500 word news report on this viral incident.
2. Contextualize the footage with geopolitical, public safety, or scientific background.
3. Headline Rule: Direct, impactful news headline. Do not include Twitter handles (@...) or tired cliches.
4. Output strict JSON only:
{
  "headline": "Hindi translation of headline for archive",
  "summary": "Hindi summary for archive",
  "content": "HTML paragraphs in Hindi for archive",
  "headlineEn": "Punchy, authoritative English Headline (60-90 chars)",
  "summaryEn": "English Summary (150-180 chars)",
  "contentEn": "Full HTML report (<p>...</p>, <h3>...</h3>) in English (400+ words)",
  "category": "world|technology|lifestyle|sports",
  "tags": "viral video, world footage, breaking video, trending",
  "keywords": "viral footage, world video news, trending video"
}
`;
      }

      const report = await gemini.generateJson<{
        headline: string;
        summary: string;
        content: string;
        headlineEn?: string;
        summaryEn?: string;
        contentEn?: string;
        category: string;
        tags: string;
        keywords: string;
      }>(prompt);

      // Embed responsive HTML5 video player and disclaimer inside content
      const videoEmbedHtml = `
<div class="video-wrapper my-6 text-center">
  <video controls playsinline preload="metadata" poster="${item.posterImage}" class="w-full max-w-3xl rounded-xl shadow-lg mx-auto bg-black border border-gray-200">
    <source src="${item.mp4Url}" type="video/mp4">
    Your browser does not support HTML5 video.
  </video>
  <p class="text-xs text-gray-500 mt-2 italic">स्रोत / Source: <a href="${item.tweetUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">X (@${item.handle})</a></p>
</div>
`;

      const hindiDisclaimer = `
<div class="p-4 my-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg text-sm text-gray-800 italic">
  <strong>नोट:</strong> 'द फ्रीलांस' इस वायरल वीडियो की सत्यता व प्रामाणिकता की स्वतंत्र पुष्टि नहीं करता है। यह रिपोर्ट सोशल मीडिया पर उपलब्ध फुटेज और जनचर्चा के आधार पर जनहित में तैयार की गई है।
</div>
`;

      const englishDisclaimer = `
<div class="p-4 my-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg text-sm text-gray-800 italic">
  <strong>Disclaimer:</strong> 'The FreeLance' does not independently verify the authenticity of this viral video. This report is compiled based on available online footage and social media discourse in public interest.
</div>
`;

      const finalContentHindi = `${videoEmbedHtml}\n${report.content}\n${hindiDisclaimer}`;
      const finalContentEnglish = report.contentEn
        ? `${videoEmbedHtml}\n${report.contentEn}\n${englishDisclaimer}`
        : null;

      // Create unique slug
      const slugBase = (report.headlineEn || report.headline)
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 75);
      const uniqueSlug = `${slugBase}-${Date.now().toString(36)}`;

      // Save to Supabase Post table
      const postPayload = {
        headline: report.headline,
        headlineEn: report.headlineEn || report.headline,
        slug: uniqueSlug,
        slugEn: uniqueSlug,
        summary: report.summary,
        summaryEn: report.summaryEn || report.summary,
        content: finalContentHindi,
        contentEn: finalContentEnglish,
        image: item.posterImage,
        imageCaption: `वीडियो दृश्य: सौजन्य X (@${item.handle})`,
        categoryStr: report.category || 'viral',
        tags: report.tags ? report.tags.split(',').map(t => t.trim()) : ['वायरल वीडियो'],
        author: 'द फ्रीलांस वीडियो डेस्क',
        postType: 'video',
        sourceUrl: item.tweetUrl,
        sourceName: `X (@${item.handle})`,
        isFeatured: false,
        isTrending: true,
        isBreaking: false,
        isPublished: true,
        isEnglishOnly: item.isEnglishOnly,
        isGoogleTrends: false,
        seoTitle: report.headline,
        seoDesc: report.summary,
        keywords: report.keywords,
        extraMeta: {
          videoUrl: item.mp4Url,
          tweetId: item.tweetId,
          handle: item.handle,
        },
      };

      const { data: inserted, error: insertError } = await supabase
        .from('Post')
        .insert(postPayload)
        .select('id, slug')
        .single();

      if (insertError) {
        console.error(`❌ Failed to insert video post:`, insertError.message);
      } else {
        console.log(`✅ [POST PUBLISHED] ID: ${inserted.id} | Slug: ${inserted.slug}`);
        existingUrlSet.add(item.tweetUrl.toLowerCase());
        publishedCount++;
      }
    } catch (e: any) {
      console.error(`❌ Error synthesizing video post from @${item.handle}:`, e.message);
    }

    // Delay between calls to prevent rate limit
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('\n======================================================');
  console.log(`🎉 Viral Videos run complete! Published ${publishedCount} new video stories.`);
  console.log('======================================================\n');

  return { success: true, published: publishedCount };
}
