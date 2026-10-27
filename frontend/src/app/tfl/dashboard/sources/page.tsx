"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getSourceStatsAction } from '@/lib/actions';

interface SourceMeta {
  key: string;
  label: string;
  icon: string;
  description: string;
  count: number;
  percentage: number;
  hourlyFreq: number;
  dailyFreq: number;
  humanViews: number;
  botViews: number;
  totalViews: number;
  avgSeo: number;
  lastPublished: string | null;
  recentSamples: any[];
}

export interface PublisherMeta {
  name: string;
  group: string;
  groupLabel: string;
  count: number;
  percentage: number;
  hourlyFreq: number;
  dailyFreq: number;
  humanViews: number;
  botViews: number;
  totalViews: number;
  avgSeo: number;
  lastPublished: string | null;
  sampleHeadline: string;
  sampleHeadlineEn?: string | null;
  sampleSlug: string;
  sampleCategory: string;
}

export interface CategoryMeta {
  categorySlug: string;
  categoryName: string;
  categoryNameEn: string;
  icon: string;
  count: number;
  percentage: number;
  hourlyFreq: number;
  dailyFreq: number;
  humanViews: number;
  botViews: number;
  totalViews: number;
  avgSeo: number;
  lastPublished: string | null;
  sampleHeadline: string;
  sampleHeadlineEn?: string | null;
  sampleSlug: string;
}

interface HourlyItem {
  hour: number;
  label: string;
  total: number;
  googleTrends: number;
  googleTrendsInternational?: number;
  googleTrendsIndia?: number;
  hindiTranslated?: number;
  aajtak: number;
  viralX: number;
  googleNews: number;
  manual: number;
  [key: string]: any;
}

interface EnglishBreakdown {
  totalEnglish: number;
  translated: number;
  googleTrendsExclusive: number;
  translatedPercentage: number;
  trendsPercentage: number;
}

export default function SourceAnalyticsPage() {
  // Filters
  const [selectedPortal, setSelectedPortal] = useState<'all' | 'hindi' | 'english'>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<'today' | 'yesterday' | '7days' | '30days' | 'all' | 'custom'>('7days');
  const [selectedEnglishType, setSelectedEnglishType] = useState<'all' | 'trends' | 'translated'>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Publisher filter & search
  const [publisherSearch, setPublisherSearch] = useState('');
  const [selectedPublisherGroup, setSelectedPublisherGroup] = useState<string>('all');

  // Category search
  const [categorySearch, setCategorySearch] = useState('');

  // Data state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('');
  const [statsData, setStatsData] = useState<{
    totalCount: number;
    elapsedHours: number;
    liveVelocity?: {
      last24hCount: number;
      last6hCount: number;
      velocity24h: number;
      velocity6h: number;
    };
    sources: SourceMeta[];
    categories?: CategoryMeta[];
    publishers?: PublisherMeta[];
    hourly24: HourlyItem[];
    englishBreakdown: EnglishBreakdown;
    recentStories: any[];
  } | null>(null);

  // Trigger states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Calculate actual ISO date bounds based on selectedDateRange
  const dateBounds = useMemo(() => {
    const now = new Date();
    if (selectedDateRange === 'today') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return { startDate: start.toISOString(), endDate: now.toISOString() };
    }
    if (selectedDateRange === 'yesterday') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, -1);
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    }
    if (selectedDateRange === '7days') {
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { startDate: start.toISOString(), endDate: now.toISOString() };
    }
    if (selectedDateRange === '30days') {
      const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { startDate: start.toISOString(), endDate: now.toISOString() };
    }
    if (selectedDateRange === 'custom') {
      return {
        startDate: customStartDate ? new Date(customStartDate).toISOString() : undefined,
        endDate: customEndDate ? new Date(customEndDate).toISOString() : undefined,
      };
    }
    return { startDate: undefined, endDate: undefined };
  }, [selectedDateRange, customStartDate, customEndDate]);

  // Fetch stats from backend
  const fetchStats = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setRefreshing(true);
    try {
      const res = await getSourceStatsAction({
        portal: selectedPortal,
        englishType: selectedPortal === 'english' ? selectedEnglishType : undefined,
        startDate: dateBounds.startDate,
        endDate: dateBounds.endDate,
      });

      if (res && res.sources) {
        setStatsData(res);
        setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      }
    } catch (err) {
      console.error('Failed to fetch source stats:', err);
    } finally {
      if (!isSilent) setLoading(false);
      setRefreshing(false);
    }
  }, [selectedPortal, selectedEnglishType, dateBounds]);

  useEffect(() => {
    fetchStats(false);
    const interval = setInterval(() => {
      fetchStats(true);
    }, 45000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Action Triggers
  const handleTriggerAction = async (endpoint: string, label: string) => {
    setActionLoading(label);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/v1/feeds/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage({
          text: data.message || `${label} सफलतापूर्वक ट्रिगर हुआ!`,
          type: 'success',
        });
        setTimeout(() => fetchStats(true), 2500);
      } else {
        setActionMessage({
          text: data.message || `${label} में त्रुटि आई।`,
          type: 'error',
        });
      }
    } catch (err: any) {
      setActionMessage({ text: err.message || 'नेटवर्क त्रुटि हुई।', type: 'error' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  // Format relative timestamp
  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return 'उपलब्ध नहीं';
    try {
      const d = new Date(dateStr);
      const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
      if (diffMin < 1) return 'अभी-अभी';
      if (diffMin < 60) return `${diffMin} मिनट पहले`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr} घंटे पहले`;
      return d.toLocaleDateString('hi-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  // Filtered publishers list
  const filteredPublishers = useMemo(() => {
    if (!statsData?.publishers) return [];
    return statsData.publishers.filter((p) => {
      const q = publisherSearch.trim().toLowerCase();
      const matchesSearch = q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.groupLabel.toLowerCase().includes(q) ||
        (p.sampleHeadline && p.sampleHeadline.toLowerCase().includes(q));

      const matchesGroup = selectedPublisherGroup === 'all' || p.group === selectedPublisherGroup;
      return matchesSearch && matchesGroup;
    });
  }, [statsData?.publishers, publisherSearch, selectedPublisherGroup]);

  // Dynamic publisher group tabs based on available publishers in current portal
  const publisherGroupTabs = useMemo(() => {
    if (!statsData?.publishers) return [{ id: 'all', label: 'सभी' }];
    const groupsPresent = new Set(statsData.publishers.map(p => p.group));
    const allTabs: { id: string; label: string }[] = [{ id: 'all', label: 'सभी' }];
    
    if (groupsPresent.has('googleTrendsInternational')) {
      allTabs.push({ id: 'googleTrendsInternational', label: '⚡ Intl Trends' });
    }
    if (groupsPresent.has('googleTrendsIndia')) {
      allTabs.push({ id: 'googleTrendsIndia', label: '⚡ Trends (भारत)' });
    }
    if (groupsPresent.has('googleTrends') && !groupsPresent.has('googleTrendsInternational') && !groupsPresent.has('googleTrendsIndia')) {
      allTabs.push({ id: 'googleTrends', label: '⚡ Trends AI' });
    }
    if (groupsPresent.has('hindiTranslated')) {
      allTabs.push({ id: 'hindiTranslated', label: '🔄 The FreeLance Hindi' });
    }
    if (groupsPresent.has('bhaskar')) {
      allTabs.push({ id: 'bhaskar', label: '📰 दैनिक भास्कर' });
    }
    if (groupsPresent.has('googleNews')) {
      allTabs.push({ id: 'googleNews', label: '📡 RSS' });
    }
    if (groupsPresent.has('aajtak')) {
      allTabs.push({ id: 'aajtak', label: '📺 AajTak' });
    }
    if (groupsPresent.has('viralX')) {
      allTabs.push({ id: 'viralX', label: '🐦 Viral X' });
    }
    if (groupsPresent.has('manual')) {
      allTabs.push({ id: 'manual', label: '✍️ Desk' });
    }
    return allTabs;
  }, [statsData?.publishers]);

  // Filtered categories list
  const filteredCategories = useMemo(() => {
    if (!statsData?.categories) return [];
    return statsData.categories.filter((c) => {
      const q = categorySearch.trim().toLowerCase();
      if (!q) return true;
      return (
        c.categoryName.toLowerCase().includes(q) ||
        c.categoryNameEn.toLowerCase().includes(q) ||
        c.categorySlug.toLowerCase().includes(q) ||
        (c.sampleHeadline && c.sampleHeadline.toLowerCase().includes(q))
      );
    });
  }, [statsData?.categories, categorySearch]);

  // Calculate highest volume hour for chart scaling
  const maxHourlyVolume = useMemo(() => {
    if (!statsData?.hourly24) return 10;
    const maxVal = Math.max(...statsData.hourly24.map(h => h.total));
    return maxVal > 0 ? maxVal : 10;
  }, [statsData?.hourly24]);

  // Overall primary source
  const primarySource = useMemo(() => {
    if (!statsData?.sources || statsData.sources.length === 0) return null;
    return [...statsData.sources].sort((a, b) => b.count - a.count)[0];
  }, [statsData?.sources]);

  // Total views and human ratio
  const { totalHumanViews, totalBotViews, humanRatio } = useMemo(() => {
    if (!statsData?.sources) return { totalHumanViews: 0, totalBotViews: 0, humanRatio: 0 };
    let human = 0;
    let bot = 0;
    statsData.sources.forEach(s => {
      human += s.humanViews;
      bot += s.botViews;
    });
    const totalV = human + bot;
    const ratio = totalV > 0 ? Math.round((human / totalV) * 100) : 0;
    return { totalHumanViews: human, totalBotViews: bot, humanRatio: ratio };
  }, [statsData?.sources]);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner / Breadcrumb & Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                📊 Content Intelligence
              </span>
              {lastSyncTime && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  लाइव सिंक: {lastSyncTime}
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>सोर्स एवं पब्लिशिंग फ्रीक्वेंसी एनालिटिक्स</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              गूगल ट्रेंड्स (अंतर्राष्ट्रीय), आजतक, एक्स/ट्विटर और सिंडीकेटेड फीड्स से प्रकाशित खबरों की मात्रा, रीयल-टाइम स्पीड और पाठक सहभागिता का विस्तृत डैशबोर्ड।
            </p>
          </div>

          {/* Quick Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleTriggerAction('trigger-trends-en', 'गूगल ट्रेंड्स अंतर्राष्ट्रीय')}
              disabled={actionLoading !== null}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold shadow-md hover:shadow-orange-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <span>⚡</span>
              <span>{actionLoading === 'गूगल ट्रेंड्स अंतर्राष्ट्रीय' ? 'स्कैनिंग जारी...' : 'Scan Google Trends'}</span>
            </button>

            <button
              onClick={() => handleTriggerAction('aajtak/trigger', 'आजतक स्क्रैपर')}
              disabled={actionLoading !== null}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <span>📺</span>
              <span>{actionLoading === 'आजतक स्क्रैपर' ? 'सिंक हो रहा...' : 'Sync AajTak'}</span>
            </button>

            <button
              onClick={() => fetchStats(false)}
              disabled={refreshing}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all cursor-pointer"
              title="डेटा रीफ्रेश करें"
            >
              <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Action feedback message */}
        {actionMessage && (
          <div className={`mt-4 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            <span>{actionMessage.type === 'success' ? '✓' : '⚠️'}</span>
            <span>{actionMessage.text}</span>
          </div>
        )}
      </div>

      {/* FILTER CONTROL BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          {/* 1. Portal Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              पोर्टल फिल्टर:
            </span>
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {[
                { id: 'all', label: 'सभी पोर्टल', icon: '🌐' },
                { id: 'hindi', label: 'हिन्दी पोर्टल', icon: '🇮🇳' },
                { id: 'english', label: 'इंग्लिश पोर्टल', icon: '🌍' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedPortal(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedPortal === tab.id
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Date Range Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              अवधि (Date Range):
            </span>
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {[
                { id: 'today', label: 'आज' },
                { id: 'yesterday', label: 'कल' },
                { id: '7days', label: '7 दिन' },
                { id: '30days', label: '30 दिन' },
                { id: 'all', label: 'संपूर्ण' },
                { id: 'custom', label: 'कस्टम' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedDateRange(t.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedDateRange === t.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. English Sub-Filter (Visible when English portal is selected) */}
        {selectedPortal === 'english' && (
          <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                इंग्लिश पोर्टल सब-फिल्टर:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'संपूर्ण इंग्लिश कंटेंट', count: statsData?.englishBreakdown.totalEnglish || 0 },
                { id: 'trends', label: '⚡ केवल गूगल ट्रेंड्स एक्सक्लूसिव', count: statsData?.englishBreakdown.googleTrendsExclusive || 0 },
                { id: 'translated', label: '🔄 केवल हिन्दी से अनुवादित', count: statsData?.englishBreakdown.translated || 0 },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedEnglishType(opt.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedEnglishType === opt.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    selectedEnglishType === opt.id ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {opt.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Date Range Picker Inputs */}
        {selectedDateRange === 'custom' && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600 dark:text-slate-400">प्रारंभ तिथि:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={e => setCustomStartDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600 dark:text-slate-400">अंतिम तिथि:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={e => setCustomEndDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-xs"
              />
            </div>
            <button
              onClick={() => fetchStats(false)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition cursor-pointer"
            >
              फिल्टर लागू करें
            </button>
          </div>
        )}
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyzed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              कुल प्रकाशित सामग्री
            </span>
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-sm">
              📰
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {loading ? '...' : (statsData?.totalCount || 0).toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">स्टोरीज</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            चयनित अवधि ({statsData?.elapsedHours || 0} घंटों की विंडो में)
          </p>
        </div>

        {/* Primary Source */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              शीर्ष स्रोत (Primary)
            </span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 text-sm">
              🏆
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900 dark:text-white truncate">
              {primarySource ? `${primarySource.icon} ${primarySource.label}` : 'डाटा नहीं'}
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
            {primarySource ? `${primarySource.percentage}% मार्केट शेयर (${primarySource.count} खबरें)` : '-'}
          </p>
        </div>

        {/* Velocity / Speed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              पब्लिशिंग फ्रीक्वेंसी
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-sm">
              ⚡
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {statsData && statsData.elapsedHours > 0
                ? (statsData.totalCount / statsData.elapsedHours).toFixed(1)
                : '0.0'}
            </span>
            <span className="text-xs text-slate-500">
              खबरें / घंटा {selectedDateRange !== 'today' && selectedDateRange !== 'yesterday' ? '(अवधि औसत)' : ''}
            </span>
          </div>
          <div className="mt-2 flex flex-col gap-1 text-[11px]">
            {statsData?.liveVelocity && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800 text-[10px]">
                  🔥 24H लाइव पेस: {statsData.liveVelocity.velocity24h}/घंटा
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                  ({statsData.liveVelocity.last24hCount} खबरें/24h)
                </span>
              </div>
            )}
            <p className="text-[11px] text-slate-400">
              दैनिक औसत: ~{statsData && statsData.elapsedHours > 0 ? Math.round((statsData.totalCount / statsData.elapsedHours) * 24) : 0} खबरें/दिन
            </p>
          </div>
        </div>

        {/* Human vs Bot Ratio & Total Article Reads */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              कुल आर्टिकल पेजव्यूज
            </span>
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-sm">
              👥
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {totalHumanViews.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">मानव पेजव्यूज ({humanRatio}%)</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
            {totalBotViews.toLocaleString()} बॉट क्रॉल • <span className="text-indigo-500 font-semibold" title="Google Analytics यूनिक यूजर्स दिखाता है, जबकि यह पोर्टल के सभी आर्टिकल्स पढ़े जाने का कुल योग है">कुल पाठ (Pageviews)</span>
          </p>
        </div>
      </div>

      {/* ENGLISH PORTAL COMPOSITION BAR (Shows on All or English) */}
      {(selectedPortal === 'all' || selectedPortal === 'english') && statsData?.englishBreakdown && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🌐 इंग्लिश पोर्टल कंटेंट संरचना (English Composition Breakdown)</span>
              </h3>
              <p className="text-xs text-slate-500">
                गूगल ट्रेंड्स अंतर्राष्ट्रीय एक्सक्लूसिव और हिन्दी से अनुवादित द्विभाषी सामग्री का अनुपात
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              कुल इंग्लिश खबरें: {statsData.englishBreakdown.totalEnglish}
            </span>
          </div>

          {/* Progress Stack */}
          <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${statsData.englishBreakdown.trendsPercentage}%` }}
              className="bg-amber-500 h-full transition-all duration-500"
              title={`गूगल ट्रेंड्स: ${statsData.englishBreakdown.googleTrendsExclusive} (${statsData.englishBreakdown.trendsPercentage}%)`}
            />
            <div
              style={{ width: `${statsData.englishBreakdown.translatedPercentage}%` }}
              className="bg-indigo-600 h-full transition-all duration-500"
              title={`हिन्दी से अनुवादित: ${statsData.englishBreakdown.translated} (${statsData.englishBreakdown.translatedPercentage}%)`}
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-6 mt-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-500" />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                गूगल ट्रेंड्स एक्सक्लूसिव: {statsData.englishBreakdown.googleTrendsExclusive} खबरें ({statsData.englishBreakdown.trendsPercentage}%)
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                Target: 5/hr
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-indigo-600" />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                हिन्दी से अनुवादित (HI→EN): {statsData.englishBreakdown.translated} खबरें ({statsData.englishBreakdown.translatedPercentage}%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 1. PRIMARY SOURCE INTELLIGENCE TABLE (REPLACING CARDS WITH CLEAN LIST) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>📋 मुख्य स्रोत वर्गीकरण रिपोर्ट (Primary Source Intelligence List)</span>
            </h2>
            <p className="text-xs text-slate-500">
              सभी मुख्य स्रोतों की वॉल्यूम, पब्लिशिंग गति, मानव vs बॉट पाठक विभाजन और SEO रिपोर्ट
            </p>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            कुल स्रोत: <span className="font-bold text-slate-700 dark:text-slate-300">{statsData?.sources.length || 0}</span>
          </div>
        </div>

        {/* Source Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-3">स्रोत का नाम व विवरण</th>
                <th className="py-3 px-3 text-center">कुल खबरें</th>
                <th className="py-3 px-3 text-center">पब्लिशिंग गति</th>
                <th className="py-3 px-3 min-w-[200px]">पाठक सहभागिता (Human vs Bot)</th>
                <th className="py-3 px-3 text-center">Avg SEO</th>
                <th className="py-3 px-3">अंतिम पब्लिश</th>
                <th className="py-3 px-3 text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {statsData?.sources.map((src, idx) => {
                const isIntlTrends = src.key === 'googleTrendsInternational' || (src.key === 'googleTrends' && selectedPortal === 'english');
                const isIndiaTrends = src.key === 'googleTrendsIndia';
                const isTrends = isIntlTrends || isIndiaTrends || src.key === 'googleTrends';
                const meetsTarget = isIntlTrends ? src.hourlyFreq >= 5 : true;
                const humanPercent = src.totalViews > 0 ? Math.round((src.humanViews / src.totalViews) * 100) : 0;

                return (
                  <tr
                    key={src.key}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition ${
                      isIntlTrends
                        ? 'bg-amber-500/[0.02] dark:bg-amber-500/[0.04]'
                        : isIndiaTrends
                        ? 'bg-orange-500/[0.02] dark:bg-orange-500/[0.04]'
                        : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="py-3.5 px-3 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    {/* Source Name & Description */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                          {src.icon}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                              {src.label}
                            </span>
                            {isIntlTrends && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                                Target: 5/hr
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block line-clamp-1 mt-0.5">
                            {src.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Count & Percentage */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div className="font-black text-slate-900 dark:text-white text-base">
                        {src.count.toLocaleString()}
                      </div>
                      <div className="flex items-center justify-center gap-1.5 mt-1">
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                          {src.percentage}%
                        </span>
                        <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden inline-block">
                          <div
                            style={{ width: `${src.percentage}%` }}
                            className="bg-indigo-600 h-full rounded-full"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Velocity */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        ⚡ {src.hourlyFreq} <span className="text-[10px] text-slate-400 font-normal">/घंटा</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        ~{src.dailyFreq} <span className="text-[10px]">/दिन</span>
                      </div>
                      {isIntlTrends && (
                        <div className="mt-1">
                          {meetsTarget ? (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              ✓ कोटा सक्रिय
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                              ⚠️ कम गति
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Readers: Human vs Bot */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                        <span className="text-emerald-600 dark:text-emerald-400">
                          👤 {humanPercent}% Human ({src.humanViews.toLocaleString()})
                        </span>
                        <span className="text-slate-400 text-[10px]">
                          🤖 {src.botViews.toLocaleString()} Bots
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${humanPercent}%` }}
                          className="bg-emerald-500 h-full transition-all"
                          title={`ह्यूमन्स: ${src.humanViews} (${humanPercent}%)`}
                        />
                        <div
                          style={{ width: `${100 - humanPercent}%` }}
                          className="bg-slate-400 dark:bg-slate-600 h-full transition-all"
                          title={`सर्च बॉट्स: ${src.botViews} (${100 - humanPercent}%)`}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        कुल व्यूज: <span className="font-bold text-slate-600 dark:text-slate-300">{src.totalViews.toLocaleString()}</span>
                      </div>
                    </td>

                    {/* Avg SEO */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-lg font-bold text-xs ${
                        src.avgSeo >= 90
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {src.avgSeo}/100
                      </span>
                    </td>

                    {/* Last Published */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 text-[11px]">
                      {formatTime(src.lastPublished)}
                    </td>

                    {/* Action Filter */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedPublisherGroup(src.key);
                          const el = document.getElementById('publishers-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-bold text-[11px] transition cursor-pointer"
                      >
                        एजेंसी देखें 🔍
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. CATEGORY-WISE PUBLISHING BREAKDOWN LIST */}
      <div id="categories-section" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm scroll-mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>📂 कैटेगरी अनुसार पब्लिशिंग रिपोर्ट (Category-wise Publishing Breakdown)</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                {statsData?.categories?.length || 0} श्रेणियां
              </span>
            </div>
            <p className="text-xs text-slate-500">
              चयनित अवधि एवं पोर्टल फिल्टर के अनुसार प्रत्येक कैटेगरी में प्रकाशित खबरों की संख्या, स्पीड और पाठकों का विभाजन
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="कैटेगरी खोजें..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-200 w-48"
              />
              <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
              {categorySearch && (
                <button
                  onClick={() => setCategorySearch('')}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3 text-center w-10">#</th>
                <th className="py-3 px-3">कैटेगरी का नाम</th>
                <th className="py-3 px-3">कुल प्रकाशित खबरें</th>
                <th className="py-3 px-3">पब्लिशिंग गति</th>
                <th className="py-3 px-3">पाठक सहभागिता (Human vs Bot)</th>
                <th className="py-3 px-3 text-center">AVG SEO</th>
                <th className="py-3 px-3">अंतिम पब्लिश</th>
                <th className="py-3 px-3">ताज़ा खबर</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    कोई कैटेगरी डेटा उपलब्ध नहीं है।
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat, idx) => {
                  const humanPercent = cat.totalViews > 0 ? Math.round((cat.humanViews / cat.totalViews) * 100) : 0;
                  return (
                    <tr
                      key={cat.categorySlug}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-3 text-center font-black text-slate-400">
                        {idx + 1}
                      </td>

                      {/* Category Name & Slug */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base shrink-0">{cat.icon || '📁'}</span>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-xs">
                              {selectedPortal === 'english' ? (cat.categoryNameEn || cat.categoryName) : cat.categoryName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {selectedPortal === 'english' ? `/en/${cat.categorySlug}` : `/${cat.categorySlug}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Story Count & Percentage */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-black text-slate-900 dark:text-white">
                            {cat.count.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {cat.percentage}%
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, cat.percentage)}%` }}
                            className="bg-amber-500 h-full rounded-full"
                          />
                        </div>
                      </td>

                      {/* Publishing Speed */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {cat.hourlyFreq} <span className="text-[10px] text-slate-400 font-normal">/घंटा</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ~{cat.dailyFreq} /दिन
                        </div>
                      </td>

                      {/* Readers: Human vs Bot */}
                      <td className="py-3.5 px-3 min-w-[160px]">
                        <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                          <span className="text-emerald-600 dark:text-emerald-400">
                            👤 {humanPercent}% Human ({cat.humanViews.toLocaleString()})
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            🤖 {cat.botViews.toLocaleString()} Bots
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                          <div
                            style={{ width: `${humanPercent}%` }}
                            className="bg-emerald-500 h-full transition-all"
                            title={`ह्यूमन्स: ${cat.humanViews} (${humanPercent}%)`}
                          />
                          <div
                            style={{ width: `${100 - humanPercent}%` }}
                            className="bg-slate-400 dark:bg-slate-600 h-full transition-all"
                            title={`सर्च बॉट्स: ${cat.botViews} (${100 - humanPercent}%)`}
                          />
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          कुल व्यूज: <span className="font-bold text-slate-600 dark:text-slate-300">{cat.totalViews.toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Avg SEO */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-lg font-bold text-xs ${
                          cat.avgSeo >= 90
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {cat.avgSeo}/100
                        </span>
                      </td>

                      {/* Last Published */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 text-[11px]">
                        {formatTime(cat.lastPublished)}
                      </td>

                      {/* Latest Headline */}
                      <td className="py-3.5 px-3 max-w-[260px]">
                        {cat.sampleHeadline || cat.sampleHeadlineEn ? (
                          <Link
                            href={selectedPortal === 'english' ? `/en/${cat.categorySlug}/${cat.sampleSlug}` : `/${cat.categorySlug}/${cat.sampleSlug}`}
                            target="_blank"
                            className="text-slate-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 font-semibold line-clamp-1 text-[11px] block transition-colors"
                            title={selectedPortal === 'english' ? (cat.sampleHeadlineEn || cat.sampleHeadline) : cat.sampleHeadline}
                          >
                            {selectedPortal === 'english' ? (cat.sampleHeadlineEn || cat.sampleHeadline) : cat.sampleHeadline}
                          </Link>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. NEWS PUBLISHERS & SYNDICATION BREAKDOWN LIST (Detailed Agency Level) */}
      <div id="publishers-section" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm scroll-mt-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>📰 सिंडीकेटेड प्रकाशक एवं एजेंसियां विस्तृत लिस्ट (News Publishers Breakdown)</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {statsData?.publishers?.length || 0} प्रकाशक
              </span>
            </div>
            <p className="text-xs text-slate-500">
              दैनिक जागरण, लाइव हिन्दुस्तान, दैनिक भास्कर, आजतक, नवभारत टाइम्स आदि से आई खबरों का विस्तृत आंकड़ा
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={publisherSearch}
                onChange={e => setPublisherSearch(e.target.value)}
                placeholder="प्रकाशक खोजें (जैसे जागरण, भास्कर...)"
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 w-52 focus:w-64 transition-all outline-none"
              />
              <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
            </div>

            {/* Group Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              {publisherGroupTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedPublisherGroup(tab.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition cursor-pointer ${
                    selectedPublisherGroup === tab.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

                {/* Publishers Table - Responsive, No-cut, High-legibility */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80">
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-3">प्रकाशक / न्यूज़ एजेंसी</th>
                <th className="py-3 px-3 text-center">कुल खबरें (शेयर)</th>
                <th className="py-3 px-3 text-center">पब्लिशिंग गति</th>
                <th className="py-3 px-3 text-center">पाठक (ह्यूमन %)</th>
                <th className="py-3 px-3 text-center">SEO</th>
                <th className="py-3 px-4">हालिया शीर्षक एवं समय</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPublishers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    कोई प्रकाशक नहीं मिला।
                  </td>
                </tr>
              ) : (
                filteredPublishers.map((pub, idx) => {
                  const humanPct = pub.totalViews > 0 ? Math.round((pub.humanViews / pub.totalViews) * 100) : 0;
                  const isIntlTrends = pub.group === 'googleTrendsInternational';
                  const isIndiaTrends = pub.group === 'googleTrendsIndia';
                  const isTrends = isIntlTrends || isIndiaTrends || pub.group === 'googleTrends';
                  const isTranslated = pub.group === 'hindiTranslated';
                  const isBhaskar = pub.group === 'bhaskar';
                  const isRSS = pub.group === 'googleNews';
                  const isAajtak = pub.group === 'aajtak';
                  const isManual = pub.group === 'manual';

                  return (
                    <tr key={pub.name} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      {/* Rank */}
                      <td className="py-3 px-3 text-center font-bold text-slate-400">
                        #{idx + 1}
                      </td>

                      {/* Publisher Name + Group Badge */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">
                            {pub.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${
                            isIntlTrends
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                              : isIndiaTrends
                              ? 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30'
                              : isTranslated
                              ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30'
                              : isBhaskar
                              ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30'
                              : isRSS
                              ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30'
                              : isAajtak
                              ? 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
                              : isManual
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30'
                          }`}>
                            {pub.groupLabel}
                          </span>
                        </div>
                      </td>

                      {/* Count & Share */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="font-black text-slate-900 dark:text-white text-sm">
                          {pub.count.toLocaleString()}
                        </span>
                        <span className="ml-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                          ({pub.percentage}%)
                        </span>
                      </td>

                      {/* Velocity */}
                      <td className="py-3 px-3 text-center whitespace-nowrap text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{pub.hourlyFreq}</span>/hr · ~{pub.dailyFreq}/दिन
                      </td>

                      {/* Readers */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {pub.totalViews.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            ({humanPct}% Human)
                          </span>
                        </div>
                      </td>

                      {/* SEO */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          pub.avgSeo >= 90
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {pub.avgSeo}
                        </span>
                      </td>

                      {/* Latest Headline & Time */}
                      <td className="py-3 px-4">
                        <div className="text-slate-700 dark:text-slate-300 text-xs font-medium line-clamp-1" title={selectedPortal === 'english' ? (pub.sampleHeadlineEn || pub.sampleHeadline || '') : (pub.sampleHeadline || pub.sampleHeadlineEn || '')}>
                          {selectedPortal === 'english' ? (pub.sampleHeadlineEn || pub.sampleHeadline || '-') : (pub.sampleHeadline || pub.sampleHeadlineEn || '-')}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          ⏱️ {formatTime(pub.lastPublished)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 24-HOUR VELOCITY TIMELINE (Distribution by Ingestion Sources) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>⏱️ 24-घंटे का पब्लिशिंग रिदम (24-Hour Velocity Timeline)</span>
            </h3>
            <p className="text-xs text-slate-500">
              प्रत्येक घंटे (00:00 से 23:00 IST) के दौरान सभी स्रोतों से प्रकाशित खबरों की मात्रा
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {selectedPortal === 'english' ? (
              <>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> ⚡ Google Trends Intl
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> 🔄 The FreeLance Hindi (अनुवाद)
                </span>
              </>
            ) : selectedPortal === 'hindi' ? (
              <>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> ⚡ Trends (भारत)
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> 📡 RSS व भास्कर
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> 📺 AajTak
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> 🐦 Viral X
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> ✍️ Desk
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> ⚡ Google Trends
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> 🔄 TFL Hindi (अनुवाद)
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> 📺 AajTak
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> 🐦 Viral X
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> 📡 RSS/Desk
                </span>
              </>
            )}
          </div>
        </div>

        {/* Bar Histogram */}
        <div className="h-48 flex items-end gap-1.5 sm:gap-2 pt-6 pb-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {statsData?.hourly24.map((h, idx) => {
            const heightPercent = maxHourlyVolume > 0 ? (h.total / maxHourlyVolume) * 100 : 0;
            const isEng = selectedPortal === 'english';
            const isHin = selectedPortal === 'hindi';

            // Distribution percentages
            const intlTrendsCount = h.googleTrendsInternational || (isEng ? h.googleTrends : 0);
            const indiaTrendsCount = h.googleTrendsIndia || (isHin ? h.googleTrends : 0);
            const trendsCount = isEng ? intlTrendsCount : isHin ? indiaTrendsCount : (h.googleTrends || 0);
            const transCount = h.hindiTranslated || 0;

            const trendsPercent = h.total > 0 ? (trendsCount / h.total) * 100 : 0;
            const transPercent = h.total > 0 ? (transCount / h.total) * 100 : 0;
            const aajtakPercent = h.total > 0 ? (h.aajtak / h.total) * 100 : 0;
            const viralPercent = h.total > 0 ? (h.viralX / h.total) * 100 : 0;
            const otherPercent = Math.max(0, 100 - trendsPercent - transPercent - aajtakPercent - viralPercent);

            return (
              <div
                key={idx}
                className="flex-1 min-w-[20px] flex flex-col items-center group relative h-full justify-end"
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 bg-slate-900 text-white text-[11px] rounded-lg py-1.5 px-2.5 pointer-events-none whitespace-nowrap z-30 shadow-xl border border-slate-700">
                  <div className="font-bold text-amber-300">{h.label} IST</div>
                  <div>कुल खबरें: <strong>{h.total}</strong></div>
                  {(h.googleTrendsInternational || 0) > 0 && <div>⚡ Trends Intl: {h.googleTrendsInternational}</div>}
                  {(h.googleTrendsIndia || 0) > 0 && <div>⚡ Trends (भारत): {h.googleTrendsIndia}</div>}
                  {!h.googleTrendsInternational && !h.googleTrendsIndia && (h.googleTrends || 0) > 0 && <div>⚡ Trends: {h.googleTrends}</div>}
                  {(h.hindiTranslated || 0) > 0 && <div>🔄 TFL Hindi: {h.hindiTranslated}</div>}
                  {h.aajtak > 0 && <div>📺 AajTak: {h.aajtak}</div>}
                  {h.viralX > 0 && <div>🐦 X: {h.viralX}</div>}
                  {(h.googleNews + h.manual) > 0 && <div>📡 RSS/Desk: {h.googleNews + h.manual}</div>}
                </div>

                {/* Stacked Vertical Bar */}
                <div
                  style={{ height: `${Math.max(4, heightPercent)}%` }}
                  className="w-full max-w-[24px] rounded-t-sm flex flex-col-reverse overflow-hidden transition-all duration-300 group-hover:brightness-110"
                >
                  {isEng ? (
                    <>
                      <div style={{ height: `${trendsPercent}%` }} className="bg-amber-500 w-full" />
                      <div style={{ height: `${100 - trendsPercent}%` }} className="bg-indigo-600 w-full" />
                    </>
                  ) : isHin ? (
                    <>
                      <div style={{ height: `${trendsPercent}%` }} className="bg-orange-500 w-full" />
                      <div style={{ height: `${aajtakPercent}%` }} className="bg-red-500 w-full" />
                      <div style={{ height: `${viralPercent}%` }} className="bg-sky-500 w-full" />
                      <div style={{ height: `${otherPercent}%` }} className="bg-blue-500 w-full" />
                    </>
                  ) : (
                    <>
                      <div style={{ height: `${trendsPercent}%` }} className="bg-amber-500 w-full" />
                      <div style={{ height: `${transPercent}%` }} className="bg-indigo-600 w-full" />
                      <div style={{ height: `${aajtakPercent}%` }} className="bg-red-500 w-full" />
                      <div style={{ height: `${viralPercent}%` }} className="bg-sky-500 w-full" />
                      <div style={{ height: `${otherPercent}%` }} className="bg-blue-500 w-full" />
                    </>
                  )}
                </div>

                {/* Hour Label */}
                <span className="text-[10px] text-slate-400 mt-2 font-mono" title={`${h.label} (${h.hoursAgo || 0} घंटे पहले)`}>
                  {idx % 2 === 0 ? h.label : ''}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
          <span>⏱️ 24 घंटे पहले</span>
          <span>12 घंटे पहले</span>
          <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            वर्तमान समय (Live Now)
          </span>
        </div>
      </div>

    </div>
  );
}
