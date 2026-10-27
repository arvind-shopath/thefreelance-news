"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getPostImage } from "@/lib/constants";

interface ReadNextPromptProps {
  post: {
    id: number | string;
    slug: string;
    categoryStr: string;
    headline: string;
    image?: string;
  };
  isEn?: boolean;
}

export default function MobileReadNextPrompt({ post, isEn = false }: ReadNextPromptProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!post || !post.slug) return;

    const handleScroll = () => {
      if (dismissed) return;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const progress = window.scrollY / scrollHeight;

      // Show after user reads 40% of the page
      if (progress > 0.4 && progress < 0.92) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post, dismissed]);

  if (!post || !post.slug || dismissed || !visible) return null;

  const href = isEn 
    ? `/en/${post.categoryStr || 'news'}/${post.slug}` 
    : `/${post.categoryStr}/${post.slug}`;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-5 sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="relative rounded-2xl bg-[#0f111a]/95 backdrop-blur-md border border-red-600/50 p-3 shadow-2xl shadow-black/80 flex items-center gap-3">
        <button
          onClick={() => {
            setDismissed(true);
            setVisible(false);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white border border-gray-700 flex items-center justify-center text-xs shadow-md transition-colors"
          aria-label="Close prompt"
        >
          ✕
        </button>

        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-900 border border-gray-800">
          <img
            src={getPostImage(post)}
            alt={post.headline}
            className="w-full h-full object-cover"
            onError={(e: any) => {
              e.currentTarget.src = "/uploads/tfl-national-parliament.jpg";
            }}
          />
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-red-500 block mb-0.5">
            {isEn ? "👉 NEXT RECOMMENDED STORY" : "👉 अगली बड़ी खबर (संबंधित)"}
          </span>
          <Link
            href={href}
            className="text-xs font-bold text-white hover:text-red-400 line-clamp-2 leading-tight block"
          >
            {post.headline}
          </Link>
        </div>

        <Link
          href={href}
          className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white font-black text-xs px-3 py-2 rounded-xl transition-all shadow-md hover:scale-105"
        >
          {isEn ? "Read →" : "पढ़ें →"}
        </Link>
      </div>
    </div>
  );
}
