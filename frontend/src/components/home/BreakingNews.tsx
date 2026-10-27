"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import PostViews, { getPostViews } from "@/components/common/PostViews";

interface BreakingNewsProps {
  post?: any;
  posts?: any[];
  tags: string[];
  isEn?: boolean;
}

export default function BreakingNews({ post, posts: postsProp, tags, isEn }: BreakingNewsProps) {
  // Combine postsProp or fallback to [post]
  const items = useMemo(() => {
    if (postsProp && Array.isArray(postsProp) && postsProp.length > 0) {
      return postsProp.filter(Boolean);
    }
    if (post) return [post];
    return [];
  }, [postsProp, post]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance carousel every 4.5 seconds
  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setIsAnimating(false);
      }, 300);
    }, 4500);

    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  if (items.length === 0) return null;

  const currentPost = items[currentIndex] || items[0];
  const title = (isEn && currentPost.headlineEn) ? currentPost.headlineEn : currentPost.headline;
  const slug = (isEn && currentPost.slugEn) ? currentPost.slugEn : currentPost.slug;
  const href = isEn ? `/en/${currentPost.categoryStr || 'news'}/${slug}` : `/${currentPost.categoryStr || 'news'}/${slug}`;

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
      setIsAnimating(false);
    }, 200);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
      setIsAnimating(false);
    }, 200);
  };

  const tagMapEn: Record<string, string> = {
    'विजुअल स्टोरी': 'VisualStories',
    'वेब स्टोरी': 'WebStories',
    'दैनिक अपडेट': 'DailyUpdates',
    'राशिफल': 'Horoscope',
    'मनोरंजन': 'Entertainment',
    'राजनीति': 'Politics',
    'खेल': 'Sports',
    'व्यापार': 'Business',
    'भारत': 'India',
    'क्राइम': 'Crime',
  };

  const displayTags = isEn
    ? tags
        .map((t) => tagMapEn[t] || t)
        .filter((t) => !/[\u0900-\u097F]/.test(t))
    : tags;

  return (
    <div className="w-full bg-[#0b0c10] pt-4 pb-4 px-4 lg:px-8 max-w-[1400px] mx-auto border-b border-gray-900/80">
      
      {/* Breaking News Live Carousel Bar */}
      <div 
        className="breaking-ticker-bar flex items-stretch mb-5 w-full mx-auto max-w-5xl rounded-full overflow-hidden shadow-lg border border-red-900/50 bg-gradient-to-r from-red-950/60 via-[#140a0e] to-[#0e1017] backdrop-blur-md group transition-all duration-300"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Animated LIVE / BREAKING Badge */}
        <div className="breaking-ticker-badge keep-white bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white font-black text-[11px] md:text-xs tracking-wider uppercase px-4 md:px-6 py-2.5 flex-shrink-0 flex items-center gap-2.5 z-10 shadow-[4px_0_12px_rgba(220,38,38,0.5)] select-none">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white shadow-[0_0_8px_white]"></span>
          </span>
          <span className="hidden sm:inline">LIVE</span>
          <span>BREAKING</span>
        </div>

        {/* Carousel Rotating Headline */}
        <div className="flex-1 flex items-center justify-between min-w-0 px-3 md:px-5 py-2 overflow-hidden">
          <Link 
            href={href}
            className="flex-1 flex items-center min-w-0 group/link"
          >
            {/* Category Pill */}
            {currentPost.categoryStr && (
              <span className="breaking-ticker-cat hidden sm:inline-block mr-2.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 flex-shrink-0 transition-colors">
                {currentPost.categoryStr}
              </span>
            )}

            {/* Rotating Title */}
            <div 
              className={`breaking-ticker-title truncate text-xs md:text-sm font-semibold tracking-tight text-white group-hover/link:text-red-400 transition-all duration-300 ${
                isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              {title}
            </div>
          </Link>

          <PostViews views={getPostViews(currentPost, isEn)} size="xs" className="hidden sm:inline-flex ml-2 mr-1 shrink-0" />

          {/* Controls: Counter + Prev/Next buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2 select-none">
            {items.length > 1 && (
              <span className="breaking-ticker-counter text-[10px] font-mono text-gray-400 mr-1 hidden sm:inline">
                {currentIndex + 1}/{items.length}
              </span>
            )}
            
            {items.length > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  title="पिछली खबर"
                  aria-label="Previous Breaking News"
                  className="breaking-ticker-btn w-6 h-6 rounded-full flex items-center justify-center bg-white/5 hover:bg-red-600 text-gray-300 hover:text-white transition-all text-xs active:scale-95"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  title="अगली खबर"
                  aria-label="Next Breaking News"
                  className="breaking-ticker-btn w-6 h-6 rounded-full flex items-center justify-center bg-white/5 hover:bg-red-600 text-gray-300 hover:text-white transition-all text-xs active:scale-95"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trending Topics (Tags) */}
      <div className="flex items-center gap-4 max-w-full">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest hidden md:block">
          {isEn ? "Trending:" : "ट्रेंडिंग:"}
        </span>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-1 flex-1">
          {displayTags.map((tag, i) => (
            <Link 
              key={i} 
              href={isEn ? `/en/tags/${encodeURIComponent(tag)}` : `/tags/${encodeURIComponent(tag)}`} 
              className="bg-[#12141c] hover:bg-red-600 hover:text-white text-gray-400 text-[11px] font-bold px-4 py-1.5 rounded-full whitespace-nowrap border border-gray-800 transition-all hover:scale-105 active:scale-95"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
