import type { Metadata } from 'next';
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { apiFetch, getArticlePageData } from "@/lib/actions";
import Header from "@/components/layout/Header";
import PhotoGalleryPost from "@/components/post/PhotoGalleryPost";
import VisualStoryPost from "@/components/post/VisualStoryPost";
import AdBlock from "@/components/home/AdBlock";
import { TweetCard, InstagramCard } from "@/components/post/ArticleSocialEmbed";
import InArticleRelatedNews from "@/components/post/InArticleRelatedNews";
import ArticleCoverImage from "@/components/post/ArticleCoverImage";
import AdsterraAd from "@/components/ads/AdsterraAd";
import NativeBannerAd from "@/components/ads/NativeBannerAd";
import ViewTracker from "@/components/analytics/ViewTracker";

import SocialEmbedLoader from "@/components/post/SocialEmbedLoader";
import { notFound } from "next/navigation";
import { getEditorialDesk } from "@/lib/editorialDesks";
import EditorialDeskCard from "@/components/post/EditorialDeskCard";
import PostViews, { getPostViews } from "@/components/common/PostViews";
import { getPostImage } from "@/lib/constants";
import ArticleJsonLd from "@/components/seo/ArticleJsonLd";
import ArticleSupportBanner from "@/components/post/ArticleSupportBanner";
import ContextualReadMore from "@/components/post/ContextualReadMore";
import MobileReadNextPrompt from "@/components/post/MobileReadNextPrompt";

// News Portal Best Practice: 60s Edge ISR Caching for Instant Page Transitions
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ category: string, slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const cleanSlug = decodeURIComponent(slug).replace(/\s+/g, '-');
  const postResponse = await apiFetch(`/articles/slug/${cleanSlug}`);
  const post = postResponse?.data;
  if (!post) {
    return { title: 'The Freelance | Latest News' };
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://news.thefreelance.in';
  const title = `${post.headline} | The Freelance`;
  const description = post.seoDesc || post.summary?.slice(0, 160) || '';
  const canonicalUrl = `${SITE_URL}/${post.categoryStr || category}/${post.slug}`;
  const imageUrl = post.image || `${SITE_URL}/logo.png`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'hi-IN': canonicalUrl,
        'hi': canonicalUrl,
        'en-IN': `${SITE_URL}/en/${post.categoryStr || category}/${post.slugEn || post.slug}`,
        'en': `${SITE_URL}/en/${post.categoryStr || category}/${post.slugEn || post.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'The Freelance',
      locale: 'hi_IN',
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 675,
          alt: post.headline,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@thefreelancein',
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ category: string, slug: string }> }) {
  const { category, slug } = await params;
  const decodedCategory = decodeURIComponent(category).replace(/\s+/g, '-');
  const cleanSlug = decodeURIComponent(slug).replace(/\s+/g, '-');
  
  const postResponse = await apiFetch(`/articles/slug/${cleanSlug}`);
  const post = postResponse?.data;

  if (!post) {
    notFound();
  }

  // Strict Editorial Isolation: If article is English-only, redirect to English portal
  if (post.isEnglishOnly) {
    const { redirect } = await import('next/navigation');
    redirect(`/en/${post.categoryStr || decodedCategory}/${post.slugEn || post.slug}`);
  }

  const postCategory = post.categoryStr || decodedCategory;
  const articleContext = await getArticlePageData(postCategory, 'hi');

  // 1. High-precision keyword extraction for topic clustering (e.g., नौकरी, भर्ती, परीक्षा, रिजल्ट, बजट, चुनाव, क्रिकेट)
  const postTags = post.tags ? post.tags.split(',').map((t: string) => t.trim().toLowerCase()).filter(Boolean) : [];
  const headlineWords = (post.headline || '')
    .replace(/[^\u0900-\u097Fa-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .map((w: string) => w.trim().toLowerCase())
    .filter((w: string) => w.length >= 3 && !['बड़ा', 'बड़ी', 'इसको', 'लेकर', 'अपडेट', 'खबर', 'जानिए', 'देखिए', 'होगा', 'होगी', 'होने', 'सकता', 'सकती', 'किया', 'किए'].includes(w));

  // Determine top topic search term
  const primaryTopicTerm = postTags[0] || headlineWords[0] || '';

  // Helper to detect if two headlines are covering the exact same event / rewrite
  const stopWords = new Set([
    'और', 'के', 'में', 'से', 'का', 'की', 'को', 'तक', 'हैं', 'है', 'क्या', 'पर', 'ये', 'वह', 'आज', 'था', 'थी', 'थीं',
    'थे', 'ने', 'भी', 'तो', 'ही', 'किया', 'किए', 'दिया', 'गया', 'गई', 'गए', 'हुए', 'हुआ', 'हुई', 'रहा', 'रही', 'रहे',
    'लेकर', 'बड़ा', 'बड़ी', 'बड़े', 'इस', 'उस', 'इन', 'उन', 'यह', 'अब', 'जब', 'तब', 'हो', 'कर'
  ]);

  const getHeadlineWords = (text: string) => {
    if (!text) return new Set<string>();
    return new Set(
      text.toLowerCase()
        .replace(/[^\u0900-\u097Fa-z0-9]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length >= 3 && !stopWords.has(w))
    );
  };

  const areHeadlinesTooSimilar = (h1: string, h2: string) => {
    if (!h1 || !h2) return false;
    if (h1.trim() === h2.trim()) return true;
    const set1 = getHeadlineWords(h1);
    const set2 = getHeadlineWords(h2);
    if (set1.size === 0 || set2.size === 0) return false;
    let overlapCount = 0;
    for (const w of set1) {
      if (set2.has(w)) overlapCount++;
    }
    const unionSize = set1.size + set2.size - overlapCount;
    const jaccard = unionSize > 0 ? overlapCount / unionSize : 0;
    return overlapCount >= 3 || jaccard >= 0.35;
  };

  // Strict filter to exclude current article across ID, slug, and headline similarity
  const isCurrentPost = (p: any) => {
    if (!p) return true;
    if (String(p.id) === String(post.id)) return true;
    if (p.slug && post.slug && p.slug === post.slug) return true;
    if (post.slugEn && p.slug === post.slugEn) return true;
    if (p.headline && post.headline && areHeadlinesTooSimilar(p.headline, post.headline)) return true;
    return false;
  };

  // 2. Fetch live targeted posts from backend API specifically for this topic/category
  let liveTargetedPosts: any[] = [];
  try {
    const searchParam = primaryTopicTerm ? `&search=${encodeURIComponent(primaryTopicTerm)}` : '';
    const liveRes = await apiFetch(`/articles?compact=true&category=${postCategory}&limit=12${searchParam}`);
    if (liveRes?.data && Array.isArray(liveRes.data)) {
      liveTargetedPosts = liveRes.data.filter((p: any) => !isCurrentPost(p));
    }
  } catch {}

  // 3. Pool posts from live targeted query + in-memory category posts
  const combinedCategoryPool = [
    ...liveTargetedPosts,
    ...articleContext.categoryPosts.filter((p: any) => !isCurrentPost(p))
  ];

  // Robust deduplication across ID, slug, and headline
  const uniqueCategoryPosts: any[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const seenHeadlines = new Set<string>();

  // Mark current post as already seen so it can never enter
  seenIds.add(String(post.id));
  if (post.slug) seenSlugs.add(post.slug);
  if (post.slugEn) seenSlugs.add(post.slugEn);
  if (post.headline) seenHeadlines.add(post.headline.trim());

  for (const p of combinedCategoryPool) {
    if (isCurrentPost(p)) continue;
    const idKey = String(p.id);
    const slugKey = (p.slug || '').trim();
    const headKey = (p.headline || '').trim();

    if (seenIds.has(idKey) || (slugKey && seenSlugs.has(slugKey)) || (headKey && seenHeadlines.has(headKey))) {
      continue;
    }
    seenIds.add(idKey);
    if (slugKey) seenSlugs.add(slugKey);
    if (headKey) seenHeadlines.add(headKey);
    uniqueCategoryPosts.push(p);
  }

  // Score relevance: high score for tag and keyword matches
  const scoredRelated = uniqueCategoryPosts.map((p: any) => {
    let score = 0;
    const pTags = p.tags ? p.tags.split(',').map((t: string) => t.trim().toLowerCase()) : [];
    const pHead = (p.headline || '').toLowerCase();
    
    // Tag match is strongest indicator of same topic
    for (const tag of postTags) {
      if (pTags.includes(tag)) score += 5;
      if (pHead.includes(tag)) score += 3;
    }
    // Headline keyword match
    for (const word of headlineWords) {
      if (pHead.includes(word)) score += 3;
      if (pTags.includes(word)) score += 2;
    }
    // Same subCategory bonus
    if (p.subCategory && post.subCategory && p.subCategory === post.subCategory) {
      score += 4;
    }
    return { post: p, score };
  });

  scoredRelated.sort((a: any, b: any) => b.score - a.score);
  const relevantCategoryPosts = scoredRelated.map((item: any) => item.post);

  // Fallback: strictly prefer same category first
  const fallbackRelated = (relevantCategoryPosts.length >= 6
    ? relevantCategoryPosts
    : [
        ...relevantCategoryPosts,
        ...articleContext.categoryPosts.filter((p: any) => !isCurrentPost(p) && !uniqueCategoryPosts.some((r: any) => String(r.id) === String(p.id) || r.slug === p.slug)),
        ...articleContext.recentPosts.filter((p: any) => !isCurrentPost(p) && !uniqueCategoryPosts.some((r: any) => String(r.id) === String(p.id) || r.slug === p.slug))
      ]).filter((p: any) => !isCurrentPost(p)).slice(0, 8);
  const relatedPosts = fallbackRelated;

  // Selected top 2 related articles for high-impact in-article callouts (STRICTLY UNIQUE & DISTINCT EVENTS)
  const inArticleCallout1 = relatedPosts.find((p: any) => 
    p && !isCurrentPost(p)
  ) || null;

  const inArticleCallout2 = relatedPosts.find((p: any) => 
    p && 
    !isCurrentPost(p) &&
    String(p.id) !== String(inArticleCallout1?.id) &&
    p.slug !== inArticleCallout1?.slug &&
    !areHeadlinesTooSimilar(p.headline, inArticleCallout1?.headline || '')
  ) || null;

  const bottomNextStory = relatedPosts.find((p: any) =>
    p &&
    !isCurrentPost(p) &&
    String(p.id) !== String(inArticleCallout1?.id) &&
    String(p.id) !== String(inArticleCallout2?.id) &&
    p.slug !== inArticleCallout1?.slug &&
    p.slug !== inArticleCallout2?.slug &&
    !areHeadlinesTooSimilar(p.headline, inArticleCallout1?.headline || '') &&
    !areHeadlinesTooSimilar(p.headline, inArticleCallout2?.headline || '')
  ) || null;

  // Sidebar: Prioritize same category posts first, then other beats
  const sidebarCategoryPosts = uniqueCategoryPosts.slice(0, 6);
  const sidebarPosts = (sidebarCategoryPosts.length >= 6
    ? sidebarCategoryPosts
    : [
        ...sidebarCategoryPosts,
        ...articleContext.recentPosts.filter((p: any) => !isCurrentPost(p) && !sidebarCategoryPosts.some((s: any) => String(s.id) === String(p.id) || s.slug === p.slug))
      ]).slice(0, 6);
  const visualStories = articleContext.visualStories || [];

  const categoryStr = post.categoryStr || decodedCategory;
  const categoryObj = articleContext.categories.find((c: any) => c.slug === categoryStr);
  const categoryName = categoryObj?.name || categoryStr.toUpperCase();
  const categoryColor = categoryObj?.color || "#ef4444";

  const getAd = (slot: string) => articleContext.ads?.find((a: any) => a.slotName === slot);
  const midAd = getAd('mid-article');
  const sidebarAd = getAd('sidebar-rect');
  const topAd = getAd('top-banner');

  // Parse extraMeta from keywords if available
  let extraMeta: any = null;
  try {
    if (post.keywords && (post.keywords.startsWith('{') || post.keywords.startsWith('['))) {
      extraMeta = JSON.parse(post.keywords);
    }
  } catch {}

  // Detect corrupted highlights (??? marks = encoding failure) and use summary as fallback
  const isCorrupted = (text: string) => {
    if (!text) return true;
    const questionMarkCount = (text.match(/\?/g) || []).length;
    return questionMarkCount > 5; // 5+ question marks = corrupted Hindi encoding
  };

  const rawHighlights = (Array.isArray(extraMeta?.highlights) && extraMeta.highlights.length > 0)
    ? extraMeta.highlights
    : [];

  const validHighlights = rawHighlights.filter((h: string) => !isCorrupted(h));

  const highlights = validHighlights.length > 0
    ? validHighlights
    : post.summary
    ? [
        post.summary,
        `इस खबर से जुड़े सभी पहलुओं की जांच और निगरानी संबंधित विभागों द्वारा की जा रही है।`,
        `विशेषज्ञों के अनुसार इस घटनाक्रम का आम जनता पर सीधा असर पड़ सकता है।`
      ]
    : [];


  // Only render a TweetCard if there is a verified, authentic real tweet URL with isReal === true
  const prominentTweet = (extraMeta?.tweet?.isReal && extraMeta?.tweet?.tweetUrl && (extraMeta.tweet.tweetUrl.includes('x.com/') || extraMeta.tweet.tweetUrl.includes('twitter.com/')))
    ? extraMeta.tweet
    : null;

  // Detect political news for dedicated campaign ad
  const isPolitical = 
    categoryStr === 'politics' || 
    categoryStr === 'special' ||
    post.categoryStr === 'politics' || 
    post.tags?.toLowerCase().includes('राजनीति') || 
    post.tags?.toLowerCase().includes('politics') || 
    post.tags?.toLowerCase().includes('चुनाव') || 
    post.headline?.includes('चुनाव') || 
    post.headline?.includes('राजनीति') ||
    post.headline?.includes('पार्टी') ||
    post.headline?.includes('सरकार') ||
    post.headline?.includes('भाजपा') ||
    post.headline?.includes('कांग्रेस') ||
    post.headline?.includes('विपक्ष');

  const ensureHtml = (raw: string) => {
    if (!raw) return '';
    if (raw.includes('<p>') || raw.includes('<h2>') || raw.includes('<div>') || raw.includes('<iframe')) {
      return raw;
    }
    return raw
      .split(/\n\s*\n/)
      .map(block => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('### ')) {
          return `<h2 class="text-xl md:text-2xl font-bold text-white mt-8 mb-4">${trimmed.replace(/^###\s+/, '')}</h2>`;
        }
        if (trimmed.startsWith('## ')) {
          return `<h2 class="text-xl md:text-2xl font-bold text-white mt-8 mb-4">${trimmed.replace(/^##\s+/, '')}</h2>`;
        }
        if (trimmed.startsWith('> ')) {
          return `<blockquote class="border-l-4 border-red-500 pl-4 my-6 italic text-gray-300 bg-red-950/10 py-2 rounded-r-lg">${trimmed.replace(/^>\s+/, '')}</blockquote>`;
        }
        if (trimmed.startsWith('---')) {
          return '<hr class="my-8 border-gray-800" />';
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed
            .split('\n')
            .map(li => `<li>${li.replace(/^[-*]\s+/, '').replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')}</li>`)
            .join('');
          return `<ul class="list-disc list-inside my-4 space-y-2 text-gray-300 leading-relaxed">${items}</ul>`;
        }
        const parsed = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return `<p class="my-4 text-gray-300 leading-relaxed text-base md:text-lg">${parsed}</p>`;
      })
      .filter(Boolean)
      .join('\n');
  };

  // Split content intelligently to distribute ads, callouts, and carousels cleanly across paragraphs and headings
  const renderContentWithInLineAd = (rawContent: string) => {
    const htmlContent = ensureHtml(rawContent);

    // Extract all top-level semantic HTML blocks (paragraphs, headings, blockquotes, lists, divs)
    const blocks = htmlContent.match(/<(p|h2|h3|blockquote|ul|ol|div|table|section)[^>]*>[\s\S]*?<\/\1>/gi);

    if (blocks && blocks.length >= 4) {
      const h2Indices: number[] = [];
      blocks.forEach((b, i) => {
        if (/^<h2/i.test(b.trim())) h2Indices.push(i);
      });

      let cut1 = 2; // after 2 paragraphs: 'पहला सही जगह पर है'
      let cut2 = 4; // after next 2 paras / above 2nd headline: 'दो पैरा (दूसरी हेडलाइन के ऊपर) एड कीजिए'
      let cut3 = 6; // after next headline and its paragraph: 'अगली हेडलाइन और उसके पैराग्राफ के बाद संबंधित बड़ी खबर'

      if (h2Indices.length >= 2) {
        // Cut 1: before 1st h2, or after opening 2 paragraphs
        cut1 = Math.min(Math.max(1, h2Indices[0]), 2);
        // Cut 2: right above 2nd h2 ("दूसरी हेडलाइन के ऊपर")
        cut2 = h2Indices[1];
        // Cut 3: after next headline (the 2nd h2) and its following paragraph ("अगली हेडलाइन और उसके पैरागफ के बाद")
        cut3 = Math.min(h2Indices[1] + 2, blocks.length - 1);
        if (h2Indices.length >= 3 && h2Indices[2] <= cut3) {
          cut3 = h2Indices[2];
        }
      } else if (blocks.length >= 6) {
        cut1 = 2;
        cut2 = 4;
        cut3 = Math.min(6, blocks.length - 1);
      } else {
        cut1 = Math.max(1, Math.floor(blocks.length * 0.3));
        cut2 = Math.max(cut1 + 1, Math.floor(blocks.length * 0.65));
        cut3 = blocks.length;
      }

      // Enforce strict monotonically increasing bounds
      if (cut2 <= cut1) cut2 = cut1 + 1;
      if (cut3 <= cut2 && cut2 < blocks.length) cut3 = cut2 + 1;

      const section1 = blocks.slice(0, cut1).join('\n');
      const section2 = blocks.slice(cut1, cut2).join('\n');
      const section3 = cut3 > cut2 ? blocks.slice(cut2, cut3).join('\n') : '';
      const section4 = cut3 < blocks.length ? blocks.slice(cut3).join('\n') : '';

      return (
        <>
          {/* Section 1: Opening Article Paragraphs */}
          <div dangerouslySetInnerHTML={{ __html: section1 }} />

          {/* Point A: 'यह भी पढ़ें' Callout (Guaranteed Distinct) */}
          {inArticleCallout1 && (
            <ContextualReadMore post={inArticleCallout1} prefix="यह भी पढ़ें" isEn={false} />
          )}

          {/* Section 2: Paragraphs up to 2nd Headline */}
          <div dangerouslySetInnerHTML={{ __html: section2 }} />

          {/* Point B: Centered In-Article Adsterra Banner (Above 2nd Headline) */}
          <div className="my-8 flex justify-center">
            <AdsterraAd format="in-article" />
          </div>

          {/* Point C: Social Media Mid-Article Reaction (if real) */}
          {prominentTweet && (
            <div className="my-6">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                सोशल मीडिया पर प्रमुख प्रतिक्रिया
              </div>
              <TweetCard 
                authorName={prominentTweet.authorName}
                handle={prominentTweet.handle}
                content={prominentTweet.content}
                date={new Date(post.createdAt).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric' })}
                likes={prominentTweet.likes || "14.2K"}
                reposts={prominentTweet.reposts || "3.5K"}
              />
            </div>
          )}

          {/* Section 3: Next Headline + Paragraph */}
          {section3 && <div dangerouslySetInnerHTML={{ __html: section3 }} />}

          {/* Point D: 'संबंधित बड़ी खबर' Callout (Guaranteed Distinct from Callout 1 and Current Post) */}
          {inArticleCallout2 && (
            <ContextualReadMore post={inArticleCallout2} prefix="संबंधित बड़ी खबर" isEn={false} />
          )}

          {/* Section 4: Final Analysis / Conclusion Paragraphs */}
          {section4 && <div dangerouslySetInnerHTML={{ __html: section4 }} />}
        </>
      );
    }

    // Short article fallback: clean single callout then full content
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        {inArticleCallout1 && (
          <ContextualReadMore post={inArticleCallout1} prefix="यह भी पढ़ें" isEn={false} />
        )}
        <div className="my-6 flex justify-center">
          <AdsterraAd format="in-article" />
        </div>
      </>
    );
  };

  const desk = getEditorialDesk(post.categoryStr || categoryStr);

  return (
    <div className="w-full min-h-screen bg-[#0b0c10] pb-16 text-white font-sans">
      <ViewTracker articleId={post.id} />
      <SocialEmbedLoader />
      <ArticleJsonLd post={post} category={categoryStr} desk={desk} isEn={false} />
      <Header />

      {/* Top Banner Ad (Below Header) */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-4 pb-2 flex justify-center">
        {topAd?.isActive && topAd.adHtml ? (
          <AdBlock width="970px" height="90px" html={topAd.adHtml} />
        ) : (
          <AdsterraAd format="leaderboard" />
        )}
      </div>
      
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 py-4 border-b border-gray-800/80">
          <Link href="/" className="hover:text-red-500 transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            होम
          </Link>
          <span className="text-gray-600">/</span>
          <Link href={`/${categoryStr}`} className="hover:text-red-500 transition-colors font-bold text-gray-300">
            {categoryName}
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-gray-500 truncate max-w-[200px] md:max-w-md">{post.headline}</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pt-6">
          
          {/* Main Article Column (8 Cols) */}
          <article className="xl:col-span-8 flex flex-col">
            
            {/* Category Pill + Read Time */}
            <div className="flex items-center gap-3 mb-4">
              <span 
                className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-sm"
                style={{ backgroundColor: categoryColor }}
              >
                {categoryName}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1 font-medium" title="अनुमानित पढ़ने का समय">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><polyline points="12 6 12 12 16 14" strokeWidth="2"/></svg>
                पढ़ने में समय: {Math.max(1, Math.ceil(((post.content || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length || 300) / 180))} मिनट
              </span>
              {post.isBreaking && (
                <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-widest animate-pulse">
                  BREAKING
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white leading-[1.25] tracking-tight mb-4">
              {post.headline}
            </h1>

            {/* Sub-headline / Lead Summary */}
            {post.summary && (
              <div className="text-lg sm:text-xl text-gray-300 font-medium leading-relaxed mb-6 border-l-4 border-red-600 pl-4 py-1.5 bg-gray-900/40 rounded-r-lg article-lead-summary">
                {post.summary}
              </div>
            )}

            {/* Author Info + Date + Share Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y border-gray-800 py-3.5 mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-700 bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-white text-lg font-black shadow-lg flex-shrink-0">
                  <span>✍️</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-white font-bold text-sm">{desk.nameHi}</span>
                    <svg className="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs mt-0.5">
                    <span className="text-red-400 font-semibold">{desk.badge}</span>
                    <span>•</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • अपडेटेड
                    </span>
                    <span>•</span>
                    <PostViews views={getPostViews(post, false)} size="sm" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {post.headlineEn && (
                  <Link
                    href={`/en/${post.categoryStr}/${post.slugEn || post.slug}`}
                    className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/40 px-3 py-1 rounded-full font-bold transition-all text-xs flex items-center gap-1.5"
                  >
                    <span>🌐</span>
                    <span>Read in English →</span>
                  </Link>
                )}
                {/* Share Icons */}
                <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold mr-1">शेयर करें:</span>
                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.headline + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center transition-all border border-[#25D366]/20 shadow-sm"
                  title="Share on WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.972.553 1.935.845 3.013.845h.002c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.748 0-3.388-.456-4.832-1.251l-5.168 1.355 1.378-5.041c-.917-1.503-1.44-3.265-1.44-5.063 0-5.518 4.482-10 10-10s10 4.482 10 10z"/></svg>
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.headline)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white flex items-center justify-center transition-all border border-sky-500/20 shadow-sm"
                  title="Share on X"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white flex items-center justify-center transition-all border border-blue-600/20 shadow-sm"
                  title="Share on Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z"/></svg>
                </a>
              </div>
            </div>
          </div>

            {/* Featured Image with Caption & Credit */}
            <div className="mb-8">
              <div className="relative w-full aspect-[16/9] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
                <ArticleCoverImage 
                  src={post.image || ""} 
                  alt={post.headline} 
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500 px-1 font-medium">
                <span>📷 {post.headline} — मुख्य घटनाक्रम</span>
                <span>फोटो साभार: रॉयटर्स / एजेंसीज़ / सोशल मीडिया</span>
              </div>
            </div>

            {/* Key Highlights Box */}
            {highlights.length > 0 && (
              <div className="mb-8 bg-[#12141c] border-2 border-red-600/40 rounded-2xl p-6 shadow-xl relative overflow-hidden article-highlights-box">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-6 bg-red-600 rounded-full"></span>
                  <h3 className="text-lg font-black text-white tracking-wide uppercase">
                    खबर की बड़ी बातें (Key Highlights)
                  </h3>
                </div>
                <ul className="space-y-3 text-[15px] text-gray-200">
                  {highlights.map((h: any, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}


            {/* Article Content with In-Line Ad Injection */}
            {(post.postType === 'general' || (post.postType === 'gallery' && (!post.slides || post.slides.length <= 1))) && post.content && (
              <div className="article-content">
                {renderContentWithInLineAd(post.content)}
              </div>
            )}

            {/* OFFICIAL MOVIE / VIDEO TRAILER EMBED */}
            {extraMeta?.youtubeId && (
              <div className="my-8 bg-[#12141c] border border-gray-800 rounded-2xl p-5 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-6 bg-red-600 rounded-full"></span>
                  <h3 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    ऑफिशियल ट्रेलर / वीडियो झलक (Official Video)
                  </h3>
                </div>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-800 shadow-lg bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${extraMeta.youtubeId}?rel=0`}
                    title="Official Movie Trailer / Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
              </div>
            )}

            {/* Gallery Post Renderer */}
            {post.postType === 'gallery' && post.slides && post.slides.length > 1 && (
              <div className="my-8">
                <PhotoGalleryPost baseSlug={`${categoryStr}/${slug}`} slides={post.slides} />
                {post.content && (
                  <div className="article-content mt-10 pt-8 border-t border-gray-800">
                    <h3 className="text-xl md:text-2xl font-black mb-6 text-white">विस्तृत रिपोर्ट</h3>
                    {renderContentWithInLineAd(post.content)}
                  </div>
                )}
              </div>
            )}

            {/* Visual Story Post Renderer */}
            {post.postType === 'visual-story' && (
              <div className="my-10 flex flex-col items-center">
                <div className="w-full border-b border-gray-800 pb-4 mb-6">
                   <h2 className="text-xl font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                     <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                     Visual Web Story
                   </h2>
                </div>
                <VisualStoryPost slides={post.slides || []} />
                
                {post.content && (
                  <div className="article-content mt-10 w-full pt-8 border-t border-gray-800">
                     <h3 className="text-2xl font-black mb-6">विस्तृत रिपोर्ट</h3>
                     <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
                  </div>
                )}
              </div>
            )}

            {/* Native Banner Immediately After Article Content */}
            <div className="my-6 w-full">
              <NativeBannerAd />
            </div>

            {/* Reader Support Banner (UPI + PayPal) - Positioned immediately after Native Ad */}
            <ArticleSupportBanner isEn={false} />

            {/* Related News Slider (Positioned below Support Banner to boost reader engagement) */}
            <InArticleRelatedNews posts={relatedPosts} />

            {/* Tags Cloud */}
            <div className="flex items-center gap-3 mt-6 mb-8 pt-6 border-t border-gray-800">
              <span className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-1.5 flex-shrink-0">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                टैग्स:
              </span>
              <div className="flex gap-2 flex-wrap">
                {post.tags?.split(',').map((tag: string) => {
                  const cleanTag = tag.trim();
                  if (!cleanTag) return null;
                  return (
                    <Link 
                      key={cleanTag} 
                      href={`/tags/${encodeURIComponent(cleanTag)}`}
                      className="bg-[#1a1d26] hover:bg-red-600 hover:text-white text-gray-300 text-xs px-3.5 py-1.5 rounded-full border border-gray-800 transition-colors font-medium article-tag-pill"
                    >
                      #{cleanTag}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* EDITORIAL DESK ATTRIBUTION & E-E-A-T CARD */}
            <EditorialDeskCard desk={desk} />

            {/* Post-Article Ad Banner (728x90 Desktop / 300x250 Mobile) */}
            <div className="my-6 w-full flex justify-center">
              <AdsterraAd format="in-feed" />
            </div>

            {/* Previous & Next Navigation */}
            <div className="my-8 flex flex-col sm:flex-row gap-5">
               {fallbackRelated[0] && (
                 <Link href={`/${fallbackRelated[0].categoryStr}/${fallbackRelated[0].slug}`} className="flex-1 bg-[#12141c] p-5 rounded-2xl border border-gray-800 hover:border-red-600 transition-all group article-nav-card">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5 block">पिछली खबर</span>
                    <h4 className="text-white font-bold text-sm group-hover:text-red-500 transition-colors line-clamp-2 leading-snug">
                      {fallbackRelated[0].headline}
                    </h4>
                 </Link>
               )}
               {fallbackRelated[1] && (
                 <Link href={`/${fallbackRelated[1].categoryStr}/${fallbackRelated[1].slug}`} className="flex-1 bg-[#12141c] p-5 rounded-2xl border border-gray-800 hover:border-red-600 transition-all group text-right article-nav-card">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5 block">अगली खबर</span>
                    <h4 className="text-white font-bold text-sm group-hover:text-red-500 transition-colors line-clamp-2 leading-snug">
                      {fallbackRelated[1].headline}
                    </h4>
                 </Link>
               )}
            </div>

            {/* RELATED VISUAL STORIES CAROUSEL/GRID */}
            {visualStories.length > 0 && (
              <div className="my-10 border-t border-gray-800 pt-8 visual-story-container">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-6 bg-red-600 rounded-full"></span>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">
                      संबंधित विजुअल स्टोरीज (Web Stories)
                    </h2>
                  </div>
                  <span className="text-xs text-red-500 font-bold uppercase tracking-wider">
                    TAP TO VIEW
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {visualStories.slice(0, 4).map((story: any) => (
                    <Link 
                      href={`/web-stories/${story.slug}`} 
                      key={story.id} 
                      className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-gray-800 hover:border-red-500 transition-all shadow-xl hover:scale-[1.02] visual-story-card"
                    >
                      <Image 
                        src={story.image || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"} 
                        alt={story.headline || story.title} 
                        fill 
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                      
                      {/* Web Story Badge */}
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        STORY
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h4 style={{ color: '#ffffff' }} className="text-white text-xs font-bold leading-snug line-clamp-3 group-hover:text-red-400 transition-colors">
                          {story.headline || story.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* RELATED ARTICLES (संबंधित विषय की बड़ी खबरें) */}
            <div className="my-8 border-t border-gray-800 pt-8">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-2.5 h-6 bg-red-600 rounded-full animate-pulse"></span>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  {primaryTopicTerm ? `‘${primaryTopicTerm}’ व ${categoryName} से जुड़ी अन्य बड़ी खबरें` : `${categoryName} की अन्य महत्वपूर्ण खबरें`}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {fallbackRelated.map((p: any) => (
                  <Link href={`/${p.categoryStr}/${p.slug}`} key={p.id} className="group flex flex-col bg-[#12141c] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all shadow-md related-article-card">
                    <div className="relative w-full h-40 overflow-hidden">
                      <Image 
                        src={getPostImage(p)} 
                        alt={p.headline} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {p.categoryStr?.toUpperCase()}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <h4 className="text-gray-200 text-sm font-bold group-hover:text-red-500 leading-snug line-clamp-2 mb-2 transition-colors">
                        {p.headline}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-[11px]">
                          {new Date(p.createdAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        <PostViews views={getPostViews(p, false)} size="xs" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Ad Immediately After Related Articles */}
            <div className="my-8 w-full flex justify-center">
              <AdsterraAd format="leaderboard" />
            </div>

          </article>

          {/* RIGHT SIDEBAR (4 Cols) */}
          <aside className="xl:col-span-4 flex flex-col gap-6">
            
            {/* 1. Rectangle Ad at Top of Sidebar */}
            <AdsterraAd format="rectangle" />

            {/* 2. Trending News Widget */}
            <div className="bg-[#12141c] p-6 rounded-2xl border border-gray-800 shadow-xl">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-3">
                <span className="w-2 h-5 bg-red-600 rounded-full"></span>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  ताज़ा और ट्रेंडिंग खबरें
                </h3>
              </div>
              <div className="flex flex-col divide-y divide-gray-800/60">
                {sidebarPosts.map((p: any, idx: number) => (
                  <Link href={`/${p.categoryStr}/${p.slug}`} key={p.id} className="py-3.5 first:pt-0 last:pb-0 flex gap-3 group items-center">
                    <span className="text-xl font-black text-gray-600 group-hover:text-red-500 transition-colors w-6 flex-shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="relative w-20 h-14 flex-shrink-0 rounded-xl overflow-hidden border border-gray-800 bg-[#12141c]">
                      <Image src={getPostImage(p)} alt={p.headline} fill sizes="80px" className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-red-500 font-black uppercase block mb-0.5">
                        {p.categoryStr}
                      </span>
                      <h4 className="text-gray-300 text-xs font-bold line-clamp-2 group-hover:text-white transition-colors leading-snug mb-1">
                        {p.headline}
                      </h4>
                      <PostViews views={getPostViews(p, false)} size="xs" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 3. Skyscraper Ad at Bottom of Sidebar */}
            <div className="flex justify-center mt-2">
              <AdsterraAd format="skyscraper" />
            </div>

          </aside>

        </div>
      </div>

      {/* MOBILE STICKY READ-NEXT PROMPT (TRIGGERS AFTER 40% SCROLL) */}
      {bottomNextStory && (
        <MobileReadNextPrompt post={bottomNextStory} isEn={false} />
      )}
    </div>
  );
}
