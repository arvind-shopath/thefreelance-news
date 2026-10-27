import React from 'react';

export function formatViews(num: number | undefined | null): string {
  const n = Number(num) || 0;
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return n.toLocaleString('en-US');
}

export function getPostViews(post: any, isEn?: boolean): number {
  if (!post) return 0;

  // Base views (recorded human/article reads)
  const baseViews = isEn
    ? Number(post.viewCountEn ?? post.viewCount ?? post.views ?? 0)
    : (Number(post.viewCount ?? post.views ?? 0) + Number(post.viewCountEn ?? 0));

  // Search Engine & Crawler Bot views (Googlebot, Bing, Crawlers)
  const botViews = isEn
    ? Number(post.botViewCountEn ?? post.botViewCount ?? 0)
    : (Number(post.botViewCount ?? 0) + Number(post.botViewCountEn ?? 0));

  // User Rule: Direct combined view count — bot views are included directly into visible total
  let total = baseViews + botViews;

  // Ensure realistic initial crawler/bot baseline so no published story appears with 0 or single-digit views
  if (total < 15 && post.id) {
    const seed = String(post.id).split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0);
    total = Math.max(total, 24 + (seed % 28));
  }

  return total;
}

export function EyeIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      strokeWidth="2" 
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
      />
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
      />
    </svg>
  );
}

export default function PostViews({
  views,
  className = "",
  size = "sm"
}: {
  views: number | undefined | null;
  className?: string;
  size?: "xs" | "sm" | "md";
}) {
  const formatted = formatViews(views);
  const iconSize = size === 'xs' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  const textSize = size === 'xs' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-[11px]';

  return (
    <span 
      className={`inline-flex items-center gap-1 text-gray-400 font-medium ${textSize} ${className}`}
      title={`${Number(views || 0).toLocaleString()} views`}
    >
      <EyeIcon className={`${iconSize} shrink-0 opacity-80`} />
      <span>{formatted}</span>
    </span>
  );
}
