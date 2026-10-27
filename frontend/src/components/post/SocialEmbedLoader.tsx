"use client";

import { useEffect } from "react";

/**
 * SocialEmbedLoader dynamically loads Twitter/X and Instagram widget scripts
 * and processes any embedded tweets (<blockquote class="twitter-tweet">)
 * or Instagram reels/posts (<blockquote class="instagram-media">) inside article HTML content.
 */
export default function SocialEmbedLoader() {
  useEffect(() => {
    // 1. Load and process Instagram Embeds
    const loadInstagram = () => {
      const hasInstagramEmbed = document.querySelector("blockquote.instagram-media");
      if (!hasInstagramEmbed) return;

      if ((window as any).instgrm?.Embeds?.process) {
        (window as any).instgrm.Embeds.process();
      } else {
        const existingScript = document.getElementById("instagram-embed-script");
        if (!existingScript) {
          const script = document.createElement("script");
          script.id = "instagram-embed-script";
          script.src = "//www.instagram.com/embed.js";
          script.async = true;
          script.onload = () => {
            if ((window as any).instgrm?.Embeds?.process) {
              (window as any).instgrm.Embeds.process();
            }
          };
          document.body.appendChild(script);
        }
      }
    };

    // 2. Load and process Twitter / X Embeds
    const loadTwitter = () => {
      const hasTwitterEmbed = document.querySelector("blockquote.twitter-tweet");
      if (!hasTwitterEmbed) return;

      if ((window as any).twttr?.widgets?.load) {
        (window as any).twttr.widgets.load();
      } else {
        const existingScript = document.getElementById("twitter-widget-script");
        if (!existingScript) {
          const script = document.createElement("script");
          script.id = "twitter-widget-script";
          script.src = "https://platform.twitter.com/widgets.js";
          script.async = true;
          script.onload = () => {
            if ((window as any).twttr?.widgets?.load) {
              (window as any).twttr.widgets.load();
            }
          };
          document.body.appendChild(script);
        }
      }
    };

    // Initial check
    loadInstagram();
    loadTwitter();

    // Re-check after DOM settles to handle Next.js client hydration
    const timer1 = setTimeout(() => {
      loadInstagram();
      loadTwitter();
    }, 800);

    const timer2 = setTimeout(() => {
      loadInstagram();
      loadTwitter();
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return null;
}
