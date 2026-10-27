"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getDashboardPostsAction, deletePost } from '@/lib/actions';
import PostEditor from '@/components/dashboard/PostEditor';

function formatDateTime(dateStr: string) {
  if (!dateStr) return { full: '', relative: '' };
  try {
    const date = new Date(dateStr);
    const formatted = date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const now = Date.now();
    const diffSec = Math.floor((now - date.getTime()) / 1000);
    let relative = '';
    if (diffSec < 60) relative = 'अभी-अभी';
    else if (diffSec < 3600) relative = `${Math.floor(diffSec / 60)} मिनट पहले`;
    else if (diffSec < 86400) relative = `${Math.floor(diffSec / 3600)} घंटे पहले`;
    else relative = `${Math.floor(diffSec / 86400)} दिन पहले`;

    return { full: formatted, relative };
  } catch {
    return { full: dateStr, relative: '' };
  }
}

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalVisualStories: 0,
    totalGalleries: 0,
    avgSeoScore: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedPortal, setSelectedPortal] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPostType, setSelectedPostType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Load saved per-page limit from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLimit = localStorage.getItem('tfl_posts_limit');
      if (savedLimit) {
        const parsed = parseInt(savedLimit, 10);
        if (!isNaN(parsed) && [10, 20, 50, 100, 200].includes(parsed)) {
          setLimit(parsed);
        }
      }
    }
  }, []);

  // Debounce search query
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setCurrentPage(1);
    }, 350);
  };

  const handlePortalChange = (val: string) => {
    setSelectedPortal(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };

  const handlePostTypeChange = (val: string) => {
    setSelectedPostType(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  const handleLimitChange = (val: number) => {
    setLimit(val);
    setCurrentPage(1);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tfl_posts_limit', String(val));
    }
  };

  // Fetch data from server
  const loadPosts = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await getDashboardPostsAction({
        page: currentPage,
        limit,
        category: selectedCategory,
        postType: selectedPostType,
        status: selectedStatus,
        portal: selectedPortal,
        search: debouncedSearch,
      });

      setPosts(res.posts);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      if (res.categories && res.categories.length > 0) {
        setCategories(res.categories);
      }
      if (res.stats) {
        setStats({
          totalPosts: res.stats.totalPosts ?? res.total,
          totalVisualStories: res.stats.totalVisualStories ?? 0,
          totalGalleries: res.stats.totalGalleries ?? 0,
          avgSeoScore: res.stats.avgSeoScore ?? 85,
        });
      }
      setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    } catch (err) {
      console.error("Failed to load dashboard posts:", err);
    } finally {
      if (!isSilent) setLoading(false);
      setIsRefreshing(false);
    }
  }, [currentPage, limit, selectedPortal, selectedCategory, selectedPostType, selectedStatus, debouncedSearch]);

  // Initial load and Auto-sync every 30 seconds
  useEffect(() => {
    loadPosts(false);
    const interval = setInterval(() => {
      loadPosts(true); // Silent background update
    }, 30000);
    return () => clearInterval(interval);
  }, [loadPosts]);

  const handleAddNew = () => {
    setCurrentPost(null);
    setIsEditing(true);
  };

  const handleEdit = (post: any) => {
    setCurrentPost(post);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost(id);
      loadPosts(false);
    }
  };

  const getSeoColor = (score: number) => {
    if (score >= 80) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (score >= 50) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-500 bg-red-500/10 border-red-500/20';
  };

  if (isEditing) {
    return (
      <div className="bg-[#0b0c10] min-h-screen">
        <PostEditor 
          post={currentPost} 
          categories={categories} 
          onClose={() => setIsEditing(false)} 
          onSave={() => {
            setIsEditing(false);
            loadPosts(false);
          }}
        />
      </div>
    );
  }

  // Calculate pagination window
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const startRecord = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endRecord = Math.min(currentPage * limit, total);

  return (
    <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-8 p-6 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-[#12141c] border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-600/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 text-center lg:text-left">
          <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start mb-2">
            <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter italic">Content <span className="text-red-600">Command</span></h1>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              लाइव ऑटो-सिंक (30s)
            </span>
          </div>
          <p className="text-gray-400 font-medium flex flex-wrap items-center gap-2 justify-center lg:justify-start">
            <span>मैनेज करें अपनी खबरें, गैलरी और विजुअल स्टोरीज - सभी रियल टाइम में</span>
            {lastSyncTime && (
              <span className="text-xs text-gray-500 font-mono">
                (अंतिम सिंक: {lastSyncTime})
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 relative z-10 w-full lg:w-auto">
          <button
            onClick={() => loadPosts(false)}
            disabled={isRefreshing}
            className="flex-1 lg:flex-none bg-[#1a1d26] hover:bg-gray-800 text-gray-200 border border-gray-700 font-bold px-6 py-5 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
            title="डैशबोर्ड को तुरंत रिफ्रेश करें"
          >
            <svg className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            रिफ्रेश
          </button>
          <button 
            onClick={handleAddNew}
            className="flex-1 lg:flex-none bg-red-600 hover:bg-red-700 text-white font-black px-10 py-5 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-wider cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M12 4v16m8-8H4"></path></svg>
            नई पोस्ट
          </button>
        </div>
      </div>

      {/* Stats Quick View (True Real-Time Database Counts) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Total Posts', value: stats.totalPosts || total, color: 'text-blue-500' },
           { label: 'Visual Stories', value: stats.totalVisualStories, color: 'text-purple-500' },
           { label: 'Galleries', value: stats.totalGalleries, color: 'text-orange-500' },
           { label: 'Avg SEO Score', value: `${stats.avgSeoScore}%`, color: 'text-green-500' }
         ].map((stat, i) => (
           <div key={i} className="bg-[#12141c] border border-gray-800 p-6 rounded-3xl">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h3>
           </div>
         ))}
      </div>

      {/* Main Table Content */}
      <div className="bg-[#12141c] border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Portal Filter Quick Tabs */}
        <div className="px-8 pt-6 pb-2 border-b border-gray-800/80 bg-[#161922] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'सभी पोर्टल (All Posts)', icon: '📚' },
              { id: 'hindi', label: '🇮🇳 हिन्दी पोर्टल (Hindi)', icon: '🇮🇳' },
              { id: 'english', label: '🌐 इंग्लिश पोर्टल (English All)', icon: '🌐' },
              { id: 'trends', label: '⚡ गूगल ट्रेंड्स (Trends Only)', icon: '⚡' },
              { id: 'translated', label: '🔄 अनुवादित (HI→EN)', icon: '🔄' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handlePortalChange(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  selectedPortal === tab.id
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-gray-400 hover:text-white bg-[#0b0c10] border border-gray-800 hover:border-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-gray-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>फिल्टर्ड कुल: <strong className="text-white font-black">{total}</strong> खबरें</span>
          </div>
        </div>

        {/* Filters, Screen Options and Search Toolbar */}
        <div className="p-8 border-b border-gray-800 bg-[#1a1d26]/50 flex flex-col xl:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 w-full xl:w-auto">
             <div className="w-2 h-8 bg-red-600 rounded-full flex-shrink-0"></div>
             <div>
               <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                 सभी पोस्ट्स 
                 <span className="text-sm font-bold bg-gray-800/80 text-gray-300 px-3 py-1 rounded-xl border border-gray-700">
                   {total} Total
                 </span>
               </h2>
               <p className="text-xs text-gray-400 mt-0.5">
                 दिखा रहे हैं {startRecord} - {endRecord} (पेज {currentPage} / {totalPages})
               </p>
             </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
             {/* WordPress-style Screen Options / Per Page Limit */}
             <div className="flex items-center gap-2 bg-[#0b0c10] border border-gray-800 rounded-2xl px-3 py-2">
               <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider whitespace-nowrap">प्रति पेज:</span>
               <select
                 value={limit}
                 onChange={(e) => handleLimitChange(Number(e.target.value))}
                 className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
                 title="एक पेज पर कितनी खबरें दिखें (WordPress Screen Options)"
               >
                 <option value={10} className="bg-[#12141c]">10 खबरें</option>
                 <option value={20} className="bg-[#12141c]">20 खबरें</option>
                 <option value={50} className="bg-[#12141c]">50 खबरें</option>
                 <option value={100} className="bg-[#12141c]">100 खबरें</option>
                 <option value={200} className="bg-[#12141c]">200 खबरें</option>
               </select>
             </div>

             {/* Portal Selector (Hindi / English / Trends) */}
             <select 
              value={selectedPortal}
              onChange={(e) => handlePortalChange(e.target.value)}
              className="bg-[#0b0c10] border border-gray-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-red-600 transition-all font-medium appearance-none cursor-pointer"
              title="पोर्टल व भाषा फिल्टर"
             >
               <option value="all">🌐 सभी पोर्टल (All Portals)</option>
               <option value="hindi">🇮🇳 मुख्य हिन्दी पोर्टल (Hindi)</option>
               <option value="english">🌍 केवल इंग्लिश पोर्टल (English Only)</option>
               <option value="trends">⚡ केवल गूगल ट्रेंड्स (Trends)</option>
               <option value="translated">🔄 अनुवादित खबरें (HI→EN)</option>
             </select>

             {/* Post Type Selector */}
             <select 
              value={selectedPostType}
              onChange={(e) => handlePostTypeChange(e.target.value)}
              className="bg-[#0b0c10] border border-gray-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-red-600 transition-all font-medium appearance-none cursor-pointer"
             >
               <option value="all">सभी प्रकार</option>
               <option value="general">आर्टिकल्स (News)</option>
               <option value="visual-story">विजुअल स्टोरी</option>
               <option value="gallery">फोटो गैलरी</option>
             </select>

             {/* Status Selector (Published vs Draft) */}
             <select 
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-[#0b0c10] border border-gray-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-red-600 transition-all font-medium appearance-none cursor-pointer"
             >
               <option value="all">सभी स्टेटस (All)</option>
               <option value="published">🟢 सिर्फ पब्लिश्ड (Live)</option>
               <option value="draft">🟡 सिर्फ ड्राफ्ट (Draft)</option>
             </select>

             {/* Category Selector */}
             <select 
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="bg-[#0b0c10] border border-gray-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-red-600 transition-all font-medium appearance-none cursor-pointer"
             >
               <option value="all">सभी कैटेगरी</option>
               {categories.map(cat => (
                 <option key={cat.id} value={cat.slug}>{cat.name}</option>
               ))}
             </select>

             {/* Search Input */}
             <div className="relative flex-1 sm:w-80">
                <input 
                 value={searchQuery}
                 onChange={(e) => handleSearchChange(e.target.value)}
                 className="w-full bg-[#0b0c10] border border-gray-800 rounded-2xl px-11 py-3.5 text-sm text-white outline-none focus:border-red-600 focus:ring-4 ring-red-600/10 transition-all font-medium" 
                 placeholder="खोजें: हेडलाइन, यूआरएल, सोर्स..." 
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                {searchQuery && (
                  <button 
                    onClick={() => handleSearchChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs bg-gray-800 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                  >
                    ×
                  </button>
                )}
             </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="flex flex-col min-h-[400px]">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-32">
               <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="text-gray-500 font-black uppercase tracking-widest text-xs">लोड हो रहा है...</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post: any) => {
              const dt = formatDateTime(post.createdAt);
              return (
                <div 
                  key={post.id} 
                  onClick={() => handleEdit(post)}
                  className="group flex flex-col lg:flex-row gap-8 p-8 border-b border-gray-800/80 hover:bg-[#1a1d26]/50 transition-all duration-300 relative cursor-pointer"
                >
                  {/* Image Preview Area */}
                  <div className="w-full lg:w-64 h-40 bg-gray-950 rounded-3xl overflow-hidden border border-gray-800 relative shadow-2xl flex-shrink-0">
                    <img 
                      src={post.image || 'https://picsum.photos/600/400'} 
                      alt="" 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000 ease-out opacity-80 group-hover:opacity-100" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                    
                    {/* Badges on Photo */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-10">
                      <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-black text-gray-200 uppercase tracking-wider border border-white/20 shadow-lg">
                        {post.postType || 'general'}
                      </span>
                      {post.isPublished ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-600/95 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-wider border border-emerald-400/60 shadow-lg flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                          <span>पब्लिश्ड</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-amber-500/95 backdrop-blur-md text-[10px] font-black text-black uppercase tracking-wider border border-amber-300 shadow-lg flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-black"></span>
                          <span>ड्राफ्ट</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Info Area */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-3">
                      <div className="flex-1">
                        {/* Language & Exclusivity Tag */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {post.isEnglishOnly ? (
                            <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                              <span>🌍</span>
                              <span>English Exclusive ({post.trendsGeo ? `Google Trends ${post.trendsGeo}` : 'इंग्लिश पोर्टल'})</span>
                            </span>
                          ) : post.isGoogleTrends ? (
                            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                              <span>⚡</span>
                              <span>गूगल ट्रेंड्स भारत (India Trends {post.trendsTimeframe || 'Realtime'})</span>
                            </span>
                          ) : post.headlineEn ? (
                            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                              <span>🌐</span>
                              <span>द्विभाषी (हिन्दी + English)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-md bg-slate-700/50 border border-slate-600 text-slate-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                              <span>🇮🇳</span>
                              <span>केवल हिन्दी (Hindi Only)</span>
                            </span>
                          )}

                          {post.categoryStr && (
                            <span className="px-2.5 py-0.5 rounded-md bg-gray-800 text-gray-300 text-[10px] font-bold uppercase tracking-wider">
                              {categories.find((c: any) => c.slug === post.categoryStr)?.name || post.categoryStr}
                            </span>
                          )}
                        </div>

                        {/* Hindi Headline */}
                        <h3 className="text-xl md:text-2xl font-black text-white leading-[1.25] mb-2 group-hover:text-red-500 transition-colors tracking-tight line-clamp-2">
                          {post.headline}
                        </h3>

                        {/* English Headline */}
                        {post.headlineEn && (
                          <div className="flex items-start gap-2 mb-3 bg-[#161c28] border border-blue-900/40 p-2.5 rounded-xl">
                            <span className="px-1.5 py-0.5 rounded bg-blue-600/90 text-[10px] font-black text-white uppercase tracking-wider flex-shrink-0 mt-0.5">
                              EN
                            </span>
                            <p className="text-sm font-semibold text-blue-200 line-clamp-2 leading-snug">
                              {post.headlineEn}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-blue-500/80 font-bold text-[11px] truncate tracking-wide bg-blue-500/5 px-3 py-1.5 rounded-xl border border-blue-500/10 w-fit max-w-full">
                           <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeWidth="2.5"></path></svg>
                           <span className="truncate">/{post.categoryStr}/{post.slug}</span>
                        </div>
                      </div>
                      
                      {/* SEO METER - Visual Gauge */}
                      <div className="flex flex-col items-center gap-2 bg-black/40 p-4 rounded-3xl border border-gray-800/50 min-w-[120px] flex-shrink-0">
                         <div className="relative w-16 h-8 overflow-hidden">
                            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-[6px] border-gray-800"></div>
                            <div 
                              className={`absolute top-0 left-0 w-16 h-16 rounded-full border-[6px] transition-all duration-1000 ${
                                (post.seoScore || 0) > 80 ? 'border-green-500' : (post.seoScore || 0) > 50 ? 'border-yellow-500' : 'border-red-600'
                              }`}
                              style={{ 
                                clipPath: `polygon(0% 100%, 100% 100%, 100% 50%, 0% 50%)`,
                                transform: `rotate(${(post.seoScore || 0) * 1.8 - 180}deg)`
                              }}
                            ></div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                         </div>
                         <div className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${getSeoColor(post.seoScore || 0)}`}>
                            SEO: {post.seoScore || 0}%
                         </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                       {/* Source Tag */}
                       <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-2xl border border-gray-800">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Source:</span>
                          <span className="text-[11px] font-black text-gray-200">{post.sourceName || 'Manual Post'}</span>
                          <div className={`w-2 h-2 rounded-full ${post.sourceName ? 'bg-blue-500 animate-pulse' : 'bg-gray-700'}`}></div>
                       </div>

                       {/* Category Tag */}
                       <div className="flex items-center gap-2 bg-red-600/5 px-4 py-2 rounded-2xl border border-red-600/10">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cat:</span>
                          <span className="text-[11px] font-black text-red-500 uppercase">{categories.find((c: any) => c.slug === post.categoryStr)?.name || post.categoryStr}</span>
                       </div>

                       {/* Publication Status Pill */}
                       <div className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border ${
                         post.isPublished 
                           ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                           : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                       }`}>
                          <span className={`w-2 h-2 rounded-full ${post.isPublished ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                          <span className="text-[11px] font-black uppercase tracking-wider">
                            {post.isPublished ? 'पब्लिश्ड (Live)' : 'ड्राफ्ट (Draft)'}
                          </span>
                       </div>

                       {/* Date & Exact Time (with Seconds & Relative Info) */}
                       <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-4 ml-auto">
                          <span className="flex items-center gap-1.5 bg-gray-900/90 px-3.5 py-1.5 rounded-xl border border-gray-800 text-gray-300">
                            <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>{dt.full}</span>
                            {dt.relative && (
                              <span className="text-red-400 font-black text-[10px] bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20 ml-1">
                                {dt.relative}
                              </span>
                            )}
                          </span>
                          <span className="flex items-center gap-2 bg-gray-900/90 px-3.5 py-1.5 rounded-xl border border-gray-800">
                            <span className="text-red-400 font-black text-[10px]">HI: {post.viewCount ?? 0}</span>
                            <span className="text-gray-600">|</span>
                            <span className="text-blue-400 font-black text-[10px]">EN: {post.viewCountEn ?? 0}</span>
                          </span>
                       </div>
                    </div>
                  </div>

                  {/* Floating Actions */}
                  <div className="flex flex-row lg:flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 absolute right-8 top-1/2 -translate-y-1/2 bg-[#12141c]/90 backdrop-blur-xl p-3 rounded-[2rem] border border-gray-800 shadow-2xl z-20">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(post);
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl shadow-lg transition-all active:scale-90 hover:shadow-blue-600/20 cursor-pointer"
                      title="Edit Post"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post.id);
                      }}
                      className="bg-red-600 hover:bg-red-500 text-white p-4 rounded-2xl shadow-lg transition-all active:scale-90 hover:shadow-red-600/20 cursor-pointer"
                      title="Delete Post"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-40 text-center">
              <div className="w-32 h-32 bg-[#1a1d26] rounded-full flex items-center justify-center text-6xl mb-8 shadow-inner border border-gray-800 animate-bounce">
                📭
              </div>
              <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter italic">No Matches Found</h3>
              <p className="text-gray-500 max-w-sm font-medium">हमें आपकी खोज के अनुसार कोई पोस्ट नहीं मिली। कृपया दूसरे शब्द आज़माएँ।</p>
              {(searchQuery || selectedCategory !== 'all' || selectedPostType !== 'all' || selectedStatus !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setDebouncedSearch("");
                    setSelectedCategory("all");
                    setSelectedPostType("all");
                    setSelectedStatus("all");
                    setCurrentPage(1);
                  }} 
                  className="mt-8 text-red-600 font-black uppercase tracking-widest text-xs hover:underline cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-800 bg-[#1a1d26]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Showing <span className="text-white font-black">{startRecord}</span> - <span className="text-white font-black">{endRecord}</span> of <span className="text-white font-black">{total}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || loading}
                className="px-4 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-xs font-bold text-gray-300 hover:text-white hover:border-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                पिछला
              </button>

              {/* Page Number Pills */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNum, idx) => {
                  if (pageNum === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-2 text-xs text-gray-600 font-bold">
                        ...
                      </span>
                    );
                  }
                  const isCurrent = pageNum === currentPage;
                  return (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => setCurrentPage(Number(pageNum))}
                      disabled={loading}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                        isCurrent
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                          : 'bg-[#0b0c10] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages || loading}
                className="px-4 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-xs font-bold text-gray-300 hover:text-white hover:border-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
              >
                अगला
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
