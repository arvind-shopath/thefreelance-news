"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { categoryEnMap } from "@/lib/constants";

const HINDI_TRENDING_TAGS = [
  "चुनाव",
  "राजनीति",
  "बजट",
  "शेयर बाजार",
  "क्रिकेट",
  "सोना चांदी",
  "मौसम",
  "टेक्नोलॉजी",
  "व्यापार"
];

const ENGLISH_TRENDING_TAGS = [
  "World",
  "US News",
  "Technology",
  "Business",
  "Sports",
  "Markets",
  "Economy",
  "Geopolitics",
  "AI"
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isEn = pathname === "/en" || (pathname ? pathname.startsWith("/en/") : false);

  const activeTrendingTags = isEn ? ENGLISH_TRENDING_TAGS : HINDI_TRENDING_TAGS;

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const searchUrl = `/api/search?q=${encodeURIComponent(trimmed)}${isEn ? '&lang=en' : '&lang=hi'}`;
      fetch(searchUrl)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setResults(data.results?.slice(0, 6) || []);
            setTotal(data.total || 0);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isEn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    const searchTarget = isEn ? `/en/search?q=${encodeURIComponent(query.trim())}` : `/search?q=${encodeURIComponent(query.trim())}`;
    router.push(searchTarget);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#12141c] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]">
        {/* Search Bar Header */}
        <form onSubmit={handleSubmit} className="relative flex items-center p-4 sm:p-5 border-b border-gray-800">
          <svg 
            className="w-5 h-5 text-red-500 shrink-0 ml-1" 
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

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isEn ? "Search global news, topics, stories... (e.g. World, Tech, Sports)" : "खबरें, मुद्दे या विषय खोजें... (उदा: चुनाव, बजट, शेयर)"}
            className="w-full bg-transparent px-3 text-white text-base sm:text-lg placeholder-gray-500 outline-none font-medium"
          />

          {loading && (
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin shrink-0 mr-2" />
          )}

          {query && !loading && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-gray-400 hover:text-white p-1 shrink-0 mr-1 transition-colors text-sm"
              title={isEn ? "Clear" : "साफ करें"}
            >
              ✕
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="text-xs bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white px-2.5 py-1.5 rounded-lg shrink-0 transition-colors font-mono"
            title={isEn ? "Close (Esc)" : "बंद करें (Esc)"}
          >
            ESC
          </button>
        </form>

        {/* Trending Tags */}
        <div className="px-5 py-3 bg-[#0d0f15] border-b border-gray-800/60 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
            <span className="text-red-500">🔥</span> {isEn ? "Trending:" : "ट्रेंडिंग:"}
          </span>
          <div className="flex gap-2 shrink-0">
            {activeTrendingTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="bg-[#181a24] hover:bg-red-600/20 hover:text-red-400 hover:border-red-500/40 text-gray-300 text-xs px-3 py-1 rounded-full border border-gray-800 transition-all whitespace-nowrap"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3">
          {query.trim() === "" ? (
            <div className="py-12 text-center text-gray-400 flex flex-col items-center justify-center">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-sm font-medium">{isEn ? "Type any keyword or topic to search" : "कोई भी शब्द या वाक्य टाइप करें"}</p>
              <p className="text-xs text-gray-500 mt-1">{isEn ? "Instant search across World, Business, Tech, Sports & Culture" : "देश, दुनिया, राजनीति, व्यापार और खेल की खबरें तुरंत खोजें"}</p>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="py-12 text-center text-gray-400 flex flex-col items-center justify-center">
              <span className="text-4xl mb-3">😕</span>
              <p className="text-sm font-medium">{isEn ? `No results found for "${query}"` : `"${query}" से संबंधित कोई परिणाम नहीं मिला`}</p>
              <p className="text-xs text-gray-500 mt-1">{isEn ? "Please try different keywords or explore trending international topics" : "कृपया कोई अन्य कीवर्ड या ट्रेंडिंग विषय चुनकर देखें"}</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-800/60">
              {results.map((item: any) => {
                const itemCat = isEn
                  ? (item.categoryStr === "international" ? "world" : (item.categoryStr || "world"))
                  : (item.categoryStr || "national");
                const itemSlug = isEn ? (item.slugEn || item.slug) : item.slug;
                const itemHref = isEn ? `/en/${itemCat}/${itemSlug}` : `/${itemCat}/${itemSlug}`;
                const itemBadge = isEn ? (categoryEnMap[item.categoryStr] || item.categoryStr || "World") : (item.categoryStr || "news");
                const itemHeadline = isEn ? (item.headlineEn || item.headline) : item.headline;
                const itemDate = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString(isEn ? "en-US" : "hi-IN", { day: "numeric", month: "short" })
                  : "";

                return (
                  <Link
                    key={item.id}
                    href={itemHref}
                    onClick={onClose}
                    className="flex gap-4 py-3 group hover:bg-gray-800/30 px-2 rounded-xl transition-colors items-center"
                  >
                    <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-gray-800 bg-gray-900">
                      <Image
                        src={item.image || "https://picsum.photos/200/150"}
                        alt={itemHeadline}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase text-red-500 bg-red-950/40 border border-red-800/30 px-2 py-0.5 rounded">
                          {itemBadge}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {itemDate}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-gray-200 group-hover:text-white leading-snug line-clamp-2 transition-colors">
                        {itemHeadline}
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with "View All Results" */}
        {results.length > 0 && (
          <div className="p-3 sm:p-4 bg-[#0d0f15] border-t border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {isEn ? (
                <>Found <strong className="text-white">{total}</strong> result(s)</>
              ) : (
                <>कुल <strong className="text-white">{total}</strong> परिणाम मिले</>
              )}
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <span>{isEn ? "View All Results" : "सभी परिणाम देखें"}</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
