import Image from "next/image";
import { getDbEn } from "@/lib/actions";
import Link from "next/link";
import Header from "@/components/layout/Header";
import PostViews, { getPostViews } from "@/components/common/PostViews";
import AdsterraAd from "@/components/ads/AdsterraAd";
import NativeBannerAd from "@/components/ads/NativeBannerAd";

// News Portal Best Practice: 60s Edge ISR Caching for Instant Page Transitions
export const revalidate = 60;

const categoryConfigEn: Record<string, { title: string, color: string, icon: string }> = {
  national: { title: "National News", color: "#2563eb", icon: "🇮🇳" },
  states: { title: "State Updates", color: "#eab308", icon: "🏛️" },
  crime: { title: "Crime & Law", color: "#ef4444", icon: "🚨" },
  entertainment: { title: "Entertainment & Cinema", color: "#ec4899", icon: "🎬" },
  sports: { title: "Sports Arena", color: "#22c55e", icon: "🏏" },
  lifestyle: { title: "Lifestyle & Wellness", color: "#ff5722", icon: "🍸" },
  religion: { title: "Culture & Spiritual", color: "#f97316", icon: "🕉️" },
  "tech-auto": { title: "Tech & Auto", color: "#0ea5e9", icon: "🚗" },
  business: { title: "Business & Economy", color: "#14b8a6", icon: "📈" },
  education: { title: "Education & Career", color: "#8b5cf6", icon: "🎓" },
  world: { title: "World & International News", color: "#0284c7", icon: "🌐" },
  international: { title: "International", color: "#0284c7", icon: "🌐" },
  special: { title: "World & Analysis", color: "#f97316", icon: "🌍" }
};

export default async function EnglishCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category || "national";
  const catData = categoryConfigEn[categorySlug] || { title: categorySlug.toUpperCase(), color: "#475569", icon: "📰" };
  
  const db = await getDbEn();
  const isWorldOrIntl = categorySlug === 'world' || categorySlug === 'international';
  const categoryPosts = db.posts.filter((p: any) => 
    (isWorldOrIntl ? (p.categoryStr === 'world' || p.categoryStr === 'international') : p.categoryStr === categorySlug) 
    && p.postType === 'general'
  );
  const top2 = categoryPosts.slice(0, 2);
  const mid3 = categoryPosts.slice(2, 5);
  const remainingPosts = categoryPosts.slice(5, 15);
  const sidebarPosts = db.posts.filter((p: any) => p.postType === 'general').slice(0, 10);

  return (
    <div className="w-full min-h-screen bg-[#0b0c10] pb-10">
      <Header />

      {/* Category Header Banner */}
      <div style={{ backgroundColor: catData.color }} className="w-full py-6 px-4 lg:px-8 mb-8 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
           <span className="text-[150px] leading-none">{catData.icon}</span>
        </div>
        
        <div className="max-w-[1400px] mx-auto flex items-center gap-3 relative z-10">
          <span className="text-4xl filter grayscale brightness-0 invert opacity-90">{catData.icon}</span>
          <h1 className="text-[32px] md:text-[40px] font-black text-white tracking-wide">{catData.title}</h1>
        </div>
      </div>

      {/* Top Category Leaderboard Ad */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-6 flex justify-center">
        <AdsterraAd format="leaderboard" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          <div className="xl:col-span-8 flex flex-col gap-8">
            
            {/* Top 2 News Grid */}
            {top2.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {top2.map((post: any) => (
                  <Link href={`/en/${post.categoryStr}/${post.slug}`} key={post.id} className="group cursor-pointer">
                    <div className="relative w-full h-56 md:h-64 rounded-xl border border-gray-800 overflow-hidden mb-3">
                      <Image src={post.image || "https://picsum.photos/800/500"} alt={post.headline} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <h2 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors leading-snug mb-2">
                      {post.headline}
                    </h2>
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-2">
                      {post.summary}
                    </p>
                    <PostViews views={getPostViews(post, true)} size="xs" />
                  </Link>
                ))}
              </div>
            )}

            {/* Mid 3 News Cards */}
            {mid3.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {mid3.map((post: any) => (
                  <Link href={`/en/${post.categoryStr}/${post.slug}`} key={post.id} className="group cursor-pointer">
                    <div className="relative w-full h-36 rounded-xl border border-gray-800 overflow-hidden mb-2">
                      <Image src={post.image || "https://picsum.photos/500/300"} alt={post.headline} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors leading-snug line-clamp-2 mb-1.5">
                      {post.headline}
                    </h3>
                    <PostViews views={getPostViews(post, true)} size="xs" />
                  </Link>
                ))}
              </div>
            )}

            {/* Mid-Feed Ad Banner (728x90 Desktop / 300x250 Mobile) */}
            <div className="my-6 w-full flex justify-center">
              <AdsterraAd format="in-feed" />
            </div>

            {/* Remaining Posts List */}
            {remainingPosts.length > 0 && (
              <div className="flex flex-col gap-4 border-t border-gray-800 pt-6">
                {remainingPosts.map((post: any) => (
                  <Link href={`/en/${post.categoryStr}/${post.slug}`} key={post.id} className="flex gap-4 group cursor-pointer bg-[#12141c] p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors mb-2 leading-snug">
                        {post.headline}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-2">
                        {post.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                        </span>
                        <PostViews views={getPostViews(post, true)} size="xs" />
                      </div>
                    </div>
                    <div className="relative w-36 h-24 rounded-lg overflow-hidden shrink-0">
                      <Image src={post.image || "https://picsum.photos/400/250"} alt={post.headline} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Bottom Feed Ad Banner (728x90 Desktop / 320x50 Mobile) */}
            <div className="my-6 w-full flex justify-center">
              <AdsterraAd format="leaderboard" />
            </div>

            {categoryPosts.length === 0 && (
              <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-12 text-center text-gray-500">
                No articles found in this category yet.
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="xl:col-span-4">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Sidebar Top Ad - 300x250 Medium Rectangle */}
              <AdsterraAd format="rectangle" />

              <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-5 shadow-xl">
                <h3 className="text-lg font-black text-white border-b border-gray-800 pb-3 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>Top Stories</span>
                </h3>
                <div className="flex flex-col gap-4">
                  {sidebarPosts.map((post: any, idx: number) => (
                    <Link href={`/en/${post.categoryStr}/${post.slug}`} key={post.id} className="flex items-start gap-3 group">
                      <span className="text-2xl font-black text-gray-700 group-hover:text-red-500 transition-colors">
                        0{idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors leading-snug line-clamp-2 mb-1">
                          {post.headline}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-gray-500 uppercase">
                            {post.categoryStr}
                          </span>
                          <PostViews views={getPostViews(post, true)} size="xs" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sidebar Bottom Ad - 160x600 Wide Skyscraper */}
              <div className="flex justify-center mt-2">
                <AdsterraAd format="skyscraper" />
              </div>
            </div>
          </div>

        </div>

        {/* Native Banner — above footer */}
        <div className="w-full mt-8 mb-4">
          <NativeBannerAd />
        </div>

      </div>
    </div>
  );
}
