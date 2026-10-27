import React from "react";
import Header from "@/components/layout/Header";
import AdsterraAd from "@/components/ads/AdsterraAd";
import Link from "next/link";
import Image from "next/image";
import { getDbEn } from "@/lib/actions";

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const resolved = await params;
  const tagName = decodeURIComponent(resolved.tag || "");
  return {
    title: `#${tagName} - Latest Stories & News Coverage | TheFreeLance`,
    description: `All verified global news reports, analysis, and breaking coverage tagged #${tagName}.`,
  };
}

export default async function EnglishTagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const resolved = await params;
  const rawTag = decodeURIComponent(resolved.tag || "").trim();
  const lowerTag = rawTag.toLowerCase();

  const db = await getDbEn();
  const allPosts = db.posts || [];

  const matchedPosts = allPosts.filter((post: any) => {
    const postTags = (post.tags || "").toLowerCase();
    const headline = (post.headline || "").toLowerCase();
    const summary = (post.summary || "").toLowerCase();
    const category = (post.categoryStr || "").toLowerCase();

    return (
      postTags.includes(lowerTag) ||
      headline.includes(lowerTag) ||
      summary.includes(lowerTag) ||
      category.includes(lowerTag)
    );
  });

  const firstBatch = matchedPosts.slice(0, 8);
  const secondBatch = matchedPosts.slice(8);

  return (
    <main className="min-h-screen bg-[#0b0c10] text-gray-200">
      <Header />

      {/* TOP BANNER AD */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex justify-center">
        <div className="w-full max-w-[970px] overflow-hidden flex justify-center">
          <AdsterraAd format="leaderboard" />
        </div>
      </div>

      {/* TAG HERO HEADER */}
      <div className="bg-[#12141c] border-b border-gray-800 py-8 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/en" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="hover:text-white transition-colors">Trending Topics</span>
            <span>›</span>
            <span className="text-red-500 font-semibold">#{rawTag}</span>
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl font-black text-red-500 bg-red-950/40 border border-red-800/40 w-12 h-12 rounded-2xl flex items-center justify-center">
                #
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{rawTag}</h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                  All verified international reports and analysis published on this topic
                </p>
              </div>
            </div>

            <span className="bg-gray-800/80 border border-gray-700 text-gray-300 px-3.5 py-1 rounded-full text-xs font-bold">
              {matchedPosts.length} {matchedPosts.length === 1 ? 'Story' : 'Stories'}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {matchedPosts.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-16 px-4 bg-[#12141c] border border-gray-800 rounded-3xl shadow-xl">
            <span className="text-5xl block mb-4">🏷️</span>
            <h2 className="text-xl font-bold text-white mb-2">No Stories Found For This Tag</h2>
            <p className="text-sm text-gray-400 mb-6">
              New reporting on #{rawTag} will appear here as soon as verified developments occur.
            </p>
            <Link
              href="/en"
              className="inline-block bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow"
            >
              Back to English Home
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {firstBatch.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/en/${post.categoryStr || "news"}/${post.slug}`}
                  className="group flex flex-col bg-[#12141c] border border-gray-800/80 hover:border-red-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-900">
                    <Image
                      src={post.image || "https://picsum.photos/400/250"}
                      alt={post.headline}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-red-400 text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                      {post.categoryStr || "news"}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="text-gray-100 font-bold text-sm sm:text-base leading-snug group-hover:text-red-400 transition-colors line-clamp-2 mb-2">
                      {post.headline}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3">
                      {post.summary}
                    </p>
                    <span className="text-[11px] text-gray-500 pt-2 border-t border-gray-800/60">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : ""}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* MID-GRID AD */}
            <div className="my-10 p-4 bg-[#08090d] border border-gray-800/80 rounded-2xl flex flex-col items-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 self-start px-2">
                ADVERTISEMENT
              </span>
              <div className="w-full flex justify-center overflow-hidden">
                <AdsterraAd format="in-feed" />
              </div>
            </div>

            {secondBatch.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {secondBatch.map((post: any) => (
                  <Link
                    key={post.id}
                    href={`/en/${post.categoryStr || "news"}/${post.slug}`}
                    className="group flex flex-col bg-[#12141c] border border-gray-800/80 hover:border-red-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-900">
                      <Image
                        src={post.image || "https://picsum.photos/400/250"}
                        alt={post.headline}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-red-400 text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                        {post.categoryStr || "news"}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <h3 className="text-gray-100 font-bold text-sm sm:text-base leading-snug group-hover:text-red-400 transition-colors line-clamp-2 mb-2">
                        {post.headline}
                      </h3>
                      <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3">
                        {post.summary}
                      </p>
                      <span className="text-[11px] text-gray-500 pt-2 border-t border-gray-800/60">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : ""}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* BOTTOM AD */}
        <div className="w-full flex justify-center mt-12">
          <AdsterraAd format="native" />
        </div>
      </div>
    </main>
  );
}
