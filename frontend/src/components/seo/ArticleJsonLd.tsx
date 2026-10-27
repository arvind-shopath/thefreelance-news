import React from 'react';

interface ArticleJsonLdProps {
  post: any;
  category: string;
  isEn?: boolean;
  desk?: {
    nameHi?: string;
    nameEn?: string;
    roleHi?: string;
    roleEn?: string;
  };
}

/**
 * High-Performance Structured Data & Schema Markup Generator
 * Implements:
 * 1. NewsArticle Schema (Google News & Discover ranking)
 * 2. FAQPage Schema (for PAA questions & rich dropdown snippets in Google Search)
 * 3. JobPosting Schema (for Government & Private Jobs / Recruitment rankings)
 */
export default function ArticleJsonLd({ post, category, isEn = false, desk }: ArticleJsonLdProps) {
  if (!post) return null;

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://news.thefreelance.in';
  const headline = isEn ? (post.headlineEn || post.headline) : post.headline;
  const summary = isEn ? (post.summaryEn || post.summary) : post.summary;
  const canonicalUrl = isEn
    ? `${SITE_URL}/en/${post.categoryStr || category}/${post.slugEn || post.slug}`
    : `${SITE_URL}/${post.categoryStr || category}/${post.slug}`;
  
  const imageUrl = post.image?.startsWith('http')
    ? post.image
    : post.image
    ? `${SITE_URL}${post.image}`
    : `${SITE_URL}/logo.png`;

  const authorName = isEn
    ? (desk?.nameEn || 'The FreeLance Editorial Desk')
    : (desk?.nameHi || 'द फ्रीलांस एडिटोरियल डेस्क');

  const authorRole = isEn
    ? (desk?.roleEn || 'Senior News Editor')
    : (desk?.roleHi || 'वरिष्ठ समाचार संपादक');

  // 1. NewsArticle Schema
  const newsArticleSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    'headline': headline?.slice(0, 110),
    'description': summary?.slice(0, 160) || headline,
    'image': [imageUrl],
    'datePublished': post.createdAt,
    'dateModified': post.updatedAt || post.createdAt,
    'inLanguage': isEn ? 'en-US' : 'hi-IN',
    'author': {
      '@type': 'Person',
      'name': authorName,
      'jobTitle': authorRole,
      'worksFor': {
        '@type': 'NewsMediaOrganization',
        'name': 'The Freelance',
        'url': SITE_URL,
      },
    },
    'publisher': {
      '@type': 'NewsMediaOrganization',
      'name': 'The Freelance',
      'url': SITE_URL,
      'logo': {
        '@type': 'ImageObject',
        'url': `${SITE_URL}/logo.png`,
        'width': 512,
        'height': 512,
      },
    },
  };

  // 2. FAQPage Schema Extraction
  // Checks extraMeta.faq_items, extraMeta.faq, or parses Q&A from content (h2/h3 followed by p)
  let faqList: Array<{ question: string; answer: string }> = [];

  let extraMeta: any = null;
  try {
    extraMeta = typeof post.extraMeta === 'string' ? JSON.parse(post.extraMeta) : post.extraMeta;
  } catch {}

  if (Array.isArray(extraMeta?.faq_items) && extraMeta.faq_items.length > 0) {
    faqList = extraMeta.faq_items.map((f: any) => ({
      question: f.question || f.q,
      answer: f.answer || f.a,
    })).filter((f: any) => f.question && f.answer);
  } else if (Array.isArray(extraMeta?.faq) && extraMeta.faq.length > 0) {
    faqList = extraMeta.faq.map((f: any) => ({
      question: f.question || f.q,
      answer: f.answer || f.a,
    })).filter((f: any) => f.question && f.answer);
  } else {
    // Attempt fallback heuristic regex parse on content (e.g. <h3>...?</h3><p>...</p>)
    const content = isEn ? (post.contentEn || post.content || '') : (post.content || '');
    const qaRegex = /<h[23][^>]*>([^<*?]+(?:\?|क्या|कब|कैसे|कौन|How|What|When|Where|Why)[^<]*)<\/h[23]>\s*<p[^>]*>([^<]+)<\/p>/gi;
    let match;
    let count = 0;
    while ((match = qaRegex.exec(content)) !== null && count < 5) {
      const q = match[1]?.trim();
      const a = match[2]?.trim();
      if (q && a && q.length > 8 && a.length > 20) {
        faqList.push({ question: q, answer: a });
        count++;
      }
    }
  }

  const faqSchema = faqList.length >= 2 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqList.slice(0, 5).map((f) => ({
      '@type': 'Question',
      'name': f.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.answer,
      },
    })),
  } : null;

  // 3. JobPosting Schema (Active for recruitment/job/admit card articles)
  const categoryStr = (post.categoryStr || category || '').toLowerCase();
  const tagsStr = (post.tags || '').toLowerCase();
  const headlineLower = (headline || '').toLowerCase();

  const isJobRelated =
    categoryStr === 'education' ||
    tagsStr.includes('भर्ती') ||
    tagsStr.includes('नौकरी') ||
    tagsStr.includes('recruitment') ||
    tagsStr.includes('job') ||
    tagsStr.includes('admit card') ||
    tagsStr.includes('vacancies') ||
    tagsStr.includes('sarkari naukri') ||
    headlineLower.includes('भर्ती') ||
    headlineLower.includes('सरकारी नौकरी') ||
    headlineLower.includes('recruitment') ||
    headlineLower.includes('admit card') ||
    headlineLower.includes('vacancies');

  let jobPostingSchema: any = null;
  if (isJobRelated) {
    const validThroughDate = new Date(new Date(post.createdAt || Date.now()).getTime() + 60 * 24 * 60 * 60 * 1000).toISOString();
    jobPostingSchema = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      'title': headline,
      'description': summary || headline,
      'datePosted': post.createdAt,
      'validThrough': validThroughDate,
      'employmentType': 'FULL_TIME',
      'hiringOrganization': {
        '@type': 'Organization',
        'name': 'Government of India / State Recruitment Board',
        'sameAs': 'https://thefreelance.in',
      },
      'jobLocation': {
        '@type': 'Place',
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': 'IN',
        },
      },
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {jobPostingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
        />
      )}
    </>
  );
}
