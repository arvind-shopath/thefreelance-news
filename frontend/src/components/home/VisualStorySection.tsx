"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";
import { getPostImage } from "@/lib/constants";
import PostViews, { getPostViews } from "@/components/common/PostViews";

export default function VisualStorySection({ stories, isEn }: { stories: any[]; isEn?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -260, behavior: "smooth" });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft: sLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (sLeft + clientWidth >= scrollWidth - 15) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: 260, behavior: "smooth" });
      }
    }
  }, []);

  // Autoplay carousel: smoothly advances every 3.5s unless hovered/touched
  useEffect(() => {
    if (!stories || stories.length <= 3 || isPaused) return;

    const interval = setInterval(() => {
      scrollRight();
    }, 3500);

    return () => clearInterval(interval);
  }, [stories, isPaused, scrollRight]);

  // Strictly isolate stories by language: English portal must never show Hindi visual stories
  const displayStories = (stories || []).filter((s: any) => {
    if (isEn) {
      return s.isEnglishOnly || (s.headlineEn && s.headlineEn.trim() !== '') || (s.headline && !/[\u0900-\u097F]/.test(s.headline));
    }
    return !s.isEnglishOnly;
  });

  if (!displayStories || displayStories.length === 0) return null;

  return (
    <section className="relative w-full select-none preserve-white-text visual-story-container">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <h2 style={{ color: '#ffffff' }} className="text-[22px] font-black text-white tracking-tight flex items-center gap-2">
            {isEn ? "Visual Stories" : "विज़ुअल स्टोरीज़"}
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 bg-white/10 px-2 py-0.5 rounded-full border border-cyan-400/30">
              Live
            </span>
          </h2>
        </div>
        <Link
          href={isEn ? "/en/web-stories" : "/web-stories"}
          style={{ color: '#ffffff' }}
          className="text-white text-sm font-bold hover:text-red-300 cursor-pointer flex items-center gap-1 transition-colors group/more"
        >
          {isEn ? "More" : "और भी"}{" "}
          <svg
            className="w-4 h-4 transition-transform group-hover/more:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>

      <div
        className="relative group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => {
          // Resume auto-slide 3s after user touch ends
          setTimeout(() => setIsPaused(false), 3000);
        }}
      >
        {/* Left Arrow Button */}
        <button
          onClick={scrollLeft}
          aria-label="Scroll left"
          className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-slate-900/80 hover:bg-red-600 text-white border border-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl opacity-70 hover:opacity-100 hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Scrollable Container with Smooth Sliding */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-1 scroll-smooth"
        >
          {displayStories.map((story, idx) => {
            const title = isEn ? (story.headlineEn || story.headline) : story.headline;
            const slug = isEn && story.slugEn ? story.slugEn : story.slug;
            const href = isEn ? `/en/web-stories/${slug}` : `/web-stories/${slug}`;
            return (
              <Link
                href={href}
                key={idx}
                data-visual-story="true"
                className="relative flex-none w-[150px] md:w-[185px] lg:w-[215px] aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer border-2 border-white/15 hover:border-cyan-400 shadow-xl group/card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-cyan-500/20 preserve-white-text visual-story-card"
              >
                <Image
                  src={getPostImage(story)}
                  alt={title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 150px, 215px"
                  className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 group-hover/card:opacity-90" />

                {/* Live Story Ring Icon */}
                <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-red-600/90 border border-white/40 flex items-center justify-center shadow-lg">
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
                  </svg>
                </div>

                {/* View Count Badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/20">
                  <PostViews views={getPostViews(story, isEn)} size="xs" className="text-white" />
                </div>

                {/* Story Title */}
                <h3
                  style={{ color: '#ffffff' }}
                  className="absolute bottom-3 left-2.5 right-2.5 text-white font-bold text-[13.5px] md:text-[14.5px] leading-snug text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] group-hover/card:text-cyan-200 transition-colors line-clamp-3"
                >
                  {title}
                </h3>
              </Link>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={scrollRight}
          aria-label="Scroll right"
          className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-slate-900/80 hover:bg-red-600 text-white border border-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl opacity-70 hover:opacity-100 hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
