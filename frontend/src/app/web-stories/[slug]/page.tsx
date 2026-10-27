"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AdsterraAd from "@/components/ads/AdsterraAd";

const API = typeof window !== "undefined" ? "/api/v1" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1");

async function fetchStory(slug: string) {
  try {
    const res = await fetch(`${API}/articles/slug/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch { return null; }
}

async function fetchRelatedStories(currentSlug: string): Promise<any[]> {
  try {
    const res = await fetch(`${API}/articles?limit=30`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    const posts = json?.data || [];
    return posts
      .filter((p: any) => (p.postType === "visual-story" || p.postType === "story") && p.slug !== currentSlug)
      .slice(0, 8);
  } catch { return []; }
}

export default function WebStoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [story, setStory] = useState<any>(null);
  const [slides, setSlides] = useState<any[]>([]);
  const [adHtml, setAdHtml] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRelated, setShowRelated] = useState(false);
  const [relatedStories, setRelatedStories] = useState<any[]>([]);
  const [transitioning, setTransitioning] = useState(false);

  // Load story + related + ads
  useEffect(() => {
    if (!slug) return;
    
    // Fetch active ad
    fetch(`${API}/ads`, { cache: 'no-store' })
      .then(res => res.json())
      .then(adsList => {
        if (Array.isArray(adsList)) {
          const ad = adsList.find((a: any) => a.slotName === 'mid-article' || a.slotName === 'sidebar-rect');
          if (ad && ad.isActive && ad.adHtml) {
            setAdHtml(ad.adHtml);
          }
        }
      })
      .catch(() => {});

    fetchStory(slug).then((data) => {
      setLoading(false);
      if (!data) return;
      const rawSlides = data.slides || [];
      const createAdSlide = (id: number) => ({
        isAd: true,
        adId: id,
        title: "प्रायोजित विज्ञापन | Sponsored Ad",
        content: "Sponsored Story Ad",
        image: "color:ad"
      });

      if (rawSlides.length >= 6) {
        // Inject ads after slide 3 and after slide 6
        const slidesWithAds = [
          ...rawSlides.slice(0, 3),
          createAdSlide(1),
          ...rawSlides.slice(3, 6),
          createAdSlide(2),
          ...rawSlides.slice(6)
        ];
        setSlides(slidesWithAds);
      } else if (rawSlides.length >= 3) {
        // Inject ad after slide 3
        const slidesWithAds = [
          ...rawSlides.slice(0, 3),
          createAdSlide(1),
          ...rawSlides.slice(3)
        ];
        setSlides(slidesWithAds);
      } else if (rawSlides.length > 0) {
        setSlides(rawSlides);
      } else {
        setSlides([{ image: data.image, title: data.headline, content: data.summary || "" }]);
      }
      setStory(data);
    });
    fetchRelatedStories(slug).then(setRelatedStories);
  }, [slug]);

  // Auto-advance with progress
  useEffect(() => {
    if (paused || slides.length === 0 || showRelated) return;
    const duration = 6000;
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        if (currentIndex < slides.length - 1) {
          changeSlide(currentIndex + 1);
        } else {
          setShowRelated(true);
        }
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [currentIndex, paused, slides.length, showRelated]);

  const changeSlide = useCallback((newIndex: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setProgress(0);
      setTimeout(() => setTransitioning(false), 50);
    }, 220);
  }, []);

  const goNext = useCallback(() => {
    if (showRelated) return;
    if (currentIndex < slides.length - 1) {
      changeSlide(currentIndex + 1);
    } else {
      setShowRelated(true);
    }
  }, [currentIndex, slides.length, showRelated, changeSlide]);

  const goPrev = useCallback(() => {
    if (showRelated) {
      setShowRelated(false);
      return;
    }
    if (currentIndex > 0) {
      changeSlide(currentIndex - 1);
    }
  }, [currentIndex, showRelated, changeSlide]);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showRelated) return;
    const { clientX, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    if (clientX - rect.left < rect.width * 0.3) {
      goPrev();
    } else {
      goNext();
    }
  };

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === " ") setPaused((p) => !p);
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, router]);

  const slide = slides[currentIndex];

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: story?.headline || "वेब स्टोरी", url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!story || slides.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 text-white gap-4">
        <p className="text-lg font-bold">स्टोरी नहीं मिली</p>
        <Link href="/" className="text-red-400 underline">होम पर जाएं</Link>
      </div>
    );
  }

  const isAdSlide = slide?.isAd === true;

  const isJokesStory =
    !isAdSlide && (
      story?.subCategory === 'jokes' ||
      story?.categoryStr === 'jokes' ||
      story?.tags?.includes('जोक्स') ||
      story?.headline?.includes('चुटकुले') ||
      story?.headline?.includes('जोक्स') ||
      slide?.image?.startsWith('color:')
    );

  const JOKE_PALETTES = [
    { bg: "from-[#d97706] via-[#ea580c] to-[#9a3412]", emoji: "🤣", badge: "bg-amber-400/20 text-amber-200 border-amber-400/30" },
    { bg: "from-[#7c3aed] via-[#6d28d9] to-[#3b0764]", emoji: "😂", badge: "bg-purple-400/20 text-purple-200 border-purple-400/30" },
    { bg: "from-[#e11d48] via-[#be123c] to-[#881337]", emoji: "😆", badge: "bg-rose-400/20 text-rose-200 border-rose-400/30" },
    { bg: "from-[#059669] via-[#047857] to-[#064e3b]", emoji: "😜", badge: "bg-emerald-400/20 text-emerald-200 border-emerald-400/30" },
    { bg: "from-[#0284c7] via-[#0369a1] to-[#082f49]", emoji: "🤪", badge: "bg-sky-400/20 text-sky-200 border-sky-400/30" },
    { bg: "from-[#c026d3] via-[#9333ea] to-[#581c87]", emoji: "🤭", badge: "bg-fuchsia-400/20 text-fuchsia-200 border-fuchsia-400/30" },
  ];

  const currentJokeStyle = JOKE_PALETTES[currentIndex % JOKE_PALETTES.length];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">

      {/* Story Container */}
      <div
        className="relative w-full max-w-[420px] h-full sm:h-[90vh] sm:max-h-[860px] sm:rounded-2xl overflow-hidden bg-black shadow-2xl flex flex-col select-none"
        onClick={handleTap}
      >

        {/* ===== RELATED STORIES PANEL (end screen) ===== */}
        {showRelated && (
          <div className="absolute inset-0 z-50 bg-[#0d0d0d] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/80 backdrop-blur-md flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); setShowRelated(false); }}
                className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-bold transition-colors"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 18l-6-6 6-6" />
                </svg>
                वापस जाएं
              </button>
              <h3 className="text-white font-black text-base tracking-wide">ये भी देखें</h3>
              <button
                onClick={(e) => { e.stopPropagation(); router.back(); }}
                className="text-white/60 hover:text-white"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Logo */}
            <div className="flex justify-center py-3 flex-shrink-0">
              <Image src="/tfl-logo.png" alt="The Freelance" width={100} height={36} className="object-contain opacity-80" />
            </div>

            {/* Stories Grid */}
            <div className="flex-1 overflow-y-auto px-3 pb-6">
              {relatedStories.length === 0 ? (
                <p className="text-center text-gray-500 mt-12 text-sm">अभी और स्टोरीज़ नहीं हैं</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {relatedStories.map((s) => (
                    <Link
                      key={s.id}
                      href={`/web-stories/${s.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="relative aspect-[9/14] rounded-xl overflow-hidden border border-white/10 group"
                    >
                      <Image
                        src={s.image || "https://picsum.photos/400/630"}
                        alt={s.headline}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="180px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2.5">
                        <p className="text-white text-xs font-bold leading-snug line-clamp-3">{s.headline}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Read Full Article */}
              <Link
                href={`/${story.categoryStr}/${story.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 rounded-xl transition-colors shadow-xl"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                पूरी खबर पढ़ें
              </Link>
            </div>
          </div>
        )}

        {/* ===== BACKGROUND: JOKES (Plain Vibrant Color + Laughing Emojis) OR AD OR IMAGE ===== */}
        {isAdSlide ? (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1d] via-[#050608] to-black flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
          </div>
        ) : isJokesStory ? (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${currentJokeStyle.bg} flex flex-col items-center justify-center overflow-hidden`}
            style={{
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "scale(1.04)" : "scale(1)",
              transition: "opacity 0.22s ease-in-out, transform 0.3s ease-in-out",
            }}
          >
            {/* Playful Floating Laughing Emojis across background */}
            <div className="absolute top-16 left-5 text-6xl opacity-20 select-none pointer-events-none">😂</div>
            <div className="absolute top-32 right-6 text-7xl opacity-20 select-none pointer-events-none">🤣</div>
            <div className="absolute bottom-36 left-6 text-7xl opacity-20 select-none pointer-events-none">😆</div>
            <div className="absolute bottom-16 right-5 text-6xl opacity-20 select-none pointer-events-none">😜</div>
            <div className="absolute inset-0 bg-black/10" />
          </div>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "scale(1.06)" : "scale(1)",
              transition: "opacity 0.22s ease-in-out, transform 0.3s ease-in-out",
            }}
          >
            {slide?.image && !slide.image.startsWith("color:") ? (
              <Image
                src={slide.image}
                alt={slide.title || story.headline}
                fill
                className="object-cover"
                priority
                sizes="420px"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/50" />
          </div>
        )}


        {/* ===== TOP PROGRESS BARS ===== */}
        <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 p-2 pt-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className="h-0.5 flex-1 bg-white/25 rounded-full overflow-hidden"
              onClick={(e) => { e.stopPropagation(); changeSlide(idx); }}
            >
              <div
                className="h-full bg-white rounded-full"
                style={{
                  width: idx < currentIndex ? "100%" : idx === currentIndex ? `${progress}%` : "0%",
                  transition: idx === currentIndex ? "none" : undefined,
                }}
              />
            </button>
          ))}
        </div>

        {/* ===== HEADER: Logo + Pause + Share + Close ===== */}
        <div className="absolute top-7 left-0 right-0 px-4 z-30 flex justify-between items-center">
          {/* Main Logo */}
          <Link href="/" onClick={(e) => e.stopPropagation()} className="flex items-center">
            <div className="relative h-9 w-24">
              <Image
                src="/tfl-logo.png"
                alt="The Freelance"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* Pause/Play */}
            <button
              onClick={(e) => { e.stopPropagation(); setPaused((p) => !p); }}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/90 hover:text-white border border-white/10"
              aria-label={paused ? "Play" : "Pause"}
            >
              {paused ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              )}
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/90 hover:text-white border border-white/10"
              aria-label="Share"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>

            {/* Close */}
            <button
              onClick={(e) => { e.stopPropagation(); router.back(); }}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/90 hover:text-white border border-white/10"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* ===== SLIDE CONTENT with transition ===== */}
        <div
          className={`absolute left-0 right-0 z-20 p-5 ${
            isAdSlide
              ? "top-14 bottom-8 flex flex-col justify-center items-center overflow-y-auto"
              : isJokesStory
              ? "top-20 bottom-8 flex flex-col justify-center items-center overflow-y-auto"
              : "bottom-0 pb-10"
          }`}
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? "translateY(12px)" : "translateY(0)",
            transition: "opacity 0.22s ease-in-out, transform 0.28s ease-out",
          }}
        >
          {isAdSlide ? (
            <div className="w-full flex flex-col items-center text-center max-w-[360px] mx-auto animate-in fade-in zoom-in duration-300">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>SPONSORED ADVERTISEMENT</span>
              </div>
              
              <div className="w-full bg-[#12141c]/90 backdrop-blur-xl border border-gray-700/60 rounded-2xl p-4 shadow-2xl flex flex-col items-center justify-center min-h-[280px]">
                <AdsterraAd format="rectangle" />
              </div>

              <div className="mt-6 flex flex-col items-center gap-2">
                <span className="text-gray-400 text-xs font-medium">कहानी जारी रखने के लिए स्क्रीन पर टैप करें</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="bg-white/15 hover:bg-white/25 text-white text-xs font-black px-6 py-2.5 rounded-full border border-white/20 transition-all flex items-center gap-2 shadow-lg"
                >
                  <span>अगला पेज देखें</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          ) : isJokesStory ? (
            <div className="w-full flex flex-col items-center text-center max-w-[360px] mx-auto">
              {/* Big Animated Laughing Emoji Header */}
              <div className="text-6xl sm:text-7xl mb-2 select-none animate-bounce drop-shadow-2xl">
                {currentJokeStyle.emoji}
              </div>

              {/* Slide Counter Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase mb-3 border backdrop-blur-md shadow-lg ${currentJokeStyle.badge}`}
              >
                <span>चुटकुला #{currentIndex + 1}</span>
                <span>•</span>
                <span>The Freelance हास्य</span>
              </div>

              {/* Title */}
              <h2 className="text-white text-lg sm:text-xl font-black leading-snug mb-3 drop-shadow-lg">
                {slide?.title || `मजेदार जोक #${currentIndex + 1}`}
              </h2>

              {/* Joke Text Box */}
              <div className="w-full bg-black/55 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl text-left">
                <p className="text-white text-base sm:text-[17px] leading-relaxed whitespace-pre-line font-medium drop-shadow">
                  {slide?.content || story.summary}
                </p>
                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-white/80">
                  <span className="font-bold">हंसते रहिए, स्वस्थ रहिए! 😊</span>
                  <span className="text-sm select-none">😂 🤣 😆</span>
                </div>
              </div>

              {/* Tap Hint */}
              {currentIndex < slides.length - 1 ? (
                <p className="text-white/90 text-xs mt-4 font-bold tracking-wide animate-pulse">
                  अगला जोक पढ़ने के लिए टैप करें →
                </p>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRelated(true);
                  }}
                  className="mt-4 bg-white/20 hover:bg-white/30 text-white text-xs font-black py-2.5 px-6 rounded-full border border-white/30 transition-all shadow-lg"
                >
                  और जोक्स व स्टोरीज़ देखें ➔
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Category badge */}
              {currentIndex === 0 && story.categoryStr && (
                <span className="inline-block bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                  {story.categoryStr}
                </span>
              )}

              {/* Title */}
              {slide?.title && (
                <h2 className="text-white text-xl sm:text-2xl font-black leading-snug mb-3 drop-shadow-xl">
                  {slide.title}
                </h2>
              )}
              {!slide?.title && currentIndex === 0 && (
                <h2 className="text-white text-xl sm:text-2xl font-black leading-snug mb-3 drop-shadow-xl">
                  {story.headline}
                </h2>
              )}

              {/* Content */}
              {slide?.content && (
                <div className="bg-black/55 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-gray-100 text-sm leading-relaxed">
                  {slide.content}
                </div>
              )}

              {/* Swipe hint on first slide */}
              {currentIndex === 0 && slides.length > 1 && (
                <p className="text-white/50 text-xs text-center mt-3 font-medium tracking-wide animate-pulse">
                  आगे पढ़ने के लिए टैप करें →
                </p>
              )}
            </>
          )}


          {/* Last slide CTA */}
          {currentIndex === slides.length - 1 && (
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={(e) => { e.stopPropagation(); setShowRelated(true); }}
                className="w-full flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-bold text-sm py-3 rounded-xl border border-white/20 transition-colors"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                ये भी देखें
              </button>
              <Link
                href={`/${story.categoryStr}/${story.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 rounded-xl transition-colors shadow-xl"
              >
                पूरी खबर पढ़ें
              </Link>
            </div>
          )}
        </div>

        {/* ===== Slide Counter ===== */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <span className="text-white/40 text-[10px] font-bold tracking-widest">
            {currentIndex + 1}/{slides.length}
          </span>
        </div>

        {/* ===== Left/Right Arrows (desktop) ===== */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-10 hidden sm:flex items-center pl-3">
          {(currentIndex > 0 || showRelated) && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="w-10 h-10 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center text-white border border-white/10 backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
        </div>
        <div className="absolute inset-y-0 right-0 w-1/3 z-10 hidden sm:flex items-center justify-end pr-3">
          {!showRelated && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="w-10 h-10 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center text-white border border-white/10 backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Desktop dim bg */}
      <div className="hidden sm:block absolute inset-0 -z-10 bg-black/80" onClick={() => router.back()} />
    </div>
  );
}