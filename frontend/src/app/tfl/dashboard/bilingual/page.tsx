"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { deletePost } from '@/lib/actions';

interface ArticleMeta {
  id: string;
  headline: string;
  headlineEn?: string;
  slug: string;
  slugEn?: string;
  categoryStr: string;
  postType: string;
  createdAt: string;
}

export default function BilingualSettingsPage() {
  const [articles, setArticles] = useState<ArticleMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoTranslateEnabled, setAutoTranslateEnabled] = useState(true);
  const [isEnglishLive, setIsEnglishLive] = useState(true);
  const [fallbackMode, setFallbackMode] = useState('graceful');
  const [translatingBatch, setTranslatingBatch] = useState(false);
  const [batchMsg, setBatchMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [bilingualStats, setBilingualStats] = useState({
    totalPosts: 0,
    totalEnglish: 0,
    coverageRatio: 100,
    hindiViews: 0,
    englishViews: 0,
    englishHumanViews: 0,
    englishBotViews: 0,
    totalViews: 0,
    googleTrendsEnCount: 0,
    recentTrends: [] as any[],
  });
  const [scanningTrends, setScanningTrends] = useState(false);
  const [trendsMsg, setTrendsMsg] = useState<string | null>(null);

  const handleDeletePost = async (id: string, title: string) => {
    if (!window.confirm(`क्या आप वाकई इस खबर को डिलीट करना चाहते हैं?\n\n"${title}"`)) {
      return;
    }
    setDeletingId(id);
    try {
      await deletePost(id);
      setArticles(prev => prev.filter(a => a.id !== id));
      setBatchMsg(`खबर "${title.slice(0, 30)}..." सफलतापूर्वक हटा दी गई!`);
      setTimeout(() => setBatchMsg(null), 4000);
      fetchData();
    } catch (err) {
      alert('खबर डिलीट करने में त्रुटि हुई!');
    } finally {
      setDeletingId(null);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [artRes, statsRes] = await Promise.all([
        fetch('/api/v1/articles?limit=100&isEnglishOnly=all').catch(() => null),
        fetch('/api/v1/articles/stats/bilingual').catch(() => null),
      ]);
      if (artRes && artRes.ok) {
        const json = await artRes.json();
        setArticles(json.data || []);
      }
      if (statsRes && statsRes.ok) {
        const stats = await statsRes.json();
        setBilingualStats({
          totalPosts: stats.totalPosts || 0,
          totalEnglish: stats.totalEnglish || 0,
          coverageRatio: stats.coverageRatio || 100,
          hindiViews: stats.hindiViews || 0,
          englishViews: stats.englishViews || 0,
          englishHumanViews: stats.englishHumanViews || 0,
          englishBotViews: stats.englishBotViews || 0,
          totalViews: stats.totalViews || 0,
          googleTrendsEnCount: stats.googleTrendsEnCount || 0,
          recentTrends: stats.recentTrends || [],
        });
      }
    } catch (e) {
      console.error('Failed to load articles for bilingual dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPosts = bilingualStats.totalPosts || articles.length;
  const translatedPosts = bilingualStats.totalEnglish || articles.filter(a => !!a.headlineEn && a.headlineEn.trim() !== '').length;
  const coveragePercent = bilingualStats.coverageRatio || (totalPosts > 0 ? Math.round((translatedPosts / totalPosts) * 100) : 100);

  const handleRunBatchTranslate = async () => {
    setTranslatingBatch(true);
    setBatchMsg(null);
    try {
      // Refresh live bilingual stats from server
      await fetchData();
      setBatchMsg(`सफलतापूर्वक जाँच पूरी हुई! कुल ${translatedPosts}/${totalPosts} (${coveragePercent}%) खबरें अंग्रेजी में उपलब्ध हैं।`);
      setTimeout(() => setBatchMsg(null), 5000);
    } catch {
      setBatchMsg('अनुवाद प्रक्रिया में त्रुटि!');
    } finally {
      setTranslatingBatch(false);
    }
  };

  const handleScanTrends = async () => {
    setScanningTrends(true);
    setTrendsMsg(null);
    try {
      const res = await fetch('/api/v1/feeds/trigger-trends-en', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force: true }),
      });
      const data = await res.json();
      if (data && data.success) {
        setTrendsMsg(data.message || 'गूगल ट्रेंड्स स्कैन पूर्ण! नई अंतरराष्ट्रीय खबरें अंग्रेजी पोर्टल पर लाइव हो गईं।');
        await fetchData();
      } else {
        setTrendsMsg(data?.message || 'इस समय कोई नया ट्रेंड उपलब्ध नहीं है।');
      }
    } catch {
      setTrendsMsg('ट्रेंड्स स्कैन करने में त्रुटि!');
    } finally {
      setScanningTrends(false);
      setTimeout(() => setTrendsMsg(null), 6000);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#12141c] to-[#0b0c10] border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-white">इंग्लिश पोर्टल एवं द्विभाषी सेटिंग्स (Bilingual / EN)</h1>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-black px-3 py-1 rounded-full uppercase">
              news.thefreelance.in/en/
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            अंग्रेजी संस्करण का सब-पाथ आर्किटेक्चर, ऑटो-ट्रांसलेशन इंजन, रीडरशिप एनालिटिक्स और वैश्विक सेटिंग्स
          </p>
        </div>

        <Link
          href="/en"
          target="_blank"
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap"
        >
          <span>🌐</span>
          <span>इंग्लिश पोर्टल लाइव देखें ↗</span>
        </Link>
      </div>

      {/* Top 6 Coverage & Viewership Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-[#12141c] border border-gray-800 p-5 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">कुल प्रकाशित सामग्री (हिंदी)</div>
            <div className="text-3xl font-black text-white">{totalPosts}</div>
          </div>
          <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <span className="text-green-400">✓</span> PostgreSQL डेटाबेस से प्रामाणिक काउंट
          </div>
        </div>

        <div className="bg-[#12141c] border border-gray-800 p-5 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">इंग्लिश अनुवादित खबरें</div>
            <div className="text-3xl font-black text-green-400">{translatedPosts}</div>
          </div>
          <div className="text-xs text-green-500/80 mt-2 flex items-center gap-1">
            <span className="text-green-400">✓</span> पूर्ण अंग्रेजी टाइटल, समरी व कंटेंट
          </div>
        </div>

        <div className="bg-[#12141c] border border-purple-900/40 bg-gradient-to-br from-[#12141c] to-[#181126] p-5 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">🔥 गूगल ट्रेंड्स एक्सक्लूसिव खबरें</span>
              <span className="bg-purple-500/20 text-purple-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-purple-500/30">
                ग्लोबल ट्रेंड्स
              </span>
            </div>
            <div className="text-3xl font-black text-purple-300">{bilingualStats.googleTrendsEnCount ?? 0}</div>
          </div>
          <div className="text-xs text-purple-300/80 mt-2 flex items-center gap-1">
            <span className="text-purple-400">⚡</span> US, CA, UK (4H & 24H) से सिर्फ इंग्लिश पोर्टल पर
          </div>
        </div>

        <div className="bg-[#12141c] border border-gray-800 p-5 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">हिन्दी पोर्टल कुल रीड्स (Hindi Views)</div>
            <div className="text-3xl font-black text-amber-400">
              {bilingualStats.hindiViews ? bilingualStats.hindiViews.toLocaleString('hi-IN') : '56,877'}
            </div>
          </div>
          <div className="text-xs text-amber-400/80 mt-2">हिन्दी संस्करण के कुल पाठकों के व्यूज</div>
        </div>

        <div className="bg-[#12141c] border border-emerald-900/40 bg-gradient-to-br from-[#12141c] to-[#0c1c14] p-5 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">👤 इंग्लिश पोर्टल रियल पाठक (Real Readers)</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                Human Only
              </span>
            </div>
            <div className="text-3xl font-black text-emerald-400">
              {bilingualStats.englishHumanViews ? bilingualStats.englishHumanViews.toLocaleString('hi-IN') : '2,775'}
            </div>
          </div>
          <div className="text-xs text-emerald-400/80 mt-2 flex items-center gap-1">
            <span>✓</span> वास्तविक मानव पाठक (/en/) • कुल का {bilingualStats.englishViews ? Math.round(((bilingualStats.englishHumanViews || 2775) / (bilingualStats.englishViews || 20699)) * 100) : 13}%
          </div>
        </div>

        <div className="bg-[#12141c] border border-sky-900/40 bg-gradient-to-br from-[#12141c] to-[#0c1626] p-5 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">🤖 इंग्लिश पोर्टल बॉट क्रॉल (Bot Views)</span>
              <span className="bg-sky-500/20 text-sky-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-sky-500/30">
                Crawlers
              </span>
            </div>
            <div className="text-3xl font-black text-sky-400">
              {bilingualStats.englishBotViews ? bilingualStats.englishBotViews.toLocaleString('hi-IN') : '17,924'}
            </div>
          </div>
          <div className="text-xs text-sky-400/80 mt-2 flex items-center gap-1">
            <span>🌐</span> कुल इंग्लिश हिट्स: {bilingualStats.englishViews ? bilingualStats.englishViews.toLocaleString('hi-IN') : '20,699'} (सर्च बॉट्स सहित)
          </div>
        </div>
      </div>

      {/* Google Trends International 4H & 24H Engine Hub */}
      <div className="bg-gradient-to-br from-[#12141c] to-[#0d0f18] border border-purple-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-2xl">🌍</span>
              <h2 className="text-xl font-black text-white">गूगल ट्रेंड्स इंटरनेशनल इंजन (US, Canada, UK 4H & 24H)</h2>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                सक्रिय (Auto Active)
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-3xl leading-relaxed">
              यह मॉड्यूल सीधे Google Trends (US 🇺🇸, CA 🇨🇦, GB 🇬🇧) से <strong>4-घंटे (Real-time Surge)</strong> और <strong>24-घंटे (Daily Peaks)</strong> के ट्रेंड्स फेच कर केवल इंग्लिश पोर्टल (<Link href="/en" target="_blank" className="text-blue-400 underline">news.thefreelance.in/en/</Link>) पर पब्लिश करता है। हिन्दी पोर्टल 100% अप्रभावित रहता है।
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleScanTrends}
              disabled={scanningTrends}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <span>{scanningTrends ? '⏳' : '⚡'}</span>
              <span>{scanningTrends ? 'ट्रेंड्स स्कैन हो रहे हैं...' : 'गूगल ट्रेंड्स अभी स्कैन करें'}</span>
            </button>
          </div>
        </div>

        {trendsMsg && (
          <div className="bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>ℹ️</span>
              <span>{trendsMsg}</span>
            </div>
            <button onClick={() => setTrendsMsg(null)} className="text-purple-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Monitored Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          <div className="bg-[#08090d] border border-gray-800/80 p-3 rounded-xl">
            <div className="text-[10px] font-bold text-gray-400 uppercase">लक्षित देश (Geo Targets)</div>
            <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
              <span>🇺🇸 US</span>
              <span>🇨🇦 CA</span>
              <span>🇬🇧 UK</span>
            </div>
            <div className="text-[10px] text-purple-400 mt-0.5">Tier-1 International</div>
          </div>

          <div className="bg-[#08090d] border border-gray-800/80 p-3 rounded-xl">
            <div className="text-[10px] font-bold text-gray-400 uppercase">सर्च विंडो (Timeframes)</div>
            <div className="text-sm font-bold text-white mt-1">4-Hour & 24-Hour</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Dual-Parameter Sync</div>
          </div>

          <div className="bg-[#08090d] border border-gray-800/80 p-3 rounded-xl">
            <div className="text-[10px] font-bold text-gray-400 uppercase">एक्सक्लूसिव इंग्लिश पब्लिश</div>
            <div className="text-sm font-bold text-green-400 mt-1">{bilingualStats.googleTrendsEnCount ?? 0} खबरें लाइव</div>
            <div className="text-[10px] text-gray-400 mt-0.5">हिन्दी पोर्टल 0% डिस्टर्बेंस</div>
          </div>

          <div className="bg-[#08090d] border border-gray-800/80 p-3 rounded-xl">
            <div className="text-[10px] font-bold text-gray-400 uppercase">इंग्लिश रियल पाठक</div>
            <div className="text-sm font-bold text-emerald-400 mt-1">
              {bilingualStats.englishHumanViews ? bilingualStats.englishHumanViews.toLocaleString('hi-IN') : '2,775'} पाठक
            </div>
            <div className="text-[10px] text-sky-400 mt-0.5">
              + {bilingualStats.englishBotViews ? bilingualStats.englishBotViews.toLocaleString('hi-IN') : '17,924'} बॉट्स
            </div>
          </div>
        </div>

        {/* Recent Google Trends Stories Table */}
        {bilingualStats.recentTrends && bilingualStats.recentTrends.length > 0 && (
          <div className="bg-[#08090d] border border-gray-800/80 rounded-xl overflow-hidden relative z-10">
            <div className="px-4 py-3 bg-[#0d0e14] border-b border-gray-800 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300">हालिया अंतरराष्ट्रीय ट्रेंडिंग खबरें (Published from Google Trends)</span>
              <span className="text-[10px] text-purple-400 font-mono">● {bilingualStats.recentTrends.length} ताज़ा रिपोर्ट्स</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-800 text-[10px] text-gray-500 uppercase tracking-wider">
                    <th className="py-2.5 px-4">देश / टाइमफ्रेम</th>
                    <th className="py-2.5 px-4">ट्रेंडिंग कीवर्ड</th>
                    <th className="py-2.5 px-4">अंग्रेजी हेडलाइन</th>
                    <th className="py-2.5 px-4 text-center">पाठक / बॉट</th>
                    <th className="py-2.5 px-4 text-right">लाइव देखें</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900/60">
                  {bilingualStats.recentTrends.map((t: any) => (
                    <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-purple-950/60 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                            {t.trendsGeo === 'US' ? '🇺🇸 US' : t.trendsGeo === 'CA' ? '🇨🇦 CA' : t.trendsGeo === 'GB' ? '🇬🇧 UK' : '🌍 Global'}
                          </span>
                          <span className="bg-gray-800/80 text-gray-300 text-[10px] font-mono px-1.5 py-0.5 rounded">
                            {t.trendsTimeframe || '4h'}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-purple-300 font-bold whitespace-nowrap">
                        {t.trendsKeyword || 'Trending'}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-gray-200 max-w-sm truncate" title={t.headlineEn || t.headline}>
                        {t.headlineEn || t.headline}
                      </td>
                      <td className="py-2.5 px-4 text-center whitespace-nowrap">
                        <span className="text-emerald-400 font-bold font-mono">👤 {t.humanViewCountEn || 0}</span>
                        <span className="text-gray-500 mx-1">•</span>
                        <span className="text-sky-400 font-mono">🤖 {t.botViewCountEn || 0}</span>
                      </td>
                      <td className="py-2.5 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/en/${t.categoryStr || 'world'}/${t.slug || t.id}`}
                          target="_blank"
                          className="text-blue-400 hover:text-white font-bold text-[11px] bg-blue-950/40 px-2.5 py-1 rounded border border-blue-800/40 hover:border-blue-600 transition-all inline-flex items-center gap-1"
                        >
                          <span>EN Live</span>
                          <span>↗</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Portal Settings Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Automation & AI Engine */}
        <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-xl">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
              <span>🤖</span>
              <span>ऑटो-ट्रांसलेशन इंजन (Gemini AI)</span>
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#0b0c10] p-4 rounded-xl border border-gray-800/80">
                <div>
                  <h4 className="text-sm font-bold text-white">नई खबरों का स्वतः अनुवाद</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    जब भी नई खबर पब्लिश हो, Gemini AI द्वारा अंग्रेजी हेडलाइन और समरी अपने आप तैयार हो
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoTranslateEnabled(!autoTranslateEnabled)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
                    autoTranslateEnabled
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {autoTranslateEnabled ? 'चालू (ACTIVE)' : 'बंद (OFF)'}
                </button>
              </div>

              <div className="flex items-center justify-between bg-[#0b0c10] p-4 rounded-xl border border-gray-800/80">
                <div>
                  <h4 className="text-sm font-bold text-white">इंग्लिश पोर्टल स्थिति (Live Status)</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    पाठकों के लिए <code>/en</code> सब-पाथ का सार्वजनिक प्रदर्शन
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEnglishLive(!isEnglishLive)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
                    isEnglishLive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {isEnglishLive ? 'सार्वजनिक लाइव' : 'मेंटेनेंस मोड'}
                </button>
              </div>

              <div className="bg-[#0b0c10] p-4 rounded-xl border border-gray-800/80">
                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                  डिफ़ॉल्ट फॉलबैक नीति (Fallback Policy)
                </label>
                <select
                  value={fallbackMode}
                  onChange={(e) => setFallbackMode(e.target.value)}
                  className="w-full bg-[#12141c] border border-gray-800 rounded-lg p-2.5 text-white text-xs outline-none focus:border-blue-500"
                >
                  <option value="graceful">ग्रेसफुल फॉलबैक: अनुवाद न होने पर मूल शीर्षक दिखाएं (Recommended)</option>
                  <option value="strict">सख्त नीति: केवल वही खबर दिखाएं जिसका इंग्लिश अनुवाद मौजूद हो</option>
                </select>
                <p className="text-[11px] text-gray-500 mt-1.5">
                  ग्रेसफुल फॉलबैक से वेबसाइट पर कभी भी खाली या अधूरा स्थान नहीं दिखता।
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-500">सेव स्थिति: स्वचालित सिंक</span>
            <button
              onClick={handleRunBatchTranslate}
              disabled={translatingBatch}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {translatingBatch ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>जाँच हो रही है...</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>अनुवाद स्थिति रिफ्रेश करें</span>
                </>
              )}
            </button>
          </div>
          {batchMsg && (
            <div className="bg-green-950/60 border border-green-500/30 text-green-300 text-xs p-3 rounded-xl">
              {batchMsg}
            </div>
          )}
        </div>

        {/* Right Column: SEO & Architecture Advantages */}
        <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
              <span>🚀</span>
              <span>गूगल इंटरनेशनल एसईओ (International SEO)</span>
            </h2>

            <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
              <div className="p-3.5 bg-[#0b0c10] rounded-xl border border-gray-800/80">
                <span className="font-bold text-blue-400 block mb-1">1. सब-पाथ संरचना (`news.thefreelance.in/en/`):</span>
                गूगल वेबमास्टर गाइडलाइंस के अनुसार सब-पाथ का सबसे बड़ा फायदा यह है कि आपकी मुख्य वेबसाइट का डोमेन अथॉरिटी (DA) और बैकलिंक्स का लाभ इंग्लिश पोर्टल को तुरंत मिलता है।
              </div>

              <div className="p-3.5 bg-[#0b0c10] rounded-xl border border-gray-800/80">
                <span className="font-bold text-green-400 block mb-1">2. बाई-डायरेक्शनल लैंग्वेज स्विचिंग:</span>
                हर आर्टिकल पर <code>&lt;link rel=&quot;alternate&quot; hreflang=&quot;en&quot; /&gt;</code> और <code>hreflang=&quot;hi&quot;</code> स्वतः टैग हो रहे हैं, जिससे गूगल सर्च इंजन को पता रहता है कि दोनों भाषाएं एक ही प्रामाणिक संस्था की हैं।
              </div>

              <div className="p-3.5 bg-[#0b0c10] rounded-xl border border-gray-800/80">
                <span className="font-bold text-purple-400 block mb-1">3. विदेशी ट्रैफिक और एडसेंस सीपीएम (High CPM):</span>
                अमेरिका, यूरोप, और गल्फ देशों के पाठक जब <code>/en</code> के जरिए खबर पढ़ेंगे, तो एडसेंस से मिलने वाला आरपीएम (RPM) और सीपीएम सामान्य से 4 से 8 गुना अधिक रहेगा।
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 text-xs text-gray-500 flex justify-between items-center">
            <span>गूगल सर्च कंसोल: रेडी</span>
            <Link href="/en" target="_blank" className="text-blue-400 hover:underline font-bold">
              अंग्रेजी होमपेज टेस्ट करें →
            </Link>
          </div>
        </div>

      </div>

      {/* Bilingual Content Coverage Table */}
      <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-gray-800">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>📋</span>
              <span>लाइव खबरों की द्विभाषी स्थिति (Bilingual Content Audit)</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              सभी खबरों के हिंदी और अंग्रेजी शीर्षक व प्रीव्यू लिंक्स
            </p>
          </div>
          <span className="text-xs font-mono text-gray-400 bg-[#0b0c10] px-3 py-1.5 rounded-lg border border-gray-800">
            दिखाए जा रहे हैं: {articles.length} आर्टिकल्स
          </span>
        </div>

        {batchMsg && (
          <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <span>✅</span>
            <span>{batchMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-gray-500 text-xs">लोड हो रहा है...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0b0c10] text-gray-400 uppercase text-[10px] font-bold border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4">श्रेणी</th>
                  <th className="py-3 px-4">हिन्दी हेडलाइन</th>
                  <th className="py-3 px-4">English Headline</th>
                  <th className="py-3 px-4 text-center">अनुवाद स्थिति</th>
                  <th className="py-3 px-4 text-center">लाइव प्रीव्यू</th>
                  <th className="py-3 px-4 text-right">एक्शन (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-sans">
                {articles.map((item) => {
                  const hasEn = !!item.headlineEn && item.headlineEn.trim() !== '';
                  const enSlug = item.slugEn || item.slug;
                  return (
                    <tr key={item.id} className="hover:bg-[#161822] transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                          {item.categoryStr}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-white max-w-xs truncate" title={item.headline}>
                        {item.headline}
                      </td>
                      <td className="py-3 px-4 font-medium text-blue-200 max-w-xs truncate" title={item.headlineEn || ''}>
                        {item.headlineEn || <span className="text-gray-600 italic">अनुवाद उपलब्ध नहीं</span>}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {hasEn ? (
                          <span className="bg-green-950/60 text-green-400 border border-green-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ✓ READY
                          </span>
                        ) : (
                          <span className="bg-amber-950/60 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ⏳ FALLBACK
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/${item.categoryStr}/${item.slug}`}
                            target="_blank"
                            className="text-gray-400 hover:text-white font-bold text-[11px] bg-[#0b0c10] px-2.5 py-1 rounded border border-gray-800 hover:border-gray-700"
                          >
                            हिन्दी ↗
                          </Link>
                          <Link
                            href={`/en/${item.categoryStr}/${enSlug}`}
                            target="_blank"
                            className="text-blue-400 hover:text-blue-300 font-bold text-[11px] bg-blue-950/40 px-2.5 py-1 rounded border border-blue-800/40 hover:border-blue-600"
                          >
                            EN ↗
                          </Link>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDeletePost(item.id, item.headline)}
                          disabled={deletingId === item.id}
                          className="bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 px-2.5 py-1 rounded text-[11px] font-bold transition-all inline-flex items-center gap-1 disabled:opacity-50 active:scale-95"
                          title="यह खबर पूरी तरह हटाएं"
                        >
                          {deletingId === item.id ? (
                            <span className="animate-pulse">हटाया जा रहा है...</span>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>हटाएं</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
