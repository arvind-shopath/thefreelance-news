import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] text-gray-900 dark:text-gray-100">
      {/* Top Header Placeholder */}
      <div className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0e0f15]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="h-8 w-36 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="hidden md:flex items-center gap-6">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Ticker / Subhead */}
        <div className="h-6 w-3/4 max-w-lg bg-gray-200 dark:bg-gray-800 rounded mb-8 animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Lead Headline */}
            <div className="space-y-3">
              <div className="h-8 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-8 w-4/5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-4 py-2">
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>

            {/* Lead Image Skeleton */}
            <div className="w-full aspect-[16/9] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-2xl animate-pulse shadow-sm" />

            {/* Content paragraphs */}
            <div className="space-y-4 pt-4">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-11/12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 p-3 rounded-xl border border-gray-100 dark:border-gray-800/60">
                  <div className="w-24 h-16 rounded-lg bg-gray-200 dark:bg-gray-800 flex-shrink-0 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
