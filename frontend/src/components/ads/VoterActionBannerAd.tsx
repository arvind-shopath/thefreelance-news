"use client";
import React from "react";
import AdsterraAd from "./AdsterraAd";

interface VoterActionBannerAdProps {
  className?: string;
  label?: string;
}

export default function VoterActionBannerAd({
  className = "",
  label = "विज्ञापन • ADVERTISEMENT"
}: VoterActionBannerAdProps) {
  return <AdsterraAd format="leaderboard" className={className} label={label} />;
}
