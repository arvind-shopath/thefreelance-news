"use client";

import React, { useState, useMemo } from 'react';
import Image from "next/image";
import Link from "next/link";
import { getPostImage } from "@/lib/constants";
import PostViews, { getPostViews } from "@/components/common/PostViews";

export const HINDI_STATES = [
  { slug: 'all', name: 'सभी राज्य' },
  { slug: 'up', name: 'उत्तर प्रदेश' },
  { slug: 'bihar', name: 'बिहार' },
  { slug: 'mp', name: 'मध्य प्रदेश' },
  { slug: 'rajasthan', name: 'राजस्थान' },
  { slug: 'delhi', name: 'दिल्ली' },
  { slug: 'haryana', name: 'हरियाणा' },
  { slug: 'jharkhand', name: 'झारखंड' },
  { slug: 'chhattisgarh', name: 'छत्तीसगढ़' },
  { slug: 'uttarakhand', name: 'उत्तराखंड' },
  { slug: 'himachal', name: 'हिमाचल' },
];

const STATE_KEYWORDS: Record<string, RegExp> = {
  bihar: /बिहार|पटना|पूर्णिया|नीतीश|तेजस्वी|गया|मुजफ्फरपुर|भागलपुर|प्रशांत किशोर|ललन सिंह|निशांत कुमार|काजल राघवानी|कटिहार|बक्सर|bihar|patna/i,
  rajasthan: /राजस्थान|जयपुर|जोधपुर|उदयपुर|दीया कुमारी|भजनलाल|कोटा|अजमेर|अलवर|चाकसू|चंदलाई|rajasthan|jaipur/i,
  up: /उत्तर प्रदेश|यूपी|लखनऊ|कानपुर|वाराणसी|अयोध्या|प्रयागराज|योगी|गोरखपुर|नोएडा|मेरठ|हापुड़|जौनपुर|बहराइच|संभल|गाजियाबाद|uttar pradesh/i,
  mp: /मध्य प्रदेश|एमपी|भोपाल|इंदौर|ग्वालियर|जबलपुर|उज्जैन|मोहन यादव|श्योपुर|रीवा|छिंदवाड़ा|madhya pradesh/i,
  delhi: /दिल्ली|केजरीवाल|आतिशी|सिसोदिया|delhi/i,
  haryana: /हरियाणा|चंडीगढ़|रोहतक|हिसार|सैनी|हुड्डा|haryana/i,
  jharkhand: /झारखंड|रांची|जमशेदपुर|धनबाद|हेमंत सोरेन|jharkhand/i,
  chhattisgarh: /छत्तीसगढ़|रायपुर|बिलासपुर|विष्णु देव साय|बस्तर|chhattisgarh/i,
  uttarakhand: /उत्तराखंड|देहरादून|हरिद्वार|धामी|नैनीताल|uttarakhand/i,
  himachal: /हिमाचल|शिमला|मंडी|धर्मशाला|सुक्खू|कुल्लू|manali|himachal/i,
};

function StatePostImage({
  post,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  post: any;
  className?: string;
  sizes?: string;
}) {
  const initialSrc = getPostImage(post);
  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [hasError, setHasError] = useState(false);

  return (
    <Image 
      src={hasError ? "/uploads/tfl-national-parliament.jpg" : imgSrc} 
      alt={post.headline || post.title || "State News"} 
      fill 
      unoptimized
      sizes={sizes}
      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${className}`}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc("/uploads/tfl-national-parliament.jpg");
        }
      }}
    />
  );
}

export default function StateCategorySection({ 
  posts = [],
  title = "राज्य समाचार",
  color = "#eab308"
}: { 
  posts?: any[],
  title?: string,
  color?: string
}) {
  const [selectedState, setSelectedState] = useState<string>('all');

  const getStateLabel = (post: any) => {
    // 1. If explicit subCategory matches a Hindi state
    if (post.subCategory && HINDI_STATES.some(s => s.slug === post.subCategory)) {
      return HINDI_STATES.find(s => s.slug === post.subCategory)?.name;
    }

    // 2. Primary state in headline: whichever state keyword appears EARLIEST in headline
    const headline = post.headline || post.title || '';
    let bestSlug: string | null = null;
    let earliestIndex = Infinity;

    for (const [slug, regex] of Object.entries(STATE_KEYWORDS)) {
      const match = headline.match(regex);
      if (match && match.index !== undefined && match.index < earliestIndex) {
        earliestIndex = match.index;
        bestSlug = slug;
      }
    }

    if (bestSlug) {
      return HINDI_STATES.find(s => s.slug === bestSlug)?.name;
    }

    // 3. Fallback: check tags and summary
    for (const [slug, regex] of Object.entries(STATE_KEYWORDS)) {
      const haystack = `${post.tags || ''} ${post.summary || ''}`;
      if (regex.test(haystack)) {
        return HINDI_STATES.find(s => s.slug === slug)?.name;
      }
    }
    return null;
  };

  const filteredPosts = useMemo(() => {
    const sortedSource = [...posts].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (selectedState === 'all') return sortedSource.slice(0, 6);
    const regex = STATE_KEYWORDS[selectedState];
    const targetStateObj = HINDI_STATES.find(s => s.slug === selectedState);
    const matches = sortedSource.filter((p: any) => {
      if (p.subCategory === selectedState) return true;
      const label = getStateLabel(p);
      if (label && targetStateObj && label === targetStateObj.name) return true;
      if (!regex) return false;
      const haystack = `${p.headline || ''} ${p.summary || ''} ${p.tags || ''} ${p.slug || ''}`;
      return regex.test(haystack);
    });
    return matches.slice(0, 6);
  }, [posts, selectedState]);

  const mainPost = filteredPosts[0];
  const sidePosts = filteredPosts.slice(1, 5);
  const activeStateName = HINDI_STATES.find(s => s.slug === selectedState)?.name || 'सभी राज्य';

  return (
    <section className="py-6 border-t border-gray-800 animate-in fade-in duration-500">
      {/* Header & View All */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/states" className="flex items-center gap-3 group">
          <div className="w-2 h-6 rounded-full transition-transform group-hover:scale-110" style={{ backgroundColor: color }}></div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide group-hover:text-amber-500 transition-colors">{title}</h2>
        </Link>
        <Link href={`/states${selectedState !== 'all' ? `?state=${selectedState}` : ''}`} className="text-amber-500 font-bold hover:underline text-sm">
          {activeStateName} की और खबरें &gt;
        </Link>
      </div>

      {/* State Filter Pills */}
      <div className="w-full bg-[#12141c] p-2 rounded-xl border border-gray-800 flex items-center gap-2 overflow-x-auto scrollbar-hide mb-6 shadow-inner">
        {HINDI_STATES.map((state) => {
          const isActive = selectedState === state.slug;
          return (
            <button
              key={state.slug}
              onClick={() => setSelectedState(state.slug)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive 
                  ? 'bg-amber-500 text-black shadow-md font-extrabold scale-[1.02]' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/80'
              }`}
            >
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-black"></span>}
              {state.name}
            </button>
          );
        })}
      </div>

      {/* Content Grid */}
      {filteredPosts.length > 0 ? (
        <div className={`grid grid-cols-1 ${sidePosts.length > 0 ? 'md:grid-cols-2' : ''} gap-6`}>
          {/* Main Card */}
          {mainPost && (
            <Link 
              href={`/${mainPost.categoryStr || 'states'}/${mainPost.slug}`} 
              className="group cursor-pointer bg-[#12141c] p-3.5 rounded-xl border border-gray-800 hover:border-amber-500/40 transition-colors block"
            >
              <div className="relative h-56 md:h-64 w-full rounded-lg overflow-hidden mb-4 bg-gray-900 shadow-md">
                <StatePostImage post={mainPost} />
                {getStateLabel(mainPost) && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-black text-[10px] font-black px-2.5 py-1 rounded shadow-lg uppercase">
                    {getStateLabel(mainPost)}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-white category-lead-title mb-2 group-hover:text-amber-500 transition-colors leading-snug">
                {mainPost.headline || mainPost.title}
              </h3>
              <p className="text-gray-400 line-clamp-3 text-sm leading-relaxed mb-3">
                {mainPost.summary}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-800/60">
                <span className="text-gray-500 text-xs">
                  {mainPost.createdAt ? new Date(mainPost.createdAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' }) : ''}
                </span>
                <PostViews views={getPostViews(mainPost, false)} size="xs" />
              </div>
            </Link>
          )}

          {/* Side Cards */}
          {sidePosts.length > 0 && (
            <div className="flex flex-col gap-3.5">
              {sidePosts.map((post: any) => (
                <Link 
                  href={`/${post.categoryStr || 'states'}/${post.slug}`} 
                  key={post.id} 
                  className="flex gap-4 group cursor-pointer bg-[#12141c] p-3 rounded-xl border border-gray-800 hover:border-amber-500/30 transition-colors"
                >
                  <div className="flex-1 flex flex-col justify-center">
                    {getStateLabel(post) && (
                      <span className="text-amber-500 text-[10px] font-black uppercase mb-1">
                        {getStateLabel(post)}
                      </span>
                    )}
                    <h4 className="text-gray-200 text-sm font-semibold line-clamp-2 group-hover:text-amber-500 transition-colors mb-2 leading-snug">
                      {post.headline || post.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' }) : post.date}
                      </span>
                      <PostViews views={getPostViews(post, false)} size="xs" />
                    </div>
                  </div>
                  <div className="relative w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900 border border-gray-800">
                    <StatePostImage post={post} sizes="112px" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#12141c] p-10 rounded-xl border border-gray-800 text-center flex flex-col items-center justify-center">
          <p className="text-gray-400 font-bold mb-3">
            {activeStateName} से जुड़ी नवीनतम खबरें जल्द ही यहाँ प्रकाशित की जाएंगी।
          </p>
          <button 
            onClick={() => setSelectedState('all')}
            className="text-xs bg-amber-500 text-black font-extrabold px-4 py-2 rounded-lg hover:bg-amber-400 transition-all"
          >
            सभी राज्यों की खबरें देखें
          </button>
        </div>
      )}
    </section>
  );
}