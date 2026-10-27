"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';


interface SeoConfig {
  siteTitle: string;
  siteDescription: string;
  keywords: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
  googleAnalyticsId: string;
  publisherName: string;
  publisherLogo: string;
  facebookUrl: string;
  twitterHandle: string;
  instagramUrl: string;
  youtubeUrl: string;
}

const DEFAULT_SEO: SeoConfig = {
  siteTitle: "The Freelance | स्वतंत्र, निष्पक्ष और निर्भीक पत्रकारिता",
  siteDescription: "The Freelance - भारत और दुनिया की ताज़ा खबरें, ब्रेकिंग न्यूज़, ग्राउंड रिपोर्ट्स, राजनीति, खेल, सिनेमा, धर्म और तकनीक की सबसे सटीक व निष्पक्ष रिपोर्टिंग।",
  keywords: "The Freelance, news.thefreelance.in, thefreelance.in, Hindi News, Latest News in Hindi, Breaking News, Samachar, ताजा समाचार, आज की बड़ी खबरें",
  googleSiteVerification: "",
  bingSiteVerification: "",
  googleAnalyticsId: "",
  publisherName: "The Freelance",
  publisherLogo: "https://news.thefreelance.in/logo.png",
  facebookUrl: "https://facebook.com/thefreelancein",
  twitterHandle: "@thefreelancein",
  instagramUrl: "https://instagram.com/thefreelancein",
  youtubeUrl: "https://youtube.com/@thefreelancein",
};

export default function SEOPage() {
  const [config, setConfig] = useState<SeoConfig>(DEFAULT_SEO);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    fetch("/api/v1/seo/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.siteTitle) {
          setConfig(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('tfl_admin_token') || 'arvind_auth_token_9723338321' : 'arvind_auth_token_9723338321';
      const res = await fetch("/api/v1/seo/settings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-token": token
        },
        body: JSON.stringify(config),
      });


      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        alert("एसईओ सेटिंग्स सेव करने में त्रुटि आई।");
      }
    } catch {
      alert("सर्वर से संपर्क नहीं हो सका।");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-16">
      
      {/* Top Header */}
      <div className="bg-[#12141c] border border-gray-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            Top-Notch Search Engine Optimization
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            एसईओ व गूगल लिस्टिंग कंट्रोल (SEO Command Center)
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            यहाँ से आप ग्लोबल मेटा टैग्स, Google Search Console, News Sitemap और Schema.org सेटिंग्स मैनेज कर सकते हैं।
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-2xl text-sm shadow-xl shadow-red-600/30 transition-all active:scale-95 disabled:opacity-50"
        >
          <span>💾</span> {saving ? "सेव हो रहा है..." : "एसईओ सेटिंग्स सेव करें"}
        </button>
      </div>

      {/* Success Alert */}
      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-4 rounded-2xl flex items-center gap-3 animate-fade-in shadow-xl">
          <span className="text-xl">✅</span>
          <span className="text-sm font-bold">
            ग्लोबल एसईओ सेटिंग्स सफलतापूर्वक अपडेट हो गई हैं! सभी साइटमैप और मेटा टैग्स तुरंत री-जनरेट हो गए हैं।
          </span>
        </div>
      )}

      {/* Sitemaps & Search Engines Hub (Top Highlights) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🗺️</span>
              <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                ACTIVE
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">मुख्य XML साइटमैप</h3>
            <p className="text-xs text-gray-400 mt-1">गूगल सर्च इंडेक्सिंग के लिए सभी पेजों की लिस्टिंग</p>
          </div>
          <a
            href="/sitemap.xml"
            target="_blank"
            className="mt-4 text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            /sitemap.xml खोलें ↗
          </a>
        </div>

        <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📰</span>
              <span className="text-[11px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                GOOGLE NEWS
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">गूगल न्यूज़ साइटमैप</h3>
            <p className="text-xs text-gray-400 mt-1">पिछले 48 घंटों की ताज़ा खबरों का विशेष साइटमैप</p>
          </div>
          <a
            href="/news-sitemap.xml"
            target="_blank"
            className="mt-4 text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            /news-sitemap.xml खोलें ↗
          </a>
        </div>

        <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📡</span>
              <span className="text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                PUBLISHER RSS
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">पब्लिशर सेंटर RSS फ़ीड</h3>
            <p className="text-xs text-gray-400 mt-1">Google Publisher Center और Feed Readers के लिए</p>
          </div>
          <a
            href="/rss.xml"
            target="_blank"
            className="mt-4 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            /rss.xml खोलें ↗
          </a>
        </div>

        <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🤖</span>
              <span className="text-[11px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-bold">
                CRAWLER RULES
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Robots.txt फ़ाइल</h3>
            <p className="text-xs text-gray-400 mt-1">Googlebot और Bingbot को क्रॉलिंग अनुमति निर्देश</p>
          </div>
          <a
            href="/robots.txt"
            target="_blank"
            className="mt-4 text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            /robots.txt देखें ↗
          </a>
        </div>
      </div>

      {/* Main Grid: Form Left, SERP Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Settings */}
        <form onSubmit={handleSave} className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Card 1: Meta Tags */}
          <div className="bg-[#12141c] border border-gray-800 p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col gap-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">🏷️</span> मेटा टाइटल्स व विवरण (Global Meta Tags)
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                वेबसाइट का मुख्य टाइटल (Site Title) *
              </label>
              <input
                type="text"
                required
                value={config.siteTitle}
                onChange={(e) => setConfig({ ...config, siteTitle: e.target.value })}
                className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3.5 px-4 text-white text-sm outline-none transition-colors"
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                गूगल सर्च रिज़ल्ट्स में नीले रंग के मुख्य लिंक के रूप में दिखेगा (अनुशंसित 50-60 अक्षर)।
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  मेटा विवरण (Meta Description) *
                </label>
                <span className={`text-[11px] font-mono ${config.siteDescription.length > 160 ? 'text-red-400' : 'text-gray-400'}`}>
                  {config.siteDescription.length}/160 अक्षर
                </span>
              </div>
              <textarea
                rows={3}
                required
                value={config.siteDescription}
                onChange={(e) => setConfig({ ...config, siteDescription: e.target.value })}
                className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl p-4 text-white text-sm outline-none transition-colors"
              ></textarea>
              <p className="text-[11px] text-gray-400 mt-1.5">
                सर्च इंजन में वेबसाइट के शीर्षक के नीचे दिखने वाला 2 लाइनों का संक्षिप्त विवरण।
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                ग्लोबल कीवर्ड्स (Keywords, अल्पविराम से अलग करें)
              </label>
              <input
                type="text"
                value={config.keywords}
                onChange={(e) => setConfig({ ...config, keywords: e.target.value })}
                className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3.5 px-4 text-white text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* Card 2: Webmaster Verification & Tracking */}
          <div className="bg-[#12141c] border border-gray-800 p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col gap-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">🔍</span> सर्च इंजन वेरिफिकेशन कोड (Webmaster Verification)
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Google Search Console Verification Code
              </label>
              <input
                type="text"
                value={config.googleSiteVerification}
                onChange={(e) => setConfig({ ...config, googleSiteVerification: e.target.value })}
                placeholder="उदा. google-site-verification=XXXXXXXXXXXXXXXXXXXX"
                className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3.5 px-4 text-white font-mono text-xs outline-none transition-colors"
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                Google Search Console में HTML Tag वेरिफिकेशन कोड यहाँ डालें।
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Bing Webmaster Tools Verification Code
              </label>
              <input
                type="text"
                value={config.bingSiteVerification}
                onChange={(e) => setConfig({ ...config, bingSiteVerification: e.target.value })}
                placeholder="उदा. 7B2XXXXXXXXXXXXXX"
                className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3.5 px-4 text-white font-mono text-xs outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Google Analytics 4 Measurement ID (GA4)
              </label>
              <input
                type="text"
                value={config.googleAnalyticsId}
                onChange={(e) => setConfig({ ...config, googleAnalyticsId: e.target.value })}
                placeholder="उदा. G-XXXXXXXXXX"
                className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3.5 px-4 text-white font-mono text-xs outline-none transition-colors"
              />
            </div>
          </div>

          {/* Card 3: Social & Publisher Schema */}
          <div className="bg-[#12141c] border border-gray-800 p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col gap-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">🌐</span> ब्रांड व सोशल प्रोफाइल (Schema.org / Social Graph)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  पब्लिशर का नाम (Publisher)
                </label>
                <input
                  type="text"
                  value={config.publisherName}
                  onChange={(e) => setConfig({ ...config, publisherName: e.target.value })}
                  className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3 px-4 text-white text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Twitter / X हैंडल
                </label>
                <input
                  type="text"
                  value={config.twitterHandle}
                  onChange={(e) => setConfig({ ...config, twitterHandle: e.target.value })}
                  placeholder="@thefreelancein"
                  className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3 px-4 text-white text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Facebook पेज URL
                </label>
                <input
                  type="text"
                  value={config.facebookUrl}
                  onChange={(e) => setConfig({ ...config, facebookUrl: e.target.value })}
                  className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3 px-4 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  YouTube चैनल URL
                </label>
                <input
                  type="text"
                  value={config.youtubeUrl}
                  onChange={(e) => setConfig({ ...config, youtubeUrl: e.target.value })}
                  className="w-full bg-[#0b0c10] border border-gray-700 focus:border-red-500 rounded-2xl py-3 px-4 text-white text-xs outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-2xl font-black text-base shadow-xl shadow-red-600/30 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? "सेव किया जा रहा है..." : "💾 एसईओ सेटिंग्स सुरक्षित करें (Save All SEO Settings)"}
          </button>
        </form>

        {/* Right Column: Google Live Search Preview & Indexing Checklist */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-6">
          
          {/* SERP Preview Card */}
          <div className="bg-[#12141c] border border-gray-800 rounded-3xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>👁️</span> गूगल सर्च लाइव प्रीव्यू
              </span>
              <div className="flex bg-[#0b0c10] p-1 rounded-xl border border-gray-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${previewMode === 'desktop' ? 'bg-red-600 text-white' : 'text-gray-400'}`}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${previewMode === 'mobile' ? 'bg-red-600 text-white' : 'text-gray-400'}`}
                >
                  Mobile
                </button>
              </div>
            </div>

            {/* Google SERP Snippet Box */}
            <div className="bg-[#202124] rounded-2xl p-5 border border-gray-700 text-left font-sans shadow-lg">
              {/* Favicon & URL */}
              <div className="flex items-center gap-2.5 text-xs text-[#bdc1c6] mb-1.5">
                <div className="w-7 h-7 rounded-full bg-[#0b0c10] border border-gray-600 overflow-hidden relative flex-shrink-0 shadow-sm">
                  <Image src="/icon.png" alt="The Freelance" fill className="object-cover" />
                </div>
                <div className="flex flex-col leading-tight truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] text-[#dadce0] font-medium">{config.publisherName}</span>
                    <span className="text-[10px] bg-red-600/20 text-red-400 px-1.5 py-0.2 rounded font-bold">News</span>
                  </div>
                  <span className="text-[11px] text-[#9aa0a6] truncate">https://news.thefreelance.in</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg text-[#8ab4f8] hover:underline font-medium cursor-pointer leading-snug mt-1 line-clamp-2">
                {config.siteTitle}
              </h3>

              {/* Meta Description */}
              <p className="text-xs text-[#bdc1c6] mt-1.5 leading-relaxed line-clamp-3">
                {config.siteDescription}
              </p>

              {/* Rich Sitelinks (AajTak Style - Google Sitelinks) */}
              <div className="mt-4 pt-3 border-t border-gray-700/60">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Google Sitelinks (शीर्ष श्रेणियां व लिंक्स)</span>
                  <span className="text-green-400 text-[10px]">Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="text-[13px] text-[#8ab4f8] font-medium hover:underline flex items-center gap-1">
                      <span>Visual Stories</span>
                      <span className="text-gray-500 text-[10px]">↗</span>
                    </div>
                    <p className="text-[11px] text-[#9aa0a6] line-clamp-1 mt-0.5">
                      बिज़नेस, लाइफस्टाइल, जोक्स और तकनीक की 10 फोटो-स्टोरीज़...
                    </p>
                  </div>

                  <div className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="text-[13px] text-[#8ab4f8] font-medium hover:underline flex items-center gap-1">
                      <span>देश / नेशनल (National)</span>
                      <span className="text-gray-500 text-[10px]">↗</span>
                    </div>
                    <p className="text-[11px] text-[#9aa0a6] line-clamp-1 mt-0.5">
                      भारत की ताज़ा राजनीतिक हलचल, चुनावी खबरें और ग्राउंड रिपोर्ट्स...
                    </p>
                  </div>

                  <div className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="text-[13px] text-[#8ab4f8] font-medium hover:underline flex items-center gap-1">
                      <span>ब्रेकिंग न्यूज़ (Breaking)</span>
                      <span className="text-gray-500 text-[10px]">↗</span>
                    </div>
                    <p className="text-[11px] text-[#9aa0a6] line-clamp-1 mt-0.5">
                      एक क्लिक में पढ़ें दिनभर की सभी बड़ी और ताज़ा सुर्खियां...
                    </p>
                  </div>

                  <div className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="text-[13px] text-[#8ab4f8] font-medium hover:underline flex items-center gap-1">
                      <span>खेल और क्रिकेट (Sports)</span>
                      <span className="text-gray-500 text-[10px]">↗</span>
                    </div>
                    <p className="text-[11px] text-[#9aa0a6] line-clamp-1 mt-0.5">
                      क्रिकेट, आईपीएल, मैच स्कोरकार्ड और खेल जगत के ताज़ा अपडेट्स...
                    </p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-800 text-[11px] text-[#8ab4f8] hover:underline cursor-pointer">
                  More results from news.thefreelance.in »
                </div>
              </div>
            </div>

            <div className="mt-3 p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/20 text-[11px] text-blue-300 leading-relaxed">
              <strong className="text-blue-200">💡 आजतक जैसे गूगल साइटलिंक्स (Sitelinks) कैसे आते हैं?</strong>
              <p className="mt-1 text-gray-400">
                गूगल सर्च इंजन में आजतक या अन्य बड़े पोर्टल्स की तरह ये सब-लिंक्स तब अपने आप आते हैं जब वेबसाइट में सही <code>SiteNavigationElement</code> स्कीमा हो। The Freelance में यह स्कीमा कोड पहले से सक्रिय है। जैसे-जैसे आपकी साइट का सर्च ट्रैफिक बढ़ेगा, गूगल इसे सर्च रिज़ल्ट्स में स्वतः दिखाएगा।
              </p>
            </div>

          </div>

          {/* Top-Notch Google Indexing Checklist */}
          <div className="bg-[#12141c] border border-gray-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span>🚀</span> गूगल लिस्टिंग व इंडेक्सिंग चेकलिस्ट
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>NewsArticle Schema:</strong> हर खबर में Google News का स्ट्रक्चर्ड JSON-LD कोड सक्रिय है।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Google News Sitemap:</strong> 48 घंटों की ताज़ा खबरें सीधे <code>/news-sitemap.xml</code> में लिस्ट हो रही हैं।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>OpenGraph & Twitter Cards:</strong> WhatsApp, Facebook, X पर शेयर करने पर बड़ी इमेज व विवरण दिखेगा।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Canonical URLs:</strong> डुप्लीकेट कंटेंट पेनाल्टी से बचाव के लिए कैनोनिकल टैग्स ऑटो-सेट हैं।</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
