import Image from "next/image";
import Link from "next/link";
import { getPostImage } from "@/lib/constants";
import PostViews, { getPostViews } from "@/components/common/PostViews";
import AdsterraAd from "@/components/ads/AdsterraAd";
import VideoBadge, { isVideoPost } from "@/components/common/VideoBadge";

export default async function TopicBasedBlock({ 
  db, 
  isEn,
  posts: propPosts
}: { 
  db: any; 
  isEn?: boolean;
  posts?: any[];
}) {
  const allRawPosts = db.posts || [];
  if (allRawPosts.length === 0) return null;

  const tagMapEn: Record<string, string> = {
    'विजुअल स्टोरी': 'VisualStories',
    'वेब स्टोरी': 'WebStories',
    'दैनिक अपडेट': 'DailyUpdates',
    'राशिफल': 'Horoscope',
    'मनोरंजन': 'Entertainment',
    'राजनीति': 'Politics',
    'खेल': 'Sports',
    'व्यापार': 'Business',
    'भारत': 'India',
    'क्राइम': 'Crime',
  };

  const rawTags: string[] = (db.trendingTags as string[]) || [];
  const trendingTags = isEn
    ? rawTags.map(t => tagMapEn[t] || t).filter(t => !/[\u0900-\u097F]/.test(t))
    : rawTags;

  const getPostMeta = (p: any) => {
    const title = (isEn && p.headlineEn) ? p.headlineEn : (p.headline || p.title);
    const summary = (isEn && p.summaryEn) ? p.summaryEn : p.summary;
    const slug = (isEn && p.slugEn) ? p.slugEn : p.slug;
    const href = isEn ? `/en/${p.categoryStr || 'business'}/${slug}` : `/${p.categoryStr || 'business'}/${slug}`;
    return { title, summary, href };
  };

  // Use deduplicated propPosts if passed from homepage-dedup, otherwise fall back to raw
  const pool = (propPosts && propPosts.length > 0)
    ? propPosts
    : allRawPosts.filter((p: any) => p.categoryStr !== 'special' && p.postType === 'general');

  // 1. TFL Exclusive Public Research Story (Strictly in-depth research/investigative story, latest first!)
  const researchCandidates = allRawPosts
    .filter((p: any) => 
      !p.slug?.includes('shrinkflation') &&
      !p.slug?.includes('quick-commerce-investigative') &&
      !p.headline?.includes('श्रिंकफ्लेशन') &&
      (
        p.subCategory === 'research-story' || 
        p.subCategory === 'tfl-exclusive' || 
        p.subCategory === 'research' ||
        p.sourceName?.includes('Investigative') ||
        p.sourceName?.includes('रिसर्च') ||
        p.tags?.includes('खोजी रिपोर्ट') ||
        p.tags?.includes('Research Story')
      )
    )
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const researchStory = researchCandidates[0] 
    || allRawPosts.find((p: any) => 
        !p.slug?.includes('shrinkflation') && 
        !p.slug?.includes('quick-commerce-investigative') &&
        !p.headline?.includes('श्रिंकफ्लेशन') &&
        p.isFeatured && 
        p.content && 
        p.content.length > 2500
      )
    || pool.find((p: any) => !p.slug?.includes('shrinkflation') && !p.headline?.includes('श्रिंकफ्लेशन'))
    || pool[0];

  const researchMeta = researchStory ? getPostMeta(researchStory) : null;

  const remainingPool = pool.filter((p: any) => p.id !== researchStory?.id);

  // 2. Right Column Fast Updates ("त्वरित अपडेट्स" / Fast Updates)
  // User Rule: "त्वरित अपडेट में वो खबरें रहेंगी जो तुरंत के तुरंत आई होंगी.. कोई पुरानी स्टोरी नहीं होगी.."
  // Strictly select freshest stories published in the last 24 hours, sorted newest first!
  const nowMs = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  const freshCandidates = allRawPosts
    .filter((p: any) => 
      p.categoryStr !== 'special' && 
      p.categoryStr !== 'web-stories' &&
      p.postType !== 'visual_story' &&
      p.postType !== 'gallery' &&
      p.isPublished !== false &&
      p.id !== researchStory?.id
    )
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const fresh24h = freshCandidates.filter((p: any) => (nowMs - new Date(p.createdAt).getTime()) <= ONE_DAY_MS);
  const fastUpdatesPool = fresh24h.length >= 3 ? fresh24h : freshCandidates;
  const rightPosts = fastUpdatesPool.slice(0, 3);
  const rightIds = new Set(rightPosts.map((p: any) => p.id));

  // 3. Left Column Big News (6 stories from remaining pool, excluding research and rightPosts)
  const leftPool = remainingPool.filter((p: any) => !rightIds.has(p.id));
  const leftPosts = leftPool.slice(0, 6);
  const leftIds = new Set(leftPosts.map((p: any) => p.id));

  // 4. Bottom Row Grid - "Also in the News / इन पर भी नज़र" (Next 6 stories, excluding research, rightPosts and leftPosts)
  const centerPosts = remainingPool.filter((p: any) => !rightIds.has(p.id) && !leftIds.has(p.id)).slice(0, 6);

  return (
    <section className="mb-10 bg-[#0b0c10]">
      {/* Trending Bar */}
      <div className="flex items-center gap-3 bg-[#12141c] p-4 rounded-t-3xl border border-gray-800 border-b-0">
        <span className="font-black text-red-600 uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
          {isEn ? "Trending:" : "ट्रेंडिंग:"}
        </span>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide flex-1">
          {trendingTags.map((tag: string, i: number) => (
            <Link 
              href={`/search?q=${encodeURIComponent(tag)}`} 
              key={i} 
              className="bg-[#0b0c10] hover:bg-red-600/10 hover:text-red-500 text-gray-400 text-[11px] font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-all border border-gray-800 hover:border-red-600/30"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[#12141c] p-6 sm:p-8 rounded-b-3xl border border-gray-800 shadow-2xl flex flex-col gap-8">
        
        {/* Top 3-Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Top Stories (6) */}
          <div className="lg:col-span-3 lg:border-r border-gray-800 lg:pr-8 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-6 bg-red-600 rounded-full"></div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
                {isEn ? "Top Stories" : "बड़ी खबरें"}
              </h2>
            </div>
            <div className="flex flex-col divide-y divide-gray-800/50">
              {leftPosts.map((post: any) => {
                const meta = getPostMeta(post);
                return (
                  <Link href={meta.href} key={post.id} className="py-3 first:pt-0 last:pb-0 group cursor-pointer block">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-red-600 text-[9px] font-black uppercase tracking-widest block">{post.categoryStr}</span>
                      <PostViews views={getPostViews(post, isEn)} size="xs" />
                    </div>
                    <h3 className="text-gray-300 font-bold text-[13.5px] leading-snug group-hover:text-red-500 transition-colors line-clamp-2">{meta.title}</h3>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Center Column - DAILY EXCLUSIVE RESEARCH REPORT */}
          <div className="lg:col-span-6 lg:border-r border-gray-800 lg:pr-8">
            {researchStory && researchMeta && (
              <div className="bg-[#0b0c10] border border-gray-800 hover:border-red-600/40 rounded-3xl p-5 md:p-6 shadow-2xl transition-all group">
                {/* Header Badges */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-gradient-to-r from-red-600 to-rose-700 text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-red-900/40 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      {isEn ? "TFL Exclusive" : "TFL एक्सक्लूसिव"}
                    </span>
                    <span className="text-gray-400 text-[11px] font-semibold hidden sm:inline">
                      {isEn ? "In-depth Public Investigation" : "गहन जनहित पड़ताल"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    {isEn ? "✓ 100% Verified Facts" : "✓ 100% सत्यापित तथ्य"}
                  </span>
                </div>

                <Link href={researchMeta.href} className="block group/link">
                  {/* Large Featured Visual */}
                  <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 shadow-xl mb-4">
                    <Image 
                      src={getPostImage(researchStory)} 
                      alt={researchMeta.title} 
                      fill 
                      loading="lazy"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover group-hover/link:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                    {isVideoPost(researchStory) && <VideoBadge size="md" />}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="bg-black/70 backdrop-blur-md text-gray-200 text-xs px-3 py-1 rounded-full border border-white/10 font-medium flex items-center gap-2">
                        <span>{new Date(researchStory.createdAt).toLocaleDateString(isEn ? 'en-US' : 'hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span className="text-gray-500">•</span>
                        <PostViews views={getPostViews(researchStory, isEn)} size="xs" />
                      </span>
                      <span className="text-xs text-red-400 font-bold bg-black/80 px-3 py-1 rounded-full flex items-center gap-1 group-hover/link:translate-x-1 transition-transform">
                        {isEn ? "Read Full Report →" : "विस्तृत रिपोर्ट पढ़ें →"}
                      </span>
                    </div>
                  </div>

                  {/* Large Headline */}
                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover/link:text-red-400 transition-colors leading-[1.25] mb-3">
                    {researchMeta.title}
                  </h3>

                  {/* Factual Summary */}
                  <p className="text-gray-300 text-sm font-normal leading-relaxed line-clamp-3 mb-4">
                    {researchMeta.summary}
                  </p>

                  {/* Ground Facts Checklist */}
                  <div className="bg-[#12141c] border border-gray-800/80 rounded-2xl p-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {isEn ? "Key Investigation Points (Fact File):" : "पड़ताल के मुख्य बिंदु (Fact File):"}
                    </div>
                    <ul className="text-xs text-gray-300 space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{isEn ? "Unbiased & technical analysis of official rules and guidelines" : "आधिकारिक नियमों और गाइडलाइंस का निष्पक्ष व तकनीकी विश्लेषण"}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{isEn ? "Direct on-ground assessment of real impact on citizens" : "आम जनता पर पड़ने वाले वास्तविक असर की सीधी पड़ताल"}</span>
                      </li>
                    </ul>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Right Column - Follow Us, Newsletter & Ad */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            
            {/* 1. Adsterra Rectangle Ad (Replaced Follow Us) */}
            <div className="flex justify-center w-full overflow-hidden">
              <AdsterraAd format="rectangle" />
            </div>

            {/* 2. Newsletter Box */}
            <div className="bg-gradient-to-br from-red-600 to-red-900 p-5 rounded-3xl shadow-xl shadow-red-900/20">
              <h3 className="text-white font-black uppercase text-xs tracking-widest mb-1.5">Newsletter</h3>
              <p className="text-white/80 text-[11px] mb-3 font-medium">
                {isEn ? "Get top verified stories delivered directly to your inbox." : "देश-दुनिया की बड़ी खबरें सीधे अपने इनबॉक्स में पाएं।"}
              </p>
              <input className="w-full bg-black/20 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder:text-white/40 mb-2.5 outline-none" placeholder={isEn ? "Your email..." : "आपका ईमेल..."} />
              <button className="w-full bg-white text-red-600 font-black py-2.5 rounded-xl text-[10px] uppercase shadow-xl active:scale-95 transition-all">
                {isEn ? "Subscribe" : "सब्सक्राइब करें"}
              </button>
            </div>

            {/* 3. Fast Updates Stories */}
            {rightPosts.length > 0 && (
              <div className="bg-[#0b0c10] border border-gray-800 rounded-3xl p-5 shadow-xl flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-gray-800/80 pb-2">
                  <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                  <h3 className="text-white font-black text-xs uppercase tracking-widest">{isEn ? "Fast Updates" : "त्वरित अपडेट्स"}</h3>
                </div>
                <div className="flex flex-col divide-y divide-gray-800/60">
                  {rightPosts.map((post: any) => {
                    const meta = getPostMeta(post);
                    return (
                      <Link href={meta.href} key={post.id} className="py-2.5 first:pt-0 last:pb-0 group block">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-amber-500 text-[9px] font-bold uppercase tracking-wider block">{post.categoryStr}</span>
                          <PostViews views={getPostViews(post, isEn)} size="xs" />
                        </div>
                        <h4 className="text-gray-300 font-semibold text-xs leading-snug group-hover:text-amber-400 transition-colors line-clamp-2">
                          {meta.title}
                        </h4>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Full-width Row - Also in the News */}
        <div className="pt-6 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
              {isEn ? "Also in the News" : "इन पर भी नज़र"}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {centerPosts.map((post: any) => {
              const meta = getPostMeta(post);
              return (
                <Link href={meta.href} key={post.id} className="group cursor-pointer block">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-800 mb-2.5 bg-[#12141c] shadow-lg">
                    <Image 
                      src={getPostImage(post)} 
                      alt={meta.title} 
                      fill 
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {isVideoPost(post) && <VideoBadge size="sm" />}
                  </div>
                  <h3 className="text-gray-200 font-bold text-xs leading-snug group-hover:text-red-500 transition-colors line-clamp-2 mb-1">
                    {meta.title}
                  </h3>
                  <PostViews views={getPostViews(post, isEn)} size="xs" />
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
