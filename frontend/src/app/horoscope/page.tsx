"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import GoogleAdUnit from "@/components/ads/GoogleAdUnit";
import Link from "next/link";

const ZODIAC_LIST = [
  { id: "aries", name: "मेष (Aries)", symbol: "♈", dates: "21 मार्च - 19 अप्रैल", element: "अग्नि" },
  { id: "taurus", name: "वृषभ (Taurus)", symbol: "♉", dates: "20 अप्रैल - 20 मई", element: "पृथ्वी" },
  { id: "gemini", name: "मिथुन (Gemini)", symbol: "♊", dates: "21 मई - 20 जून", element: "वायु" },
  { id: "cancer", name: "कर्क (Cancer)", symbol: "♋", dates: "21 जून - 22 जुलाई", element: "जल" },
  { id: "leo", name: "सिंह (Leo)", symbol: "♌", dates: "23 जुलाई - 22 अगस्त", element: "अग्नि" },
  { id: "virgo", name: "कन्या (Virgo)", symbol: "♍", dates: "23 अगस्त - 22 सितंबर", element: "पृथ्वी" },
  { id: "libra", name: "तुला (Libra)", symbol: "♎", dates: "23 सितंबर - 22 अक्टूबर", element: "वायु" },
  { id: "scorpio", name: "वृश्चिक (Scorpio)", symbol: "♏", dates: "23 अक्टूबर - 21 नवंबर", element: "जल" },
  { id: "sagittarius", name: "धनु (Sagittarius)", symbol: "♐", dates: "22 नवंबर - 21 दिसंबर", element: "अग्नि" },
  { id: "capricorn", name: "मकर (Capricorn)", symbol: "♑", dates: "22 दिसंबर - 19 जनवरी", element: "पृथ्वी" },
  { id: "aquarius", name: "कुंभ (Aquarius)", symbol: "♒", dates: "20 जनवरी - 18 फरवरी", element: "वायु" },
  { id: "pisces", name: "मीन (Pisces)", symbol: "♓", dates: "19 फरवरी - 20 मार्च", element: "जल" },
];

export default function HoroscopePage() {
  const [horoscopes, setHoroscopes] = useState<{ [key: string]: string }>({});
  const [activeSign, setActiveSign] = useState<string>("aries");
  const [loading, setLoading] = useState(true);

  const todayStr = new Date().toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    fetch("/api/v1/feeds/horoscope")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any[]) => {
        const map: { [key: string]: string } = {};
        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item.sign) map[item.sign] = item.prediction;
          });
        }
        setHoroscopes(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activeZodiacObj = ZODIAC_LIST.find((z) => z.id === activeSign) || ZODIAC_LIST[0];
  const activePrediction =
    horoscopes[activeSign] ||
    "आज का दिन आपके लिए सामान्य से बेहतर रहेगा। कार्यक्षेत्र में नए अवसर मिल सकते हैं। स्वास्थ्य का ध्यान रखें और सकारात्मक सोच बनाए रखें।";

  return (
    <main className="horoscope-page-container min-h-screen bg-[#0b0c10] text-gray-200">
      <Header />

      {/* TOP BANNER AD */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex justify-center">
        <div className="w-full max-w-[970px] overflow-hidden flex justify-center">
          <GoogleAdUnit slot="2418463479" format="auto" />
        </div>
      </div>

      {/* HERO BANNER */}
      <div className="horoscope-hero-header relative overflow-hidden bg-gradient-to-b from-[#1c1410] via-[#0b0c10] to-[#0b0c10] border-b border-gray-800/80 pt-10 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors">होम</Link>
            <span>›</span>
            <span className="text-amber-500 font-semibold">दैनिक राशिफल (Horoscope)</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-600/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            आज का वैदिक राशिफल • {todayStr}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            आज का विस्तृत राशिफल (Daily Horoscope)
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
            जानें आज क्या कहते हैं आपके सितारे। व्यापार, नौकरी, प्रेम, परिवार और स्वास्थ्य का सटीक ज्योतिषीय आंकलन।
          </p>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        
        {/* ZODIAC ICONS SELECTOR */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {ZODIAC_LIST.map((z) => {
            const isSelected = activeSign === z.id;
            return (
              <button
                key={z.id}
                onClick={() => setActiveSign(z.id)}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isSelected ? "horoscope-sign-btn-active bg-amber-600/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10 scale-105" : "horoscope-sign-btn-inactive bg-[#141620] border-gray-800/80 text-gray-400 hover:border-gray-700 hover:text-white"
                }`}
              >
                <span className="text-2xl mb-1">{z.symbol}</span>
                <span className="text-xs font-bold text-center leading-tight">{z.name.split(" ")[0]}</span>
                <span className="text-[10px] text-gray-500 mt-0.5">{z.element}</span>
              </button>
            );
          })}
        </div>

        {/* SELECTED SIGN DETAILED CARD */}
        <div className="horoscope-detail-card bg-[#12141c] border border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800/80">
            <div className="flex items-center gap-4">
              <span className="text-4xl sm:text-5xl w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                {activeZodiacObj.symbol}
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {activeZodiacObj.name}
                </h2>
                <p className="text-xs text-amber-400/90 font-medium mt-1">
                  तत्व: {activeZodiacObj.element} • {activeZodiacObj.dates}
                </p>
              </div>
            </div>

            <div className="bg-[#181b26] px-4 py-2 rounded-xl border border-gray-800 text-xs text-gray-400">
              तारीख: <strong className="text-white">{todayStr}</strong>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-500">✨</span> आज का भविष्यफल:
            </h3>
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-normal horoscope-prediction-body bg-[#161824] p-6 rounded-2xl border border-gray-800/80 shadow-inner">
              {activePrediction}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-800/60 text-xs">
            <div className="horoscope-metric-box p-3 bg-[#161824] rounded-xl border border-gray-800">
              <span className="text-gray-400 block mb-1">भाग्यशाली अंक</span>
              <strong className="text-amber-400 text-base">3, 7, 9</strong>
            </div>
            <div className="horoscope-metric-box p-3 bg-[#161824] rounded-xl border border-gray-800">
              <span className="text-gray-400 block mb-1">शुभ रंग</span>
              <strong className="text-amber-400 text-base">सुनहरा, पीला</strong>
            </div>
            <div className="horoscope-metric-box p-3 bg-[#161824] rounded-xl border border-gray-800">
              <span className="text-gray-400 block mb-1">उपाय</span>
              <strong className="text-amber-400 text-base">सूर्य देव को जल अर्पित करें</strong>
            </div>
          </div>
        </div>

        {/* MID AD */}
        <div className="w-full flex justify-center my-6">
          <GoogleAdUnit slot="2418463479" format="auto" />
        </div>

        {/* ALL 12 SIGNS COMPACT GRID */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-amber-500 pl-3">
            सभी 12 राशियों का एक नज़र में राशिफल
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ZODIAC_LIST.map((z) => {
              const text = horoscopes[z.id] || "आज का दिन सुखद रहेगा। परिवार का सहयोग मिलेगा और कार्यों में प्रगति होगी।";
              return (
                <div
                  key={z.id}
                  onClick={() => setActiveSign(z.id)}
                  className="horoscope-mini-card bg-[#12141c] p-5 rounded-2xl border border-gray-800/80 hover:border-amber-500/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{z.symbol}</span>
                      <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                        {z.name}
                      </h3>
                    </div>
                    <span className="text-[10px] text-gray-500">{z.dates}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 leading-relaxed">
                    {text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Astrology Disclaimer */}
        <div className="horoscope-disclaimer-box bg-[#12141c] border border-gray-800/80 rounded-2xl p-5 text-xs text-gray-400 leading-relaxed">
          <strong className="text-gray-300">ज्योतिष अस्वीकरण:</strong> राशिफल में दी गई भविष्यवाणियां वैदिक ज्योतिष शास्त्र के सामान्य सिद्धांतों पर आधारित हैं। इन्हें केवल सामान्य मार्गदर्शन और मनोरंजन के रूप में लिया जाना चाहिए।
        </div>

        {/* BOTTOM AD */}
        <div className="w-full flex justify-center pt-4">
          <GoogleAdUnit slot="2418463479" format="auto" />
        </div>

      </div>
    </main>
  );
}
