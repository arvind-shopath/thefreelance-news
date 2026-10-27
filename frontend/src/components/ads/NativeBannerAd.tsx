"use client";
import React, { useEffect, useRef } from "react";

/**
 * Adsterra Native Recommendation Banner Widget
 * Active for ALL countries (India + International).
 * Completely replaced Monetag with 100% Adsterra native ads.
 */
export default function NativeBannerAd({ className = "", label = "प्रायोजित • SPONSORED" }: { className?: string; label?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Clear any leftover content on remount
    wrapper.innerHTML = "";

    // Create container div that Adsterra script searches for
    const container = document.createElement("div");
    container.id = "container-71eb3094a0ec5c63fcede4b0120fe3cf";
    container.className = "w-full min-h-[140px]";
    wrapper.appendChild(container);

    // Load Adsterra invoke script
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://larvamomentum.com/71eb3094a0ec5c63fcede4b0120fe3cf/invoke.js";
    wrapper.appendChild(script);

    // Helper: enforce target="_blank" on all anchors
    const enforceNewTab = () => {
      const links = wrapper.querySelectorAll("a");
      links.forEach((a) => {
        if (a.getAttribute("target") !== "_blank") {
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        }
      });
    };

    const observer = new MutationObserver(() => {
      enforceNewTab();
    });
    observer.observe(wrapper, { childList: true, subtree: true });

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (anchor) {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
      }
    };
    wrapper.addEventListener("click", handleClick, true);

    return () => {
      observer.disconnect();
      wrapper.removeEventListener("click", handleClick, true);
    };
  }, []);

  return (
    <div className={`w-full my-6 flex flex-col items-center justify-center ${className}`}>
      {label && (
        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block text-center">
          {label}
        </span>
      )}
      <div
        ref={wrapperRef}
        className="w-full max-w-[970px] min-h-[140px] rounded-2xl overflow-hidden bg-gray-950/30 p-2 flex justify-center items-center"
        aria-label="Sponsored Recommendations"
      />
    </div>
  );
}
