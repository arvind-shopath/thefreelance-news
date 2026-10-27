"use client";
import React from "react";
import AdsterraAd from "./AdsterraAd";

interface VoterActionSquareAdProps {
  className?: string;
  label?: string;
}

export default function VoterActionSquareAd({
  className = "",
  label = "विज्ञापन • ADVERTISEMENT"
}: VoterActionSquareAdProps) {
  return <AdsterraAd format="rectangle" className={className} label={label} />;
}
