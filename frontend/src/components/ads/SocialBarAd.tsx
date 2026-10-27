"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SESSION_DISMISSED_KEY = "tfl_socialbar_dismissed";

/**
 * Adsterra Social Bar Ad Component
 * Strict Rules:
 * 1. Active globally (India + all international countries).
 * 2. Exactly one Social Bar instance active at a time.
 * 3. Appears throughout the browser session until the user closes it.
 * 4. Once closed/dismissed by the user, it NEVER reappears for the rest of that session.
 */
export default function SocialBarAd() {
  const pathname = usePathname();

  // Exclude admin dashboard, admin login, and English portal (Rule 3: English portal is strictly ad-free)
  const isExcluded = pathname?.startsWith("/tfl") || pathname?.startsWith("/arvind") || pathname?.startsWith("/en");

  useEffect(() => {
    if (typeof window === "undefined" || isExcluded) return;

    const SCRIPT_ID = "adsterra-socialbar-script";

    const killAllOverlays = () => {
      // 1. Remove script tag
      const existingScript = document.getElementById(SCRIPT_ID);
      if (existingScript) existingScript.remove();

      // 2. Inject permanent CSS suppression rule
      if (!document.getElementById("tfl-kill-socialbar-style")) {
        const style = document.createElement("style");
        style.id = "tfl-kill-socialbar-style";
        style.innerHTML = `
          [id*="asg"], [class*="asg"], [id*="larva"], [class*="larva"],
          div[style*="position: fixed"][style*="z-index: 2147483647"],
          div[style*="position:fixed"][style*="z-index:2147483647"],
          div[style*="z-index: 2147483647"],
          div[style*="z-index:2147483647"] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            height: 0 !important;
            width: 0 !important;
          }
        `;
        document.head.appendChild(style);
      }

      // 3. Remove all existing notification elements from DOM
      document.querySelectorAll('div[style*="fixed"][style*="z-index"], div[id*="asg"], div[class*="asg"], [id*="larva"], [class*="larva"]').forEach((el) => {
        const html = el.innerHTML.toLowerCase();
        if (html.includes('vpn') || html.includes('larva') || html.includes('hide') || html.includes('learn more') || html.includes('asg')) {
          el.remove();
        }
      });
    };

    const setDismissedForever = () => {
      try {
        sessionStorage.setItem(SESSION_DISMISSED_KEY, "true");
        localStorage.setItem(SESSION_DISMISSED_KEY, "true");
        document.cookie = "tfl_socialbar_dismissed=true; path=/; max-age=86400";
      } catch (err) {}
      killAllOverlays();
    };

    // 1. Check if user already closed the Social Bar in this session (or last 24h)
    try {
      const isDismissed =
        sessionStorage.getItem(SESSION_DISMISSED_KEY) === "true" ||
        localStorage.getItem(SESSION_DISMISSED_KEY) === "true" ||
        document.cookie.includes("tfl_socialbar_dismissed=true");

      if (isDismissed) {
        killAllOverlays();
        return;
      }
    } catch (e) {}

    // 2. Inject script only if not dismissed
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://larvamomentum.com/7e/b1/dc/7eb1dc5c8eb8b1bcd3f5ca50e49526f9.js";
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      document.body.appendChild(script);
    }

    // 3. Global click listener to catch dismiss/close/hide clicks
    const handleDismissClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const text = (target.textContent || '').trim().toLowerCase();
      const isDismissWord = text === 'hide' || text === 'close' || text === '✕' || text === '×' || text === 'dismiss' || text === 'बंद करें';

      const isCloseBtn = isDismissWord || !!target.closest(
        '[class*="close" i], [id*="close" i], [aria-label*="close" i], [title*="close" i], [class*="hide" i], [id*="hide" i], button, svg'
      );

      // Check if click is inside notification overlay
      const container = target.closest(
        'div[style*="z-index"], div[style*="fixed"], div[class*="asg"], div[id*="asg"], div[class*="larva"], div[id*="larva"]'
      );

      if (container && (isCloseBtn || isDismissWord)) {
        setDismissedForever();
      }
    };

    // 4. MutationObserver to catch injected elements and removals
    const observer = new MutationObserver((mutations) => {
      const isDismissedNow =
        sessionStorage.getItem(SESSION_DISMISSED_KEY) === "true" ||
        localStorage.getItem(SESSION_DISMISSED_KEY) === "true";

      if (isDismissedNow) {
        killAllOverlays();
        return;
      }

      for (const m of mutations) {
        // Detect if ad container was removed by user clicking internal close button
        for (const node of Array.from(m.removedNodes)) {
          if (node instanceof HTMLElement) {
            const str = (node.id + ' ' + node.className + ' ' + (node.innerHTML || '')).toLowerCase();
            if (str.includes('asg') || str.includes('larva') || str.includes('vpn')) {
              setDismissedForever();
              return;
            }
          }
        }

        // Attach click handlers to any newly added ad elements
        for (const node of Array.from(m.addedNodes)) {
          if (node instanceof HTMLElement) {
            const html = node.innerHTML.toLowerCase();
            if (html.includes('vpn') || html.includes('hide') || html.includes('larva') || html.includes('asg')) {
              node.querySelectorAll('*').forEach((child) => {
                const childText = (child.textContent || '').trim().toLowerCase();
                if (childText === 'hide' || childText === 'close' || childText === '✕' || childText === '×') {
                  child.addEventListener('click', () => {
                    setDismissedForever();
                  }, { capture: true });
                }
              });
            }
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("click", handleDismissClick, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("click", handleDismissClick, true);
    };
  }, [pathname, isExcluded]);

  return null;
}
