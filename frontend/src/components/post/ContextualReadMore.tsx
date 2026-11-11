"use client";
import React from "react";
import Link from "next/link";
import { getPostImage } from "@/lib/constants";

interface ContextualReadProps {
  post: {
    id: number | string;
    slug: string;
    categoryStr: string;
    headline: string;
    image?: string;
  };
  prefix?: string;
  isEn?: boolean;
}

export default function ContextualReadMore({ post, prefix = "यह भी पढ़ें", isEn = false }: ContextualReadProps) {
  if (!post || !post.slug) return null;

  const href = isEn 
    ? `/en/${post.categoryStr || 'news'}/${post.slug}` 
    : `/${post.categoryStr}/${post.slug}`;

  const imageUrl = getPostImage(post);

  return (
    <div className="contextual-read-more my-6 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-red-50/90 via-white to-slate-50 dark:from-red-950/40 dark:via-[#161922] dark:to-[#12141c] border-l-4 border-red-600 border-y border-r border-slate-200 dark:border-gray-800/80 shadow-md hover:shadow-lg dark:shadow-lg hover:border-red-500/70 transition-all group">
      <Link href={href} className="flex items-center gap-3.5">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm">
          <img
            src={imageUrl}
            alt={post.headline}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e: any) => {
              e.currentTarget.src = "/uploads/tfl-national-parliament.jpg";
            }}
          />
          <div className="absolute top-1 left-1 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
            {isEn ? "MUST READ" : "खास"}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-black text-red-600 dark:text-red-500 uppercase tracking-widest mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500 animate-pulse"></span>
            <span>{prefix}:</span>
          </div>
          <h4 className="contextual-read-title text-slate-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 font-bold text-sm sm:text-base leading-snug line-clamp-2 transition-colors">
            {post.headline}
          </h4>
          <span className="contextual-read-link text-[11px] text-slate-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-gray-300 font-medium inline-flex items-center gap-1 mt-1">
            <span>{isEn ? "Read full report" : "पूरी रिपोर्ट पढ़ें"}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </Link>
    </div>
  );
}
