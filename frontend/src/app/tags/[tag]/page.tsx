import React from "react";
import Header from "@/components/layout/Header";
import GoogleAdUnit from "@/components/ads/GoogleAdUnit";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getDb, getDbEn } from "@/lib/actions";

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const resolved = await params;
  const tagName = decodeURIComponent(resolved.tag || "");
  return {
    title: `#${tagName} से जुड़े समाचार | The Freelance`,
    description: `#${tagName} विषय पर सभी ताज़ा खबरें, विश्लेषण और ग्राउंड रिपोर्ट्स।`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const resolved = await params;
  const rawTag = decodeURIComponent(resolved.tag || "").trim();
  const lowerTag = rawTag.toLowerCase();

  const db = await getDb();
  const allPosts = db.posts || [];

  let matchedPosts = allPosts.filter((post: any) => {
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

  // If no Hindi posts found for this tag and it has no Devanagari characters, check if English portal has posts for it
  if (matchedPosts.length === 0 && !/[\u0900-\u097F]/.test(rawTag)) {
    const dbEn = await getDbEn();
    const enPosts = (dbEn.posts || []).filter((post: any) => {
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

    if (enPosts.length > 0) {
      redirect(`/en/tags/${encodeURIComponent(rawTag)}`);
    }
  }

  const firstBatch = matchedPosts.slice(0, 8);
  const secondBatch = matchedPosts.slice(8);

  return (
    <main className="min-h-screen bg-[#0b0c10] text-gray-200">
      <Header />

      {/* TOP BANNER GOOGLE AD */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex justify-center">
        <div className="w-full max-w-[970px] overflow-hidden flex justify-center">
          <GoogleAdUnit slot="2418463479" format="auto" />
        </div>
      </div>

      {/* TAG HERO HEADER */}
      <div className="bg-[#12141c] border-b border-gray-800 py-8 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">होम</Link>
            <span>›</span>
            <Link href="/trending" className="hover:text-white transition-colors">ट्रेंडिंग टॉपिक्स</Link>
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
                  इस विषय पर प्रकाशित सभी महत्वपूर्ण खबरें और विश्लेषण
                </p>
              </div>
            </div>

            <span className="bg-gray-800/80 border border-gray-700 text-gray-300 px-3.5 py-1 rounded-full text-xs font-bold">
              {matchedPosts.length} खबरें
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {matchedPosts.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-16 px-4 bg-[#12141c] border border-gray-800 rounded-3xl shadow-xl">
            <span className="text-5xl block mb-4">🏷️</span>
            <h2 className="text-xl font-bold text-white mb-2">इस टैग से संबंधित कोई खबर नहीं मिली</h2>
            <p className="text-sm text-gray-400 mb-6">
              #{rawTag} विषय पर जल्द ही नई रिपोर्ट प्रकाशित की जाएंगी।
            </p>
            <Link
              href="/"
              className="inline-block bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow"
            >
              होमपेज पर लौटें
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {firstBatch.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/${post.categoryStr || "national"}/${post.slug}`}
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
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString("hi-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {secondBatch.map((post: any) => (
                  <Link
                    key={post.id}
                    href={`/${post.categoryStr || "national"}/${post.slug}`}
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
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString("hi-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* BOTTOM GOOGLE AD */}
        <div className="w-full flex justify-center mt-12">
          <GoogleAdUnit slot="2418463479" format="auto" />
        </div>
      </div>
    </main>
  );
}
