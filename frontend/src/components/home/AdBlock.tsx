"use client";
import React from "react";
import AdsterraAd from "@/components/ads/AdsterraAd";

export default function AdBlock({ 
  width, 
  height, 
  text = "विज्ञापन • ADVERTISEMENT", 
  html 
}: { 
  width?: string; 
  height?: string; 
  text?: string; 
  html?: string | null; 
}) {
  const isSquare = (width && width.includes("300")) || (height && height.includes("250"));
  if (isSquare) {
    return <AdsterraAd format="rectangle" label={text} />;
  }

  return <AdsterraAd format="leaderboard" label={text} />;
}
