"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { getPostImage } from "@/lib/constants";

interface RelatedPost {
  id: number | string;
  slug: string;
  slugEn?: string;
  categoryStr: string;
  headline: string;
  image?: string;
  createdAt?: string;
}

export default function InArticleRelatedNews({
  posts,
  isEn = false
}: {
  posts: RelatedPost[];
  isEn?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!posts || posts.length === 0) return null;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -280, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 280, behavior: "smooth" });
  };

  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-red-700/40 shadow-xl bg-[#0f1117] in-article-related-box">
      {/* Red Header */}
      <div className="bg-red-600 px-4 py-2.5 flex items-center gap-2">
        <svg
          className="w-4 h-4 text-white flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6"
          />
        </svg>
        <h3 className="text-white font-black text-sm uppercase tracking-widest">
          {isEn ? "Related News" : "संबंधित खबरें"}
        </h3>
      </div>

      {/* Scrollable Cards */}
      <div className="relative group px-3 py-3">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/70 hover:bg-red-600 border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg ml-1"
          aria-label="Scroll left"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
        >
          {posts.map((post) => {
            const imageUrl = getPostImage(post);
            const targetSlug = isEn && post.slugEn ? post.slugEn : post.slug;
            const targetHref = isEn ? `/en/${post.categoryStr}/${targetSlug}` : `/${post.categoryStr}/${targetSlug}`;
            const fallbackImg = isEn ? "/uploads/tfl-world-diplomacy.jpg" : "/uploads/tfl-national-parliament.jpg";
            return (
              <Link
                key={post.id}
                href={targetHref}
                className="flex-none w-[240px] sm:w-[260px] flex items-center gap-3 bg-[#1a1d28] hover:bg-[#22263a] border border-gray-800 hover:border-red-700/50 rounded-xl p-2.5 transition-all group/card in-article-related-item"
              >
                <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
                  <img
                    src={imageUrl}
                    alt={post.headline}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e: any) => {
                      e.currentTarget.src = fallbackImg;
                    }}
                  />
                </div>
                <p className="text-gray-200 text-xs font-semibold leading-snug line-clamp-3 flex-1 in-article-related-title">
                  {post.headline}
                </p>
              </Link>
            );
          })}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/70 hover:bg-red-600 border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg mr-1"
          aria-label="Scroll right"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}