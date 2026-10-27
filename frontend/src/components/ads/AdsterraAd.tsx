"use client";
import React, { useEffect, useRef } from "react";

export interface AdsterraAdProps {
  format?: "leaderboard" | "rectangle" | "square" | "skyscraper" | "half-skyscraper" | "banner-468" | "mobile" | "native" | "in-article" | "in-feed";
  className?: string;
  label?: string;
}

const BANNERS = {
  leaderboard: {
    key: "faa27093d4d9a016a0d1db02fa67ee5f",
    width: 728,
    height: 90,
  },
  rectangle: {
    key: "db1211703eb4c95ee6fe4e438b779446",
    width: 300,
    height: 250,
  },
  skyscraper: {
    key: "f25a62c31dcf86b2f9fa111a998b61b8",
    width: 160,
    height: 600,
  },
  halfSkyscraper: {
    key: "1129bff607b22974d69b4c4c697e881b",
    width: 160,
    height: 300,
  },
  banner468: {
    key: "721d5349129f8cccfc7e41e1708bcbba",
    width: 468,
    height: 60,
  },
  mobile: {
    key: "ec730cbb8ca7435ecdc354fd899d6811",
    width: 320,
    height: 50,
  },
};

function getAdFrameUrl(key: string, width: number, height: number): string {
  return `/api/ads/frame?key=${key}&w=${width}&h=${height}`;
}

export default function AdsterraAd({
  format = "leaderboard",
  className = "",
  label,
}: AdsterraAdProps) {
  const displayLabel = label || "विज्ञापन • ADVERTISEMENT";

  // Native Recommendation Banner
  if (format === "native") {
    return <NativeAdsterraBanner label={displayLabel} className={className} />;
  }

  // In-Article / Mid-Content Ad:
  if (format === "in-article") {
    return (
      <div className={`w-full min-h-[270px] md:min-h-[110px] flex flex-col items-center justify-center my-2 ${className}`}>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 block">
          {displayLabel}
        </span>
        <div className="hidden md:flex justify-center w-[728px] max-w-full h-[90px] overflow-hidden rounded-xl bg-gray-950/40 border border-gray-800/40 shadow-sm">
          <iframe
            src={getAdFrameUrl(BANNERS.leaderboard.key, BANNERS.leaderboard.width, BANNERS.leaderboard.height)}
            width={728}
            height={90}
            style={{ width: "728px", height: "90px", border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement In-Article Desktop"
          />
        </div>
        <div className="flex md:hidden justify-center w-[300px] h-[250px] overflow-hidden rounded-xl bg-gray-950/40 border border-gray-800/40 shadow-md">
          <iframe
            src={getAdFrameUrl(BANNERS.rectangle.key, BANNERS.rectangle.width, BANNERS.rectangle.height)}
            width={300}
            height={250}
            style={{ width: "300px", height: "250px", border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement In-Article Mobile"
          />
        </div>
      </div>
    );
  }

  // In-Feed Section Ad:
  if (format === "in-feed") {
    return (
      <div className={`w-full min-h-[270px] md:min-h-[110px] flex flex-col items-center justify-center my-2 ${className}`}>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 block">
          {displayLabel}
        </span>
        <div className="hidden md:flex justify-center w-[728px] max-w-full h-[90px] overflow-hidden rounded-xl bg-gray-950/40 border border-gray-800/40 shadow-sm">
          <iframe
            src={getAdFrameUrl(BANNERS.leaderboard.key, BANNERS.leaderboard.width, BANNERS.leaderboard.height)}
            width={728}
            height={90}
            style={{ width: "728px", height: "90px", border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement In-Feed Desktop"
          />
        </div>
        <div className="flex md:hidden justify-center w-[300px] h-[250px] overflow-hidden rounded-xl bg-gray-950/40 border border-gray-800/40 shadow-md">
          <iframe
            src={getAdFrameUrl(BANNERS.rectangle.key, BANNERS.rectangle.width, BANNERS.rectangle.height)}
            width={300}
            height={250}
            style={{ width: "300px", height: "250px", border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement In-Feed Mobile"
          />
        </div>
      </div>
    );
  }

  // Responsive Leaderboard:
  if (format === "leaderboard") {
    return (
      <div className={`w-full min-h-[70px] md:min-h-[110px] flex flex-col items-center justify-center my-2 ${className}`}>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 block">
          {displayLabel}
        </span>
        <div className="hidden md:flex justify-center w-[728px] max-w-full h-[90px] overflow-hidden rounded-lg bg-gray-950/40 border border-gray-800/40 shadow-sm">
          <iframe
            src={getAdFrameUrl(BANNERS.leaderboard.key, BANNERS.leaderboard.width, BANNERS.leaderboard.height)}
            width={728}
            height={90}
            style={{ width: "728px", height: "90px", border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement 728x90"
          />
        </div>
        <div className="flex md:hidden justify-center w-[320px] h-[50px] overflow-hidden rounded-lg bg-gray-950/40 border border-gray-800/40 shadow-sm">
          <iframe
            src={getAdFrameUrl(BANNERS.mobile.key, BANNERS.mobile.width, BANNERS.mobile.height)}
            width={320}
            height={50}
            style={{ width: "320px", height: "50px", border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement 320x50"
          />
        </div>
      </div>
    );
  }

  // 300x250 Medium Rectangle:
  if (format === "rectangle" || format === "square") {
    return (
      <div className={`w-full min-h-[270px] flex flex-col items-center justify-center my-2 ${className}`}>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 block">
          {displayLabel}
        </span>
        <div className="w-[300px] h-[250px] overflow-hidden rounded-xl bg-gray-950/40 border border-gray-800/40 shadow-md">
          <iframe
            src={getAdFrameUrl(BANNERS.rectangle.key, BANNERS.rectangle.width, BANNERS.rectangle.height)}
            width={300}
            height={250}
            style={{ width: "300px", height: "250px", border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement 300x250"
          />
        </div>
      </div>
    );
  }

  // 160x600 Skyscraper:
  if (format === "skyscraper") {
    return (
      <div className={`w-full min-h-[270px] md:min-h-[620px] flex flex-col items-center justify-center my-2 ${className}`}>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 block">
          {displayLabel}
        </span>
        <div className="hidden md:flex justify-center w-[160px] h-[600px] overflow-hidden rounded-xl bg-gray-950/40 border border-gray-800/40 shadow-md">
          <iframe
            src={getAdFrameUrl(BANNERS.skyscraper.key, BANNERS.skyscraper.width, BANNERS.skyscraper.height)}
            width={160}
            height={600}
            style={{ width: "160px", height: "600px", border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement 160x600"
          />
        </div>
        <div className="flex md:hidden justify-center w-[300px] h-[250px] overflow-hidden rounded-xl bg-gray-950/40 border border-gray-800/40 shadow-md">
          <iframe
            src={getAdFrameUrl(BANNERS.rectangle.key, BANNERS.rectangle.width, BANNERS.rectangle.height)}
            width={300}
            height={250}
            style={{ width: "300px", height: "250px", border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement 300x250 Mobile"
          />
        </div>
      </div>
    );
  }

  // 160x300 Half Skyscraper:
  if (format === "half-skyscraper") {
    return (
      <div className={`w-full flex flex-col items-center justify-center my-4 ${className}`}>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 block">
          {displayLabel}
        </span>
        <div className="w-[160px] h-[300px] overflow-hidden rounded-xl bg-gray-950/40 border border-gray-800/40 shadow-md">
          <iframe
            src={getAdFrameUrl(BANNERS.halfSkyscraper.key, BANNERS.halfSkyscraper.width, BANNERS.halfSkyscraper.height)}
            width={160}
            height={300}
            style={{ width: "160px", height: "300px", border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement 160x300"
          />
        </div>
      </div>
    );
  }

  // 468x60 Mid Banner:
  if (format === "banner-468") {
    return (
      <div className={`w-full flex flex-col items-center justify-center my-4 ${className}`}>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 block">
          {displayLabel}
        </span>
        <div className="w-[468px] max-w-full h-[60px] overflow-hidden rounded-lg bg-gray-950/40 border border-gray-800/40 shadow-sm">
          <iframe
            src={getAdFrameUrl(BANNERS.banner468.key, BANNERS.banner468.width, BANNERS.banner468.height)}
            width={468}
            height={60}
            style={{ width: "468px", height: "60px", border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement 468x60"
          />
        </div>
      </div>
    );
  }

  // 320x50 Mobile Banner:
  if (format === "mobile") {
    return (
      <div className={`w-full flex flex-col items-center justify-center my-4 ${className}`}>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 block">
          {displayLabel}
        </span>
        <div className="w-[320px] h-[50px] overflow-hidden rounded-lg bg-gray-950/40 border border-gray-800/40 shadow-sm">
          <iframe
            src={getAdFrameUrl(BANNERS.mobile.key, BANNERS.mobile.width, BANNERS.mobile.height)}
            width={320}
            height={50}
            style={{ width: "320px", height: "50px", border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement 320x50"
          />
        </div>
      </div>
    );
  }

  return null;
}

function NativeAdsterraBanner({ label, className = "" }: { label?: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const existing = document.getElementById("adsterra-native-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "adsterra-native-script";
      script.src = "https://pl31669755.profitableratecpmnetwork.com/71eb3094a0ec5c63fcede4b0120fe3cf/invoke.js";
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className={`w-full my-6 flex flex-col items-center justify-center ${className}`}>
      {label && (
        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">
          {label}
        </span>
      )}
      <div
        id="container-71eb3094a0ec5c63fcede4b0120fe3cf"
        ref={containerRef}
        className="w-full max-w-[970px] min-h-[120px] rounded-2xl overflow-hidden bg-gray-950/30 p-2"
      />
    </div>
  );
}
