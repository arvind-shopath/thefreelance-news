'use client';

import React, { useState } from 'react';

interface CoverImageProps {
  src: string;
  alt: string;
  className?: string;
}

const FALLBACK_NEWS_IMAGES = [
  '/uploads/tfl-national-parliament.jpg',
  '/uploads/tfl-action-modi-rally.jpg',
  '/uploads/tfl-action-rahul-rally.jpg',
  '/uploads/tfl-national-supreme-court.jpg',
  '/uploads/tfl-national-election-voting.jpg',
  '/uploads/tfl-biz-stock-market-sensex.jpg',
];

export default function ArticleCoverImage({ src, alt, className = '' }: CoverImageProps) {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src || '');

  // Deterministic fallback based on headline text
  const getFallbackUrl = (text: string) => {
    const lower = (text || '').toLowerCase();
    if (/मोदी|modi|प्रधानमंत्री|pm /.test(lower)) return '/uploads/tfl-action-modi-rally.jpg';
    if (/राहुल|गांधी|rahul|congress|कांग्रेस/.test(lower)) return '/uploads/tfl-action-rahul-rally.jpg';
    if (/सुप्रीम कोर्ट|अदालत|court|justice|न्यायालय/.test(lower)) return '/uploads/tfl-national-supreme-court.jpg';
    if (/चुनाव|वोट|मतदान|election|eci|ec /.test(lower)) return '/uploads/tfl-national-election-voting.jpg';
    if (/शेयर|बाजार|सेंसेक्स|निफ्टी|स्टॉक|market|sensex|rbi/.test(lower)) return '/uploads/tfl-biz-stock-market-sensex.jpg';
    if (/अखिलेश|सपा|samajwadi/.test(lower)) return '/uploads/tfl-verified-akhilesh-yadav.jpg';
    if (/सिंधु|sindhu|बैडमिंटन/.test(lower)) return '/uploads/tfl-sports-pv-sindhu.jpg';

    let hash = 0;
    for (let i = 0; i < text.length; i++) hash = (hash << 5) - hash + text.charCodeAt(i);
    const idx = Math.abs(hash) % FALLBACK_NEWS_IMAGES.length;
    return FALLBACK_NEWS_IMAGES[idx];
  };

  const lowerSrc = (currentSrc || '').toLowerCase();
  const isInvalid = !currentSrc || hasError || 
    currentSrc.includes('1526374965328') || 
    currentSrc.includes('1540910419892') || 
    currentSrc.includes('1500382017468') || // sunset field/forest
    currentSrc.includes('1532375810709') ||
    currentSrc.includes('0cdb0e9f7ab3') ||
    currentSrc.includes('googleusercontent') ||
    lowerSrc.includes('barricade_tape_in_japan') || 
    lowerSrc.includes('japan_april');
  const displaySrc = isInvalid ? getFallbackUrl(alt || 'thefreelance') : currentSrc;

  return (
    <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#0a0b10] flex items-center justify-center rounded-2xl">
      {/* Ambient blurred backdrop for aesthetic glow */}
      <img
        src={displaySrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-105 pointer-events-none"
      />
      {/* Clean main image: strictly 16:9 widescreen, object-fit cover with center positioning (Golden Standard) */}
      <img
        src={displaySrc}
        alt={alt}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setCurrentSrc(getFallbackUrl(alt || 'thefreelance'));
          }
        }}
        className={`relative z-10 w-full h-full aspect-[16/9] object-cover object-center news-thumbnail shadow-2xl transition-all ${className}`}
        loading="eager"
      />
    </div>
  );
}
