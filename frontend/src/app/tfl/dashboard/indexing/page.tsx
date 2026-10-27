"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface QuotaStats {
  date: string;
  totalLimit: number;
  usedTotal: number;
  remaining: number;
  usedEnglish: number;
  usedHindi: number;
  englishReserved: number;
  isAsiaWindow?: boolean;
  usedEnglishAsia?: number;
  usedEnglishUS?: number;
  asiaQuotaLimit?: number;
  usQuotaLimit?: number;
}

interface IndexingStory {
  id: string;
  title: string;
  titleEn?: string | null;
  portal: string;
  isEnglishOnly: boolean;
  category: string;
  postType: string;
  geo?: string | null;
  keyword?: string | null;
  source?: string | null;
  urlHi?: string | null;
  urlEn?: string | null;
  primaryUrl: string;
  createdAt: string;
  googleIndexedAt?: string | null;
  indexNowIndexedAt?: string | null;
  indexingStatus?: string | null;
}

export default function IndexingMonitorPage() {
  const [quota, setQuota] = useState<QuotaStats | null>(null);
  const [stories, setStories] = useState<IndexingStory[]>([]);
  const [totalStories, setTotalStories] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [portalFilter, setPortalFilter] = useState<'all' | 'english' | 'hindi'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'indexed' | 'pending'>('all');
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().slice(0, 10));
  const [pingUrl, setPingUrl] = useState('');
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [isBatchIndexing, setIsBatchIndexing] = useState(false);
  const [batchStatus, setBatchStatus] = useState<string | null>(null);

  // Fetch quota stats
  const fetchQuota = async () => {
    try {
      const res = await fetch('/api/v1/seo/indexing-quota');
      if (res.ok) {
        const data = await res.json();
        setQuota(data);
      }
    } catch (e) {
      console.error('Failed to load quota', e);
    }
  };

  // Fetch filtered stories
  const fetchStories = async () => {
    setLoading(true);
    try {
      let url = `/api/v1/seo/indexing-stories?page=${page}&limit=30&portal=${portalFilter}&status=${statusFilter}`;
      if (dateFilter) {
        url += `&date=${dateFilter}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setStories(json.data || []);
        setTotalStories(json.total || 0);
        setTotalPages(json.totalPages || 1);
      }
    } catch (e) {
      console.error('Failed to load stories', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuota();
    fetchStories();
  }, [portalFilter, statusFilter, dateFilter, page]);

  // Batch Indexing for Today's English Stories
  const handleBatchIndexToday = async () => {
    setIsBatchIndexing(true);
    setBatchStatus('⏳ आज की इंग्लिश खबरों को गूगल व बिंग में ऑटो-इंडेक्स किया जा रहा है...');
    try {
      const res = await fetch('/api/v1/seo/batch-index-today', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 60 })
      });
      const data = await res.json();
      setBatchStatus(`✅ सफलतापूर्वक ${data.count || 0} इंग्लिश खबरों को गूगल व बिंग में इंडेक्स कर दिया गया!`);
      await fetchQuota();
      await fetchStories();
    } catch (err: any) {
      setBatchStatus(`❌ त्रुटि: ${err.message}`);
    } finally {
      setIsBatchIndexing(false);
      setTimeout(() => setBatchStatus(null), 8000);
    }
  };

  // Manual Ping Trigger
  const handleManualPing = async (urlToPing: string) => {
    if (!urlToPing) return;
    setIsPinging(true);
    setPingStatus('गूगल व बिंग को पिंग भेजा जा रहा है...');
    try {
      const res = await fetch('/api/v1/seo/instant-index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToPing })
      });
      const data = await res.json();
      if (data?.google?.[0]?.status === 'success') {
        setPingStatus(`✅ सफलतापूर्वक इंडेक्स पिंग भेजा गया! (Google & IndexNow Success)`);
        fetchQuota();
        fetchStories();
      } else if (data?.google?.[0]?.status === 'skipped_quota') {
        setPingStatus(`⚠️ कोटा सीमा सुरक्षित रखने के लिए रोका गया: ${data.google[0].error}`);
      } else {
        setPingStatus(`रिस्पॉन्स: ${JSON.stringify(data)}`);
      }
    } catch (err: any) {
      setPingStatus(`त्रुटि: ${err.message}`);
    } finally {
      setIsPinging(false);
      setTimeout(() => setPingStatus(null), 7000);
    }
  };

  const usedPercentage = quota ? Math.min(100, Math.round((quota.usedTotal / quota.totalLimit) * 100)) : 0;
  const englishPercent = quota && quota.usedTotal > 0 ? Math.round((quota.usedEnglish / quota.usedTotal) * 100) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="p-2 bg-red-600/20 text-red-500 rounded-lg">⚡</span>
            गूगल व बिंग इंस्टेंट इंडेक्सिंग मॉनिटर
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            दैनिक 200 गूगल कोटा ट्रैकिंग, यूएस/यूके इंग्लिश प्रायोरिटी, और रियल-टाइम पब्लिश्ड खबरें
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handleBatchIndexToday}
            disabled={isBatchIndexing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
          >
            {isBatchIndexing ? '⏳ इंडेक्स हो रहा है...' : '🚀 आज की इंग्लिश खबरें इंडेक्स करें'}
          </button>
          <button 
            onClick={() => { fetchQuota(); fetchStories(); }}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-semibold rounded-lg flex items-center gap-2 border border-gray-700 transition-colors"
          >
            🔄 रीफ्रेश करें
          </button>
        </div>
      </div>

      {batchStatus && (
        <div className="p-3 bg-blue-900/30 border border-blue-500/40 rounded-xl text-blue-300 text-sm font-medium animate-pulse">
          {batchStatus}
        </div>
      )}

      {/* Quota Intelligence Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Google Quota */}
        <div className="bg-[#0f1117] border border-gray-800 rounded-xl p-5 relative overflow-hidden">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Google Daily Quota (आज का कुल)
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{quota?.usedTotal ?? 0}</span>
            <span className="text-sm font-semibold text-gray-400">/ {quota?.totalLimit ?? 200}</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                usedPercentage > 80 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${usedPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[11px] text-gray-400 mt-2 font-mono">
            <span>शेष कोटा: <strong className="text-emerald-400">{quota?.remaining ?? 200}</strong></span>
            <span>{usedPercentage}% प्रयुक्त</span>
          </div>
        </div>

        {/* Card 2: English Reserved / High Priority */}
        <div className="bg-[#0f1117] border border-blue-900/40 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              ⭐ English (US/UK/SG)
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
              quota?.isAsiaWindow 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}>
              {quota?.isAsiaWindow ? '🌏 सिंगापुर/एशिया विंडो' : '🇺🇸 US/UK पीक विंडो'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{quota?.usedEnglish ?? 0}</span>
            <span className="text-xs text-gray-400 font-mono">/ {quota?.englishReserved ?? 130} आरक्षित</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-gray-800/80 text-[11px] text-gray-400 flex flex-col gap-1">
            <div className="flex justify-between">
              <span>दिन (SG/India 45 Cap):</span>
              <strong className="text-blue-300 font-mono">{quota?.usedEnglishAsia ?? 0} / 45</strong>
            </div>
            <div className="flex justify-between">
              <span>रात (US/UK 85 Reserve):</span>
              <strong className="text-emerald-400 font-mono">{quota?.usedEnglishUS ?? 0} / 85</strong>
            </div>
          </div>
        </div>

        {/* Card 3: Hindi Portal Safe Limit */}
        <div className="bg-[#0f1117] border border-orange-900/40 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              🇮🇳 हिन्दी मुख्य पोर्टल
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-500/20 text-orange-300 rounded border border-orange-500/30">
              HIGH-TRAFFIC
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{quota?.usedHindi ?? 0}</span>
            <span className="text-xs text-gray-400 font-mono">/ 70 दैनिक सीमा</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-gray-800/80 text-[11px] text-gray-400 leading-relaxed">
            <span className="text-amber-400 font-semibold">फोकस:</span> मनोरंजन, धर्म, खेल, लाइफस्टाइल, नौकरी, गैलरी, वेब-स्टोरी!
          </div>
        </div>

        {/* Card 4: IndexNow / Bing */}
        <div className="bg-[#0f1117] border border-emerald-900/40 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              🌐 IndexNow (Bing / Yandex)
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
              असीमित
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">10,000</span>
            <span className="text-xs text-gray-400 font-mono">डेली फ्री कोटा</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
            हिन्दी व इंग्लिश की हर नई खबर Bing और Yandex पर <strong>100% तुरंत सबमिट</strong> होती है।
          </p>
        </div>
      </div>

      {/* Manual Instant Index Push Bar */}
      <div className="bg-[#0f1117] border border-gray-800 rounded-xl p-4">
        <div className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
          <span>🚀 मैनुअल इंस्टेंट इंडेक्सिंग ट्रिगर (MANUAL PUSH)</span>
          <span className="text-gray-500 normal-case font-normal">(किसी भी खास यूआरएल को तुरंत भेजें)</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={pingUrl}
            onChange={(e) => setPingUrl(e.target.value)}
            placeholder="उदाहरण: https://news.thefreelance.in/en/world/us-canada-trade-talks-8971"
            className="flex-1 bg-[#050608] border border-gray-700 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-red-500 font-mono"
          />
          <button
            onClick={() => handleManualPing(pingUrl)}
            disabled={isPinging || !pingUrl}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
          >
            {isPinging ? 'सबमिट हो रहा है...' : 'गूगल में सबमिट करें'}
          </button>
        </div>
        {pingStatus && (
          <div className="mt-2 text-xs font-mono text-gray-300 bg-gray-900/60 p-2 rounded border border-gray-800">
            {pingStatus}
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-[#0f1117] border border-gray-800 rounded-xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left: Portal & Status Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Portal Filter Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-gray-400 mr-1">पोर्टल:</span>
            <button
              onClick={() => { setPortalFilter('all'); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                portalFilter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              सभी (All)
            </button>
            <button
              onClick={() => { setPortalFilter('english'); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                portalFilter === 'english' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              ⭐ इंग्लिश पोर्टल (US/UK/EU)
            </button>
            <button
              onClick={() => { setPortalFilter('hindi'); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                portalFilter === 'hindi' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              🇮🇳 मुख्य हिन्दी पोर्टल
            </button>
          </div>

          <div className="h-4 w-px bg-gray-800 hidden md:block"></div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-gray-400 mr-1">इंडेक्स स्टेटस:</span>
            <button
              onClick={() => { setStatusFilter('all'); setPage(1); }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              सभी
            </button>
            <button
              onClick={() => { setStatusFilter('indexed'); setPage(1); }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                statusFilter === 'indexed' ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-emerald-400 hover:bg-gray-800'
              }`}
            >
              ✅ केवल इंडेक्स्ड
            </button>
            <button
              onClick={() => { setStatusFilter('pending'); setPage(1); }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              ⏳ पेंडिंग
            </button>
          </div>
        </div>

        {/* Date Filter & Total Counter */}
        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">तारीख:</span>
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
              className="bg-[#050608] border border-gray-700 text-white text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-red-500 font-mono"
            />
          </div>
          <div className="text-xs font-bold text-gray-400">
            दिखाई गई खबरें: <span className="text-white font-mono">{totalStories}</span>
          </div>
        </div>
      </div>

      {/* Stories Table */}
      <div className="bg-[#0f1117] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#12141c] text-gray-400 uppercase font-mono tracking-wider border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4">समय (IST)</th>
                <th className="py-3.5 px-4">पोर्टल / एडिशन</th>
                <th className="py-3.5 px-4">कैटेगरी</th>
                <th className="py-3.5 px-4">खबर का शीर्षक व यूआरएल</th>
                <th className="py-3.5 px-4 text-center">इंडेक्सिंग स्टेटस</th>
                <th className="py-3.5 px-4 text-center">एक्शन</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 font-mono">
                    लोड हो रहा है...
                  </td>
                </tr>
              ) : stories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 font-medium">
                    इस तारीख ({dateFilter}) पर इस फ़िल्टर के तहत कोई खबर नहीं मिली।
                  </td>
                </tr>
              ) : (
                stories.map((story) => {
                  const dateObj = new Date(story.createdAt);
                  const timeFormatted = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
                  const isIndexed = !!story.googleIndexedAt || story.indexingStatus === 'success';

                  return (
                    <tr key={story.id} className="hover:bg-gray-800/40 transition-colors">
                      {/* Column 1: Time */}
                      <td className="py-3 px-4 font-mono text-gray-400 whitespace-nowrap">
                        {timeFormatted}
                      </td>

                      {/* Column 2: Portal Tag */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {story.isEnglishOnly ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            ⭐ English Only ({story.geo || 'US'})
                          </span>
                        ) : story.titleEn ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            🌐 द्विभाषी (Hi + En)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            🇮🇳 मुख्य हिन्दी
                          </span>
                        )}
                      </td>

                      {/* Column 3: Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-gray-300 font-semibold uppercase font-mono text-[11px] px-2 py-0.5 bg-gray-800 rounded">
                          {story.category}
                        </span>
                        {story.postType !== 'general' && (
                          <span className="ml-1.5 text-[10px] text-gray-400 font-mono">
                            [{story.postType}]
                          </span>
                        )}
                      </td>

                      {/* Column 4: Title & URL Links */}
                      <td className="py-3 px-4 max-w-lg">
                        <div className="font-semibold text-gray-100 line-clamp-1 text-sm hover:text-red-400 transition-colors">
                          <a href={story.primaryUrl} target="_blank" rel="noopener noreferrer">
                            {story.isEnglishOnly || portalFilter === 'english' ? (story.titleEn || story.title) : story.title}
                          </a>
                        </div>
                        {story.titleEn && !story.isEnglishOnly && portalFilter !== 'english' && (
                          <div className="text-[11px] text-gray-400 line-clamp-1 italic mt-0.5">
                            EN: {story.titleEn}
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono">
                          {story.urlHi && (
                            <a 
                              href={story.urlHi} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-orange-400 hover:underline flex items-center gap-1"
                            >
                              🔗 Hi URL
                            </a>
                          )}
                          {story.urlEn && (
                            <a 
                              href={story.urlEn} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-400 hover:underline flex items-center gap-1"
                            >
                              🔗 En URL
                            </a>
                          )}
                          {story.source && (
                            <span className="text-gray-400 font-sans">
                              (स्रोत: {story.source})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 5: Indexing Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {isIndexed ? (
                          <div className="inline-flex flex-col items-center gap-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              ✅ Google Indexed
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono">
                              IndexNow Active ⚡
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-gray-800 text-gray-400 border border-gray-700">
                            ⏳ पेंडिंग (Queue)
                          </span>
                        )}
                      </td>

                      {/* Column 6: Manual Instant Index Action */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleManualPing(story.primaryUrl)}
                          className="px-3 py-1 bg-gray-800 hover:bg-red-600 text-gray-200 hover:text-white rounded text-[11px] font-bold border border-gray-700 transition-colors flex items-center gap-1 mx-auto"
                          title="इस खबर को फिर से गूगल इंडेक्स में पिंग भेजें"
                        >
                          ⚡ Re-Ping
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-[#12141c]">
            <span className="text-xs text-gray-400 font-mono">
              पेज {page} / {totalPages} (कुल {totalStories} खबरें)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 text-xs font-semibold rounded border border-gray-700"
              >
                पिछला
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 text-xs font-semibold rounded border border-gray-700"
              >
                अगला
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
