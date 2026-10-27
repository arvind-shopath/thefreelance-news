import React from 'react';

export function isVideoPost(post: any): boolean {
  if (!post) return false;
  return post.postType === 'video' || post.subCategory === 'viral-video' || !!post.videoUrl;
}

export default function VideoBadge({ 
  size = "md", 
  className = "" 
}: { 
  size?: "sm" | "md" | "lg"; 
  className?: string;
}) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <div 
      className={`absolute bottom-2 left-2 z-10 flex items-center gap-1.5 bg-black/85 backdrop-blur-md text-white font-bold rounded-md border border-white/20 shadow-lg tracking-wider ${
        isSm 
          ? "px-1.5 py-0.5 text-[10px]" 
          : isLg
          ? "px-3 py-1.5 text-sm"
          : "px-2 py-0.5 text-xs"
      } ${className}`}
    >
      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
      <svg 
        className={`${isSm ? "w-2.5 h-2.5" : isLg ? "w-4 h-4" : "w-3 h-3"} text-white fill-current`} 
        viewBox="0 0 24 24"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
      <span>VIDEO</span>
    </div>
  );
}
