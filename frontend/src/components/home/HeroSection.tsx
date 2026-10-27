import Image from "next/image";
import Link from "next/link";
import { getPostImage } from "@/lib/constants";
import PostViews, { getPostViews } from "@/components/common/PostViews";

// Intelligent dynamic Topic Badge Hook (e.g. 'नहीं रहे नाना' or 'अलविदा [नाम]')
function getTopicBadgeHook(mainPost: any, isEn: boolean = false): string {
  if (!mainPost) return isEn ? "Special Coverage" : "विशेष कवरेज";
  
  const headline = (isEn && mainPost.headlineEn ? mainPost.headlineEn : mainPost.headline || '').trim();
  const lowerHl = headline.toLowerCase();
  
  // Specific detected topics
  if (/पाटेकर|patekar/i.test(lowerHl)) {
    return isEn ? "Farewell Nana Patekar" : "नहीं रहे नाना";
  }
  if (/रतन टाटा|ratan tata/i.test(lowerHl)) {
    return isEn ? "Remembering Ratan Tata" : "अलविदा रतन टाटा";
  }
  if (/बजट|budget/i.test(lowerHl)) {
    return isEn ? "Union Budget" : "आम बजट 2026";
  }
  if (/चुनाव|election|मतदान|वोट/i.test(lowerHl)) {
    return isEn ? "Election Focus" : "चुनावी दंगल";
  }
  if (/विश्व कप|world cup|ipl|cricket|क्रिकेट/i.test(lowerHl)) {
    return isEn ? "Cricket Special" : "क्रिकेट स्पेशल";
  }
  if (/युद्ध|war|इजरायल|ईरान|गाजा|lebanon|israel/i.test(lowerHl)) {
    return isEn ? "Global Conflict" : "महायुद्ध";
  }

  // Tags detection
  if (mainPost.tags) {
    const cleanTag = mainPost.tags
      .split(',')
      .map((t: string) => t.trim().replace(/^#/, ''))
      .find((t: string) => t && t.length >= 3 && t.length <= 15 && !/news|trending|todays/i.test(t));
    if (cleanTag) return cleanTag;
  }

  // Passing away detection
  if (/निधन|नहीं रहे|अंतिम सांस|death|passes away/i.test(lowerHl)) {
    const match = headline.match(/(?:अभिनेता|एक्टर|दिग्गज|नेता)?\s*([^\s,।]+(?:\s+[^\s,।]+)?)\s*(?:का निधन|नहीं रहे)/);
    if (match && match[1]) {
      return `अलविदा ${match[1].trim()}`;
    }
    return isEn ? "In Memoriam" : "शोक संवेदना";
  }

  // First 2-3 words fallback
  const parts = headline.split(/[:|।—\-]/)[0].trim().split(/\s+/);
  if (parts.length <= 3 && parts.length >= 2) {
    return parts.join(' ');
  }

  return isEn ? "Special Focus" : "विशेष कवरेज";
}

export default async function HeroSection({ 
  db, 
  isEn,
  heroMain,
  heroSubPosts,
}: { 
  db: any; 
  isEn?: boolean;
  heroMain?: any;
  heroSubPosts?: any[];
}) {
  // Check if Hero Section is enabled in Homepage Settings
  const isHeroActiveInSettings = db?.homepage 
    ? db.homepage.some((s: any) => s.sectionType === 'hero' && s.isActive !== false) 
    : true;

  if (!heroMain || !isHeroActiveInSettings) return null;

  const mainPost = heroMain;
  const subPosts = heroSubPosts || [];

  const mainHeadline = (isEn && mainPost.headlineEn) ? mainPost.headlineEn : mainPost.headline;
  const mainSlug = (isEn && mainPost.slugEn) ? mainPost.slugEn : mainPost.slug;
  const mainHref = isEn ? `/en/${mainPost.categoryStr || 'news'}/${mainSlug}` : `/${mainPost.categoryStr || 'news'}/${mainSlug}`;
  
  const topicBadge = getTopicBadgeHook(mainPost, isEn);

  // Left featured card (1st related story)
  const leftPost = subPosts.length > 0 ? subPosts[0] : null;
  const leftHeadline = leftPost ? ((isEn && leftPost.headlineEn) ? leftPost.headlineEn : leftPost.headline) : '';
  const leftSlug = leftPost ? ((isEn && leftPost.slugEn) ? leftPost.slugEn : leftPost.slug) : '';
  const leftHref = leftPost ? (isEn ? `/en/${leftPost.categoryStr || 'news'}/${leftSlug}` : `/${leftPost.categoryStr || 'news'}/${leftSlug}`) : '';

  // Right grid (up to 4 related stories)
  const rightPosts = subPosts.length > 1 ? subPosts.slice(1, 5) : [];
  return (
    <section className="relative w-full mb-10 overflow-hidden bg-slate-100 dark:bg-[#0c0d12] border-b border-slate-200 dark:border-gray-800/80 hero-topic-banner">
      {/* Cinematic Subject Backdrop */}
      <div className="absolute inset-0 w-full h-[550px] md:h-[650px] pointer-events-none overflow-hidden select-none">
        <Image 
          src={getPostImage(mainPost)} 
          alt={mainHeadline} 
          fill 
          className="object-cover object-right-top md:object-right opacity-45 sm:opacity-55 dark:opacity-45 filter contrast-105" 
          priority 
        />
        {/* Soft Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100/95 via-slate-100/60 to-transparent dark:from-[#0c0d12] dark:via-[#0c0d12]/80 dark:to-[#0c0d12]/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100/90 via-slate-100/40 to-transparent dark:from-[#0c0d12] dark:via-[#0c0d12]/60 dark:to-[#0c0d12]/90"></div>
      </div>

      {/* Main Content Layout */}
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-8">
        {/* Topic Badge Hook (e.g. 'नहीं रहे नाना' or 'अलविदा नाना पाटेकर') */}
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-[#e60000] text-white text-[12px] sm:text-[13px] font-black px-3.5 py-1 rounded shadow-md tracking-wider uppercase inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            {topicBadge}
          </span>
          <div className="h-px flex-1 max-w-[80px] bg-red-600/60 hidden sm:block"></div>
        </div>

        {/* Big Bold Impactful Lead Headline */}
        <Link href={mainHref} className="group block mb-7">
          <h1 className="hero-main-title text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-slate-900 dark:text-white leading-[1.22] drop-shadow-sm group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors tracking-tight">
            {mainHeadline}
          </h1>
        </Link>

        {/* Stories Grid: Left Featured Card (Replacing video player) + Right 2x2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left Featured Card */}
          {leftPost ? (
            <div className="lg:col-span-4 xl:col-span-4 flex flex-col">
              <Link 
                href={leftHref} 
                className="hero-card-left group flex flex-col justify-between h-full bg-white dark:bg-[#161822]/90 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden p-3.5 hover:border-red-500/50 transition-all shadow-md dark:shadow-xl backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 dark:border-gray-800">
                    <span className="bg-[#e60000] text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      {isEn ? "Special Coverage" : "विशेष कवरेज"}
                    </span>
                    <PostViews views={getPostViews(leftPost, isEn)} size="xs" />
                  </div>
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 mb-3 border border-slate-200 dark:border-white/5">
                    <Image 
                      src={getPostImage(leftPost)} 
                      alt={leftHeadline} 
                      fill 
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  </div>
                </div>
                <h3 className="hero-left-title text-slate-900 dark:text-white font-bold text-sm sm:text-base leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                  {leftHeadline}
                </h3>
              </Link>
            </div>
          ) : null}

          {/* Right 2x2 Sub-Stories Grid */}
          {rightPosts.length > 0 ? (
            <div className={leftPost ? "lg:col-span-8 xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5" : "lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"}>
              {rightPosts.map((post: any) => {
                const subHeadline = (isEn && post.headlineEn) ? post.headlineEn : post.headline;
                const subSlug = (isEn && post.slugEn) ? post.slugEn : post.slug;
                const subHref = isEn ? `/en/${post.categoryStr || 'news'}/${subSlug}` : `/${post.categoryStr || 'news'}/${subSlug}`;
                
                return (
                  <Link 
                    href={subHref} 
                    key={post.id} 
                    className="hero-card-sub group flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#161822]/75 hover:bg-slate-50 dark:hover:bg-[#161822] border border-slate-200 dark:border-white/5 hover:border-red-500/40 transition-all backdrop-blur-md shadow-sm dark:shadow-md"
                  >
                    <div className="relative w-24 sm:w-28 h-16 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-slate-200 dark:border-white/10">
                      <Image 
                        src={getPostImage(post)} 
                        alt={subHeadline} 
                        fill 
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-red-600 dark:text-red-500 text-[10px] font-black uppercase tracking-wider">
                          {isEn ? "Update" : "अपडेट"}
                        </span>
                        <PostViews views={getPostViews(post, isEn)} size="xs" />
                      </div>
                      <h4 className="hero-sub-title text-slate-800 dark:text-gray-100 font-bold text-[13px] sm:text-[14px] leading-snug line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {subHeadline}
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : null}

        </div>
      </div>
    </section>
  );
}
