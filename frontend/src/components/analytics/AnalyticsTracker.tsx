"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-8PR1LQHRM3";
const ADSENSE_CLIENT = "ca-pub-7153554525059355";

export default function AnalyticsTracker() {
  const pathname = usePathname() || "";

  // 1. Strict Route Exclusion: Never track admin dashboard or login routes
  const isAdminRoute =
    pathname.startsWith("/tfl") ||
    pathname.startsWith("/arvind");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if current user is logged in as admin/editor
    const hasAdminToken = Boolean(localStorage.getItem("tfl_admin_token"));
    const hasAdminCookie =
      document.cookie.includes("tfl_admin_session") ||
      document.cookie.includes("tfl_admin_client_auth");

    const shouldExclude = isAdminRoute || hasAdminToken || hasAdminCookie;

    if (shouldExclude) {
      // Officially disable Google Analytics for this property in the browser
      (window as any)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
    } else {
      (window as any)[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
    }
  }, [pathname, isAdminRoute]);

  // If on admin routes, do NOT load GA4, Google AdSense, or Google Reader Revenue scripts
  if (isAdminRoute) {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `window['ga-disable-${GA_MEASUREMENT_ID}'] = true;`,
        }}
      />
    );
  }

  return (
    <>
      {/* Inline early guard before async scripts load */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var p = window.location.pathname.toLowerCase();
                var isAdmin = p.indexOf('/tfl') === 0 || 
                              p.indexOf('/arvind') === 0 || 
                              Boolean(localStorage.getItem('tfl_admin_token')) || 
                              document.cookie.indexOf('tfl_admin_session') !== -1 || 
                              document.cookie.indexOf('tfl_admin_client_auth') !== -1;
                if (isAdmin) {
                  window['ga-disable-${GA_MEASUREMENT_ID}'] = true;
                }
              } catch(e) {}
            })();
          `,
        }}
      />

      {/* Google Analytics 4 (GA4) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          (function() {
            var isAdmin = Boolean(localStorage.getItem('tfl_admin_token')) || 
                          document.cookie.indexOf('tfl_admin_session') !== -1 || 
                          document.cookie.indexOf('tfl_admin_client_auth') !== -1;
            if (isAdmin) {
              window['ga-disable-${GA_MEASUREMENT_ID}'] = true;
              return;
            }
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: true
            });
          })();
        `}
      </Script>

      {/* Google AdSense */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Google Reader Revenue Manager / Subscribe with Google */}
      <Script
        async
        src="https://news.google.com/swg/js/v1/swg-basic.js"
        strategy="afterInteractive"
      />
      <Script
        id="swg-basic-init"
        strategy="afterInteractive"
      >
        {`
          (self.SWG_BASIC = self.SWG_BASIC || []).push( basicSubscriptions => {
            basicSubscriptions.init({
              type: "NewsArticle",
              isPartOfType: ["Product"],
              isPartOfProductId: "CAowuOzHDA:openaccess",
              clientOptions: { theme: "light", lang: "en" },
            });
          });
        `}
      </Script>
    </>
  );
}
