"use client";

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { pullSingleNewsAction } from '@/lib/actions';

interface GoogleNewsFeed {
  name: string;
  categoryStr: string;
  url: string;
  lang: 'hi' | 'en';
}

const DEFAULT_FEEDS: GoogleNewsFeed[] = [
  { name: "गूगल न्यूज़ - मुख्य समाचार (Top Stories)", categoryStr: "auto", url: "https://news.google.com/rss?hl=hi&gl=IN&ceid=IN:hi", lang: "hi" },
  { name: "गूगल न्यूज़ - भारत (National)", categoryStr: "national", url: "https://news.google.com/rss/headlines/section/topic/NATION?hl=hi&gl=IN&ceid=IN:hi", lang: "hi" },
  { name: "गूगल न्यूज़ - कारोबार (Business)", categoryStr: "business", url: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=hi&gl=IN&ceid=IN:hi", lang: "hi" },
  { name: "गूगल न्यूज़ - मनोरंजन (Entertainment)", categoryStr: "entertainment", url: "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=hi&gl=IN&ceid=IN:hi", lang: "hi" },
  { name: "गूगल न्यूज़ - खेल (Sports)", categoryStr: "sports", url: "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=hi&gl=IN&ceid=IN:hi", lang: "hi" },
  { name: "गूगल न्यूज़ - विज्ञान एवं तकनीक (Science & Tech)", categoryStr: "tech-auto", url: "https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=hi&gl=IN&ceid=IN:hi", lang: "hi" },
  { name: "गूगल न्यूज़ - स्वास्थ्य (Health)", categoryStr: "lifestyle", url: "https://news.google.com/rss/headlines/section/topic/HEALTH?hl=hi&gl=IN&ceid=IN:hi", lang: "hi" },
  { name: "गूगल न्यूज़ - दुनिया (World)", categoryStr: "international", url: "https://news.google.com/rss/headlines/section/topic/WORLD?hl=hi&gl=IN&ceid=IN:hi", lang: "hi" },
  
  { name: "Google News - Top Stories (English)", categoryStr: "auto", url: "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en", lang: "en" },
  { name: "Google News - India News (English)", categoryStr: "national", url: "https://news.google.com/rss/headlines/section/topic/NATION?hl=en-IN&gl=IN&ceid=IN:en", lang: "en" },
  { name: "Google News - Business (English)", categoryStr: "business", url: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en", lang: "en" },
  { name: "Google News - Technology (English)", categoryStr: "tech-auto", url: "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en", lang: "en" },
];

export default function GoogleNewsManager() {
  const [selectedFeedUrl, setSelectedFeedUrl] = useState("https://news.google.com/rss?hl=hi&gl=IN&ceid=IN:hi");
  const [customSearch, setCustomSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [pulledResult, setPulledResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePullSingle = (feedUrlToUse?: string) => {
    const url = feedUrlToUse || selectedFeedUrl;
    setErrorMsg(null);
    setPulledResult(null);

    startTransition(async () => {
      try {
        const res = await pullSingleNewsAction(url);
        if (res?.success && res?.post) {
          setPulledResult(res);
        } else {
          setErrorMsg(res?.message || "खबर पुल करने में विफल। कृपया पुनः प्रयास करें।");
        }
      } catch (err: any) {
        setErrorMsg(err?.message || "त्रुटि हुई।");
      }
    });
  };

  const handleSearchPull = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSearch.trim()) return;
    const searchUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(customSearch.trim())}&hl=hi&gl=IN&ceid=IN:hi`;
    handlePullSingle(searchUrl);
  };

  return (
    <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-6 bg-red-600 rounded-full"></span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              गूगल न्यूज़ RSS इंटीग्रेशन (Google News Hub)
            </h2>
          </div>
          <p className="text-sm text-gray-400">
            रीयल-टाइम एग्रीगेटेड खबरें • ऑटोमैटिक यूआरएल डिकोडिंग • असली हाई-रेजोल्यूशन फ़ोटो एक्सट्रैक्शन
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
            बल्क ऑटो-पुल: रोका गया (Manual Pull Only)
          </div>
        </div>
      </div>

      {/* Main Single Pull Action Bar */}
      <div className="my-6 p-5 bg-[#0b0c10] border border-gray-800 rounded-2xl flex flex-col lg:flex-row items-stretch lg:items-center gap-4 justify-between">
        <div className="flex-1">
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
            कैटेगरी या फ़ीड चुनें:
          </label>
          <select
            value={selectedFeedUrl}
            onChange={(e) => setSelectedFeedUrl(e.target.value)}
            disabled={isPending}
            className="w-full bg-[#12141c] border border-gray-700 rounded-xl p-3.5 text-white font-medium text-sm outline-none focus:border-red-600 cursor-pointer"
          >
            {DEFAULT_FEEDS.map((f, i) => (
              <option key={i} value={f.url}>
                {f.lang === 'hi' ? '🇮🇳 ' : '🌐 '} {f.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => handlePullSingle()}
            disabled={isPending}
            className="w-full lg:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black px-8 py-3.5 rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider text-sm flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Google News से खबर प्रोसेस हो रही है...
              </>
            ) : (
              '⚡ सिर्फ 1 खबर टेस्ट पुल करें'
            )}
          </button>
        </div>
      </div>

      {/* Custom Search Pull Form */}
      <form onSubmit={handleSearchPull} className="mb-6 p-4 bg-[#0b0c10]/60 border border-dashed border-gray-800 rounded-xl flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex-1 w-full">
          <input
            type="text"
            value={customSearch}
            onChange={(e) => setCustomSearch(e.target.value)}
            placeholder="कस्टम सर्च टॉपिक / शहर लिखें (उदा. उत्तर प्रदेश, बजट, लखनऊ, AI)..."
            disabled={isPending}
            className="w-full bg-[#12141c] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-red-600"
          />
        </div>
        <button
          type="submit"
          disabled={isPending || !customSearch.trim()}
          className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all whitespace-nowrap"
        >
          🔍 इस सर्च से 1 खबर लाएँ
        </button>
      </form>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 bg-red-600/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-semibold mb-6">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Result Card when a news item is pulled */}
      {pulledResult?.post && (
        <div className="mb-8 p-6 bg-gradient-to-r from-red-950/30 to-blue-950/30 border-2 border-green-500/40 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2 text-green-400 text-xs font-black uppercase tracking-wider mb-3">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
            ✅ गूगल न्यूज़ से सफलतापूर्वक 1 खबर पुल और री-राइट की गई!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {pulledResult.post.image && (
              <div className="relative h-44 rounded-xl overflow-hidden border border-gray-700">
                <img
                  src={pulledResult.post.image}
                  alt={pulledResult.post.headline}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md text-[10px] text-white font-bold px-2 py-0.5 rounded">
                  असली न्यूज़ फ़ोटो
                </span>
              </div>
            )}

            <div className={`flex flex-col gap-2 ${pulledResult.post.image ? 'md:col-span-3' : 'md:col-span-4'}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
                  {pulledResult.post.categoryStr}
                </span>
                <span className="text-gray-400 text-xs">
                  मूल स्रोत: <strong className="text-white">{pulledResult.details?.publisher || 'Google News'}</strong>
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-xs">
                  शब्द संख्या: ~{pulledResult.post.content ? pulledResult.post.content.split(/\s+/).length : 0} शब्द
                </span>
              </div>

              <h3 className="text-xl font-black text-white leading-snug">
                {pulledResult.post.headline}
              </h3>

              <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed">
                {pulledResult.post.summary}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-2">
                <a
                  href={`/${pulledResult.post.categoryStr}/${pulledResult.post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-5 py-2.5 rounded-lg transition-all shadow-md flex items-center gap-1.5"
                >
                  🚀 लाइव आर्टिकल खोलें और लुक चेक करें
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>

                {pulledResult.details?.decodedUrl && (
                  <a
                    href={pulledResult.details.decodedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-xs underline font-medium"
                  >
                    मूल पब्लिशर लिंक देखें ({pulledResult.details.publisher})
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Google News Pre-sets Grid */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
          <span>📋</span> उपलब्ध गूगल न्यूज़ फ़ीड्स ({DEFAULT_FEEDS.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEFAULT_FEEDS.map((f, i) => (
            <div
              key={i}
              className="bg-[#0b0c10] border border-gray-800/80 hover:border-gray-700 p-3.5 rounded-xl flex items-center justify-between gap-3 group transition-all"
            >
              <div className="min-w-0">
                <div className="text-xs font-bold text-gray-200 truncate group-hover:text-white">
                  {f.name}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                  कैटेगरी: {f.categoryStr} • {f.lang.toUpperCase()}
                </div>
              </div>
              <button
                onClick={() => handlePullSingle(f.url)}
                disabled={isPending}
                className="text-[11px] bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-red-500/20 font-bold transition-all whitespace-nowrap"
                title="इस फ़ीड से 1 खबर टेस्ट पुल करें"
              >
                1 खबर लाएँ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
