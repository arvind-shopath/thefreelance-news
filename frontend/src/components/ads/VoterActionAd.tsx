import React from "react";
import VoterActionBannerAd from "./VoterActionBannerAd";

export default function VoterActionAd({ className = "", label = "विज्ञापन • SPONSORED" }: { className?: string; label?: string }) {
  return <VoterActionBannerAd className={className} label={label} />;
}
