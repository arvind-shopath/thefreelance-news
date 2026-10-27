"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import ThemeToggle from "@/components/layout/ThemeToggle";
import NativeBannerAd from "@/components/ads/NativeBannerAd";

export default function SiteWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSocialDomain, setIsSocialDomain] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const h = window.location.hostname;
      if (h.startsWith("socialcraft.") || h.includes("socialcraft")) {
        setIsSocialDomain(true);
      }
    }
  }, []);

  const isWebStory = pathname?.startsWith("/web-stories/");
  const isDashboard = pathname?.startsWith("/tfl");
  const isAuthPage = pathname?.startsWith("/arvind");
  const isSocialCraft = pathname?.startsWith("/socialcraft") || isSocialDomain;

  if (isWebStory || isDashboard || isAuthPage || isSocialCraft) {
    return <>{children}</>;
  }

  // Article pages already render NativeBannerAd directly below the article content
  const isArticlePage = Boolean(
    pathname &&
    pathname !== "/" &&
    pathname !== "/en" &&
    !pathname.startsWith("/tags/") &&
    !pathname.startsWith("/en/tags/") &&
    !pathname.startsWith("/search") &&
    !pathname.startsWith("/en/search") &&
    !pathname.startsWith("/horoscope") &&
    !pathname.startsWith("/photos") &&
    !pathname.startsWith("/trending") &&
    ((pathname.startsWith("/en/") && pathname.split("/").filter(Boolean).length >= 3) ||
     (!pathname.startsWith("/en") && pathname.split("/").filter(Boolean).length >= 2))
  );

  return (
    <>
      <div className="flex-1">{children}</div>
      {/* Adsterra Native Recommendation Banner above Footer */}
      {!isArticlePage && (
        <div className="w-full max-w-7xl mx-auto px-4 my-6">
          <NativeBannerAd />
        </div>
      )}
      <Footer />
      <MobileBottomNav />
      <ThemeToggle />
    </>
  );
}