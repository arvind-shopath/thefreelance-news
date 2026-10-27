"use client";
import React from "react";
import AdsterraAd from "./AdsterraAd";

interface SocialCraftBannerAdProps {
  className?: string;
  label?: string;
}

export default function SocialCraftBannerAd({
  className = "",
  label = "विज्ञापन • ADVERTISEMENT"
}: SocialCraftBannerAdProps) {
  return <AdsterraAd format="leaderboard" className={className} label={label} />;
}
