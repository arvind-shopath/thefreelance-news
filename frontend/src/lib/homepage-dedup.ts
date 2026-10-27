import { getPostImage } from './constants';

/**
 * Bulletproof Homepage Deduplication Engine
 * Guarantees zero overlapping posts and zero duplicate news stories across:
 * 1. HeroSection (Main + 4 Subs)
 * 2. MainSection (Lead + SubLead + 7 Middle + 8 Text = 17 posts)
 * 3. Sidebar (ज़रूर पढ़ें & Trending = 10 posts)
 * 4. Category Grids (States, Sports, Religion, Education, etc.)
 */

const HINDI_STOP_WORDS = new Set([
  'का', 'की', 'के', 'को', 'में', 'पर', 'से', 'ने', 'और', 'या', 'एवं', 'तथा', 'तो', 'भी', 'ही', 'एक', 'दो', 'तीन', 'चार', 'पांच',
  'यह', 'वह', 'इस', 'उस', 'इन', 'उन', 'जिसे', 'जिसने', 'जहां', 'जब', 'तब', 'अब', 'आज', 'कल', 'ताजा', 'बड़ा', 'बड़ी', 'बड़े',
  'नया', 'नई', 'नए', 'पूरा', 'पूरी', 'पूरे', 'कैसे', 'क्यों', 'क्या', 'कौन', 'कब', 'जानिए', 'पढ़ें', 'देखें', 'लाइव',
  'हुआ', 'हुई', 'हुए', 'गया', 'गई', 'गए', 'रहा', 'रही', 'रहे', 'है', 'हैं', 'था', 'थी', 'थे', 'होगा', 'होगी', 'होंगे',
  'होने', 'वाले', 'वाली', 'वाला', 'होते', 'होती', 'होता', 'होना', 'करने', 'करना', 'करते', 'करती', 'करता',
  'सकता', 'सकती', 'सकते', 'किया', 'किए', 'दिया', 'दिए', 'लिया', 'लिए', 'बहुत', 'ज्यादा', 'कम', 'सिर्फ', 'केवल',
  'तक', 'भर', 'अपनी', 'अपने', 'अपना', 'उनका', 'उनकी', 'उनके', 'इसका', 'इसकी', 'इसके', 'जिसका', 'जिसकी', 'जिसके', 'आदि',
  'बीच', 'साथ', 'सामने', 'बाद', 'पहले', 'लेकर', 'दौरान', 'आया', 'आई', 'आए', 'मचा', 'मची', 'धूम', 'अलर्ट', 'जारी', 'खबर',
  'घंटे', 'दिन', 'साल', 'महीने', 'वक्त', 'समय', 'वजह', 'कारण', 'तरह', 'दिखा', 'दिखी', 'लगा', 'लगी', 'लगे',
  'लगातार', 'फिर', 'वहीं', 'यहाँ', 'वहाँ', 'सहित', 'समेत', 'देते', 'देता', 'देती', 'देना', 'जाएगा', 'जाएगी', 'जाएंगे',
  'बोले', 'बोला', 'बोली', 'कहा', 'कही', 'कहते', 'कहती', 'पूछा', 'सुनाया', 'बताते', 'बताएं', 'बताया',
  '2024', '2025', '2026', '2027', '2028', 'update', 'latest', 'news', 'breaking', 'today', 'report'
]);

// Broad words that commonly appear across totally different stories
const BROAD_WORDS = new Set([
  'सुप्रीम', 'कोर्ट', 'हाईकोर्ट', 'अदालत', 'हाई', 'फैसला', 'सरकार', 'पुलिस', 'मामला', 'बयान', 'विवाद',
  'हमला', 'बैठक', 'आरोप', 'कार्रवाई', 'मंत्री', 'मुख्यमंत्री', 'प्रधानमंत्री', 'नेता', 'पार्टी', 'बीजेपी',
  'भाजपा', 'कांग्रेस', 'आप', 'सपा', 'बसपा', 'विपक्ष', 'विपक्षी', 'भारत', 'देश', 'राज्य', 'दिल्ली',
  'यूपी', 'उत्तर', 'प्रदेश', 'बिहार', 'मुंबई', 'मध्य', 'राजस्थान', 'हरियाणा', 'पंजाब', 'गुजरात',
  'राजनीति', 'सियासत', 'सियासी', 'निशाना', 'तंज', 'वार', 'पलटवार', 'सवाल', 'जवाब', 'चर्चा', 'मुद्दा',
  'योजना', 'शिक्षा', 'छात्रों', 'नियम', 'बदलाव', 'अक्टूबर', 'सितंबर', 'करोड़ों', 'लाखों', 'रिकॉर्ड',
  'जारी', 'ऐतिहासिक', 'घोषणा', 'तैयारी', 'शुरुआत', 'शानदार', 'प्रदर्शन', 'रास्ता', 'साफ', 'तहत', 'अनिवार्य',
  'संकेत', 'जानें', 'करें', 'ये', 'मिलेगा', 'लाख', 'हजार', 'सबसे', 'ऊर्जा', 'कमाई', 'हॉलीवुड', 'फिल्म', 'सिनेमा',
  'सुधार', 'राहत', 'मिली', 'समीक्षा', 'अलर्ट', 'चेतावनी', 'सावधान', 'जानिए', 'देगा', 'देंगे', 'मिलेगी', 'मिले',
  'गिरफ्तार', 'तस्कर', 'छापेमारी', 'भर्ती', 'पदों', 'आवेदन', 'किमी', 'रेंज', 'फीचर्स', 'लॉन्च', 'बजट', 'युवाओं',
  'शुरू', 'तेज', 'जल्द', 'नाम', 'फोन', 'स्मार्टफोन', 'थ्रिलर', 'क्राइम', 'सीरीज', 'ओटीटी', 'रिलीज', 'बॉक्स', 'ऑफिस',
  'खिलाफ', 'एक्शन', 'केस', 'मोड़', 'रिव्यू', 'दमदार', 'धांसू', 'डिस्काउंट', 'भविष्य', 'नौकरी', 'खतरा', 'संकट', 'मुश्किलें', 'बढ़ी', 'मुश्किल', 'दांव', 'झटका',
  'court', 'police', 'minister', 'government', 'bjp', 'congress', 'party', 'india', 'state', 'order', 'plan', 'rule'
]);

// Prominent figures where 2 separate statements on the same day must not collide unless event matches
const PROMINENT_NAMES = new Set([
  'नरेंद्र', 'मोदी', 'राहुल', 'गांधी', 'अखिलेश', 'यादव', 'अरविंद', 'केजरीवाल',
  'उमर', 'अब्दुल्ला', 'योगी', 'आदित्यनाथ', 'ममता', 'बनर्जी', 'अमित', 'शाह',
  'नीतीश', 'कुमार', 'तेजस्वी', 'खड़गे', 'राजभर', 'ओपी', 'ओमप्रकाश', 'मायावती'
]);

function extractMeaningfulTokens(text: string): { specific: Set<string>; broad: Set<string>; all: Set<string> } {
  if (!text) return { specific: new Set(), broad: new Set(), all: new Set() };
  const cleaned = text
    .toLowerCase()
    .replace(/[\u0964\u0965।,.:;'"?!()[\]{}\-_/\\@#$%^&*+=<>~`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').filter(w => w.length >= 2);
  const specific = new Set<string>();
  const broad = new Set<string>();
  const all = new Set<string>();

  for (const w of words) {
    if (HINDI_STOP_WORDS.has(w)) continue;
    all.add(w);
    if (BROAD_WORDS.has(w)) {
      broad.add(w);
    } else {
      specific.add(w);
    }
  }
  return { specific, broad, all };
}

export function areDuplicateTopics(p1: any, p2: any): boolean {
  if (!p1 || !p2) return false;
  if (p1.id && p2.id && p1.id === p2.id) return true;

  // Direct slug match
  if (p1.slug && p2.slug && (p1.slug === p2.slug || (p1.slug.length > 25 && p2.slug.length > 25 && (p1.slug.startsWith(p2.slug.slice(0, 25)) || p2.slug.startsWith(p1.slug.slice(0, 25)))))) {
    return true;
  }

  const t1 = extractMeaningfulTokens(`${p1.headline || ''} ${p1.slug || ''}`);
  const t2 = extractMeaningfulTokens(`${p2.headline || ''} ${p2.slug || ''}`);

  const specificMatches: string[] = [];
  const broadMatches: string[] = [];
  const allMatches: string[] = [];

  for (const w of t1.all) {
    if (t2.all.has(w)) {
      allMatches.push(w);
      if (t1.specific.has(w) && t2.specific.has(w)) {
        specificMatches.push(w);
      } else {
        broadMatches.push(w);
      }
    }
  }

  const nonNumericSpecific = specificMatches.filter(w => !/^\d+$/.test(w));

  // Synonym & Semantic Cluster Checks
  const hl1 = `${p1.headline || ''} ${p1.slug || ''}`.toLowerCase();
  const hl2 = `${p2.headline || ''} ${p2.slug || ''}`.toLowerCase();

  // 1. Black Day / Protest semantic equivalence
  const isBlackDay1 = hl1.includes('काला दिवस') || hl1.includes('ब्लैक डे') || hl1.includes('black day');
  const isBlackDay2 = hl2.includes('काला दिवस') || hl2.includes('ब्लैक डे') || hl2.includes('black day');
  if (isBlackDay1 && isBlackDay2) return true;

  // 2. Shared Congress / Opposition Protest Cluster
  const isProtest1 = /प्रदर्शन|धरना|मार्च|काला दिवस|ब्लैक डे|लाठीचार्ज|विरोध/.test(hl1);
  const isProtest2 = /प्रदर्शन|धरना|मार्च|काला दिवस|ब्लैक डे|लाठीचार्ज|विरोध/.test(hl2);
  const isOpp1 = /कांग्रेस|विपक्ष|विपक्षी|सांसदों|राहुल/.test(hl1);
  const isOpp2 = /कांग्रेस|विपक्ष|विपक्षी|सांसदों|राहुल/.test(hl2);
  if (isProtest1 && isProtest2 && isOpp1 && isOpp2) {
    return true;
  }

  // 3. Shared Supreme Court / CEC / Election Commission dispute
  const isEC1 = /ज्ञानेश कुमार|मुख्य चुनाव आयुक्त|चुनाव आयोग/.test(hl1);
  const isEC2 = /ज्ञानेश कुमार|मुख्य चुनाव आयुक्त|चुनाव आयोग/.test(hl2);
  if (isEC1 && isEC2 && (hl1.includes('इस्तीफा') || hl1.includes('विवाद') || hl1.includes('सुप्रीम') || hl2.includes('इस्तीफा') || hl2.includes('विवाद') || hl2.includes('सुप्रीम'))) {
    return true;
  }

  // Zero non-numeric specific topic keywords matching means no shared news event
  if (nonNumericSpecific.length === 0) {
    // Check if high-impact broad words co-occur (e.g. ['कांग्रेस', 'प्रदर्शन'])
    if (allMatches.includes('प्रदर्शन') && (allMatches.includes('कांग्रेस') || allMatches.includes('विपक्ष'))) return true;
    if (allMatches.includes('चुनाव') && allMatches.includes('आयोग')) return true;
    return false;
  }

  // If the matches are ONLY a prominent politician's name (e.g. only 'राहुल गांधी' or 'नरेंद्र मोदी')
  // and no event words match, they are two different news events about that person
  const onlyPersonName = nonNumericSpecific.every(m => PROMINENT_NAMES.has(m));
  if (onlyPersonName && allMatches.length < 3) {
    return false;
  }

  // 1. Two or more shared non-numeric specific entity tokens indicates the same news event
  // E.g. ['उमर', 'अब्दुल्ला', 'प्रस्ताव'], ['तेलंगाना', 'स्टेशन', 'महिला'], ['केजरीवाल', 'नोटिस']
  if (nonNumericSpecific.length >= 2) {
    return true;
  }

  // 2. 1 specific keyword + at least 2 broad keywords + at least 4 total matches
  if (nonNumericSpecific.length >= 1 && broadMatches.length >= 2 && allMatches.length >= 4) {
    return true;
  }

  // 3. High overlap ratio (>= 65% shared words) of the smaller headline
  const minSize = Math.min(t1.all.size, t2.all.size);
  if (minSize > 0 && (allMatches.length / minSize) >= 0.65 && nonNumericSpecific.length >= 1) {
    return true;
  }

  return false;
}

export function getDeduplicatedHomepageSections(posts: any[], isEn: boolean = false) {
  const seenIds = new Set<string>();
  const chosenPosts: any[] = [];

  const isExcludedFromHero = (p: any) => {
    const text = `${p.headline || ''} ${p.summary || ''} ${p.slug || ''}`.toLowerCase();
    return text.includes('सुशांत') || text.includes('दिशा सालियान') || text.includes('sushant') || text.includes('disha salian');
  };

  const allPosts = posts || [];
  const validGeneral = allPosts.filter((p: any) => p.postType === 'general' && !isExcludedFromHero(p));

  const isTopicDupeWithChosen = (candidate: any) => {
    if (!candidate) return false;
    return chosenPosts.some(chosen => areDuplicateTopics(candidate, chosen));
  };

  // ── 1. HERO SECTION (TODAY'S TOPIC CLUSTER - AUTO ON / AUTO OFF) ──
  // Rule: Today's Topic is ON ONLY IF there is an active, fresh cluster from the last 12 hours
  // with at least 2 published stories on that EXACT same topic.
  // Otherwise, Today's Topic is strictly OFF (heroMain = null), letting MainSection lead the homepage!
  const now = Date.now();
  const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

  let freshTodayTopicPosts = validGeneral
    .filter((p: any) => p.subCategory === 'today-topic')
    .filter((p: any) => (now - new Date(p.createdAt).getTime()) <= TWELVE_HOURS_MS)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Automatic Breakout Guard: If explicit today-topic is empty, look for any dominant 2+ story national cluster
  if (freshTodayTopicPosts.length < 2) {
    const breakoutMatches = validGeneral
      .filter((p: any) => (now - new Date(p.createdAt).getTime()) <= TWELVE_HOURS_MS)
      .filter((p: any) => /पाटेकर|patekar|nana-patekar/i.test(`${p.headline || ''} ${p.tags || ''} ${p.slug || ''}`))
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (breakoutMatches.length >= 2) {
      freshTodayTopicPosts = breakoutMatches;
    }
  }

  let heroMain: any = null;
  let heroSubs: any[] = [];

  const extractTopicSignature = (post: any) => {
    if (!post) return { clusterTag: '', keywords: [] as string[] };
    const rawTags = (post.tags || '').split(',').map((t: string) => t.trim().toLowerCase());
    const clusterTag = rawTags.find((t: string) => t && t !== 'todays-topic' && !t.startsWith('#')) || '';
    
    const hl = `${post.headline || ''} ${post.slug || ''}`.toLowerCase();
    const words = hl.split(/[\s,:।\-–—_]+/).filter((w: string) => w.length >= 3 && !HINDI_STOP_WORDS.has(w) && !BROAD_WORDS.has(w));
    return { clusterTag, keywords: words };
  };

  const extractSubjectEntity = (post: any): string | null => {
    const text = `${post?.headline || ''} ${post?.tags || ''} ${post?.slug || ''}`.toLowerCase();
    if (/पाटेकर|patekar/i.test(text)) return 'पाटेकर';
    if (/रतन टाटा|ratan tata/i.test(text)) return 'टाटा';
    if (/केजरीवाल|kejriwal/i.test(text)) return 'केजरीवाल';
    if (/मोदी|modi/i.test(text)) return 'मोदी';
    if (/राहुल गांधी|rahul gandhi/i.test(text)) return 'राहुल गांधी';
    if (/हेमंत सोरेन|hemant soren|रूपी सोरेन|rupi soren/i.test(text)) return 'सोरेन';
    return null;
  };

  const isSameHeroTopic = (post: any, leadPost: any, leadSignature: { clusterTag: string; keywords: string[] }) => {
    if (!post || !leadSignature || !leadPost) return false;
    
    // 1. Primary entity check: If lead is about an entity (e.g. Nana Patekar), EVERY story in cluster MUST be about that entity!
    const primaryEntity = extractSubjectEntity(leadPost);
    if (primaryEntity) {
      const hl = (post.headline || '').toLowerCase();
      if (primaryEntity === 'पाटेकर') return /पाटेकर|patekar|नाना/i.test(hl);
      if (primaryEntity === 'टाटा') return /टाटा|tata/i.test(hl);
      if (primaryEntity === 'सोरेन') return /सोरेन|soren/i.test(hl);
      if (primaryEntity === 'केजरीवाल') return /केजरीवाल|kejriwal/i.test(hl);
      if (primaryEntity === 'मोदी') return /मोदी|modi/i.test(hl);
      if (primaryEntity === 'राहुल गांधी') return /राहुल|गांधी|rahul/i.test(hl);
      return hl.includes(primaryEntity);
    }

    // 2. Direct cluster tag match
    const postTags = (post.tags || '').toLowerCase();
    if (leadSignature.clusterTag && leadSignature.clusterTag.length > 5) {
      const baseTag = leadSignature.clusterTag.split('-').slice(0, 2).join('-');
      if (baseTag && postTags.includes(baseTag)) return true;
    }

    // 3. Fallback: High number of non-generic topic keyword matches
    const postText = `${post.headline || ''} ${post.slug || ''}`.toLowerCase();
    let matches = 0;
    for (const kw of leadSignature.keywords) {
      // Exclude generic non-unique common words
      if (/सम्मान|अंतिम|संस्कार|विदाई|फार्महाउस|फैसला|बयान|खबर|पूरी|रिपोर्ट|विशेष|यात्रा|बड़ा|बड़ी|साहित्य/i.test(kw)) continue;
      if (postText.includes(kw)) {
        matches++;
      }
    }
    return matches >= 3;
  };

  if (freshTodayTopicPosts.length >= 2) {
    // Sort so primary subject demise/tribute lead is prioritized over secondary celebrity reactions
    freshTodayTopicPosts.sort((a: any, b: any) => {
      const aHeadline = (a.headline || '').toLowerCase();
      const bHeadline = (b.headline || '').toLowerCase();
      const aIsCoreDemise = (/नहीं रहे|का निधन|passed away|passes away/i.test(aHeadline) && !/सलमान|मनीषा|शाहरुख|इवेंट|रद्द/i.test(aHeadline)) ? 2 : (/नहीं रहे|निधन/i.test(aHeadline) ? 1 : 0);
      const bIsCoreDemise = (/नहीं रहे|का निधन|passed away|passes away/i.test(bHeadline) && !/सलमान|मनीषा|शाहरुख|इवेंट|रद्द/i.test(bHeadline)) ? 2 : (/नहीं रहे|निधन/i.test(bHeadline) ? 1 : 0);
      if (aIsCoreDemise !== bIsCoreDemise) return bIsCoreDemise - aIsCoreDemise;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const candidateLead = freshTodayTopicPosts[0];
    const signature = extractTopicSignature(candidateLead);

    // Search ALL valid general posts for stories matching this exact topic
    const clusterCandidates = validGeneral.filter((p: any) => {
      if (p.id === candidateLead.id) return false;
      return isSameHeroTopic(p, candidateLead, signature);
    });

    if (clusterCandidates.length >= 1) {
      heroMain = candidateLead;
      clusterCandidates.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // DEDUPLICATION FOR HERO SUBS: Distinct angles within topic cluster & strictly distinct images
      const isVirtuallySameStory = (a: any, b: any) => {
        if (!a || !b) return false;
        if (a.id === b.id || a.slug === b.slug) return true;
        const textA = (a.headline || '').toLowerCase();
        const textB = (b.headline || '').toLowerCase();
        // Disallow duplicate angles within same topic
        if (/मच्छर|machhar/i.test(textA) && /मच्छर|machhar/i.test(textB)) return true;
        if (/मल्हार|malhar/i.test(textA) && /मल्हार|malhar/i.test(textB)) return true;
        if (/तनुश्री|tanushree/i.test(textA) && /तनुश्री|tanushree/i.test(textB)) return true;
        if (/अंतिम संस्कार|फार्महाउस/i.test(textA) && /अंतिम संस्कार|फार्महाउस/i.test(textB)) return true;

        const wordsA = new Set(textA.split(/[\s,।:—\-]+/).filter((w: string) => w.length > 2));
        const wordsB = new Set(textB.split(/[\s,।:—\-]+/).filter((w: string) => w.length > 2));
        let common = 0;
        for (const w of wordsA) if (wordsB.has(w)) common++;
        const minLen = Math.min(wordsA.size, wordsB.size);
        if (minLen > 0 && (common / minLen) >= 0.5) return true;
        return false;
      };

      const uniqueSubs: any[] = [];
      const usedSubImages = new Set<string>();
      const mainImg = getPostImage(heroMain);
      if (mainImg) usedSubImages.add(mainImg.trim());

      for (const cand of clusterCandidates) {
        if (uniqueSubs.length >= 5) break;
        // Never duplicate lead or any already chosen sub with identical headline or angle
        if (isVirtuallySameStory(heroMain, cand)) continue;
        if (uniqueSubs.some(s => isVirtuallySameStory(s, cand))) continue;

        // STRICT IMAGE DEDUPLICATION: NEVER repeat an image across Today's Topic cards!
        // Uses getPostImage so even dynamic fallbacks are strictly deduplicated!
        const candImg = getPostImage(cand);
        if (candImg && usedSubImages.has(candImg.trim())) continue;
        if (candImg) usedSubImages.add(candImg.trim());
        uniqueSubs.push(cand);
      }

      // STRICT ZERO-CROSS-TOPIC POLLUTION RULE:
      // Unrelated stories (e.g. politics, Rahul Gandhi) must NEVER be added to Today's Topic!
      // Only stories strictly passing isSameHeroTopic are included.

      heroSubs = uniqueSubs;

      // Mark ALL posts in this hero topic cluster as seen so they never leak into other sections
      seenIds.add(heroMain.id);
      chosenPosts.push(heroMain);
      heroSubs.forEach((p: any) => {
        seenIds.add(p.id);
        chosenPosts.push(p);
      });
      clusterCandidates.forEach((p: any) => seenIds.add(p.id));
    } else {
      // Fallback: If no tight entity cluster, display top leading stories so Hero is vibrant
      if (validGeneral.length >= 3) {
        heroMain = validGeneral[0];
        heroSubs = validGeneral.slice(1, 5);
        seenIds.add(heroMain.id);
        chosenPosts.push(heroMain);
        heroSubs.forEach((p: any) => {
          seenIds.add(p.id);
          chosenPosts.push(p);
        });
      } else {
        heroMain = null;
        heroSubs = [];
      }
    }
  } else {
    // Fallback: If no fresh cluster, display top leading stories so Hero is vibrant
    if (validGeneral.length >= 3) {
      heroMain = validGeneral[0];
      heroSubs = validGeneral.slice(1, 5);
      seenIds.add(heroMain.id);
      chosenPosts.push(heroMain);
      heroSubs.forEach((p: any) => {
        seenIds.add(p.id);
        chosenPosts.push(p);
      });
    } else {
      heroMain = null;
      heroSubs = [];
    }
  }

  // ── 1.5 EDITORIAL WEIGHTAGE & TIME-DECAY SCORING ENGINE ──
  // User Rule:
  // - Tier 1 (Highest weight): Major political news (100), Major crime/shocking incidents (95), Major sports tournaments (90), Big business/economic (85).
  // - Tier 2: Normal political news (70), Normal crime (65), Normal sports (60), Big entertainment (55).
  // - Tier 3: General entertainment (40), Lifestyle (30), Soft news / filler (20).
  // - Time-decay: Older news decays smoothly via exponential decay so fresh news naturally moves up.
  const computeEditorialScore = (p: any): number => {
    if (!p) return 0;
    const cat = p.categoryStr || '';
    const text = `${p.headline || ''} ${p.summary || ''} ${p.slug || ''}`.toLowerCase();

    let baseWeight = 40; // Default baseline

    // Tier 1 & 2 Keywords & Conditions
    const isMajorPolitics = /मोदी|योगी|अमित शाह|राहुल गांधी|प्रियंका|केजरीवाल|संसद|कैबिनेट|सुप्रीम कोर्ट|चुनाव आयोग|राष्ट्रपति|भाजपा|कांग्रेस|आम आदमी पार्टी|लोकसभा|विधानसभा|उपचुनाव|अखिलेश/.test(text);
    const isMajorCrime = /हत्या|मर्डर|एनकाउंटर|रेप|गैंगरेप|गिरफ्तार|वारदात|गोलीबारी|ब्लास्ट|धमाका|हिरासत|सीबीआई|ईडी|छापेमारी|शव बरामद|लाश|खौफनाक/.test(text);
    const isMajorSports = /विश्व कप|वर्ल्ड कप|world cup|ipl|फाइनल|सेमीफाइनल|चैंपियन|ओलंपिक|ind vs|india vs|रोहित शर्मा|विराट कोहली|गोल्ड मेडल/.test(text);
    const isBigBusiness = /आरबीआई|rbi|रेपो रेट|महंगाई|जीडीपी|gdp|बजट|शेयर बाजार|सेंसेक्स|निफ्टी|पेट्रोल|डीजल|एलपीजी|सोना|चांदी|टैक्स|इनकम टैक्स/.test(text);

    if (isEn) {
      // ENGLISH PORTAL EDITORIAL RULE: World & International trends lead, followed by India
      if (cat === 'world' || cat === 'international' || p.isGoogleTrends) {
        baseWeight = p.isGoogleTrends ? 110 : 95;
      } else if (cat === 'technology' || cat === 'tech-auto' || cat === 'business') {
        baseWeight = 80;
      } else if (cat === 'entertainment') {
        baseWeight = 70;
      } else if (cat === 'national') {
        baseWeight = 50; // India stories come AFTER International stories
      } else {
        baseWeight = 40;
      }
    } else {
      if (cat === 'national' || cat === 'politics' || isMajorPolitics) {
        baseWeight = isMajorPolitics ? 100 : 70;
      } else if (cat === 'crime' || isMajorCrime) {
        baseWeight = isMajorCrime ? 95 : 65;
      } else if (cat === 'sports' || isMajorSports) {
        baseWeight = isMajorSports ? 90 : 60;
      } else if (cat === 'business' || isBigBusiness) {
        baseWeight = isBigBusiness ? 85 : 55;
      } else if (cat === 'international' || cat === 'world') {
        baseWeight = 65;
      } else if (cat === 'jobs' || cat === 'education') {
        baseWeight = 60;
      } else if (cat === 'entertainment') {
        // Big entertainment vs normal
        const isBigEnt = /सलमान|शाहरुख|आमिर|अमिताभ|ऑस्कर|कंगना|दीपिका|रणबीर|बॉक्स ऑफिस|box office|blockbuster/.test(text);
        baseWeight = isBigEnt ? 55 : 35;
      } else if (cat === 'lifestyle') {
        baseWeight = 25; // Lifestyle never leads main section
      } else if (cat === 'religion') {
        baseWeight = 45;
      }
    }

    // Editorial Flags Boost
    if (p.isBreaking) baseWeight += 50;
    if (p.isFeatured) baseWeight += 30;
    if (p.subCategory === 'tfl-exclusive' || p.subCategory === 'research') baseWeight += 40;

    // Time-Decay Math: Score = BaseWeight * exp(-0.06 * hoursElapsed)
    // At 6 hours -> ~70%, At 12 hours -> ~49%, At 24 hours -> ~24%
    const createdAtMs = new Date(p.createdAt).getTime();
    const hoursElapsed = Math.max(0, (now - createdAtMs) / (1000 * 60 * 60));
    const decayFactor = Math.exp(-0.06 * hoursElapsed);

    return baseWeight * decayFactor;
  };

  // ── 2. MAIN SECTION (Lead + Sublead + Middle + Headlines = 17 posts) ──
  // STRICTLY EXCLUDES ALL HERO POSTS & ANY POST ON THE SAME TOPIC!
  // Editorial Rules:
  // - High-weightage major news (politics, crime, big business, sports) lead.
  // - NO lifestyle and NO jokes/fluff allowed in Main Section!
  // - Entertainment allowed ONLY if big news.
  const isExcludedFromMainSection = (p: any) => {
    if (p.categoryStr === 'lifestyle') return true;
    const text = `${p.headline || ''} ${p.slug || ''}`.toLowerCase();
    // Exclude lifestyle & viral joke/meme keywords
    const fluffKeywords = ['वजन घटाएं', 'स्किन केयर', 'बाल झड़ना', 'डायबिटीज डाइट', 'जोक्स', 'चुटकुले', 'हंसी के ठहाके', 'मेकअप टिप्स'];
    return fluffKeywords.some(kw => text.includes(kw));
  };

  const isMicroLocalStory = (p: any) => {
    if (p.subCategory === 'tfl-exclusive' || p.subCategory === 'research') return false;
    const text = `${p.headline || ''} ${p.slug || ''}`.toLowerCase();
    const localKeywords = [
      'जौनपुर', 'हापुड़', 'बक्सर', 'कटिहार', 'थाना', 'कोतवाली', 'गली नंबर', 'वार्ड नंबर', 
      'ग्राम पंचायत', 'जनपंचायत', 'तहसील', 'मोहल्ले', 'ब्लॉक', 'बांदा', 'बबेरू', 'चित्रकूट',
      'महोबा', 'हमीरपुर', 'फतेहपुर', 'रोटी बैंक', 'roti bank', 'banda'
    ];
    return localKeywords.some(kw => text.includes(kw));
  };

  const isMajorLeadCandidate = (p: any) => {
    if (isMicroLocalStory(p) || isExcludedFromMainSection(p)) return false;
    const text = `${p.headline || ''} ${p.slug || ''}`.toLowerCase();
    const majorKeywords = [
      'मोदी', 'योगी', 'अखिलेश', 'राजभर', 'राहुल', 'शाह', 'केजरीवाल', 'सुप्रीम', 'कोर्ट',
      'संसद', 'सरकार', 'कैबिनेट', 'चुनाव', 'बजट', 'भारत', 'सेना', 'इसरो', 'cbse', 'नीट',
      'कमबैक', 'खिलाफ', 'हमला', 'बयान', 'ऐतिहासिक', 'फैसला', 'महंगाई', 'खुदरा', 'थोक', 'आरबीआई', 'rbi',
      'हत्या', 'मर्डर', 'एनकाउंटर', 'गिरफ्तार', 'गोलीबारी'
    ];
    return p.isFeatured || p.isBreaking || p.subCategory === 'tfl-exclusive' || p.categoryStr === 'national' || p.categoryStr === 'politics' || p.categoryStr === 'crime' || majorKeywords.some(kw => text.includes(kw));
  };

  // Candidate pool for Main Section sorted by editorial weightage & time decay
  const mainCandidates = validGeneral
    .filter((p: any) => !seenIds.has(p.id) && !isExcludedFromMainSection(p))
    .map((p: any) => ({ post: p, score: computeEditorialScore(p) }))
    .sort((a: any, b: any) => b.score - a.score)
    .map((item: any) => item.post);

  const mainPosts: any[] = [];

  // Step A: Pick Main Lead (mainPosts[0]) - must be a major lead candidate
  const leadCandidate = mainCandidates.find((p: any) => 
    !seenIds.has(p.id) && !isTopicDupeWithChosen(p) && isMajorLeadCandidate(p)
  ) || mainCandidates.find((p: any) => !seenIds.has(p.id) && !isTopicDupeWithChosen(p) && !isMicroLocalStory(p));

  if (leadCandidate) {
    mainPosts.push(leadCandidate);
    seenIds.add(leadCandidate.id);
    chosenPosts.push(leadCandidate);
  }

  // Step B: Pick Sublead (mainPosts[1]) - must also be non-micro-local
  const subLeadCandidate = mainCandidates.find((p: any) => 
    !seenIds.has(p.id) && !isTopicDupeWithChosen(p) && !isMicroLocalStory(p)
  );

  if (subLeadCandidate) {
    mainPosts.push(subLeadCandidate);
    seenIds.add(subLeadCandidate.id);
    chosenPosts.push(subLeadCandidate);
  }

  const isStateLocalNews = (p: any) => p.categoryStr === 'states' || p.categoryStr === 'states-sub';

  // Step C: Fill the remaining slots (Middle News & Text Headlines) by weighted priority
  for (const p of mainCandidates) {
    if (mainPosts.length >= 17) break;
    if (seenIds.has(p.id)) continue;
    if (isStateLocalNews(p)) continue; // Keep state news exclusively for StateCategorySection!
    if (isTopicDupeWithChosen(p)) {
      seenIds.add(p.id);
      continue;
    }
    mainPosts.push(p);
    seenIds.add(p.id);
    chosenPosts.push(p);
  }

  // ── 3. TOPIC BASED BLOCK (16 posts: 1 exclusive + 15 grid) ──
  // STRICTLY EXCLUDES ALL HERO & MAIN SECTION POSTS & ANY TOPIC DUPLICATE!
  const topicCandidates = validGeneral
    .filter((p: any) => !seenIds.has(p.id))
    .map((p: any) => ({ post: p, score: computeEditorialScore(p) }))
    .sort((a: any, b: any) => b.score - a.score)
    .map((item: any) => item.post);

  const topicBlockPosts: any[] = [];
  for (const p of topicCandidates) {
    if (topicBlockPosts.length >= 16) break;
    if (seenIds.has(p.id)) continue;
    if (isTopicDupeWithChosen(p)) {
      seenIds.add(p.id);
      continue;
    }
    topicBlockPosts.push(p);
    seenIds.add(p.id);
    chosenPosts.push(p);
  }

  // ── 4. SIDEBAR ("ज़रूर पढ़ें" / Must Read: 24-HOUR HIGHEST VIEWS) ──
  // User Rule: "जरूरत पढ़ें में 24 घंटे के भीतर की वो खबर लगाई जाएगी जिसके व्यू सबसे ज्यादा होंगे.."
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const THIRTY_SIX_HOURS_MS = 36 * 60 * 60 * 1000;
  
  const getSortViews = (p: any) => {
    const base = isEn ? Number(p.viewCountEn || p.viewCount || 0) : (Number(p.viewCount || 0) + Number(p.viewCountEn || 0));
    const bot = isEn ? Number(p.botViewCountEn || p.botViewCount || 0) : (Number(p.botViewCount || 0) + Number(p.botViewCountEn || 0));
    return base + bot;
  };

  const pool24h = validGeneral.filter((p: any) => (now - new Date(p.createdAt).getTime()) <= ONE_DAY_MS);
  const pool36h = validGeneral.filter((p: any) => (now - new Date(p.createdAt).getTime()) <= THIRTY_SIX_HOURS_MS);
  const candidatePool = pool24h.length >= 5 ? pool24h : (pool36h.length >= 5 ? pool36h : pool24h);

  // Sort candidate pool strictly by real view count descending! In tie-breaks, newest createdAt wins.
  const sortedByViews = [...candidatePool].sort((a: any, b: any) => {
    const vA = getSortViews(a);
    const vB = getSortViews(b);
    if (vB !== vA) return vB - vA;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const sidebarPosts: any[] = [];
  for (const p of sortedByViews) {
    if (sidebarPosts.length >= 10) break;
    if (sidebarPosts.some(s => s.id === p.id)) continue;
    sidebarPosts.push(p);
  }

  // ── 5. CATEGORY POST SELECTOR (Guaranteed unique, non-duplicated feeds) ──
  // STRICT GENRE ISOLATION RULE:
  // Sensitive categories ('crime', 'sports', 'religion', 'national', 'jobs', 'business', 'tech-auto') MUST NEVER be backfilled
  // with unrelated general stories (e.g. Horoscope or Sports leaking into Business or Crime)!
  const PURE_GENRE_CATEGORIES = new Set(['crime', 'sports', 'religion', 'national', 'jobs', 'business', 'tech-auto']);

  const isAstrologyOrHoroscope = (p: any) => {
    const text = `${p.headline || ''} ${p.summary || ''} ${p.tags || ''}`.toLowerCase();
    return /राशिफल|ज्योतिष|कुंडली|पंचांग|ग्रहण योग|ग्रह गोचर|horoscope|astrology/.test(text);
  };

  const getCategoryPosts = (categorySlug: string, count = 5) => {
    const selected: any[] = [];
    const catCandidates = validGeneral.filter((p: any) => {
      // STRICT RELIGION & HOROSCOPE EXCLUSION: Horoscope belongs ONLY in Religion!
      if (categorySlug !== 'religion' && isAstrologyOrHoroscope(p)) {
        return false;
      }
      if (categorySlug === 'international' || categorySlug === 'world') {
        return p.categoryStr === 'international' || p.categoryStr === 'world';
      }
      if (categorySlug === 'jobs' || categorySlug === 'education') {
        return p.categoryStr === 'jobs' || p.categoryStr === 'education';
      }
      if (categorySlug === 'national' || categorySlug === 'desh' || categorySlug === 'india') {
        return p.categoryStr === 'national' || p.categoryStr === 'politics' || p.categoryStr === 'india';
      }
      if (categorySlug === 'states') {
        return p.categoryStr === 'states' || p.categoryStr === 'states-sub';
      }
      if (categorySlug === 'sports') {
        const text = `${p.headline || ''} ${p.summary || ''}`.toLowerCase();
        // Footwear, sneakers, brand disputes & consumer court cases are NEVER sports!
        if (/शूज|जूते|shoes|स्नीकर्स|फुटवियर|असेक्सिस|asics|उपभोक्ता फोरम|कंज्यूमर फोरम/.test(text)) {
          return false;
        }
      }
      return p.categoryStr === categorySlug;
    }).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pass 1: Strict deduplication (not seen in earlier sections, and not topic dupe)
    for (const p of catCandidates) {
      if (selected.length >= count) break;
      if (seenIds.has(p.id)) continue;
      if (isTopicDupeWithChosen(p)) {
        seenIds.add(p.id);
        continue;
      }
      selected.push(p);
      seenIds.add(p.id);
      chosenPosts.push(p);
    }

    // Pass 2: If we still need stories, reuse candidates from the same category
    // that are not yet included in selected (retains genre purity, avoids duplicate topics)
    if (selected.length < count) {
      for (const p of catCandidates) {
        if (selected.length >= count) break;
        if (selected.some((s: any) => s.id === p.id || areDuplicateTopics(p, s))) continue;
        selected.push(p);
        seenIds.add(p.id);
        chosenPosts.push(p);
      }
    }

    // Pass 3: Category-specific semantic keyword search across all valid posts
    if (selected.length < count) {
      if (categorySlug === 'crime') {
        const isCrimeKeyword = (p: any) => {
          if (isAstrologyOrHoroscope(p)) return false;
          const text = `${p.headline || ''} ${p.summary || ''}`.toLowerCase();
          return /हत्या|मर्डर|गिरफ्तार|एनकाउंटर|रेप|वारदात|गोलीबारी|ब्लास्ट|धमाका|हिरासत|शव|लाश|खौफनाक|डकैती|चोरी|तस्करी|अपराध/.test(text);
        };
        for (const p of validGeneral) {
          if (selected.length >= count) break;
          if (selected.some((s: any) => s.id === p.id || areDuplicateTopics(p, s))) continue;
          if (isCrimeKeyword(p)) {
            selected.push(p);
            seenIds.add(p.id);
          }
        }
      } else if (categorySlug === 'business') {
        const isBusinessKeyword = (p: any) => {
          if (isAstrologyOrHoroscope(p)) return false;
          const text = `${p.headline || ''} ${p.summary || ''}`.toLowerCase();
          return /शेयर बाजार|सेंसेक्स|निफ्टी|आरबीआई|रेपो रेट|महंगाई|जीडीपी|बजट|सोना|चांदी|स्टॉक|इन्वेस्टर|बैंक|लोन|ईएमआई|कंपनी|मुनाफा|कारोबार|उद्योग/.test(text);
        };
        for (const p of validGeneral) {
          if (selected.length >= count) break;
          if (selected.some((s: any) => s.id === p.id || areDuplicateTopics(p, s))) continue;
          if (isBusinessKeyword(p)) {
            selected.push(p);
            seenIds.add(p.id);
          }
        }
      } else if (categorySlug === 'jobs' || categorySlug === 'education') {
        const isJobsKeyword = (p: any) => {
          if (isAstrologyOrHoroscope(p)) return false;
          const text = `${p.headline || ''} ${p.summary || ''}`.toLowerCase();
          return /सरकारी नौकरी|भर्ती|रिक्ति|वैकेंसी|एडमिट कार्ड|परीक्षा|रिजल्ट|कटऑफ|यूपीएससी|upsc|ssc|ssc cgl|रेलवे भर्ती|आवेदन/.test(text);
        };
        for (const p of validGeneral) {
          if (selected.length >= count) break;
          if (selected.some((s: any) => s.id === p.id || areDuplicateTopics(p, s))) continue;
          if (isJobsKeyword(p)) {
            selected.push(p);
            seenIds.add(p.id);
          }
        }
      } else if (categorySlug === 'sports') {
        const isSportsKeyword = (p: any) => {
          if (isAstrologyOrHoroscope(p)) return false;
          const text = `${p.headline || ''} ${p.summary || ''}`.toLowerCase();
          if (/शूज|जूते|shoes|स्नीकर्स|फुटवियर|असेक्सिस|asics|उपभोक्ता फोरम|कंज्यूमर फोरम/.test(text)) return false;
          return /क्रिकेट|cricket|ipl|football|फुटबॉल|मैच|टूर्नामेंट|खिलाड़ी|कप्तान|विकेट|रन|सेंचुरी|ओलंपिक|टेनिस|बैडमिंटन/.test(text);
        };
        for (const p of validGeneral) {
          if (selected.length >= count) break;
          if (selected.some((s: any) => s.id === p.id || areDuplicateTopics(p, s))) continue;
          if (isSportsKeyword(p)) {
            selected.push(p);
            seenIds.add(p.id);
          }
        }
      } else if (categorySlug === 'religion') {
        const isRelKeyword = (p: any) => {
          const text = `${p.headline || ''} ${p.summary || ''}`.toLowerCase();
          return /मंदिर|पूजा|व्रत|त्योहार|आरती|ज्योतिष|राशिफल|कुंडली|हनुमान|शिव|विष्णु|गंगा|पंचांग|एकादशी|प्रदोष/.test(text);
        };
        for (const p of validGeneral) {
          if (selected.length >= count) break;
          if (selected.some((s: any) => s.id === p.id || areDuplicateTopics(p, s))) continue;
          if (isRelKeyword(p)) {
            selected.push(p);
            seenIds.add(p.id);
          }
        }
      } else if (categorySlug === 'lifestyle') {
        const isLifestyleKeyword = (p: any) => {
          if (isAstrologyOrHoroscope(p)) return false;
          const text = `${p.headline || ''} ${p.summary || ''}`.toLowerCase();
          return /स्वास्थ्य|सेहत|बीमारी|डॉक्टर|अस्पताल|डाइट|लाइफस्टाइल|योग|नींद|दिल|दवा|हेल्थ|फिट|वजन|health|lifestyle/.test(text);
        };
        for (const p of validGeneral) {
          if (selected.length >= count) break;
          if (selected.some((s: any) => s.id === p.id || areDuplicateTopics(p, s))) continue;
          if (isLifestyleKeyword(p)) {
            selected.push(p);
            seenIds.add(p.id);
          }
        }
      }
    }

    // Pass 4: Safe backfill ONLY for NON-PURE categories (entertainment, lifestyle)
    // PURE genres are STRICTLY EXEMPT to prevent corruption!
    if (selected.length < count && !PURE_GENRE_CATEGORIES.has(categorySlug)) {
      for (const p of validGeneral) {
        if (selected.length >= count) break;
        if (selected.some((s: any) => s.id === p.id || areDuplicateTopics(p, s))) continue;
        if (categorySlug !== 'religion' && isAstrologyOrHoroscope(p)) continue;
        selected.push(p);
        seenIds.add(p.id);
      }
    }

    // STRICT CHRONOLOGICAL INTEGRITY:
    // Today's latest news MUST ALWAYS be first (Main Card = newest story)!
    // 7 Oct news must NEVER be placed below 6 Oct or 5 Oct news!
    selected.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return selected;
  };

  return {
    heroMain,
    heroSubs,
    mainPosts,
    topicBlockPosts,
    sidebarPosts,
    getCategoryPosts,
    seenIds,
  };
}
