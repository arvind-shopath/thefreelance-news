import React from "react";
import Header from "@/components/layout/Header";
import GoogleAdUnit from "@/components/ads/GoogleAdUnit";
import Link from "next/link";
import Image from "next/image";
import { getDb } from "@/lib/actions";
import { getPostImage } from "@/lib/constants";

export const metadata = {
  title: "ट्रेंडिंग और वायरल समाचार | The Freelance",
  description: "सोशल मीडिया और देश के जनमानस में छाए प्रमुख मुद्दे, विश्लेषण और एक्सक्लूसिव रिपोर्ट्स।",
};

export const revalidate = 60;

export default async function TrendingPage() {
  const db = await getDb();
  const allPosts = db.posts || [];
  const trendingList = allPosts.filter((p: any) => p.isTrending || p.isFeatured).slice(0, 30);
  const posts = trendingList.length > 0 ? trendingList : allPosts.slice(0, 30);

  const firstBatch = posts.slice(0, 9);
  const secondBatch = posts.slice(9);

  return (
    <main className="min-h-screen bg-[#0b0c10] text-gray-200">
      <Header />

      {/* TOP BANNER GOOGLE AD */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex justify-center">
        <div className="w-full max-w-[970px] overflow-hidden flex justify-center">
          <GoogleAdUnit slot="2418463479" format="auto" />
        </div>
      </div>

      {/* HERO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1c1212] via-[#0b0c10] to-[#0b0c10] border-b border-gray-800/80 pt-10 pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-4 font-medium">
            <Link href="/" className="hover:text-white transition-colors">होम</Link>
            <span>›</span>
            <span className="text-red-500 font-semibold">ट्रेंडिंग टॉपिक्स (Trending News)</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            देशभर में सबसे ज्यादा पढ़ी जा रही खबरें
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-3">
            ट्रेंडिंग और वायरल समाचार
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
            सोशल मीडिया और देश के जनमानस में छाए प्रमुख मुद्दे, विश्लेषण और एक्सक्लूसिव रिपोर्ट्स।
          </p>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-[#12141c] border border-gray-800 rounded-2xl">
            <p className="text-gray-400 text-lg">वर्तमान में कोई ट्रेंडिंग खबर उपलब्ध नहीं है।</p>
            <Link href="/" className="inline-block mt-4 text-red-400 hover:underline text-sm font-bold">
              ← होमपेज पर लौटें
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {firstBatch.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/${post.categoryStr || 'national'}/${post.slug}`}
                  className="group relative rounded-2xl overflow-hidden border border-gray-800/80 hover:border-red-500/60 shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col bg-[#141620]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={getPostImage(post)}
                      alt={post.headline}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141620] via-transparent to-transparent"></div>
                    
                    <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-white tracking-wider">
                      🔥 ट्रेंडिंग • {post.categoryStr}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <h2 className="text-white font-bold text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">
                      {post.headline}
                    </h2>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-2 leading-relaxed">
                      {post.summary}
                    </p>
                    <div className="pt-4 border-t border-gray-800/60 mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span>स्रोत: {post.sourceName || "The Freelance Bureau"}</span>
                      <span className="text-red-400 font-bold group-hover:translate-x-1 transition-transform">
                        पूरी खबर पढ़ें →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* MID-GRID IN-FEED GOOGLE AD */}
            <div className="my-10 p-4 bg-[#08090d] border border-gray-800/80 rounded-2xl flex flex-col items-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 self-start px-2">
                विज्ञापन • ADVERTISEMENT
              </span>
              <div className="w-full flex justify-center overflow-hidden">
                <GoogleAdUnit slot="2418463479" format="auto" />
              </div>
            </div>

            {secondBatch.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {secondBatch.map((post: any) => (
                  <Link
                    key={post.id}
                    href={`/${post.categoryStr || 'national'}/${post.slug}`}
                    className="group relative rounded-2xl overflow-hidden border border-gray-800/80 hover:border-red-500/60 shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col bg-[#141620]"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <Image
                        src={getPostImage(post)}
                        alt={post.headline}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141620] via-transparent to-transparent"></div>
                      
                      <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-white tracking-wider">
                        🔥 ट्रेंडिंग • {post.categoryStr}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <h2 className="text-white font-bold text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">
                        {post.headline}
                      </h2>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-2 leading-relaxed">
                        {post.summary}
                      </p>
                      <div className="pt-4 border-t border-gray-800/60 mt-4 flex items-center justify-between text-xs text-gray-500">
                        <span>स्रोत: {post.sourceName || "The Freelance Bureau"}</span>
                        <span className="text-red-400 font-bold group-hover:translate-x-1 transition-transform">
                          पूरी खबर पढ़ें →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* BOTTOM AD */}
        <div className="w-full flex justify-center mt-14">
          <GoogleAdUnit slot="2418463479" format="auto" />
        </div>
      </div>
    </main>
  );
}
