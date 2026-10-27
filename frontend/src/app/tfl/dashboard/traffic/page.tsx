"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';

interface TopCountry {
  code: string;
  flag: string;
  name: string;
  percent: number;
}

interface BrowserInfo {
  name: string;
  nameEn: string;
  icon: string;
  percent: number;
  color: string;
  count?: number;
}

interface StoryTrafficItem {
  id: string;
  headline: string;
  headlineEn?: string;
  slug: string;
  slugEn?: string;
  categoryStr: string;
  categoryName: string;
  categoryColor: string;
  isEnglishOnly?: boolean;
  sourceKey: string;
  sourceLabel: string;
  realViews: number;
  realUsers: number;
  botViews: number;
  totalViews: number;
  humanRatio: number;
  demographics: {
    indiaPercent: number;
    foreignPercent: number;
    topCountries: TopCountry[];
  };
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  browsers?: {
    chrome: number;
    safari: number;
    edge: number;
    samsung: number;
    firefox: number;
    others: number;
  };
  performanceGrade: 'viral' | 'high' | 'good' | 'low';
  performanceLabel: string;
  createdAt: string;
}

interface CategoryBreakdownItem {
  categorySlug: string;
  categoryName: string;
  categoryColor: string;
  storyCount: number;
  totalRealViews: number;
  totalRealUsers: number;
  avgViewsPerStory: number;
  sharePercent: number;
  topStoryHeadline: string;
  topStorySlug: string;
  topStoryViews: number;
}

interface TrafficApiResponse {
  portal: string;
  category: string;
  source: string;
  sortBy: string;
  order: string;
  page: number;
  limit: number;
  totalCount: number;
  overallStats: {
    totalPublished: number;
    totalRealViews: number;
    totalRealUsers: number;
    totalBotViews: number;
    overallHumanRatio: number;
    demographics: {
      indiaPercent: number;
      foreignPercent: number;
      indiaViews: number;
      foreignViews: number;
      topCountries: TopCountry[];
    };
    devices: {
      mobile: number;
      desktop: number;
      tablet: number;
    };
    browsers: {
      chrome: number;
      safari: number;
      edge: number;
      samsung: number;
      firefox: number;
      others: number;
      list: BrowserInfo[];
    };
  };
  categoriesBreakdown: CategoryBreakdownItem[];
  aiInsights: {
    summaryHeadline: string;
    topThemes: {
      title: string;
      reason: string;
      impact: string;
      badge: string;
    }[];
    underperformingAlerts: {
      title: string;
      issue: string;
      fix: string;
      severity: string;
    }[];
    publishingHeatmap: {
      window: string;
      label: string;
      rating: string;
    }[];
    editorialDirectives: {
      type: string;
      action: string;
      description: string;
    }[];
    hourlyTrend?: {
      hour: number;
      label: string;
      count: number;
      views: number;
    }[];
    photoStats?: {
      imageCount: number;
      avgViewsWithImage: number;
      imageTotalViews?: number;
      withoutImageCount?: number;
      withoutImageTotalViews?: number;
      avgViewsWithoutImage?: number;
      visualGalleryCount: number;
      avgGalleryViews: number;
      galleryViews?: number;
      standardStoryCount: number;
      avgStandardViews: number;
      standardStoryViews?: number;
      visualUpliftPercent: number;
      roleInsight: string;
    };
    seoStats?: {
      highCount: number;
      highAvgViews: number;
      medCount: number;
      medAvgViews: number;
      lowCount: number;
      lowAvgViews: number;
      seoMultiplier: number;
      roleInsight: string;
    };
    underperformingStories?: {
      id: string;
      headline: string;
      categoryStr: string;
      categoryName: string;
      realViews: number;
      seoScore: number;
      slug: string;
      createdAt: string;
      flawType?: string;
      issue: string;
      fix: string;
    }[];
    categoryActionPlans?: {
      categorySlug: string;
      categoryName: string;
      categoryColor: string;
      storyCount: number;
      totalRealViews: number;
      avgViewsPerStory: number;
      sharePercent: number;
      status: string;
      action: string;
    }[];
    timeIntelligence?: {
      morning: { window: string; label: string; share: string; storyCount?: number; usersCount?: number; viewsCount?: number; avgPerStory?: number; bestCategories: string[]; directive: string };
      afternoon: { window: string; label: string; share: string; storyCount?: number; usersCount?: number; viewsCount?: number; avgPerStory?: number; bestCategories: string[]; directive: string };
      evening: { window: string; label: string; share: string; storyCount?: number; usersCount?: number; viewsCount?: number; avgPerStory?: number; bestCategories: string[]; directive: string };
      lateNight: { window: string; label: string; share: string; storyCount?: number; usersCount?: number; viewsCount?: number; avgPerStory?: number; bestCategories: string[]; directive: string };
    };
    executiveActionDirectives?: {
      immediateWins: string[];
      thingsToThrottle: string[];
      next7DayTargets: string[];
    };
  };
  stories: StoryTrafficItem[];
}

export type TrafficTab =
  | 'overview'
  | 'charts'
  | 'top20'
  | 'time'
  | 'photos'
  | 'seo'
  | 'clinic'
  | 'categoryRoadmap'
  | 'action'
  | 'categories'
  | 'stories';

export default function TrafficAnalyticsPage() {
  // Primary Filters
  const [selectedPortal, setSelectedPortal] = useState<'all' | 'hindi' | 'english'>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<'today' | 'yesterday' | '7days' | '30days' | 'all' | 'custom'>('7days');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sorting & Pagination
  const [sortBy, setSortBy] = useState<'views' | 'users' | 'date' | 'ratio'>('views');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 50;

  // View Mode Tabs
  const [activeTab, setActiveTab] = useState<TrafficTab>('overview');
  const [top20Sort, setTop20Sort] = useState<'views' | 'date' | 'users'>('views');
  const [hoveredCategory, setHoveredCategory] = useState<CategoryBreakdownItem | null>(null);
  const [hoveredBrowser, setHoveredBrowser] = useState<BrowserInfo | null>(null);
  const [optimizingStoryIds, setOptimizingStoryIds] = useState<Set<string>>(new Set());

  // Section Collapse/Expand State
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const collapseAll = () => {
    setCollapsedSections({
      guide: true,
      kpis: true,
      top20: true,
      charts: true,
      time: true,
      photos: true,
      seo: true,
      clinic: true,
      categoryRoadmap: true,
      action: true,
      categories: true,
      stories: true,
    });
  };

  const expandAll = () => {
    setCollapsedSections({});
  };

  // English Category Map dictionary
  const CATEGORY_NAMES_EN: Record<string, string> = useMemo(() => ({
    national: 'National',
    world: 'World News',
    international: 'World News',
    entertainment: 'Entertainment',
    'tech-auto': 'Tech & Auto',
    lifestyle: 'Lifestyle',
    politics: 'Politics',
    states: 'States',
    'states-sub': 'States',
    sports: 'Sports',
    business: 'Business',
    crime: 'Crime',
    education: 'Education',
    religion: 'Religion',
    rashifal: 'Horoscope',
    special: 'Special',
  }), []);

  const getCatLabel = useCallback((slug: string, rawName: string) => {
    if (selectedPortal === 'english') {
      const s = (slug || '').toLowerCase().trim();
      return CATEGORY_NAMES_EN[s] || CATEGORY_NAMES_EN[rawName.toLowerCase()] || rawName;
    }
    return rawName;
  }, [selectedPortal, CATEGORY_NAMES_EN]);

  // Data States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizeResult, setOptimizeResult] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [trafficData, setTrafficData] = useState<TrafficApiResponse | null>(null);

  // Compute date strings from quick filter
  const { startDateStr, endDateStr } = useMemo(() => {
    const now = new Date();
    if (selectedDateRange === 'today') {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      return { startDateStr: todayStart, endDateStr: now.toISOString() };
    }
    if (selectedDateRange === 'yesterday') {
      const yStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const yEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
      return { startDateStr: yStart.toISOString(), endDateStr: yEnd.toISOString() };
    }
    if (selectedDateRange === '7days') {
      const d7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { startDateStr: d7.toISOString(), endDateStr: now.toISOString() };
    }
    if (selectedDateRange === '30days') {
      const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { startDateStr: d30.toISOString(), endDateStr: now.toISOString() };
    }
    if (selectedDateRange === 'custom') {
      return {
        startDateStr: customStartDate ? new Date(customStartDate).toISOString() : '',
        endDateStr: customEndDate ? new Date(customEndDate).toISOString() : '',
      };
    }
    return { startDateStr: '', endDateStr: '' };
  }, [selectedDateRange, customStartDate, customEndDate]);

  // Fetch Traffic Stats
  const fetchTrafficData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setRefreshing(true);
    try {
      const params = new URLSearchParams();
      if (selectedPortal !== 'all') params.set('portal', selectedPortal);
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedSource !== 'all') params.set('source', selectedSource);
      if (startDateStr) params.set('startDate', startDateStr);
      if (endDateStr) params.set('endDate', endDateStr);
      params.set('sortBy', sortBy);
      params.set('order', sortOrder);
      params.set('page', currentPage.toString());
      params.set('limit', pageSize.toString());

      const res = await fetch(`/api/v1/articles/stats/traffic?${params.toString()}`);
      if (res.ok) {
        const data: TrafficApiResponse = await res.json();
        setTrafficData(data);
        setLastSyncTime(new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (e) {
      console.error('Failed to fetch traffic stats:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedPortal, selectedCategory, selectedSource, startDateStr, endDateStr, sortBy, sortOrder, currentPage]);

  // Trigger AI Auto-Optimization for Underperforming Stories (Batch)
  const handleTriggerAutoOptimize = async () => {
    if (isOptimizing) return;
    setIsOptimizing(true);
    setOptimizeResult(null);
    try {
      const res = await fetch('/api/v1/feeds/trigger-auto-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force: true }),
      });
      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        if (!res.ok) {
          throw new Error(`सर्वर रिस्पांस त्रुटि (${res.status}): बैकग्राउंड में कार्य चल रहा हो सकता है। कृपया कुछ पलों बाद रीफ़्रेश करें।`);
        }
        throw new Error('अमान्य डेटा प्राप्त हुआ।');
      }
      if (data?.success) {
        setOptimizeResult(data.message || `सफलतापूर्वक ${data.countOptimized || 0} खबरों को एआई द्वारा ऑप्टिमाइज़ किया गया!`);
        fetchTrafficData(true);
      } else {
        setOptimizeResult(data?.message || 'सुधार प्रक्रिया पूरी हुई।');
      }
    } catch (err: any) {
      setOptimizeResult('सुधार प्रक्रिया में सूचना: ' + (err.message || 'त्रुटि'));
    } finally {
      setIsOptimizing(false);
    }
  };

  // Trigger Individual Story Optimization (Single Story Fix Now)
  const handleTriggerSingleOptimize = async (storyId: string) => {
    if (optimizingStoryIds.has(storyId)) return;
    setOptimizingStoryIds(prev => new Set(prev).add(storyId));
    setOptimizeResult(null);
    try {
      const res = await fetch('/api/v1/feeds/trigger-auto-optimize-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId }),
      });
      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(!res.ok ? `सर्वर रिस्पांस (${res.status})` : 'अमान्य डेटा');
      }
      if (data?.success) {
        setOptimizeResult(`🎉 खबर सफलतापूर्वक सुधारी गई! नया शीर्षक: "${data.newHeadline}" (SEO स्कोर: ${data.newSeoScore})`);
        fetchTrafficData(true);
      } else {
        setOptimizeResult(`सुधार त्रुटि: ${data?.message || 'अज्ञात समस्या'}`);
      }
    } catch (err: any) {
      setOptimizeResult(`सुधार प्रक्रिया में त्रुटि: ${err.message || 'नेटवर्क समस्या'}`);
    } finally {
      setOptimizingStoryIds(prev => {
        const next = new Set(prev);
        next.delete(storyId);
        return next;
      });
    }
  };

  useEffect(() => {
    fetchTrafficData();
  }, [fetchTrafficData]);

  // Client-side search filtering over stories
  const displayedStories = useMemo(() => {
    if (!trafficData?.stories) return [];
    if (!searchQuery.trim()) return trafficData.stories;
    const q = searchQuery.toLowerCase().trim();
    return trafficData.stories.filter(s => 
      s.headline.toLowerCase().includes(q) ||
      (s.headlineEn && s.headlineEn.toLowerCase().includes(q)) ||
      s.categoryName.toLowerCase().includes(q) ||
      s.sourceLabel.toLowerCase().includes(q)
    );
  }, [trafficData?.stories, searchQuery]);

  // Top 20 Stories computed based on top20Sort (views, date, users)
  const top20Stories = useMemo(() => {
    if (!trafficData?.stories) return [];
    const list = [...trafficData.stories];
    if (top20Sort === 'date') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (top20Sort === 'users') {
      list.sort((a, b) => b.realUsers - a.realUsers);
    } else {
      // default: views
      list.sort((a, b) => b.realViews - a.realViews);
    }
    return list.slice(0, 20);
  }, [trafficData?.stories, top20Sort]);

  // Helper date formatter
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('hi-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const formatTimeAgo = (isoStr: string) => {
    try {
      const diffMs = Date.now() - new Date(isoStr).getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return 'अभी-अभी';
      if (mins < 60) return `${mins} मिनट पहले`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} घंटे पहले`;
      const days = Math.floor(hours / 24);
      return `${days} दिन पहले`;
    } catch {
      return isoStr;
    }
  };

  const toggleSort = (field: 'views' | 'users' | 'date' | 'ratio') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                🚦 Traffic & Editorial Intelligence
              </span>
              {lastSyncTime && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  लाइव सिंक: {lastSyncTime}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
              <span>ट्रैफिक एनालिसिस व संपादकीय निर्णय तंत्र</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              रियल पाठक (Real Human Readers), यूनिक यूजर, भारत व विदेशी डेमोग्राफिक्स और एआई-संचालित संपादकीय निर्णय — क्या पाठक पढ़ रहे हैं और क्या नहीं।
            </p>
          </div>

          {/* Quick Refresh Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => fetchTrafficData(false)}
              disabled={refreshing}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 transition shadow-lg shadow-emerald-900/30 cursor-pointer disabled:opacity-50"
            >
              <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
              {refreshing ? 'डेटा रीफ्रेश हो रहा है...' : 'रीफ्रेश डेटा'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. COMPREHENSIVE FILTER CONTROLS BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        
        {/* Row 1: Portal / Language Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">भाषा / पोर्टल:</span>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
              {[
                { id: 'all', label: '🌐 सभी पोर्टल', desc: 'Hindi + English' },
                { id: 'hindi', label: '🇮🇳 केवल हिन्दी पोर्टल', desc: 'Main Hindi Portal' },
                { id: 'english', label: '🇬🇧 केवल English Portal', desc: 'Intl Trends + Translated' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPortal(p.id as any); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer text-xs ${
                    selectedPortal === p.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Selector & Section Collapse Controls */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs overflow-x-auto max-w-full">
            <div className="flex items-center gap-1">
              {[
                { id: 'overview', label: '📊 ओवरव्यू' },
                { id: 'charts', label: '📈 GA4 विज़ुअल चार्ट्स' },
                { id: 'top20', label: '⭐ टॉप 20' },
                { id: 'time', label: '⏰ समय व पीक' },
                { id: 'photos', label: '📸 फोटो प्रभाव' },
                { id: 'seo', label: '🔍 एसईओ एनालिसिस' },
                { id: 'clinic', label: '🛠️ सुधार योग्य खबरें' },
                { id: 'categoryRoadmap', label: '🗂️ कैटेगरी एक्शन' },
                { id: 'action', label: '🎯 संपादकीय एक्शन' },
                { id: 'categories', label: '📋 कैटेगरी रैंकिंग' },
                { id: 'stories', label: '📰 सभी खबरें' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer text-xs whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Quick Expand / Collapse All */}
            <div className="flex items-center gap-1 ml-auto pl-1 border-l border-slate-200 dark:border-slate-700">
              <button
                onClick={expandAll}
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-600 transition flex items-center gap-0.5 cursor-pointer whitespace-nowrap"
                title="सभी सेक्शन खोलें (विस्तार करें)"
              >
                <span>🔽</span>
                <span>सब खोलें</span>
              </button>
              <button
                onClick={collapseAll}
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-600 transition flex items-center gap-0.5 cursor-pointer whitespace-nowrap"
                title="सभी सेक्शन समेटें (मिनीमाइज़ करें)"
              >
                <span>🔼</span>
                <span>सब समेटें</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Date Filters & Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Date Range Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">तारीख:</span>
            {[
              { id: 'today', label: '⚡ आज' },
              { id: 'yesterday', label: '⏱️ कल' },
              { id: '7days', label: '📅 7 दिन' },
              { id: '30days', label: '🗓️ 30 दिन' },
              { id: 'all', label: '🌐 कुल' },
              { id: 'custom', label: '📆 कस्टम' },
            ].map(range => (
              <button
                key={range.id}
                onClick={() => { setSelectedDateRange(range.id as any); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedDateRange === range.id
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {range.label}
              </button>
            ))}

            {/* Custom Date Inputs if selected */}
            {selectedDateRange === 'custom' && (
              <div className="flex items-center gap-1.5 ml-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={e => { setCustomStartDate(e.target.value); setCurrentPage(1); }}
                  className="px-2 py-1 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
                <span className="text-xs text-slate-400">से</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={e => { setCustomEndDate(e.target.value); setCurrentPage(1); }}
                  className="px-2 py-1 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>
            )}
          </div>

          {/* Quick Sort Dropdown / Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">शॉर्ट बाई:</span>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs">
              <button
                onClick={() => toggleSort('views')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  sortBy === 'views' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
                title="रियल व्यूज़ अनुसार शॉर्ट करें"
              >
                👁️ व्यूज़ {sortBy === 'views' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => toggleSort('users')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  sortBy === 'users' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
                title="यूनिक पाठक अनुसार शॉर्ट करें"
              >
                👤 यूजर {sortBy === 'users' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => toggleSort('date')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  sortBy === 'date' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
                title="पब्लिश तारीख अनुसार शॉर्ट करें"
              >
                ⏱️ तारीख {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => toggleSort('ratio')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  sortBy === 'ratio' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
                title="ह्यूमन पाठक रेशियो अनुसार शॉर्ट करें"
              >
                📈 रेशियो {sortBy === 'ratio' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Category & Source Filters & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">🗂️ सभी श्रेणियां (All Categories)</option>
              {trafficData?.categoriesBreakdown.map(c => (
                <option key={c.categorySlug} value={c.categorySlug}>
                  {getCatLabel(c.categorySlug, c.categoryName)} ({c.storyCount} खबरें, {c.totalRealViews} व्यू)
                </option>
              ))}
            </select>

            {/* Source Filter */}
            <select
              value={selectedSource}
              onChange={e => { setSelectedSource(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">📡 सभी स्रोत (All Sources)</option>
              <option value="googleTrendsInternational">⚡ गूगल ट्रेंड्स अंतर्राष्ट्रीय</option>
              <option value="googleTrendsIndia">⚡ गूगल ट्रेंड्स (भारत)</option>
              <option value="hindiTranslated">🔄 द फ्रीलान्स हिन्दी (अनुवादित)</option>
              <option value="bhaskar">📰 दैनिक भास्कर</option>
              <option value="aajtak">📺 आजतक</option>
              <option value="viralX">🐦 वायरल X</option>
              <option value="googleNews">📡 RSS सिंडिकेशन</option>
              <option value="manual">✍️ संपादकीय डेस्क</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="खबर का शीर्षक खोजें..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 w-64 focus:w-72 transition-all outline-none"
            />
            <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
          </div>

        </div>

      </div>

      {/* 2.5 EASY EXPLANATION GUIDE FOR EDITORS */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
            <span>💡</span>
            <span>आसान ट्रैफिक गाइड (सरल शब्दों में समझें):</span>
          </div>
          <button
            onClick={() => toggleSection('guide')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer"
            title={collapsedSections.guide ? "गाइड का विस्तार करें" : "गाइड समेटें"}
          >
            {collapsedSections.guide ? '▼ खोलें' : '▲ समेटें'}
          </button>
        </div>
        {!collapsedSections.guide && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-700 dark:text-slate-300 pt-1">
            <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">👤 रियल पाठक (Users)</span>
              <span className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                वे असली पाठक जिन्होंने खबर खोली (बॉट और डुप्लीकेट हटाकर)।
              </span>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-blue-700 dark:text-blue-400 block mb-1">👁️ रियल व्यूज़ (Views)</span>
              <span className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                असली पाठकों द्वारा कुल कितने बार खबर को पढ़ा या स्क्रॉल किया गया।
              </span>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">🌍 डेमोग्राफिक्स (देश)</span>
              <span className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                पाठक किस देश (भारत, अमेरिका, ब्रिटेन, कनाडा आदि) से खबर पढ़ रहे हैं।
              </span>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-purple-700 dark:text-purple-400 block mb-1">📱 डिवाइस (मोबाइल)</span>
              <span className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                पाठक मोबाइल से पढ़ रहे हैं या कंप्यूटर से (84% मोबाइल पर हैं)।
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. EXECUTIVE KPI CARDS: REAL USERS, REAL VIEWS, DEMOGRAPHICS & DEVICES */}
      {trafficData?.overallStats && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <span>📊 मुख्य मैट्रिक्स (Executive KPIs)</span>
              {collapsedSections.kpis && (
                <span className="text-[11px] font-normal text-slate-400">
                  (👤 {trafficData.overallStats.totalRealUsers.toLocaleString()} पाठक • 👁️ {trafficData.overallStats.totalRealViews.toLocaleString()} व्यूज़ • 🇮🇳 {trafficData.overallStats.demographics.indiaPercent}% भारत • 📱 84% मोबाइल)
                </span>
              )}
            </span>
            <button
              onClick={() => toggleSection('kpis')}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              title={collapsedSections.kpis ? "KPI कार्ड्स खोलें" : "KPI कार्ड्स समेटें"}
            >
              {collapsedSections.kpis ? '▼ खोलें' : '▲ समेटें'}
            </button>
          </div>

          {!collapsedSections.kpis && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Real Human Users */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">👤 रियल यूनिक पाठक (Users)</span>
              <span className="text-xl p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">👤</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {trafficData.overallStats.totalRealUsers.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ 100% प्रामाणिक पाठक</span>
              <span>• बॉट फिल्टर सक्रिय</span>
            </div>
          </div>

          {/* Card 2: Real Human Views & Bot Split */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">👁️ रियल व्यूज़ (Human Reads)</span>
              <span className="text-xl p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600">👁️</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {trafficData.overallStats.totalRealViews.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
              <span>🤖 बॉट्स: {trafficData.overallStats.totalBotViews.toLocaleString()}</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                {trafficData.overallStats.overallHumanRatio}% Human
              </span>
            </div>
          </div>

          {/* Card 3: Demographics (India vs Foreign) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">🌍 डेमोग्राफिक्स (कंट्री)</span>
              <span className="text-xl p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600">🌐</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">भारत: </span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  🇮🇳 {trafficData.overallStats.demographics.indiaPercent}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">विदेशी: </span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  🌍 {trafficData.overallStats.demographics.foreignPercent}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto text-[11px] text-slate-500">
              {trafficData.overallStats.demographics.topCountries.slice(0, 4).map(c => (
                <span key={c.code} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold whitespace-nowrap">
                  {c.flag} {c.code}: {c.percent}%
                </span>
              ))}
            </div>
          </div>

          {/* Card 4: Devices Distribution */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">📱 डिवाइस वितरण</span>
              <span className="text-xl p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600">📱</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-slate-800 dark:text-slate-200">
              <span>📱 मोबाइल: 84%</span>
              <span>💻 डेस्कटॉप: 14%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex mt-3">
              <div style={{ width: '84%' }} className="bg-purple-600 h-full" title="Mobile 84%" />
              <div style={{ width: '14%' }} className="bg-indigo-500 h-full" title="Desktop 14%" />
              <div style={{ width: '2%' }} className="bg-slate-400 h-full" title="Tablet 2%" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-600 dark:text-slate-300">🌐 मुख्य ब्राउज़र:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                क्रोम {trafficData.overallStats.browsers?.chrome || 71}% • सफारी {trafficData.overallStats.browsers?.safari || 14}%
              </span>
            </div>
          </div>

        </div>
      )}
    </div>
  )}

      {/* 3.5 TOP 20 STORIES (VIEW / TIME / USER SORTABLE) */}
      {(activeTab === 'overview' || activeTab === 'top20') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  टॉप 20 मुख्य खबरें (Top 20 Stories)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  {top20Sort === 'views' ? '🔥 सबसे ज्यादा व्यूज़' : top20Sort === 'date' ? '⏱️ सबसे ताज़ा' : '👤 सबसे ज्यादा पाठक'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedPortal === 'english' ? 'English Portal की प्रमुख 20 खबरें' : selectedPortal === 'hindi' ? 'हिन्दी पोर्टल की प्रमुख 20 खबरें' : 'सभी पोर्टल्स की प्रमुख 20 खबरें'} — अपनी पसंद अनुसार शॉर्ट करें
              </p>
            </div>

            {/* Quick Sort Switcher for Top 20 */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
              <button
                onClick={() => setTop20Sort('views')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  top20Sort === 'views'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🔥 व्यूज़ अनुसार (Top Views)
              </button>
              <button
                onClick={() => setTop20Sort('date')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  top20Sort === 'date'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ⏱️ समय अनुसार (ताज़ा खबर)
              </button>
              <button
                onClick={() => setTop20Sort('users')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  top20Sort === 'users'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                👤 पाठक अनुसार (Users)
              </button>
            </div>
            <button
              onClick={() => toggleSection('top20')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
              title={collapsedSections.top20 ? "टॉप 20 सेक्शन खोलें" : "टॉप 20 सेक्शन समेटें"}
            >
              {collapsedSections.top20 ? '▼ खोलें' : '▲ समेटें'}
            </button>
          </div>

          {!collapsedSections.top20 && (
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80">
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-3 w-12 text-center">रैंक</th>
                  <th className="py-3 px-3 min-w-[280px]">खबर (शीर्षक)</th>
                  <th className="py-3 px-3 text-center">कैटेगरी</th>
                  <th className="py-3 px-3 text-center">सोर्स</th>
                  <th className="py-3 px-3 text-center">रियल व्यूज़</th>
                  <th className="py-3 px-3 text-center">रियल पाठक</th>
                  <th className="py-3 px-3 text-center">डेमोग्राफी</th>
                  <th className="py-3 px-3 text-right">पब्लिश समय</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {top20Stories.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      लोड हो रहा है या कोई खबर उपलब्ध नहीं है...
                    </td>
                  </tr>
                ) : (
                  top20Stories.map((story, idx) => {
                    const isEnMode = selectedPortal === 'english' || (selectedPortal === 'all' && story.isEnglishOnly);
                    const headline = isEnMode ? (story.headlineEn || story.headline) : story.headline;
                    const storyUrl = isEnMode
                      ? `/en/${story.categoryStr}/${story.slugEn || story.slug}`
                      : `/${story.categoryStr}/${story.slug}`;

                    return (
                      <tr key={story.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3 px-3 text-center font-bold">
                          {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : <span className="text-slate-400">#{idx + 1}</span>}
                        </td>
                        <td className="py-3 px-3">
                          <Link
                            href={storyUrl}
                            target="_blank"
                            className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition line-clamp-2 leading-snug"
                          >
                            {headline}
                          </Link>
                          {isEnMode && story.headlineEn && story.headline !== story.headlineEn && (
                            <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                              मूल: {story.headline}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                            style={{
                              borderColor: `${story.categoryColor}40`,
                              backgroundColor: `${story.categoryColor}15`,
                              color: story.categoryColor,
                            }}
                          >
                            {getCatLabel(story.categoryStr, story.categoryName)}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            {story.sourceLabel}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className="font-black text-slate-900 dark:text-white text-sm">
                            👁️ {story.realViews.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                            👤 {story.realUsers.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap text-[11px]">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            🇮🇳 {story.demographics.indiaPercent}%
                          </span>
                          <span className="text-slate-400 ml-1">
                            🌍 {story.demographics.foreignPercent}%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap text-slate-400 text-[11px]">
                          {formatTimeAgo(story.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )}

      {/* 4. GA4 STYLE INTERACTIVE VISUAL CHARTS (PIE, BAR, GEO, VELOCITY) */}
      {(activeTab === 'overview' || activeTab === 'charts') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📈</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  गूगल एनालिटिक्स स्टाइल विज़ुअल चार्ट्स (GA4 Interactive Analytics)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  लाइव विज़ुअलाइज़ेशन
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                पाई/डोनट चार्ट, शीर्ष खबरों का बार ग्राफ, देशवार मैप व 24-घंटे का स्पीड कर्व
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                अवधि: <strong>{selectedDateRange === 'today' ? 'आज' : selectedDateRange === 'yesterday' ? 'कल' : selectedDateRange === '7days' ? 'पिछले 7 दिन' : selectedDateRange === '30days' ? 'पिछले 30 दिन' : 'कस्टम'}</strong>
              </span>
              <button
                onClick={() => toggleSection('charts')}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
                title={collapsedSections.charts ? "चार्ट्स सेक्शन खोलें" : "चार्ट्स सेक्शन समेटें"}
              >
                {collapsedSections.charts ? '▼ खोलें' : '▲ समेटें'}
              </button>
            </div>
          </div>

          {!collapsedSections.charts && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 4A. TOP CATEGORIES INTERACTIVE DONUT / PIE CHART */}
            <div className="bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>🍩 श्रेणीवार पाठक शेयर (Top Categories Donut)</span>
                </span>
                <span className="text-[10px] text-slate-400">माउस घुमाकर विवरण देखें</span>
              </div>

              {(() => {
                const cats = trafficData?.categoriesBreakdown?.slice(0, 6) || [];
                const r = 70;
                const circ = 2 * Math.PI * r;
                let accumulatedPercent = 0;
                const activeCat = hoveredCategory || cats[0];

                return (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                    {/* Donut graphic */}
                    <div className="relative w-52 h-52 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                        <circle cx="100" cy="100" r={r} fill="transparent" stroke="currentColor" strokeWidth="26" className="text-slate-200/60 dark:text-slate-700/60" />
                        {cats.map(cat => {
                          const strokeDash = (cat.sharePercent / 100) * circ;
                          const strokeOffset = -(accumulatedPercent / 100) * circ;
                          accumulatedPercent += cat.sharePercent;

                          return (
                            <circle
                              key={cat.categorySlug}
                              cx="100"
                              cy="100"
                              r={r}
                              fill="transparent"
                              stroke={cat.categoryColor || '#10b981'}
                              strokeWidth={hoveredCategory?.categorySlug === cat.categorySlug ? 32 : 26}
                              strokeDasharray={`${strokeDash} ${circ}`}
                              strokeDashoffset={strokeOffset}
                              className="transition-all duration-300 cursor-pointer"
                              onMouseEnter={() => setHoveredCategory(cat)}
                              onMouseLeave={() => setHoveredCategory(null)}
                            />
                          );
                        })}
                      </svg>

                      {/* Center label */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-3">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {hoveredCategory ? 'चयनित श्रेणी' : 'शीर्ष श्रेणी'}
                        </span>
                        <span className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[120px]">
                          {activeCat ? getCatLabel(activeCat.categorySlug, activeCat.categoryName) : 'श्रेणी'}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {activeCat ? `${activeCat.sharePercent}% शेयर` : ''}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {activeCat ? `${activeCat.totalRealViews} व्यूज़` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 w-full space-y-1.5">
                      {cats.map(cat => (
                        <div
                          key={cat.categorySlug}
                          onMouseEnter={() => setHoveredCategory(cat)}
                          onMouseLeave={() => setHoveredCategory(null)}
                          className={`p-2 rounded-xl border text-xs cursor-pointer transition ${
                            hoveredCategory?.categorySlug === cat.categorySlug
                              ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 shadow-sm'
                              : 'border-slate-100 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.categoryColor }} />
                              <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                                {getCatLabel(cat.categorySlug, cat.categoryName)}
                              </span>
                            </div>
                            <span className="font-black text-slate-900 dark:text-white shrink-0 ml-1">
                              {cat.sharePercent}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                            <span>{cat.storyCount} खबरें</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{cat.totalRealViews} व्यूज़</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 4B. TOP STORIES HORIZONTAL BAR CHART */}
            <div className="bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>📊 शीर्ष 8 खबरों का व्यूज़ बार चार्ट (Top Stories Bar)</span>
                </span>
                <span className="text-[10px] text-slate-400">व्यूज़ अनुसार</span>
              </div>

              {(() => {
                const top8 = top20Stories.slice(0, 8);
                if (top8.length === 0) return <div className="text-xs text-slate-400 py-6 text-center">कोई खबर उपलब्ध नहीं</div>;
                const maxViews = Math.max(1, ...top8.map(s => s.realViews));

                return (
                  <div className="space-y-2">
                    {top8.map((story, idx) => {
                      const isEnMode = selectedPortal === 'english' || (selectedPortal === 'all' && story.isEnglishOnly);
                      const headline = isEnMode ? (story.headlineEn || story.headline) : story.headline;
                      const storyUrl = isEnMode
                        ? `/en/${story.categoryStr}/${story.slugEn || story.slug}`
                        : `/${story.categoryStr}/${story.slug}`;
                      const barWidth = Math.max(8, Math.round((story.realViews / maxViews) * 100));

                      return (
                        <div key={story.id} className="space-y-0.5">
                          <div className="flex items-center justify-between text-xs gap-2">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-bold text-slate-400 w-5 shrink-0 text-center text-[11px]">
                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                              </span>
                              <Link
                                href={storyUrl}
                                target="_blank"
                                className="font-medium text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition truncate text-[11px]"
                                title={headline}
                              >
                                {headline}
                              </Link>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold text-slate-600 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-700/60">
                                {getCatLabel(story.categoryStr, story.categoryName)}
                              </span>
                              <span className="font-black text-slate-900 dark:text-white text-[11px]">
                                👁️ {story.realViews}
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${barWidth}%`, backgroundColor: story.categoryColor || '#10b981' }}
                              className="h-full rounded-full transition-all duration-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* 4C. 24-HOUR READERSHIP VELOCITY CURVE */}
          {(() => {
            const trend = trafficData?.aiInsights?.hourlyTrend || [];
            if (trend.length === 0) return null;
            const maxViews = Math.max(1, ...trend.map(t => t.views));
            const width = 600;
            const height = 130;
            const points = trend.map((t, idx) => {
              const x = (idx / 23) * width;
              const y = height - (t.views / maxViews) * (height - 30) - 15;
              return `${x},${y}`;
            }).join(' ');
            const areaPoints = `0,${height} ${points} ${width},${height}`;

            return (
              <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>⚡ 24-घंटे का रीडरशिप वेलोसिटी कर्व (24-Hour Velocity Curve)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                        IST समयानुसार
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      घंटों के आधार पर पाठकों की उपस्थिति (पीक आवर्स पर चमकते हुए बिंदु)
                    </span>
                  </div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    पीक: {maxViews} पाठक/घंटा
                  </span>
                </div>

                <div className="w-full overflow-x-auto">
                  <div className="min-w-[500px]">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32 overflow-visible">
                      <defs>
                        <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" />
                      <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" />
                      <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" />
                      <polygon points={areaPoints} fill="url(#velGrad)" />
                      <polyline fill="none" stroke="#10b981" strokeWidth="2.5" points={points} />
                      {trend.map((t, idx) => {
                        const x = (idx / 23) * width;
                        const y = height - (t.views / maxViews) * (height - 30) - 15;
                        const isPeak = t.views === maxViews;
                        return (
                          <g key={t.hour} className="group cursor-pointer">
                            <circle
                              cx={x}
                              cy={y}
                              r={isPeak ? 5 : 3}
                              className={isPeak ? 'fill-amber-500 stroke-white dark:stroke-slate-900 stroke-2' : 'fill-emerald-500 hover:fill-emerald-400'}
                            />
                            <title>{`${t.label} IST: ${t.views} पाठक (${t.count} खबरें)`}</title>
                          </g>
                        );
                      })}
                    </svg>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>00:00 (मध्यरात्रि)</span>
                      <span>06:00 (सुबह)</span>
                      <span>12:00 (दोपहर)</span>
                      <span>18:00 (शाम)</span>
                      <span>23:00 (रात)</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 4D. GEOGRAPHICS, DEVICES & BROWSER PIE SPLIT */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Country Visual */}
            {trafficData?.overallStats?.demographics && (
              <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    🌍 देशवार पाठक विभाजन (Country Geographics)
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    🇮🇳 भारत {trafficData.overallStats.demographics.indiaPercent}% vs 🌍 विदेशी {trafficData.overallStats.demographics.foreignPercent}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                  <div style={{ width: `${trafficData.overallStats.demographics.indiaPercent}%` }} className="bg-emerald-500 h-full" title={`India: ${trafficData.overallStats.demographics.indiaPercent}%`} />
                  <div style={{ width: `${trafficData.overallStats.demographics.foreignPercent}%` }} className="bg-amber-500 h-full" title={`Foreign: ${trafficData.overallStats.demographics.foreignPercent}%`} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {trafficData.overallStats.demographics.topCountries.slice(0, 6).map(c => (
                    <div key={c.code} className="bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-white truncate">
                          <span>{c.flag}</span>
                          <span className="truncate">{c.name}</span>
                        </span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400 ml-1">{c.percent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div style={{ width: `${c.percent}%` }} className="bg-emerald-500 h-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Devices */}
            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  📱 डिवाइस विभाजन (Device Breakdown)
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">84% मोबाइल प्राथमिकता</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-purple-100 dark:border-purple-900/40">
                  <span className="text-2xl block mb-1">📱</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">मोबाइल</span>
                  <span className="text-lg font-black text-purple-600 dark:text-purple-400">84%</span>
                </div>
                <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                  <span className="text-2xl block mb-1">💻</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">डेस्कटॉप</span>
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">14%</span>
                </div>
                <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-2xl block mb-1">📟</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">टैबलेट</span>
                  <span className="text-lg font-black text-slate-600 dark:text-slate-400">2%</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                84% से अधिक पाठक स्मार्टफोन पर समाचार पढ़ते हैं, इसलिए शीर्षक 2 पंक्तियों से अधिक लंबा न हो और तस्वीरें वर्टिकल/हॉरिजॉन्टल दोनों में साफ़ दिखें।
              </p>
            </div>

            {/* 4E. Browser Distribution Donut / Pie Chart */}
            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>🌐 ब्राउज़र शेयर (Browser Distribution)</span>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {trafficData?.overallStats?.browsers?.chrome || (selectedPortal === 'english' ? 54 : 71)}% क्रोम प्रभुत्व
                </span>
              </div>

              {(() => {
                const defaultList: BrowserInfo[] = selectedPortal === 'english'
                  ? [
                      { name: 'गूगल क्रोम (Google Chrome)', nameEn: 'Google Chrome', icon: '🌐', percent: 54, color: '#34A853' },
                      { name: 'एप्पल सफारी (Apple Safari)', nameEn: 'Apple Safari', icon: '🧭', percent: 28, color: '#007AFF' },
                      { name: 'माइक्रोसॉफ्ट एज (MS Edge)', nameEn: 'Microsoft Edge', icon: '🌀', percent: 9, color: '#0078D7' },
                      { name: 'सैमसंग इंटरनेट (Samsung)', nameEn: 'Samsung Internet', icon: '📱', percent: 4, color: '#6C2BD9' },
                      { name: 'मोज़िला फ़ायरफ़ॉक्स (Firefox)', nameEn: 'Mozilla Firefox', icon: '🦊', percent: 3, color: '#FF7139' },
                      { name: 'अन्य / ऑपेरा (Others)', nameEn: 'Others', icon: '⭕', percent: 2, color: '#94A3B8' },
                    ]
                  : [
                      { name: 'गूगल क्रोम (Google Chrome)', nameEn: 'Google Chrome', icon: '🌐', percent: 71, color: '#34A853' },
                      { name: 'एप्पल सफारी (Apple Safari)', nameEn: 'Apple Safari', icon: '🧭', percent: 14, color: '#007AFF' },
                      { name: 'सैमसंग इंटरनेट (Samsung)', nameEn: 'Samsung Internet', icon: '📱', percent: 7, color: '#6C2BD9' },
                      { name: 'माइक्रोसॉफ्ट एज (MS Edge)', nameEn: 'Microsoft Edge', icon: '🌀', percent: 4, color: '#0078D7' },
                      { name: 'मोज़िला फ़ायरफ़ॉक्स (Firefox)', nameEn: 'Mozilla Firefox', icon: '🦊', percent: 2, color: '#FF7139' },
                      { name: 'अन्य / ऑपेरा (Others)', nameEn: 'Others', icon: '⭕', percent: 2, color: '#94A3B8' },
                    ];

                const browserList: BrowserInfo[] = trafficData?.overallStats?.browsers?.list || defaultList;
                const r = 38;
                const circ = 2 * Math.PI * r;
                let accumulatedPercent = 0;
                const activeItem = hoveredBrowser || browserList[0];

                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3 pt-1">
                      {/* Interactive SVG Donut / Pie */}
                      <div className="relative w-24 h-24 shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
                          <circle cx="50" cy="50" r={r} fill="transparent" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="12" />
                          {browserList.map((b) => {
                            const strokeDasharray = `${(b.percent / 100) * circ} ${circ}`;
                            const strokeDashoffset = -((accumulatedPercent / 100) * circ);
                            accumulatedPercent += b.percent;
                            const isHovered = (hoveredBrowser?.nameEn || browserList[0]?.nameEn) === b.nameEn;

                            return (
                              <circle
                                key={b.nameEn}
                                cx="50"
                                cy="50"
                                r={r}
                                fill="transparent"
                                stroke={b.color}
                                strokeWidth={isHovered ? "15" : "12"}
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-200 cursor-pointer"
                                onMouseEnter={() => setHoveredBrowser(b)}
                              />
                            );
                          })}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                          <span className="text-xs">{activeItem.icon}</span>
                          <span className="text-[11px] font-black text-slate-900 dark:text-white leading-tight">
                            {activeItem.percent}%
                          </span>
                        </div>
                      </div>

                      {/* Active Browser Card Detail */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{activeItem.icon}</span>
                          <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {activeItem.nameEn}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold" style={{ color: activeItem.color }}>
                          {activeItem.percent}% पाठक शेयर • {(activeItem.count ?? Math.round(((trafficData?.overallStats?.totalRealUsers || 0) * activeItem.percent) / 100)).toLocaleString('en-IN')} पाठक
                        </div>
                        <span className="text-[10px] text-slate-400 block leading-tight">
                          माउस घुमाकर अन्य ब्राउज़र देखें
                        </span>
                      </div>
                    </div>

                    {/* Interactive Legend Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
                      {browserList.map(b => {
                        const bCount = b.count ?? Math.round(((trafficData?.overallStats?.totalRealUsers || 0) * b.percent) / 100);
                        return (
                          <div
                            key={b.nameEn}
                            onMouseEnter={() => setHoveredBrowser(b)}
                            className={`p-1.5 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                              activeItem.nameEn === b.nameEn
                                ? 'bg-white dark:bg-slate-700/80 shadow-xs border-slate-300 dark:border-slate-600'
                                : 'bg-white/60 dark:bg-slate-800/60 border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                              <span className="truncate text-slate-700 dark:text-slate-300 font-medium">{b.nameEn}</span>
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white ml-1 shrink-0 text-right whitespace-nowrap">
                              {b.percent}% <span className="text-[9px] font-normal text-slate-500 dark:text-slate-400">({bCount.toLocaleString('en-IN')})</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-snug">
                      70%+ पाठक क्रोम और 14-28% सफारी (WebKit) पर हैं। इसलिए WebP फॉर्मेट व मोबाइल सफारी ऑप्टिमाइजेशन सक्रिय है।
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  )}

      {/* 5. PUBLISHING TIME & VELOCITY INTELLIGENCE */}
      {(activeTab === 'overview' || activeTab === 'time') && trafficData?.aiInsights?.timeIntelligence && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">⏰</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  समय व पीक ट्रैफिक एनालिसिस (Publishing Time & Peak Rhythm)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  प्राइम टाइम स्लॉट्स
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                दिन के किस हिस्से में कौन सी कैटेगरी सबसे ज्यादा पढ़ी जा रही है
              </p>
            </div>
            <button
              onClick={() => toggleSection('time')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
              title={collapsedSections.time ? "समय एनालिसिस खोलें" : "समय एनालिसिस समेटें"}
            >
              {collapsedSections.time ? '▼ खोलें' : '▲ समेटें'}
            </button>
          </div>

          {!collapsedSections.time && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { key: 'morning', icon: '🌅', color: 'border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20', ...trafficData.aiInsights.timeIntelligence.morning },
              { key: 'afternoon', icon: '☀️', color: 'border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/20', ...trafficData.aiInsights.timeIntelligence.afternoon },
              { key: 'evening', icon: '🌆', color: 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20', ...trafficData.aiInsights.timeIntelligence.evening },
              { key: 'lateNight', icon: '🌙', color: 'border-purple-200 dark:border-purple-900/50 bg-purple-50/30 dark:bg-purple-950/20', ...trafficData.aiInsights.timeIntelligence.lateNight },
            ].map(slot => (
              <div key={slot.key} className={`p-4 rounded-xl border ${slot.color} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="text-lg">{slot.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
                    {slot.share} रीडरशिप
                  </span>
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 dark:text-white block">{slot.label}</span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{slot.window}</span>
                </div>

                {/* Exact Website Metrics for This Time Slot */}
                <div className="grid grid-cols-3 gap-1 py-1.5 px-2 bg-white/80 dark:bg-slate-800/80 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-center shadow-2xs">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold">वेबसाइट खबरें</span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                      {slot.storyCount !== undefined ? slot.storyCount : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold">कुल पाठक</span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                      {slot.usersCount !== undefined ? slot.usersCount.toLocaleString('en-IN') : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold">औसत / खबर</span>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                      {slot.avgPerStory !== undefined ? slot.avgPerStory : '—'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-0.5">
                  {slot.bestCategories.map((c, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700">
                      {c}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">
                  {slot.directive}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    )}

      {/* 6. PHOTO & VISUAL IMPACT ANALYSIS */}
      {(activeTab === 'overview' || activeTab === 'photos') && trafficData?.aiInsights?.photoStats && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📸</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  फोटोज़ व विज़ुअल्स का प्रभाव (Visual & Photo Impact Intelligence)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  +140% विज़ुअल अपलिफ्ट
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                गूगल डिस्कवर में 16:9 बिना-लोगो वाली फोटो व विज़ुअल स्टोरीज का सीटीआर (CTR) विश्लेषण
              </p>
            </div>
            <button
              onClick={() => toggleSection('photos')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
              title={collapsedSections.photos ? "फोटो एनालिसिस खोलें" : "फोटो एनालिसिस समेटें"}
            >
              {collapsedSections.photos ? '▼ खोलें' : '▲ समेटें'}
            </button>
          </div>

          {!collapsedSections.photos && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 p-4 rounded-xl space-y-2">
              <span className="text-xs font-bold text-purple-900 dark:text-purple-300 block">
                🖼️ फोटो वाली खबरें vs बिना फोटो
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                  {trafficData.aiInsights.photoStats.avgViewsWithImage}
                </span>
                <span className="text-xs text-slate-500">औसत पाठक / फोटो खबर</span>
              </div>
              <div className="pt-1 space-y-1 text-[11px]">
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span>📸 फोटो संलग्न खबरें:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {trafficData.aiInsights.photoStats.imageCount} खबरें ({trafficData.aiInsights.photoStats.imageTotalViews?.toLocaleString('en-IN') || 0} पाठक)
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>🚫 बिना फोटो खबरें:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {trafficData.aiInsights.photoStats.withoutImageCount || 0} खबरें ({trafficData.aiInsights.photoStats.withoutImageTotalViews?.toLocaleString('en-IN') || 0} पाठक)
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-purple-200/50 dark:border-purple-900/40">
                बिना फोटो वाली खबरों का औसत पाठक केवल {trafficData.aiInsights.photoStats.avgViewsWithoutImage || 0} है, जबकि फोटो वाली खबरों का {trafficData.aiInsights.photoStats.avgViewsWithImage} है।
              </p>
            </div>

            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl space-y-2">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block">
                ✨ विज़ुअल स्टोरीज व फोटो गैलरी
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {trafficData.aiInsights.photoStats.avgGalleryViews}
                </span>
                <span className="text-xs text-slate-500">औसत पाठक / गैलरी</span>
              </div>
              <div className="pt-1 space-y-1 text-[11px]">
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span>🎨 कुल विज़ुअल गैलरी:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {trafficData.aiInsights.photoStats.visualGalleryCount} गैलरी ({trafficData.aiInsights.photoStats.galleryViews?.toLocaleString('en-IN') || 0} पाठक)
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>📰 सामान्य टेक्स्ट खबरें:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {trafficData.aiInsights.photoStats.standardStoryCount} खबरें ({trafficData.aiInsights.photoStats.standardStoryViews?.toLocaleString('en-IN') || 0} पाठक)
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 pt-1 border-t border-emerald-200/50 dark:border-emerald-900/40 font-semibold">
                विज़ुअल कहानियों को सामान्य खबरों ({trafficData.aiInsights.photoStats.avgStandardViews} व्यू) की तुलना में +{trafficData.aiInsights.photoStats.visualUpliftPercent}% अधिक पाठक मिलते हैं।
              </p>
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl space-y-2">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300 block">
                📐 16:9 नो-लोगो फोटो नियम
              </span>
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>1200px+ हाई रेजोल्यूशन (Google Discover)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>0% टीवी/चैनल लोगो (Zero Watermark)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>इमोशनल व एक्सप्रेसिव चेहरे</span>
                </div>
              </div>
            </div>
          </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                <span className="text-base shrink-0">💡</span>
                <span className="leading-relaxed">
                  <strong>संपादकीय निर्देश:</strong> {trafficData.aiInsights.photoStats.roleInsight}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* 7. SEO & GOOGLE DISCOVER ANALYSIS */}
      {(activeTab === 'overview' || activeTab === 'seo') && trafficData?.aiInsights?.seoStats && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  एसईओ व सर्च परफॉर्मेंस एनालिसिस (SEO & Google Discover Engine)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {trafficData.aiInsights.seoStats.seoMultiplier}x ऑर्गेनिक गुणक
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                SEO स्कोर (80+ vs मध्यम vs निम्न) और हेडिंग संरचना का पाठक संख्या पर सीधा असर
              </p>
            </div>
            <button
              onClick={() => toggleSection('seo')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
              title={collapsedSections.seo ? "एसईओ एनालिसिस खोलें" : "एसईओ एनालिसिस समेटें"}
            >
              {collapsedSections.seo ? '▼ खोलें' : '▲ समेटें'}
            </button>
          </div>

          {!collapsedSections.seo && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">🟢 उच्च SEO (स्कोर 80+)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                  {trafficData.aiInsights.seoStats.highCount} खबरें
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {trafficData.aiInsights.seoStats.highAvgViews} <span className="text-xs font-normal text-slate-400">औसत पाठक</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                उच्च स्कोर वाली खबरें गूगल सर्च और डिस्कवर में प्राथमिकता से दिखाई जाती हैं।
              </p>
            </div>

            <div className="bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300">🟡 मध्यम SEO (स्कोर 65-79)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
                  {trafficData.aiInsights.seoStats.medCount} खबरें
                </span>
              </div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {trafficData.aiInsights.seoStats.medAvgViews} <span className="text-xs font-normal text-slate-400">औसत पाठक</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                सामान्य पाठक संख्या; 2-3 प्राथमिक कीवर्ड्स और उप-शीर्षक जोड़कर इसे 80+ किया जा सकता है।
              </p>
            </div>

            <div className="bg-red-50/40 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-800 dark:text-red-300">🔴 कमजोर SEO (स्कोर &lt;65)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                  {trafficData.aiInsights.seoStats.lowCount} खबरें
                </span>
              </div>
              <div className="text-2xl font-black text-red-600 dark:text-red-400">
                {trafficData.aiInsights.seoStats.lowAvgViews} <span className="text-xs font-normal text-slate-400">औसत पाठक</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                सर्च इंजनों में इंडेक्स होने में कठिनाई; शीर्षक छोटा करें और मेटा विवरण जोड़ें।
              </p>
            </div>
          </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                <span className="text-base shrink-0">💡</span>
                <span className="leading-relaxed">
                  <strong>एसईओ मंत्र:</strong> {trafficData.aiInsights.seoStats.roleInsight}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* 8. SPECIFIC STORY CLINIC (UNDERPERFORMERS FIXES) */}
      {(activeTab === 'overview' || activeTab === 'clinic') && trafficData?.aiInsights?.underperformingStories && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl">🛠️</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  किन खबरों में क्या सुधार होना चाहिए (Story Improvement Clinic)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  सीधा एक्शन प्लान
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  ⏰ रोज़ 12:00 PM व 6:00 PM ऑटो-सुधार सक्रिय
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                कम व्यूज़ वाली वास्तविक खबरों का एआई डायग्नोसिस व स्पष्ट सुधार सुझाव (टोटल खबरें 100% सुरक्षित, 0 खबरें हटाई जाती हैं)
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleTriggerAutoOptimize}
                disabled={isOptimizing}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-sm flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                title="कम व्यूज वाली खबरों को एआई से तुरंत री-एंगल व SEO ऑप्टिमाइज़ करवाएं"
              >
                {isOptimizing ? (
                  <>
                    <span className="inline-block animate-spin">⚡</span>
                    <span>एआई सुधार जारी है...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>अभी एआई से सुधार करवाएं (Run AI Auto-Fix)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleSection('clinic')}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                title={collapsedSections.clinic ? "स्टोरी क्लिनिक खोलें" : "स्टोरी क्लिनिक समेटें"}
              >
                {collapsedSections.clinic ? '▼ खोलें' : '▲ समेटें'}
              </button>
            </div>
          </div>

          {/* Alert Toast / Result Banner */}
          {optimizeResult && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-fadeIn">
              <span className="font-semibold">🎉 {optimizeResult}</span>
              <button onClick={() => setOptimizeResult(null)} className="text-emerald-600 hover:text-emerald-800 dark:hover:text-white text-xs font-bold px-1.5 py-0.5">✕</button>
            </div>
          )}

          {!collapsedSections.clinic && (
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80">
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-3 min-w-[240px]">खबर (शीर्षक व लिंक)</th>
                  <th className="py-3 px-3 text-center">कैटेगरी</th>
                  <th className="py-3 px-3 text-center">रियल व्यू</th>
                  <th className="py-3 px-3 text-center">SEO</th>
                  <th className="py-3 px-3 min-w-[220px]">पहचानी गई समस्या (Specific Flaw)</th>
                  <th className="py-3 px-3 min-w-[240px]">ठोस सुधार सुझाव (Actionable Fix)</th>
                  <th className="py-3 px-3 text-center min-w-[120px]">कार्रवाई (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {trafficData.aiInsights.underperformingStories.map((story, idx) => {
                  const isEnMode = selectedPortal === 'english';
                  const storyUrl = isEnMode ? `/en/${story.categoryStr}/${story.slug}` : `/${story.categoryStr}/${story.slug}`;

                  return (
                    <tr key={story.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3">
                        <Link
                          href={storyUrl}
                          target="_blank"
                          className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition line-clamp-2 leading-snug"
                        >
                          {story.headline}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {getCatLabel(story.categoryStr, story.categoryName)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-black text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        👁️ {story.realViews}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {story.seoScore}
                      </td>
                      <td className="py-3 px-3 text-red-600 dark:text-red-400 text-[11px] leading-relaxed">
                        {story.flawType && (
                          <span className="inline-block mb-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 mr-1.5">
                            {story.flawType}
                          </span>
                        )}
                        <div>❌ {story.issue}</div>
                      </td>
                      <td className="py-3 px-3 text-emerald-700 dark:text-emerald-300 font-medium text-[11px] leading-relaxed">
                        💡 {story.fix}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleTriggerSingleOptimize(story.id)}
                          disabled={optimizingStoryIds.has(story.id)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-xs transition disabled:opacity-50 cursor-pointer flex items-center gap-1 mx-auto"
                          title="इस खबर का शीर्षक और SEO तुरंत एआई से सुधारें"
                        >
                          {optimizingStoryIds.has(story.id) ? (
                            <>
                              <span className="inline-block animate-spin">⚡</span>
                              <span>सुधार जारी...</span>
                            </>
                          ) : (
                            <>
                              <span>⚡</span>
                              <span>अभी सुधारें</span>
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
    )}

      {/* 9. CATEGORY-BY-CATEGORY ROADMAP */}
      {(activeTab === 'overview' || activeTab === 'categoryRoadmap') && trafficData?.aiInsights?.categoryActionPlans && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🗂️</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  कैटेगरी-वार सुधार रोडमैप (Category-by-Category Roadmap)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  बीट विशिष्ट रणनीति
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                किस श्रेणी में क्या बदलाव करना है, किसको बढ़ाना है और किसको संतुलित करना है
              </p>
            </div>
            <button
              onClick={() => toggleSection('categoryRoadmap')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
              title={collapsedSections.categoryRoadmap ? "कैटेगरी रोडमैप खोलें" : "कैटेगरी रोडमैप समेटें"}
            >
              {collapsedSections.categoryRoadmap ? '▼ खोलें' : '▲ समेटें'}
            </button>
          </div>

          {!collapsedSections.categoryRoadmap && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trafficData.aiInsights.categoryActionPlans.map(cat => (
              <div key={cat.categorySlug} className="bg-slate-50/60 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.categoryColor }} />
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {getCatLabel(cat.categorySlug, cat.categoryName)}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {cat.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span>कुल खबरें: <strong>{cat.storyCount}</strong></span>
                  <span>रियल व्यूज़: <strong className="text-emerald-600 dark:text-emerald-400">{cat.totalRealViews}</strong></span>
                  <span>शेयर: <strong>{cat.sharePercent}%</strong></span>
                </div>

                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-200/60 dark:border-slate-700">
                  🎯 <strong>संपादकीय निर्देश:</strong> {cat.action}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    )}

      {/* 10. EDITORIAL ACTION DIRECTIVES (IMMEDIATE, THROTTLE, 7-DAY GOALS) */}
      {(activeTab === 'overview' || activeTab === 'action') && trafficData?.aiInsights?.executiveActionDirectives && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  संपादकीय एक्शन प्लान (Editorial Directives & Execution)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  कार्रवाई योग्य निर्णय
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                क्या तुरंत शुरू करें, क्या सीमित करें और अगले 7 दिन का क्या लक्ष्य हो
              </p>
            </div>
            <button
              onClick={() => toggleSection('action')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
              title={collapsedSections.action ? "एक्शन प्लान खोलें" : "एक्शन प्लान समेटें"}
            >
              {collapsedSections.action ? '▼ खोलें' : '▲ समेटें'}
            </button>
          </div>

          {!collapsedSections.action && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Immediate Wins */}
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🚀</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                  तुरंत करने योग्य कार्य (Immediate Wins)
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {trafficData.aiInsights.executiveActionDirectives.immediateWins.map((act, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40 text-[11px] leading-relaxed">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: What to Throttle */}
            <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🛑</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-900 dark:text-red-300">
                  क्या रोकना / सीमित करना है (Things to Throttle)
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {trafficData.aiInsights.executiveActionDirectives.thingsToThrottle.map((act, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-red-100 dark:border-red-900/40 text-[11px] leading-relaxed">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: 7-Day Targets */}
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-base">📈</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                  अगले 7-दिन का लक्ष्य (Next 7-Day Milestones)
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {trafficData.aiInsights.executiveActionDirectives.next7DayTargets.map((act, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/40 text-[11px] leading-relaxed">
                    <span className="text-indigo-600 font-bold shrink-0">🎯</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    )}

      {/* 5. TOP CATEGORIES RANKING TABLE */}
      {(activeTab === 'overview' || activeTab === 'categories') && trafficData?.categoriesBreakdown && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🗂️ टॉप कैटेगरी प्रदर्शन रैंकिंग (Top Categories by Real Readership)</span>
              </h2>
              <p className="text-xs text-slate-500">
                किस श्रेणी की खबरें सबसे ज्यादा पढ़ी जा रही हैं — कुल पाठक, रियल व्यूज़ और औसत जुड़ाव
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                कुल {trafficData.categoriesBreakdown.length} श्रेणियां सक्रिय
              </span>
              <button
                onClick={() => toggleSection('categories')}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
                title={collapsedSections.categories ? "कैटेगरी टेबल खोलें" : "कैटेगरी टेबल समेटें"}
              >
                {collapsedSections.categories ? '▼ खोलें' : '▲ समेटें'}
              </button>
            </div>
          </div>

          {!collapsedSections.categories && (
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80">
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-3 w-12 text-center">रैंक</th>
                  <th className="py-3 px-3">कैटेगरी का नाम</th>
                  <th className="py-3 px-3 text-center">कुल खबरें</th>
                  <th className="py-3 px-3 text-center">रियल पाठक (Users)</th>
                  <th className="py-3 px-3 text-center">रियल व्यूज़</th>
                  <th className="py-3 px-3 text-center">औसत व्यू/खबर</th>
                  <th className="py-3 px-3 text-center">ट्रैफिक शेयर (%)</th>
                  <th className="py-3 px-4">शीर्ष पढ़ी गई खबर (Top Story)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {trafficData.categoriesBreakdown.map((cat, idx) => (
                  <tr key={cat.categorySlug} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 text-center font-bold text-slate-400">
                      #{idx + 1}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: cat.categoryColor }}
                        />
                        <span className="font-bold text-slate-900 dark:text-white">
                          {getCatLabel(cat.categorySlug, cat.categoryName)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          /{cat.categorySlug}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                      {cat.storyCount}
                    </td>
                    <td className="py-3 px-3 text-center font-black text-emerald-600 dark:text-emerald-400">
                      {cat.totalRealUsers.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center font-black text-slate-900 dark:text-white">
                      {cat.totalRealViews.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-indigo-600 dark:text-indigo-400">
                      ⚡ {cat.avgViewsPerStory}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{cat.sharePercent}%</span>
                        <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div style={{ width: `${cat.sharePercent}%` }} className="bg-emerald-500 h-full" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      {cat.topStoryHeadline ? (
                        <Link
                          href={selectedPortal === 'english' ? `/en/${cat.categorySlug}/${cat.topStorySlug}` : `/${cat.categorySlug}/${cat.topStorySlug}`}
                          target="_blank"
                          className="text-slate-700 dark:text-slate-300 font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition block truncate"
                          title={cat.topStoryHeadline}
                        >
                          {cat.topStoryHeadline}
                        </Link>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        🏆 {cat.topStoryViews} व्यूज़
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )}

      {/* 6. DEEP GRANULAR STORY TRAFFIC TABLE (NOT JUST CARDS, FULL ANALYTICS VIEW) */}
      {(activeTab === 'overview' || activeTab === 'stories') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📰 खबरों का सूक्ष्म ट्रैफिक व एंगेजमेंट विश्लेषण (Deep Story Analytics)</span>
              </h2>
              <p className="text-xs text-slate-500">
                प्रत्येक खबर का रियल यूजर काउंट, व्यूज़, देश (डेमोग्राफिक्स), डिवाइस और परफॉर्मेंस ग्रेड
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-400">
                प्रदर्शित: <strong>{displayedStories.length}</strong> / कुल: <strong>{trafficData?.totalCount || 0}</strong> खबरें
              </div>
              <button
                onClick={() => toggleSection('stories')}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
                title={collapsedSections.stories ? "खबरों की टेबल खोलें" : "खबरों की टेबल समेटें"}
              >
                {collapsedSections.stories ? '▼ खोलें' : '▲ समेटें'}
              </button>
            </div>
          </div>

          {!collapsedSections.stories && (
            <>
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80">
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-3 w-12 text-center">#</th>
                  <th className="py-3 px-3 min-w-[280px]">खबर (शीर्षक व विवरण)</th>
                  <th className="py-3 px-3 text-center">कैटेगरी</th>
                  <th className="py-3 px-3 text-center">सोर्स</th>
                  <th className="py-3 px-3 text-center cursor-pointer hover:text-emerald-600" onClick={() => toggleSort('users')}>
                    रियल पाठक {sortBy === 'users' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                  </th>
                  <th className="py-3 px-3 text-center cursor-pointer hover:text-emerald-600" onClick={() => toggleSort('views')}>
                    रियल व्यूज़ {sortBy === 'views' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                  </th>
                  <th className="py-3 px-3 min-w-[140px]">डेमोग्राफी (देश)</th>
                  <th className="py-3 px-3 text-center">डिवाइस</th>
                  <th className="py-3 px-3 text-center">स्थिति / ग्रेड</th>
                  <th className="py-3 px-3 text-right">पब्लिश समय</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 text-xs">
                      डेटा लोड हो रहा है, कृपया प्रतीक्षा करें...
                    </td>
                  </tr>
                ) : displayedStories.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 text-xs">
                      कोई खबर नहीं मिली। कृपया अपने फ़िल्टर बदलें।
                    </td>
                  </tr>
                ) : (
                  displayedStories.map((story, idx) => {
                    const isViral = story.performanceGrade === 'viral';
                    const isHigh = story.performanceGrade === 'high';

                    return (
                      <tr
                        key={story.id}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${
                          isViral ? 'bg-amber-500/[0.03] dark:bg-amber-500/[0.05]' : ''
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3 px-3 text-center font-bold text-slate-400">
                          {(currentPage - 1) * pageSize + idx + 1}
                        </td>

                        {/* Story Headline & Slug */}
                        <td className="py-3 px-3">
                          {(() => {
                            const isEnMode = selectedPortal === 'english' || (selectedPortal === 'all' && story.isEnglishOnly);
                            const primaryHeadline = isEnMode ? (story.headlineEn || story.headline) : story.headline;
                            const secondaryHeadline = isEnMode ? (story.headlineEn && story.headline !== story.headlineEn ? story.headline : null) : story.headlineEn;
                            const storyUrl = isEnMode
                              ? `/en/${story.categoryStr}/${story.slugEn || story.slug}`
                              : `/${story.categoryStr}/${story.slug}`;

                            return (
                              <>
                                <Link
                                  href={storyUrl}
                                  target="_blank"
                                  className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition line-clamp-2 leading-snug"
                                >
                                  {primaryHeadline}
                                </Link>
                                {secondaryHeadline && (
                                  <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                                    {isEnMode ? `🇮🇳 मूल हिन्दी: ${secondaryHeadline}` : `🇬🇧 EN: ${secondaryHeadline}`}
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                            style={{
                              borderColor: `${story.categoryColor}40`,
                              backgroundColor: `${story.categoryColor}15`,
                              color: story.categoryColor,
                            }}
                          >
                            {getCatLabel(story.categoryStr, story.categoryName)}
                          </span>
                        </td>

                        {/* Source */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">
                            {story.sourceLabel}
                          </span>
                        </td>

                        {/* Real Users */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                            {story.realUsers.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 block">पाठक</span>
                        </td>

                        {/* Real Views */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className="font-black text-slate-900 dark:text-white text-sm">
                            {story.realViews.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            (बॉट: {story.botViews})
                          </span>
                        </td>

                        {/* Demographics (Top Countries) */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                              🇮🇳 {story.demographics.indiaPercent}%
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            <span className="text-[11px] font-semibold text-slate-500">
                              🌍 {story.demographics.foreignPercent}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {story.demographics.topCountries.slice(0, 3).map(c => (
                              <span key={c.code} className="text-[10px] text-slate-400" title={`${c.name}: ${c.percent}%`}>
                                {c.flag} {c.percent}%
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Devices */}
                        <td className="py-3 px-3 text-center whitespace-nowrap text-[11px]">
                          <span className="text-purple-600 dark:text-purple-400 font-bold">
                            📱 {story.devices.mobile}%
                          </span>
                          <span className="text-slate-400 text-[10px] block">
                            💻 {story.devices.desktop}%
                          </span>
                        </td>

                        {/* Status / Grade */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isViral
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                              : isHigh
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                              : story.performanceGrade === 'good'
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {story.performanceLabel}
                          </span>
                        </td>

                        {/* Time */}
                        <td className="py-3 px-3 text-right whitespace-nowrap text-slate-400 text-[11px]">
                          {formatDate(story.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {trafficData && trafficData.totalCount > pageSize && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500">
                पेज {currentPage} (कुल {Math.ceil(trafficData.totalCount / pageSize)} पेज)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold disabled:opacity-40 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  ← पिछला
                </button>
                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage * pageSize >= trafficData.totalCount}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold disabled:opacity-40 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  अगला →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )}

    </div>
  );
}
