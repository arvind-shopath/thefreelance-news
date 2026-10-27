"use client";

import React, { useState, useEffect } from 'react';

interface AdSlot {
  id?: string;
  slotName: string;
  adHtml: string;
  isActive: boolean;
  label: string;
  description: string;
  recommendedSize: string;
}

const DEFAULT_SLOTS: Omit<AdSlot, 'adHtml' | 'isActive'>[] = [
  {
    slotName: 'top-banner',
    label: 'हेडर टॉप लीडरबोर्ड (Top Banner)',
    description: 'वेबसाइट के मुख्य हेडर के ठीक नीचे पूरे डेस्कटॉप और मोबाइल पर दिखने वाला प्रमुख विज्ञापन',
    recommendedSize: '970x90 px (Desktop) / 320x100 px (Mobile)',
  },
  {
    slotName: 'sidebar-rect',
    label: 'साइडबार विज्ञापन (Sidebar MPU)',
    description: 'होमपेज और आर्टिकल पेज के साइडबार में "ज़रूर पढ़ें" के ऊपर स्टिकी विज्ञापन ब्लॉक',
    recommendedSize: '300x250 px / 300x600 px (Half Page)',
  },
  {
    slotName: 'mid-article',
    label: 'इन-आर्टिकल विज्ञापन (In-Feed / In-Article)',
    description: 'हर खबर और लेख के बीच में पाठकों की नजरों के सामने दिखने वाला सबसे अधिक सीटीआर (CTR) वाला स्लॉट',
    recommendedSize: '728x90 px / 336x280 px Responsive',
  },
  {
    slotName: 'adsense-auto-ads',
    label: 'गूगल एडसेंस ऑटो-ऐड्स कोड (AdSense Auto-Ads <head>)',
    description: 'गूगल एडसेंस का मुख्य सत्यापन व ऑटो-ऐड्स जावास्क्रिप्ट कोड जो वेबसाइट के <head> में रहता है',
    recommendedSize: 'Global AdSense Script (ca-pub-XXXXXXXXXX)',
  }
];

export default function AdsManager() {
  const [ads, setAds] = useState<Record<string, { adHtml: string; isActive: boolean }>>({});
  const [revenueStats, setRevenueStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingSlot, setSavingSlot] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ slot: string; text: string; type: 'success' | 'error' } | null>(null);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/ads').catch(() => fetch('http://localhost:4000/api/v1/ads'));
      if (res && res.ok) {
        const list = await res.json();
        const map: Record<string, { adHtml: string; isActive: boolean }> = {};
        list.forEach((item: any) => {
          if (item.slotName !== 'support_payment_config') {
            map[item.slotName] = {
              adHtml: item.adHtml || '',
              isActive: item.isActive ?? true,
            };
          }
        });
        setAds(map);
      }

      const revRes = await fetch('/api/v1/ads/stats/revenue').catch(() => fetch('http://localhost:4000/api/v1/ads/stats/revenue'));
      if (revRes && revRes.ok) {
        const rData = await revRes.json();
        setRevenueStats(rData);
      }
    } catch (e) {
      console.error('Failed to load ads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleTextChange = (slotName: string, value: string) => {
    setAds(prev => ({
      ...prev,
      [slotName]: {
        adHtml: value,
        isActive: prev[slotName]?.isActive ?? true,
      }
    }));
  };

  const handleToggle = (slotName: string) => {
    setAds(prev => ({
      ...prev,
      [slotName]: {
        adHtml: prev[slotName]?.adHtml || '',
        isActive: !prev[slotName]?.isActive,
      }
    }));
  };

  const handleSaveSlot = async (slotName: string) => {
    setSavingSlot(slotName);
    setMsg(null);
    try {
      const slotData = ads[slotName] || { adHtml: '', isActive: true };
      const res = await fetch(`/api/v1/ads/${slotName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adHtml: slotData.adHtml,
          isActive: slotData.isActive,
        }),
      });

      if (res.ok) {
        setMsg({ slot: slotName, text: 'स्लॉट सफलतापूर्वक सेव और लाइव हुआ! ✓', type: 'success' });
        setTimeout(() => setMsg(null), 4000);
      } else {
        setMsg({ slot: slotName, text: 'सेव करने में विफलता!', type: 'error' });
      }
    } catch (e) {
      console.error('Failed to save ad slot:', e);
      setMsg({ slot: slotName, text: 'सर्वर से संपर्क नहीं हो सका!', type: 'error' });
    } finally {
      setSavingSlot(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#12141c] to-[#0b0c10] border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-white">विज्ञापन एवं एडसेंस मैनेजमेंट (Ads & AdSense)</h1>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-black px-3 py-1 rounded-full">
              Google AdSense & Direct Ads
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            वेबसाइट के अलग-अलग स्थानों पर गूगल एडसेंस, स्पॉन्सर्ड बैनर्स और कस्टम कोड का लाइव नियंत्रण
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#0b0c10] px-4 py-2.5 rounded-xl border border-gray-800 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-gray-300 font-bold">मोनेटाइजेशन इंजन सक्रिय</span>
        </div>
      </div>

      {/* AdSense Live Income & Monetization Matrix */}
      <div className="bg-gradient-to-br from-[#12141c] to-[#0c0d12] border border-amber-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💰</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Google AdSense लाइव अर्निंग्स एवं स्टेटस</h2>
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {revenueStats?.statusLabel ?? "समीक्षा जारी (Review Requested)"}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                पब्लिशर आईडी: <code className="text-amber-300 font-mono">pub-7153554525059355</code> • ऑटो-ऐड्स: <strong className="text-green-400">सक्रिय (ON)</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://adsense.google.com/adsense/u/0/pub-7153554525059355/home"
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 text-amber-300 font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>AdSense रिपोर्ट देखें</span>
              <span>↗</span>
            </a>
            <a
              href="https://thefreelance.in/ads.txt"
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-3 py-2 rounded-xl transition-all"
            >
              ads.txt ↗
            </a>
          </div>
        </div>

        {/* 4 Earning Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#08090d] border border-gray-800 p-4 rounded-xl">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">आज की आय (Today)</div>
            <div className="text-2xl font-black text-white mt-1.5">
              ₹{(revenueStats?.earnings?.today ?? 0).toFixed(2)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">Today so far</div>
          </div>

          <div className="bg-[#08090d] border border-gray-800 p-4 rounded-xl">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">कल की आय (Yesterday)</div>
            <div className="text-2xl font-black text-white mt-1.5">
              ₹{(revenueStats?.earnings?.yesterday ?? 0).toFixed(2)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">Yesterday</div>
          </div>

          <div className="bg-[#08090d] border border-gray-800 p-4 rounded-xl">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">पिछले 7 दिन (Last 7D)</div>
            <div className="text-2xl font-black text-white mt-1.5">
              ₹{(revenueStats?.earnings?.last7Days ?? 0).toFixed(2)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">Last 7 days</div>
          </div>

          <div className="bg-[#08090d] border border-gray-800 p-4 rounded-xl">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">इस महीने (This Month)</div>
            <div className="text-2xl font-black text-amber-400 mt-1.5">
              ₹{(revenueStats?.earnings?.thisMonth ?? 0).toFixed(2)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">This month</div>
          </div>
        </div>

        {/* Status Notice Banner */}
        <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="font-bold text-amber-300">साइट अप्रूवल प्रगति पर है (Getting Ready)</div>
              <p className="text-gray-400 mt-0.5">
                Google AdSense टीम आपकी साइट की समीक्षा कर रही है। अप्रूवल मिलते ही विज्ञापन दिखने लगेंगे और दैनिक सीटीआर (CTR), आरपीएम (RPM) और कुल कमाई यहाँ लाइव दिखेगी।
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full font-bold">
              ✓ ads.txt सक्रिय
            </span>
            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full font-bold">
              ✓ Head Code सक्रिय
            </span>
          </div>
        </div>
      </div>

      {/* Quick Help Card */}
      <div className="bg-blue-950/20 border border-blue-900/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="text-sm font-bold text-blue-200">एडसेंस कोड कैसे जोड़ें?</h4>
            <p className="text-xs text-blue-300/70">
              गूगल एडसेंस डैशबोर्ड से प्राप्त <code>&lt;ins class=&quot;adsbygoogle&quot; ...&gt;</code> कोड को सीधे संबंधित स्लॉट के बॉक्स में पेस्ट करें और &quot;स्लॉट अपडेट करें&quot; पर क्लिक करें।
            </p>
          </div>
        </div>
      </div>

      {/* Ads Slots Grid */}
      {loading ? (
        <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-12 text-center text-gray-500 text-sm">
          विज्ञापन सेटिंग्स लोड हो रही हैं...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {DEFAULT_SLOTS.map((slot) => {
            const current = ads[slot.slotName] || { adHtml: '', isActive: true };
            const isSaving = savingSlot === slot.slotName;
            const slotMsg = msg?.slot === slot.slotName ? msg : null;

            return (
              <div
                key={slot.slotName}
                className="bg-[#12141c] border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between group hover:border-gray-700 transition-all"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 mb-3 border-b border-gray-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                        {slot.label}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                        {slot.description}
                      </p>
                    </div>

                    {/* Active Toggle Pill */}
                    <button
                      type="button"
                      onClick={() => handleToggle(slot.slotName)}
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-black transition-all ${
                        current.isActive
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : 'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}
                    >
                      {current.isActive ? '● LIVE / ON' : '○ DISABLED'}
                    </button>
                  </div>

                  {/* Size recommendation badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] bg-[#0b0c10] border border-gray-800 text-gray-400 font-mono px-2.5 py-1 rounded-md">
                      📏 साइज़: {slot.recommendedSize}
                    </span>
                  </div>

                  {/* HTML / Script Code Area */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                      Ad Code / HTML / Script
                    </label>
                    <textarea
                      rows={6}
                      value={current.adHtml}
                      onChange={(e) => handleTextChange(slot.slotName, e.target.value)}
                      placeholder="<!-- Paste your Google AdSense or Custom HTML code here -->"
                      className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-3.5 text-green-400 font-mono text-xs focus:border-red-500 outline-none leading-relaxed resize-y"
                    />
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-gray-800 flex items-center justify-between gap-3">
                  {slotMsg ? (
                    <span
                      className={`text-xs font-bold ${
                        slotMsg.type === 'success' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {slotMsg.text}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500 font-medium">
                      स्लॉट: <code>{slot.slotName}</code>
                    </span>
                  )}

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSaveSlot(slot.slotName)}
                    className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>सेव हो रहा है...</span>
                      </>
                    ) : (
                      <span>स्लॉट अपडेट करें ✓</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
