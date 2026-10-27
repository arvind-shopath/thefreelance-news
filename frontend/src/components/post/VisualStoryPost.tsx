"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function VisualStoryPost({ slides }: { slides: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 5000; // 5 seconds per slide
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return 0;
          }
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, slides.length]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    }
  };

  return (
    <div className="relative w-full max-w-[450px] mx-auto aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 mt-4 mb-10">
      {/* Progress Bars */}
      <div className="absolute top-4 left-0 right-0 z-20 flex gap-1 px-2">
        {slides.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-50"
              style={{ 
                width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' 
              }}
            />
          </div>
        ))}
      </div>

      {/* Close/Back Button (Optional) */}
      <div className="absolute top-8 right-4 z-20">
         <button className="text-white bg-black/50 rounded-full p-2 backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
         </button>
      </div>

      {/* Navigation Areas */}
      <div className="absolute inset-0 z-10 flex">
        <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
        <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
      </div>

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image 
            src={slides[currentIndex]?.image} 
            alt={slides[currentIndex]?.title} 
            fill 
            className="object-cover"
          />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-6 pb-12 text-white">
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-black mb-3 leading-tight text-white drop-shadow-lg"
            >
              {slides[currentIndex]?.title}
            </motion.h3>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-gray-200 leading-relaxed font-medium"
            >
              {slides[currentIndex]?.content}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Count */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-20 pointer-events-none">
        <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-gray-300">
          {currentIndex + 1} OF {slides.length}
        </span>
      </div>
    </div>
  );
}
