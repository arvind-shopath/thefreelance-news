import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SiteWrapper from '@/components/layout/SiteWrapper';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://news.thefreelance.in';

export const metadata: Metadata = {
  title: {
    template: '%s | द फ्रीलांस',
    default: 'द फ्रीलांस (The FreeLance) - स्वतंत्र और निष्पक्ष डिजिटल न्यूज़ पोर्टल',
  },
  description: 'द फ्रीलांस (The FreeLance) - भारत का अग्रणी निष्पक्ष व स्वतंत्र डिजिटल न्यूज़ पोर्टल। राजनीति, राष्ट्रीय, क्राइम, खेल, मनोरंजन, व्यापार और जनसरोकार की ताज़ा व प्रामाणिक खबरें।',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'द फ्रीलांस (The FreeLance) - स्वतंत्र और निष्पक्ष डिजिटल न्यूज़ पोर्टल',
    description: 'भारत का अग्रणी निष्पक्ष व स्वतंत्र डिजिटल न्यूज़ पोर्टल। राजनीति, राष्ट्रीय, क्राइम, खेल, मनोरंजन और जनसरोकार की प्रामाणिक खबरें।',
    url: SITE_URL,
    siteName: 'द फ्रीलांस',
    locale: 'hi_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { headers } from 'next/headers';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import SocialBarAd from '@/components/ads/SocialBarAd';
import PushNotificationPrompt from '@/components/notifications/PushNotificationPrompt';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isSocialCraft = host.startsWith('socialcraft.');

  if (isSocialCraft) {
    return (
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark bg-[#08071A]`}
      >
        <head>
          <link rel="icon" type="image/svg+xml" href="/socialcraft-favicon.svg" />
          <link rel="icon" type="image/png" sizes="32x32" href="/socialcraft-icon-32.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/socialcraft-icon.png" />
          <link rel="apple-touch-icon" href="/socialcraft-icon.png" />
          <meta name="theme-color" content="#08071A" />
        </head>
        <body className="min-h-screen bg-[#08071A] text-white">
          {children}
        </body>
      </html>
    );
  }

  return (
    <html
      lang="hi"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >


      <head>
        {/* Pre-hydration Zero-Flicker Theme Initializer */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (window.location.pathname.startsWith('/tfl')) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    var saved = localStorage.getItem('tfl-theme');
                    if (saved === 'dark') {
                      document.documentElement.setAttribute('data-theme', 'dark');
                    } else {
                      document.documentElement.setAttribute('data-theme', 'light');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Google Analytics 4, AdSense & Reader Revenue with Strict Admin & Dashboard Exclusion */}
        <AnalyticsTracker />
        {/* Schema.org WebSite & NewsMediaOrganization Structured Data for Google Search & AI Overview */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  "name": "द फ्रीलांस",
                  "alternateName": ["The FreeLance", "TheFreelance", "द फ्रीलांस न्यूज़", "The Freelance", "The FreeLance News"],
                  "url": SITE_URL
                },
                {
                  "@type": "NewsMediaOrganization",
                  "@id": `${SITE_URL}/#organization`,
                  "name": "The Freelance",
                  "alternateName": "द फ्रीलांस",
                  "url": SITE_URL,
                  "logo": {
                    "@type": "ImageObject",
                    "url": `${SITE_URL}/logo.png`,
                    "width": 512,
                    "height": 512
                  },
                  "description": "द फ्रीलांस (The FreeLance) भारत का अग्रणी निष्पक्ष व स्वतंत्र डिजिटल न्यूज़ पोर्टल है, जो राष्ट्रीय मामलों, राजनीति, जनसरोकार, अपराध, खेल, मनोरंजन और जनसुविधाओं पर प्रामाणिक और खोजी पत्रकारिता प्रदान करता है।",
                  "ethicsPolicy": `${SITE_URL}/about`,
                  "publishingPrinciples": `${SITE_URL}/about`
                }
              ]
            })
          }}
        />
        {/* RSS Feeds Auto-discovery for Feedly, News Readers & Aggregators */}
        <link rel="alternate" type="application/rss+xml" title="The FreeLance (हिन्दी फीड)" href={`${SITE_URL}/rss.xml`} />
        <link rel="alternate" type="application/rss+xml" title="The FreeLance (English Portal Feed)" href={`${SITE_URL}/en/feed.xml`} />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0b0c10] text-gray-200">
        <ThemeProvider>
          <SiteWrapper>
            {children}
          </SiteWrapper>
          {/* Language-segregated Web Push Notification Prompt */}
          <PushNotificationPrompt />
        </ThemeProvider>
        {/* Adsterra Controlled Social Bar (30-day dismiss memory + once-per-session cap) */}
        <SocialBarAd />
      </body>

    </html>
  );
}