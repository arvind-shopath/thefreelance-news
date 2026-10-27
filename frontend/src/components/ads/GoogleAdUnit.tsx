"use client";
import React from "react";
import AdsterraAd from "./AdsterraAd";

interface GoogleAdUnitProps {
  slot?: string;
  format?: string;
  layout?: string;
  layoutKey?: string;
  style?: React.CSSProperties;
  className?: string;
  variant?: "banner" | "square" | "auto";
}

export default function GoogleAdUnit({
  slot,
  format = "auto",
  layout,
  layoutKey,
  style,
  className = "",
  variant
}: GoogleAdUnitProps) {
  const isSquare =
    variant === "square" ||
    format === "rectangle" ||
    (style?.maxWidth && String(style.maxWidth).includes("300")) ||
    (style?.maxHeight && String(style.maxHeight).includes("250")) ||
    className.includes("sidebar") ||
    className.includes("square");

  if (isSquare) {
    return <AdsterraAd format="rectangle" className={className} />;
  }

  return <AdsterraAd format="leaderboard" className={className} />;
}
