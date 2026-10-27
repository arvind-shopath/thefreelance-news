import React from "react";
import Header from "@/components/layout/Header";
import GoogleAdUnit from "@/components/ads/GoogleAdUnit";
import Link from "next/link";
import Image from "next/image";
import { getDb } from "@/lib/actions";

export const metadata = {
  title: "विजुअल वेब स्टोरीज़ | The Freelance",
  description: "तस्वीरों और मुख्य हाइलाइट्स के साथ देश, मौसम, तकनीक, सिनेमा और लाइफस्टाइल की रोचक कहानियाँ।",
};

export const revalidate = 60;

export default async function WebStoriesArchivePage() {
  const db = await getDb();
  const stories = db.visualStories || [];

  const firstBatch = stories.slice(0, 10);
  const secondBatch = stories.slice(10);

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
      <div className="relative overflow-hidden bg-gradient-to-b from-[#141622] via-[#0b0c10] to-[#0b0c10] border-b border-gray-800/80 pt-10 pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-4 font-medium">
            <Link href="/" className="hover:text-white transition-colors">होम</Link>
            <span>›</span>
            <span className="text-red-500 font-semibold">विजुअल स्टोरीज़ (Visual Stories)</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            फुलस्क्रीन विजुअल अनुभव (Web Stories)
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-3">
            विजुअल वेब स्टोरीज़
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
            तस्वीरों और मुख्य हाइलाइट्स के साथ देश, मौसम, तकनीक, सिनेमा और लाइफस्टाइल की रोचक कहानियाँ।
          </p>
        </div>
      </div>

      {/* STORIES GRID */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {stories.length === 0 ? (
          <div className="text-center py-20 bg-[#12141c] border border-gray-800 rounded-2xl">
            <p className="text-gray-400 text-lg">वर्तमान में कोई वेब स्टोरी उपलब्ध नहीं है।</p>
            <Link href="/" className="inline-block mt-4 text-red-400 hover:underline text-sm font-bold">
              ← होमपेज पर लौटें
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {firstBatch.map((story: any) => (
                <Link
                  key={story.id}
                  href={`/web-stories/${story.slug}`}
                  className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-gray-800/80 hover:border-red-500/60 shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-end p-4 bg-[#141620]"
                >
                  <Image
                    src={story.posterImage || story.image || story.slides?.[0]?.imageUrl || "https://picsum.photos/450/800"}
                    alt={story.title || story.headline}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                  
                  {/* Category / Visual Story Icon Badge */}
                  <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase text-white tracking-wider flex items-center gap-1">
                    <span>⚡</span>
                    <span>Story</span>
                  </div>

                  <div className="relative z-10">
                    <h2 className="text-white font-bold text-xs sm:text-sm leading-snug line-clamp-3 group-hover:text-red-400 transition-colors">
                      {story.title || story.headline}
                    </h2>
                    <span className="text-[10px] text-gray-400 mt-2 block font-medium">
                      {story.createdAt ? new Date(story.createdAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' }) : ''}
                    </span>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {secondBatch.map((story: any) => (
                  <Link
                    key={story.id}
                    href={`/web-stories/${story.slug}`}
                    className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-gray-800/80 hover:border-red-500/60 shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-end p-4 bg-[#141620]"
                  >
                    <Image
                      src={story.posterImage || story.image || story.slides?.[0]?.imageUrl || "https://picsum.photos/450/800"}
                      alt={story.title || story.headline}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                    
                    <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase text-white tracking-wider flex items-center gap-1">
                      <span>⚡</span>
                      <span>Story</span>
                    </div>

                    <div className="relative z-10">
                      <h2 className="text-white font-bold text-xs sm:text-sm leading-snug line-clamp-3 group-hover:text-red-400 transition-colors">
                        {story.title || story.headline}
                      </h2>
                      <span className="text-[10px] text-gray-400 mt-2 block font-medium">
                        {story.createdAt ? new Date(story.createdAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' }) : ''}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* BOTTOM GOOGLE AD */}
        <div className="w-full flex justify-center mt-14">
          <GoogleAdUnit slot="2418463479" format="auto" />
        </div>
      </div>
    </main>
  );
}
