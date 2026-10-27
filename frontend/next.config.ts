import type { NextConfig } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://news.thefreelance.in";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://thefreelance.in/api/v1";

const nextConfig: NextConfig = {
  compress: true, // Enable gzip & brotli compression for ultra-fast TTFB
  poweredByHeader: false, // Hide Next.js header for security

  images: {
    unoptimized: true, // Allow direct CDN loading of news images without broken 404 proxy
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },

  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: '/api/v1/:path*',
          destination: `${API_BASE}/:path*`,
        },
        {
          source: '/uploads/:path*',
          destination: `${SITE_URL}/uploads/:path*`,
        },
      ],
    };
  },

  async headers() {
    return [
      // 1. Static Assets (JS, CSS, fonts, immutable chunks): Cache for 1 full year
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 2. Static public images and icons: Cache for 7 days with background revalidation
      {
        source: '/:all*(svg|jpg|png|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      // 3. Security & Performance headers across all pages
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // 4. Admin routes (/arvind, /tfl/*): Strict NO-CACHE for security
      {
        source: '/arvind',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/tfl/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
