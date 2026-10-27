"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import AdsterraAd from "@/components/ads/AdsterraAd";

export default function PhotoGalleryPost({ baseSlug, slides }: { baseSlug: string, slides: any[] }) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Set up intersection observer to detect which photo is currently in view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6 // Trigger when 60% of the photo container is visible
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const indexStr = entry.target.getAttribute('data-index');
          if (indexStr) {
            const index = parseInt(indexStr, 10);
            setActivePhotoIndex(index);
            
            // Shallow push to update URL without reloading, preserving full path
            const currentPath = window.location.pathname.replace(/-\d+$/, '');
            const newUrl = `${currentPath}-${index + 1}`;
            window.history.replaceState(null, '', newUrl);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all photo sections
    const elements = document.querySelectorAll('.photo-section-observer');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [baseSlug]);

  return (
    <div className="flex flex-col gap-10 mt-8" ref={containerRef}>
      {slides.map((photo, idx) => (
        <div 
          key={idx} 
          data-index={idx}
          className="photo-section-observer flex flex-col gap-4 border-b border-gray-800 pb-10"
        >
          {/* Photo Header */}
          <div className="flex justify-between items-center bg-[#12141c] px-4 py-3 border-l-4 border-red-600 rounded-r-md shadow-md">
            <span className="font-bold text-white text-lg">तस्वीर {idx + 1} / {slides.length}</span>
            <span className="text-gray-500 text-sm font-semibold flex items-center gap-1 animate-pulse">
              Scroll Down 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
          </div>
          
          {/* Large Photo */}
          <div className="relative w-full h-[400px] md:h-[600px] bg-[#050608] border border-gray-800 rounded shadow-inner">
             <Image src={photo.image} alt={photo.title} fill className="object-contain" />
          </div>
          
          {/* Photo Content / Description */}
          <div className="bg-[#12141c] p-6 rounded border border-gray-800">
             <h3 className="text-2xl font-bold text-white mb-3">{photo.title}</h3>
             <p className="text-[18px] text-gray-300 leading-relaxed font-sans">
               {photo.content}
             </p>
             
             {/* Ad between photos: at least 3 ads across gallery */}
             {idx === 0 && (
                <div className="w-full mt-6 flex flex-col items-center justify-center">
                  <AdsterraAd format="in-article" />
                </div>
             )}
             {idx === 1 && (
                <div className="w-full mt-6 flex flex-col items-center justify-center">
                  <AdsterraAd format="rectangle" />
                </div>
             )}
             {idx === 3 && (
                <div className="w-full mt-6 flex flex-col items-center justify-center">
                  <AdsterraAd format="in-feed" />
                </div>
             )}
          </div>
        </div>
      ))}

      {/* Guaranteed 3rd ad if gallery has fewer than 4 slides */}
      {slides.length < 4 && (
        <div className="w-full my-4 flex flex-col items-center justify-center">
          <AdsterraAd format="rectangle" />
        </div>
      )}
    </div>
  );
}
