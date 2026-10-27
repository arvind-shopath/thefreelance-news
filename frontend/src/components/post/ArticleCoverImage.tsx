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
    // Entertainment actors & personalities FIRST (before political names like गांधी)
    if (/अमन गांधी|aman gandhi|बिग बॉस|bigg boss/.test(lower)) return '/uploads/tfl-media-1790741542833-e5acbfb1794b73e2.jpg';
    if (/विद्युत|जामवाल|jammwal/.test(lower)) return '/uploads/tfl-media-1790741542833-e5acbfb1794b73e2.jpg';
    if (/पाटेकर|patekar|नाना पाटेकर/.test(lower)) return '/uploads/tfl-nana-patekar.jpg';
    if (/रामायण|ramayana|रणबीर|नमित|namit/.test(lower)) return '/uploads/tfl-media-1790741542833-e5acbfb1794b73e2.jpg';

    // Sports (Cricket priority in India)
    if (/क्रिकेट|cricket|t20|odi|ipl|मंधाना|mandhana|स्मृति|नामीबिया|namibia|sa20|ऑक्शन|विराट|रोहित|dhoni|धोनी|wpl|पिच|विकेट|रन/.test(lower)) return '/uploads/tfl-sports-cricket.jpg';
    if (/फुटबॉल|football|fifa|मेस्सी|रोनाल्डो/.test(lower)) return '/uploads/tfl-sports-football-stadium.jpg';
    if (/सिंधु|sindhu|बैडमिंटन/.test(lower)) return '/uploads/tfl-sports-pv-sindhu.jpg';

    // Judiciary / CJI / Court (NEVER show Modi or BJP)
    if (/सीजेआई|cji|सूर्य कांत|मुख्य न्यायाधीश|सुप्रीम कोर्ट|हाईकोर्ट|उच्च न्यायालय|सर्वोच्च न्यायालय|अदालत|कोर्ट|न्यायालय/.test(lower)) return '/uploads/tfl-national-supreme-court.jpg';

    // Opposition / Protest / March (NEVER show Modi or BJP)
    if (/विपक्ष|इंडिया गठबंधन|विरोध|प्रदर्शन|धरना|मार्च|रैली|घेराव|काला दिवस|लाठीचार्ज/.test(lower)) return '/uploads/tfl-national-parliament.jpg';

    // Specific opposition leaders first so clashes like "राहुल ने मोदी पर बोला हमला" show Rahul, not Modi
    if (/(राहुल गांधी|rahul gandhi|राहुलजी|rahulji)/.test(lower) || (/congress|कांग्रेस/.test(lower) && !/अमन|aman|महात्मा|mahatma/.test(lower))) return '/uploads/tfl-action-rahul-rally.jpg';
    if (/अखिलेश|सपा|samajwadi/.test(lower)) return '/uploads/tfl-verified-akhilesh-yadav.jpg';
    if (/केजरीवाल|आप |aap /.test(lower)) return '/uploads/tfl-verified-arvind-kejriwal.jpg';
    if (/ममता|टीएमसी|trinamool/.test(lower)) return '/uploads/tfl-verified-mamata-banerjee.jpg';
    if (/चुनाव आयोग|ईसीआई|वोट|मतदान|election|eci|ec /.test(lower)) return '/uploads/tfl-national-election-voting.jpg';
    if (/शेयर|बाजार|सेंसेक्स|निफ्टी|स्टॉक|market|sensex|rbi|रेपो/.test(lower)) return '/uploads/tfl-biz-stock-market-sensex.jpg';
    if (/योगी|adityanath/.test(lower)) return '/uploads/tfl-action-yogi-rally.jpg';
    if (/अमित शाह|गृह मंत्री/.test(lower)) return '/uploads/tfl-action-amit-shah-rally.jpg';
    if (/मोदी|modi|प्रधानमंत्री/.test(lower) && !/विपक्ष|आरोप|हमला|निशाना|विरोध|संसद/.test(lower)) return '/uploads/tfl-action-modi-rally.jpg';

    let hash = 0;
    for (let i = 0; i < text.length; i++) hash = (hash << 5) - hash + text.charCodeAt(i);
    const nonModiFallbacks = [
      '/uploads/tfl-national-parliament.jpg',
      '/uploads/tfl-national-supreme-court.jpg',
      '/uploads/tfl-national-election-voting.jpg',
      '/uploads/tfl-biz-stock-market-sensex.jpg',
    ];
    const idx = Math.abs(hash) % nonModiFallbacks.length;
    return nonModiFallbacks[idx];
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
