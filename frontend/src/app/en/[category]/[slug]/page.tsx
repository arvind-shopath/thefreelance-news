import type { Metadata } from 'next';
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { apiFetch, getDbEn } from "@/lib/actions";
import Header from "@/components/layout/Header";
import PhotoGalleryPost from "@/components/post/PhotoGalleryPost";
import ArticleCoverImage from "@/components/post/ArticleCoverImage";
import SocialEmbedLoader from "@/components/post/SocialEmbedLoader";
import { notFound } from "next/navigation";
import { getEditorialDesk } from "@/lib/editorialDesks";
import EditorialDeskCard from "@/components/post/EditorialDeskCard";
import ViewTracker from "@/components/analytics/ViewTracker";
import PostViews, { getPostViews } from "@/components/common/PostViews";
import AdsterraAd from "@/components/ads/AdsterraAd";
import NativeBannerAd from "@/components/ads/NativeBannerAd";
import ArticleJsonLd from "@/components/seo/ArticleJsonLd";
import ArticleSupportBanner from "@/components/post/ArticleSupportBanner";
import InArticleRelatedNews from "@/components/post/InArticleRelatedNews";
import ContextualReadMore from "@/components/post/ContextualReadMore";
import MobileReadNextPrompt from "@/components/post/MobileReadNextPrompt";

export async function generateMetadata({ params }: { params: Promise<{ category: string, slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const postResponse = await apiFetch(`/articles/slug/${slug}`);
  const post = postResponse?.data;
  if (!post) {
    return { title: 'The Freelance | English Edition' };
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://news.thefreelance.in';
  const headline = post.headlineEn || post.headline;
  const description = post.summaryEn || post.summary || '';
  const canonicalUrl = `${SITE_URL}/en/${post.categoryStr || category}/${post.slugEn || post.slug}`;
  const imageUrl = post.image || `${SITE_URL}/logo.png`;

  return {
    title: `${headline} | The Freelance`,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-IN': canonicalUrl,
        'en': canonicalUrl,
        'hi-IN': `${SITE_URL}/${post.categoryStr || category}/${post.slug}`,
        'hi': `${SITE_URL}/${post.categoryStr || category}/${post.slug}`,
      },
    },
    openGraph: {
      title: headline,
      description,
      url: canonicalUrl,
      siteName: 'The Freelance (English)',
      locale: 'en_US',
      type: 'article',
      images: [{ url: imageUrl, width: 1200, height: 675, alt: headline }],
    },
    twitter: {
      card: 'summary_large_image',
      title: headline,
      description,
      images: [imageUrl],
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

export default async function EnglishPostPage({ params }: { params: Promise<{ category: string, slug: string }> }) {
  const { category, slug } = await params;
  
  const postResponse = await apiFetch(`/articles/slug/${slug}?lang=en`);
  const post = postResponse?.data;

  if (!post) {
    notFound();
  }

  if (post.postType === 'visual-story' || post.postType === 'story') {
    const { redirect } = await import('next/navigation');
    redirect(`/web-stories/${post.slug}`);
  }

  // Strict Editorial Isolation: Never display Hindi content on the English portal
  const hasValidEnContent = Boolean(post.contentEn && !/[\u0900-\u097F]/.test(post.contentEn.slice(0, 150)));
  const isIndianTrend = Boolean(post.isGoogleTrends && (!post.trendsGeo || post.trendsGeo === 'IN'));
  if (isIndianTrend || (!hasValidEnContent && post.content && /[\u0900-\u097F]/.test(post.content.slice(0, 100)))) {
    const { redirect } = await import('next/navigation');
    redirect(`/${post.categoryStr || category}/${post.slug}`);
  }

  const ensureHtml = (raw: string) => {
    if (!raw) return '';
    if (raw.includes('<p>') || raw.includes('<h2>') || raw.includes('<div>')) {
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

  const headline = post.headlineEn || post.headline;
  const summary = post.summaryEn || post.summary;
  const content = ensureHtml(post.contentEn || post.content);

  const db = await getDbEn();
  const postCategory = post.categoryStr || category;

  // Extract English keywords for topic matching
  const postTags = post.tags ? post.tags.split(',').map((t: string) => t.trim().toLowerCase()).filter(Boolean) : [];
  const headlineWords = (headline || '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .map((w: string) => w.trim().toLowerCase())
    .filter((w: string) => w.length >= 4 && !['this', 'that', 'with', 'from', 'have', 'were', 'what', 'know', 'will', 'been'].includes(w));

  const primaryTopicTerm = postTags[0] || headlineWords[0] || '';

  // Helper to detect if two headlines are covering the exact same event / rewrite
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'from', 'this', 'that', 'have', 'were', 'what', 'will', 'been', 'about', 'after',
    'more', 'into', 'over', 'than', 'them', 'their', 'there', 'they', 'here', 'when', 'where', 'which', 'while'
  ]);

  const getHeadlineWords = (text: string) => {
    if (!text) return new Set<string>();
    return new Set(
      text.toLowerCase()
        .replace(/[^a-z0-9]/g, ' ')
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
    if (p.slug && (p.slug === post.slug || p.slug === post.slugEn)) return true;
    if (p.slugEn && (p.slugEn === post.slug || p.slugEn === post.slugEn)) return true;
    const pHead = p.headlineEn || p.headline || '';
    if (pHead && headline && areHeadlinesTooSimilar(pHead, headline)) return true;
    return false;
  };

  // Fetch live related posts from backend
  let liveTargetedPosts: any[] = [];
  try {
    const searchParam = primaryTopicTerm ? `&search=${encodeURIComponent(primaryTopicTerm)}` : '';
    const liveRes = await apiFetch(`/articles?compact=true&category=${postCategory}&limit=12&lang=en${searchParam}`);
    if (liveRes?.data && Array.isArray(liveRes.data)) {
      liveTargetedPosts = liveRes.data.filter((p: any) => !isCurrentPost(p));
    }
  } catch {}

  const combinedCategoryPool = [
    ...liveTargetedPosts,
    ...db.posts.filter((p: any) => !isCurrentPost(p) && p.categoryStr === postCategory)
  ];

  // Robust deduplication across ID, slug, and headline
  const uniqueCategoryPosts: any[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const seenHeadlines = new Set<string>();

  seenIds.add(String(post.id));
  if (post.slug) seenSlugs.add(post.slug);
  if (post.slugEn) seenSlugs.add(post.slugEn);
  if (headline) seenHeadlines.add(headline.trim());

  for (const p of combinedCategoryPool) {
    if (isCurrentPost(p)) continue;
    const idKey = String(p.id);
    const slugKey = (p.slugEn || p.slug || '').trim();
    const headKey = (p.headlineEn || p.headline || '').trim();

    if (seenIds.has(idKey) || (slugKey && seenSlugs.has(slugKey)) || (headKey && seenHeadlines.has(headKey))) {
      continue;
    }
    seenIds.add(idKey);
    if (slugKey) seenSlugs.add(slugKey);
    if (headKey) seenHeadlines.add(headKey);
    uniqueCategoryPosts.push(p);
  }

  const scoredRelated = uniqueCategoryPosts.map((p: any) => {
    let score = 0;
    const pTags = p.tags ? p.tags.split(',').map((t: string) => t.trim().toLowerCase()) : [];
    const pHead = (p.headlineEn || p.headline || '').toLowerCase();
    for (const tag of postTags) {
      if (pTags.includes(tag)) score += 5;
      if (pHead.includes(tag)) score += 3;
    }
    for (const word of headlineWords) {
      if (pHead.includes(word)) score += 3;
      if (pTags.includes(word)) score += 2;
    }
    return { post: p, score };
  });

  scoredRelated.sort((a: any, b: any) => b.score - a.score);
  const relevantCategoryPosts = scoredRelated.map((item: any) => item.post);

  const fallbackRelated = (relevantCategoryPosts.length >= 6
    ? relevantCategoryPosts
    : [
        ...relevantCategoryPosts,
        ...db.posts.filter((p: any) => !isCurrentPost(p) && p.categoryStr === postCategory && !uniqueCategoryPosts.some((r: any) => String(r.id) === String(p.id) || r.slug === p.slug)),
        ...db.posts.filter((p: any) => !isCurrentPost(p) && !uniqueCategoryPosts.some((r: any) => String(r.id) === String(p.id) || r.slug === p.slug))
      ]).filter((p: any) => !isCurrentPost(p)).slice(0, 8);
  const relatedPosts = fallbackRelated;
  const relatedPostsEn = relatedPosts.map((p: any) => ({
    ...p,
    headline: p.headlineEn || p.headline,
    slug: p.slugEn || p.slug,
    categoryStr: p.categoryStr || category
  }));

  // Selected top 2 related articles for high-impact in-article callouts (STRICTLY UNIQUE & DISTINCT EVENTS)
  const inArticleCallout1 = relatedPosts.find((p: any) => 
    p && !isCurrentPost(p)
  ) || null;

  const inArticleCallout2 = relatedPosts.find((p: any) => 
    p && 
    !isCurrentPost(p) &&
    String(p.id) !== String(inArticleCallout1?.id) &&
    p.slug !== inArticleCallout1?.slug &&
    !areHeadlinesTooSimilar(p.headlineEn || p.headline || '', inArticleCallout1?.headlineEn || inArticleCallout1?.headline || '')
  ) || null;

  const bottomNextStory = relatedPosts.find((p: any) =>
    p &&
    !isCurrentPost(p) &&
    String(p.id) !== String(inArticleCallout1?.id) &&
    String(p.id) !== String(inArticleCallout2?.id) &&
    p.slug !== inArticleCallout1?.slug &&
    p.slug !== inArticleCallout2?.slug &&
    !areHeadlinesTooSimilar(p.headlineEn || p.headline || '', inArticleCallout1?.headlineEn || inArticleCallout1?.headline || '') &&
    !areHeadlinesTooSimilar(p.headlineEn || p.headline || '', inArticleCallout2?.headlineEn || inArticleCallout2?.headline || '')
  ) || null;

  const desk = getEditorialDesk(postCategory);

  // Split content intelligently to distribute ads and callouts evenly across reading paragraphs and headings
  const renderContentWithInLineAd = (rawContent: string) => {
    if (!rawContent) return null;
    const blocks = rawContent.match(/<(p|h2|h3|blockquote|ul|ol|div|table|section)[^>]*>[\s\S]*?<\/\1>/gi);

    if (blocks && blocks.length >= 4) {
      const h2Indices: number[] = [];
      blocks.forEach((b, i) => {
        if (/^<h2/i.test(b.trim())) h2Indices.push(i);
      });

      let cut1 = 2; // after 2 paragraphs
      let cut2 = 4; // above 2nd headline
      let cut3 = 6; // after next headline & paragraph

      if (h2Indices.length >= 2) {
        cut1 = Math.min(Math.max(1, h2Indices[0]), 2);
        cut2 = h2Indices[1];
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

      if (cut2 <= cut1) cut2 = cut1 + 1;
      if (cut3 <= cut2 && cut2 < blocks.length) cut3 = cut2 + 1;

      const section1 = blocks.slice(0, cut1).join('\n');
      const section2 = blocks.slice(cut1, cut2).join('\n');
      const section3 = cut3 > cut2 ? blocks.slice(cut2, cut3).join('\n') : '';
      const section4 = cut3 < blocks.length ? blocks.slice(cut3).join('\n') : '';

      return (
        <>
          <div dangerouslySetInnerHTML={{ __html: section1 }} />
          {inArticleCallout1 && (
            <ContextualReadMore post={inArticleCallout1} prefix="Recommended Read" isEn={true} />
          )}
          <div dangerouslySetInnerHTML={{ __html: section2 }} />
          <div className="my-8 flex justify-center">
            <AdsterraAd format="in-article" />
          </div>
          {section3 && <div dangerouslySetInnerHTML={{ __html: section3 }} />}
          {inArticleCallout2 && (
            <ContextualReadMore post={inArticleCallout2} prefix="Related Story" isEn={true} />
          )}
          {section4 && <div dangerouslySetInnerHTML={{ __html: section4 }} />}
        </>
      );
    }

    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: rawContent }} />
        {inArticleCallout1 && (
          <ContextualReadMore post={inArticleCallout1} prefix="Recommended Read" isEn={true} />
        )}
        <div className="my-6 flex justify-center">
          <AdsterraAd format="in-article" />
        </div>
      </>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#0b0c10] text-gray-200 pb-16">
      <Header />
      <SocialEmbedLoader />
      <ArticleJsonLd post={post} category={post.categoryStr || category} desk={desk} isEn={true} />

      {/* Top Banner Ad - 728x90 Desktop / 320x50 Mobile */}
      <div className="max-w-[1200px] mx-auto px-4 pt-4 pb-2 flex justify-center">
        <AdsterraAd format="leaderboard" />
      </div>

      {/* Breadcrumb Bar */}
      <div className="border-b border-gray-800 bg-[#0e1017]">
        <div className="max-w-[1200px] mx-auto px-4 py-3 text-xs flex items-center gap-2 text-gray-400">
          <Link href="/en" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href={`/en/${post.categoryStr}`} className="hover:text-white capitalize">
            {post.categoryStr}
          </Link>
          <span>/</span>
          <span className="text-gray-500 truncate max-w-xs">{headline}</span>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article Main Column */}
          <article className="lg:col-span-8 flex flex-col gap-6">
            {/* Category Tag */}
            <div>
              <span className="bg-red-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md">
                {post.categoryStr}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              {headline}
            </h1>

            {/* Summary */}
            {summary && (
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium border-l-4 border-red-600 pl-4 py-1 italic bg-[#12141c]/50 rounded-r-lg">
                {summary}
              </p>
            )}

            {/* Meta Row: Author, Date, Switch to Hindi Link */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-gray-800 text-xs text-gray-400">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-white text-sm font-black shadow-md shrink-0">
                  <span>✍️</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-gray-200">{desk.nameEn}</span>
                    <svg className="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                    <span className="text-red-400 font-semibold">{desk.roleEn}</span>
                    <span>•</span>
                    <time>{new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                    <span>•</span>
                    <PostViews views={getPostViews(post, true)} size="sm" />
                  </div>
                </div>
              </div>

              {/* View in Hindi Switcher */}
              <Link
                href={`/${post.categoryStr}/${post.slug}`}
                className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/40 px-3 py-1 rounded-full font-bold transition-all text-xs flex items-center gap-1.5"
              >
                <span>🌐</span>
                <span>यह खबर हिन्दी में पढ़ें →</span>
              </Link>
            </div>

            {/* Featured Image */}
            {post.image && (
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                <ArticleCoverImage
                  src={post.image}
                  alt={headline}
                />
              </div>
            )}

            {/* Photo Gallery Mode or Article Content */}
            {post.postType === 'gallery' && post.slides && post.slides.length > 1 ? (
              <div className="my-8">
                <PhotoGalleryPost baseSlug={post.slugEn || post.slug} slides={post.slides} />
                {content && (
                  <div
                    className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-4 article-content mt-10 pt-8 border-t border-gray-800"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                )}
              </div>
            ) : (
              <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-4 article-content">
                {renderContentWithInLineAd(content || `<p>${summary}</p>`)}
              </div>
            )}

            {/* Native Banner Immediately After Article Content */}
            <div className="my-6 w-full">
              <NativeBannerAd />
            </div>

            {/* Reader Support Banner (PayPal + UPI) - Positioned immediately after Native Ad */}
            <ArticleSupportBanner isEn={true} />

            {/* Related News Slider (Positioned below Support Banner to boost reader engagement) */}
            <InArticleRelatedNews posts={relatedPostsEn} isEn={true} />

            {/* Tags */}
            {post.tags && (
              <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-800">
                <span className="text-xs font-bold text-gray-400 self-center mr-2">Tags:</span>
                {post.tags.split(',').map((tag: string, i: number) => {
                  const cleanTag = tag.trim().replace(/^#+/, '');
                  if (!cleanTag) return null;
                  return (
                    <Link
                      key={i}
                      href={`/en/tags/${encodeURIComponent(cleanTag)}`}
                      className="bg-[#12141c] hover:bg-red-600 hover:text-white text-gray-300 text-xs px-3 py-1.5 rounded-lg border border-gray-800 transition-colors"
                    >
                      #{cleanTag}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Editorial Desk Attribution & E-E-A-T Card */}
            <EditorialDeskCard desk={desk} isEn={true} />

            {/* Post-Article Ad Banner (728x90 Desktop / 300x250 Mobile) */}
            <div className="my-6 w-full flex justify-center">
              <AdsterraAd format="in-feed" />
            </div>

            {/* Previous & Next Navigation */}
            <div className="my-8 flex flex-col sm:flex-row gap-5">
               {fallbackRelated[0] && (
                 <Link href={`/en/${fallbackRelated[0].categoryStr}/${fallbackRelated[0].slugEn || fallbackRelated[0].slug}`} className="flex-1 bg-[#12141c] p-5 rounded-2xl border border-gray-800 hover:border-red-600 transition-all group article-nav-card">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5 block">Previous Story</span>
                    <h4 className="text-white font-bold text-sm group-hover:text-red-500 transition-colors line-clamp-2 leading-snug">
                      {fallbackRelated[0].headlineEn || fallbackRelated[0].headline}
                    </h4>
                 </Link>
               )}
               {fallbackRelated[1] && (
                 <Link href={`/en/${fallbackRelated[1].categoryStr}/${fallbackRelated[1].slugEn || fallbackRelated[1].slug}`} className="flex-1 bg-[#12141c] p-5 rounded-2xl border border-gray-800 hover:border-red-600 transition-all group text-right article-nav-card">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1.5 block">Next Story</span>
                    <h4 className="text-white font-bold text-sm group-hover:text-red-500 transition-colors line-clamp-2 leading-snug">
                      {fallbackRelated[1].headlineEn || fallbackRelated[1].headline}
                    </h4>
                 </Link>
               )}
            </div>

            {/* Bottom Leaderboard Ad */}
            <div className="my-8 w-full flex justify-center">
              <AdsterraAd format="leaderboard" />
            </div>
          </article>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Sidebar Top Ad - 300x250 Medium Rectangle */}
            <AdsterraAd format="rectangle" />

            <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-5 shadow-xl">
              <h3 className="text-lg font-black text-white border-b border-gray-800 pb-3 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                <span>Trending Worldwide</span>
              </h3>
              <div className="flex flex-col gap-4">
                {db.posts.slice(0, 6).map((item: any, idx: number) => (
                  <Link
                    key={item.id}
                    href={`/en/${item.categoryStr}/${item.slug}`}
                    className="flex items-start gap-3 group pb-3 border-b border-gray-800/40 last:border-0"
                  >
                    <span className="text-2xl font-black text-gray-700 group-hover:text-red-500 transition-colors">
                      0{idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors leading-snug line-clamp-2">
                        {item.headline}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-gray-500 uppercase">
                          {item.categoryStr}
                        </span>
                        <PostViews views={getPostViews(item, true)} size="xs" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar Skyscraper Ad */}
            <div className="flex justify-center mt-2">
              <AdsterraAd format="skyscraper" />
            </div>
          </aside>
        </div>
        <ViewTracker articleId={post.id} lang="en" />
      </main>

      {/* MOBILE STICKY READ-NEXT PROMPT (TRIGGERS AFTER 40% SCROLL) */}
      {bottomNextStory && (
        <MobileReadNextPrompt post={bottomNextStory} isEn={true} />
      )}
    </div>
  );
}
