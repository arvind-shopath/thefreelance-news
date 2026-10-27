import React from "react";
import Header from "@/components/layout/Header";
import GoogleAdUnit from "@/components/ads/GoogleAdUnit";
import Link from "next/link";
import Image from "next/image";
import { getDb } from "@/lib/actions";

export const metadata = {
  title: "खबरें खोजें (Search News) | The Freelance",
  description: "The Freelance पर देश, दुनिया, राजनीति, व्यापार और खेल से जुड़े समाचार और रिपोर्ट खोजें।",
};

const CATEGORY_FILTERS = [
  { slug: "all", label: "सभी खबरें" },
  { slug: "national", label: "देश" },
  { slug: "politics", label: "राजनीति" },
  { slug: "states", label: "राज्य" },
  { slug: "business", label: "व्यापार" },
  { slug: "sports", label: "खेल" },
  { slug: "entertainment", label: "मनोरंजन" },
  { slug: "tech-auto", label: "टेक & ऑटो" },
  { slug: "religion", label: "धर्म" },
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const rawQuery = resolvedParams.q?.trim() || "";
  const categoryFilter = resolvedParams.category || "all";

  const db = await getDb();
  const allPosts = db.posts || [];

  const q = rawQuery.toLowerCase();

  const filteredPosts = allPosts.filter((post: any) => {
    // Category filter
    if (categoryFilter !== "all") {
      if (post.categoryStr !== categoryFilter && !(categoryFilter === "states" && post.categoryStr === "states-sub")) {
        return false;
      }
    }

    if (!q) return true;

    const headline = (post.headline || "").toLowerCase();
    const summary = (post.summary || "").toLowerCase();
    const tags = (post.tags || "").toLowerCase();
    const categoryStr = (post.categoryStr || "").toLowerCase();
    const headlineEn = (post.headlineEn || "").toLowerCase();

    return (
      headline.includes(q) ||
      summary.includes(q) ||
      tags.includes(q) ||
      categoryStr.includes(q) ||
      headlineEn.includes(q)
    );
  });

  const firstBatch = filteredPosts.slice(0, 8);
  const secondBatch = filteredPosts.slice(8);

  return (
    <main className="min-h-screen bg-[#0b0c10] text-gray-200">
      <Header />

      {/* TOP BANNER GOOGLE AD */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex justify-center">
        <div className="w-full max-w-[970px] overflow-hidden flex justify-center">
          <GoogleAdUnit slot="2418463479" format="auto" />
        </div>
      </div>

      {/* SEARCH HEADER */}
      <div className="bg-[#12141c] border-b border-gray-800 py-8 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">होम</Link>
            <span>›</span>
            <span className="text-red-500 font-semibold">सर्च (Search)</span>
          </div>

          <form action="/search" method="GET" className="relative flex items-center">
            <input
              type="text"
              name="q"
              defaultValue={rawQuery}
              placeholder="सर्च करें... (उदा: चुनाव, बजट, शेयर मार्केट, क्राइम)"
              className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3.5 pl-12 pr-28 text-white placeholder-gray-500 outline-none font-medium shadow-inner transition-colors"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <button
              type="submit"
              className="absolute right-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
            >
              खोजें
            </button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            {CATEGORY_FILTERS.map((cat) => {
              const isActive = categoryFilter === cat.slug;
              const href = rawQuery
                ? `/search?q=${encodeURIComponent(rawQuery)}&category=${cat.slug}`
                : `/search?category=${cat.slug}`;
              return (
                <Link
                  key={cat.slug}
                  href={href}
                  className={`text-xs px-3.5 py-1.5 rounded-full border whitespace-nowrap font-medium transition-all ${
                    isActive
                      ? "bg-red-600 border-red-500 text-white shadow-md font-bold"
                      : "bg-[#0b0c10] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>

          {/* Query Feedback */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800/60">
            <div>
              {rawQuery ? (
                <span>
                  &quot;<strong className="text-white">{rawQuery}</strong>&quot; के लिए परिणाम:
                </span>
              ) : (
                <span>ताज़ा खोज परिणाम:</span>
              )}
            </div>
            <span className="bg-gray-800/80 text-gray-300 px-3 py-1 rounded-full font-bold">
              {filteredPosts.length} खबरें मिलीं
            </span>
          </div>
        </div>
      </div>

      {/* RESULTS GRID */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filteredPosts.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-16 px-4 bg-[#12141c] border border-gray-800 rounded-3xl shadow-xl">
            <span className="text-5xl block mb-4">🔍</span>
            <h2 className="text-xl font-bold text-white mb-2">कोई परिणाम नहीं मिला</h2>
            <p className="text-sm text-gray-400 mb-6">
              आपके द्वारा खोजे गए शब्द &quot;{rawQuery}&quot; से संबंधित कोई खबर नहीं मिली। कृपया वर्तनी (spelling) जांचें या अन्य शब्द खोजें।
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 font-bold w-full mb-2">लोकप्रिय खोजें:</span>
              {["चुनाव", "बजट", "शेयर बाजार", "क्रिकेट", "मौसम", "राजनीति"].map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="bg-[#181a24] hover:bg-red-600 hover:text-white text-gray-300 text-xs px-3.5 py-1.5 rounded-full border border-gray-800 transition-all"
                >
                  #{tag}
                </Link>
              ))}
            </div>
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

            {/* MID-RESULTS IN-FEED GOOGLE AD */}
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
