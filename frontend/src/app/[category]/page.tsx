import Image from "next/image";
import { getDb } from "@/lib/actions";
import Link from "next/link";
import { getPostImage } from "@/lib/constants";
import VisualStorySection from "@/components/home/VisualStorySection";
import PhotoGallerySection from "@/components/home/PhotoGallerySection";
import Header from "@/components/layout/Header";
import AdBlock from "@/components/home/AdBlock";
import AdsterraAd from "@/components/ads/AdsterraAd";
import NativeBannerAd from "@/components/ads/NativeBannerAd";
import PostViews, { getPostViews } from "@/components/common/PostViews";

const categoryConfig: Record<string, { title: string, color: string, icon: string }> = {
  national: { title: "देश", color: "#2563eb", icon: "🇮🇳" },
  desh: { title: "देश", color: "#2563eb", icon: "🇮🇳" },
  india: { title: "देश", color: "#2563eb", icon: "🇮🇳" },
  politics: { title: "राजनीति", color: "#dc2626", icon: "🗳️" },
  international: { title: "दुनिया", color: "#0284c7", icon: "🌐" },
  world: { title: "दुनिया", color: "#0284c7", icon: "🌐" },
  states: { title: "राज्य", color: "#eab308", icon: "🏛️" },
  crime: { title: "क्राइम", color: "#ef4444", icon: "🚨" },
  entertainment: { title: "मनोरंजन", color: "#ec4899", icon: "🎬" },
  sports: { title: "खेल", color: "#22c55e", icon: "🏏" },
  lifestyle: { title: "लाइफ स्टाइल", color: "#ff5722", icon: "🍸" },
  religion: { title: "धर्म", color: "#f97316", icon: "🕉️" },
  "tech-auto": { title: "टेक & ऑटो", color: "#0ea5e9", icon: "🚗" },
  business: { title: "व्यापार", color: "#14b8a6", icon: "📈" },
  education: { title: "सरकारी नौकरी & करियर", color: "#059669", icon: "💼" },
  jobs: { title: "सरकारी नौकरी & करियर", color: "#059669", icon: "💼" }
};

const HINDI_STATES = [
  { slug: 'all', name: 'सभी राज्य' },
  { slug: 'up', name: 'उत्तर प्रदेश' },
  { slug: 'bihar', name: 'बिहार' },
  { slug: 'mp', name: 'मध्य प्रदेश' },
  { slug: 'rajasthan', name: 'राजस्थान' },
  { slug: 'delhi', name: 'दिल्ली' },
  { slug: 'haryana', name: 'हरियाणा' },
  { slug: 'jharkhand', name: 'झारखंड' },
  { slug: 'chhattisgarh', name: 'छत्तीसगढ़' },
  { slug: 'uttarakhand', name: 'उत्तराखंड' },
  { slug: 'himachal', name: 'हिमाचल' },
];

export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ category: string }>,
  searchParams?: Promise<{ state?: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedState = resolvedSearchParams.state || 'all';
  const categorySlug = resolvedParams.category || "national";
  const catData = categoryConfig[categorySlug] || { title: categorySlug.toUpperCase(), color: "#475569", icon: "📰" };
  
  const db = await getDb();
  let categoryPosts = db.posts.filter((p: any) => 
    (p.categoryStr === categorySlug || 
     (categorySlug === 'states' && (p.categoryStr === 'states' || p.categoryStr === 'states-sub')) ||
     ((categorySlug === 'international' || categorySlug === 'world') && (p.categoryStr === 'international' || p.categoryStr === 'world')) ||
     ((categorySlug === 'jobs' || categorySlug === 'education') && (p.categoryStr === 'jobs' || p.categoryStr === 'education')) ||
     ((categorySlug === 'national' || categorySlug === 'desh' || categorySlug === 'india') && (p.categoryStr === 'national' || p.categoryStr === 'politics' || p.categoryStr === 'india'))
    ) && 
    p.postType === 'general'
  );

  if (categorySlug === 'states' && selectedState && selectedState !== 'all') {
    categoryPosts = categoryPosts.filter((p: any) => p.subCategory === selectedState);
  }

  const top2 = categoryPosts.slice(0, 2);
  const mid3 = categoryPosts.slice(2, 5);
  const remainingPosts = categoryPosts.slice(5, 15);
  const sidebarPosts = db.posts.filter((p: any) => p.postType === 'general').slice(0, 10);
  const activeStateName = HINDI_STATES.find(s => s.slug === selectedState)?.name || 'सभी राज्य';

  return (
    <div className="w-full min-h-screen bg-[#0b0c10] pb-10">
      <Header />

      {/* Top Banner Ad below Header */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex justify-center">
        <AdsterraAd format="leaderboard" />
      </div>
      
      {/* Category Header Banner */}
      <div style={{ backgroundColor: catData.color }} className="w-full py-5 px-4 lg:px-8 mb-6 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
           <span className="text-[150px] leading-none">{catData.icon}</span>
        </div>
        
        <div className="max-w-[1400px] mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-4xl filter grayscale brightness-0 invert opacity-90">{catData.icon}</span>
            <h1 className="text-[32px] md:text-[40px] font-black text-white tracking-wide">{catData.title}</h1>
          </div>
          {categorySlug === 'states' && selectedState !== 'all' && (
            <span className="text-black bg-amber-400 font-extrabold px-3 py-1 rounded-full text-xs uppercase shadow">
              {activeStateName}
            </span>
          )}
        </div>
      </div>



      {/* State Filter Bar on /states page */}
      {categorySlug === 'states' && (
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-8">
          <div className="w-full bg-[#12141c] p-2.5 rounded-2xl border border-gray-800 flex items-center gap-2 overflow-x-auto scrollbar-hide shadow-lg">
            {HINDI_STATES.map((state) => {
              const isActive = selectedState === state.slug;
              const href = state.slug === 'all' ? '/states' : `/states?state=${state.slug}`;
              return (
                <Link
                  key={state.slug}
                  href={href}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-amber-500 text-black shadow-md font-extrabold scale-[1.02]' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/80'
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-black"></span>}
                  {state.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          <div className="xl:col-span-8 flex flex-col gap-10">
            
            {categoryPosts.length === 0 ? (
              <div className="bg-[#12141c] p-12 rounded-2xl border border-gray-800 text-center flex flex-col items-center justify-center">
                <span className="text-4xl mb-3">📰</span>
                <h3 className="text-white text-xl font-bold mb-2">
                  {categorySlug === 'states' ? `${activeStateName} से जुड़ी खबरें जल्द ही यहाँ प्रकाशित की जाएंगी` : 'इस कैटेगरी में फिलहाल कोई खबर उपलब्ध नहीं है'}
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  {categorySlug === 'states' ? 'तब तक आप अन्य राज्यों या देश-विदेश की ताज़ा खबरें पढ़ सकते हैं।' : 'कृपया कुछ देर बाद पुनः देखें।'}
                </p>
                {categorySlug === 'states' && (
                  <Link 
                    href="/states"
                    className="text-xs bg-amber-500 text-black font-extrabold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-all shadow"
                  >
                    सभी राज्यों की खबरें देखें
                  </Link>
                )}
              </div>
            ) : (
              <>
            {/* 1. Top News Grid */}
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {top2.map((post: any) => (
                  <Link href={`/${post.categoryStr}/${post.slug}`} key={post.id} className="group cursor-pointer">
                    <div className="relative w-full h-56 md:h-64 rounded-sm border border-gray-800 overflow-hidden mb-3">
                      <Image src={post.image || "https://picsum.photos/800/500"} alt={post.headline} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <h2 className="text-white font-bold text-2xl leading-tight group-hover:text-red-500 transition-colors mb-2">
                      {post.headline}
                    </h2>
                    <PostViews views={getPostViews(post, false)} size="xs" />
                  </Link>
                ))}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {mid3.map((post: any) => (
                  <Link href={`/${post.categoryStr}/${post.slug}`} key={post.id} className="group cursor-pointer">
                    <div className="relative w-full h-32 md:h-40 rounded-sm border border-gray-800 overflow-hidden mb-3">
                      <Image src={post.image || "https://picsum.photos/400/300"} alt={post.headline} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <h3 className="text-gray-200 font-semibold text-[17px] leading-snug group-hover:text-red-500 transition-colors mb-1.5">
                      {post.headline}
                    </h3>
                    <PostViews views={getPostViews(post, false)} size="xs" />
                  </Link>
                ))}
              </div>
            </div>

            {/* IN-FEED CATEGORY AD (728x90 Desktop / 300x250 Mobile) */}
            <div className="my-6 w-full flex justify-center">
              <AdsterraAd format="in-feed" />
            </div>

            {/* 2. Visual Stories */}
            <div className="w-full -mx-4 lg:-mx-8 px-4 lg:px-8 bg-transparent">
              <VisualStorySection stories={db.visualStories} />
            </div>

            {/* 3. Remaining Category Posts */}
            <div className="flex flex-col mb-4">
              <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-b-[6px] border-b-transparent" style={{ borderLeftColor: catData.color }}></div>
                  <h2 className="text-[22px] font-black text-white">{catData.title} की अन्य खबरें</h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {remainingPosts.map((post: any) => (
                  <Link href={`/${post.categoryStr}/${post.slug}`} key={post.id} className="flex gap-4 group cursor-pointer border-b border-gray-800/50 pb-6">
                    <div className="relative w-28 md:w-40 h-20 md:h-28 flex-shrink-0 rounded-lg border border-gray-800 overflow-hidden bg-gray-900">
                      <Image src={getPostImage(post)} alt={post.headline} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5 justify-center">
                      <h4 className="text-gray-200 font-bold text-[16px] md:text-[18px] leading-snug group-hover:text-red-500 transition-colors line-clamp-3">
                        {post.headline}
                      </h4>
                      <p className="text-gray-400 text-xs hidden md:block line-clamp-2">{post.summary}</p>
                      <PostViews views={getPostViews(post, false)} size="xs" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* BOTTOM CATEGORY AD (728x90 Desktop / 320x50 Mobile) */}
            <div className="my-6 w-full flex justify-center">
              <AdsterraAd format="leaderboard" />
            </div>
            </>
            )}

            {/* 4. Photo Gallery */}
            <div className="mt-4 border-t border-gray-800 pt-8">
               <PhotoGallerySection posts={db.photoGalleries} />
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-4">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Sidebar Top Ad - 300x250 Medium Rectangle */}
              <AdsterraAd format="rectangle" />

              <div className="flex flex-col bg-[#12141c] border border-gray-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-b-[6px] border-b-transparent border-l-red-600"></div>
                    <h2 className="text-[18px] font-black text-white uppercase tracking-tight">लेटेस्ट खबरें</h2>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3.5 divide-y divide-gray-800/50">
                  {sidebarPosts.map((post: any) => (
                    <Link href={`/${post.categoryStr}/${post.slug}`} key={post.id} className="flex gap-3.5 group cursor-pointer items-start pt-3.5 first:pt-0">
                      <div className="relative w-24 h-16 flex-shrink-0 rounded-lg border border-gray-800 overflow-hidden bg-gray-900">
                        <Image src={getPostImage(post)} alt={post.headline} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-200 font-medium text-[13px] leading-snug group-hover:text-red-500 transition-colors line-clamp-2 mb-1">
                          {post.headline}
                        </h4>
                        <PostViews views={getPostViews(post, false)} size="xs" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sidebar Bottom Skyscraper Ad */}
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
