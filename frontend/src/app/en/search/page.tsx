import React from "react";
import Header from "@/components/layout/Header";
import Link from "next/link";
import Image from "next/image";
import { getDbEn } from "@/lib/actions";
import { categoryEnMap } from "@/lib/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://news.thefreelance.in";

export const metadata = {
  title: "Search News & Global Stories | The FreeLance (English)",
  description: "Search verified international stories, world affairs, politics, technology, sports, and business on The FreeLance.",
  alternates: {
    canonical: `${SITE_URL}/en/search`,
  },
};

const CATEGORY_FILTERS = [
  { slug: "all", label: "All Stories" },
  { slug: "world", label: "World" },
  { slug: "national", label: "India" },
  { slug: "crime", label: "Crime" },
  { slug: "entertainment", label: "Entertainment" },
  { slug: "sports", label: "Sports" },
  { slug: "lifestyle", label: "Lifestyle" },
  { slug: "business", label: "Business" },
  { slug: "tech-auto", label: "Tech & Auto" },
  { slug: "religion", label: "Religion" },
];

export default async function EnglishSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const rawQuery = resolvedParams.q?.trim() || "";
  const categoryFilter = resolvedParams.category || "all";

  const db = await getDbEn();
  const allPosts = db.posts || [];

  const q = rawQuery.toLowerCase();

  const filteredPosts = allPosts.filter((post: any) => {
    // Category filter
    if (categoryFilter !== "all") {
      const cat = (post.categoryStr || "").toLowerCase();
      if (cat !== categoryFilter && !(categoryFilter === "world" && cat === "international")) {
        return false;
      }
    }

    if (!q) return true;

    const headline = (post.headline || "").toLowerCase();
    const headlineEn = (post.headlineEn || "").toLowerCase();
    const summary = (post.summary || "").toLowerCase();
    const summaryEn = (post.summaryEn || "").toLowerCase();
    const tags = (post.tags || "").toLowerCase();
    const categoryStr = (post.categoryStr || "").toLowerCase();
    const content = (post.content || "").toLowerCase();
    const contentEn = (post.contentEn || "").toLowerCase();

    return (
      headline.includes(q) ||
      headlineEn.includes(q) ||
      summary.includes(q) ||
      summaryEn.includes(q) ||
      tags.includes(q) ||
      categoryStr.includes(q) ||
      content.includes(q) ||
      contentEn.includes(q)
    );
  });

  return (
    <main className="min-h-screen bg-[#0b0c10] text-gray-200">
      <Header />

      {/* SEARCH HEADER */}
      <div className="bg-[#12141c] border-b border-gray-800 py-8 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/en" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-red-500 font-semibold">Search</span>
          </div>

          <form action="/en/search" method="GET" className="relative flex items-center">
            <input
              type="text"
              name="q"
              defaultValue={rawQuery}
              placeholder="Search global stories, topics, keywords... (e.g. World, Tech, Sports)"
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
              Search
            </button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            {CATEGORY_FILTERS.map((cat) => {
              const isActive = categoryFilter === cat.slug;
              const href = rawQuery
                ? `/en/search?q=${encodeURIComponent(rawQuery)}&category=${cat.slug}`
                : `/en/search?category=${cat.slug}`;
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
                  Results for &quot;<strong className="text-white">{rawQuery}</strong>&quot;:
                </span>
              ) : (
                <span>Latest Global Coverage:</span>
              )}
            </div>
            <span className="bg-gray-800/80 text-gray-300 px-3 py-1 rounded-full font-bold">
              {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"} found
            </span>
          </div>
        </div>
      </div>

      {/* RESULTS GRID */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filteredPosts.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-16 px-4 bg-[#12141c] border border-gray-800 rounded-3xl shadow-xl">
            <span className="text-5xl block mb-4">🔍</span>
            <h2 className="text-xl font-bold text-white mb-2">No Results Found</h2>
            <p className="text-sm text-gray-400 mb-6">
              We couldn&apos;t find any stories matching &quot;{rawQuery}&quot;. Please check the spelling or explore popular topics.
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 font-bold w-full mb-2">Popular Searches:</span>
              {["World", "US News", "Technology", "Business", "Markets", "Sports"].map((tag) => (
                <Link
                  key={tag}
                  href={`/en/search?q=${encodeURIComponent(tag)}`}
                  className="bg-[#181a24] hover:bg-red-600 hover:text-white text-gray-300 text-xs px-3.5 py-1.5 rounded-full border border-gray-800 transition-all"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPosts.map((post: any) => {
              const itemCat = post.categoryStr === "international" ? "world" : (post.categoryStr || "world");
              const itemSlug = post.slugEn || post.slug;
              const itemHref = `/en/${itemCat}/${itemSlug}`;
              const itemBadge = categoryEnMap[post.categoryStr] || post.categoryStr || "World";
              const itemHeadline = post.headlineEn || post.headline;
              const itemSummary = post.summaryEn || post.summary;
              const itemDate = post.createdAt
                ? new Date(post.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                : "";

              return (
                <Link
                  key={post.id}
                  href={itemHref}
                  className="group flex flex-col bg-[#12141c] border border-gray-800/80 hover:border-red-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-900">
                    <Image
                      src={post.image || "https://picsum.photos/400/250"}
                      alt={itemHeadline}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-red-400 text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                      {itemBadge}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-gray-100 font-bold text-sm sm:text-base leading-snug group-hover:text-red-400 transition-colors line-clamp-2 mb-2">
                        {itemHeadline}
                      </h3>
                      {itemSummary && (
                        <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3">
                          {itemSummary}
                        </p>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500 pt-2 border-t border-gray-800/60 block">
                      {itemDate}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
