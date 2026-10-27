"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

interface Slide {
  id?: string;
  order: number;
  title: string;
  content: string;
  image: string;
}

interface Story {
  id: string;
  headline: string;
  headlineEn?: string;
  slug: string;
  slugEn?: string;
  summary: string;
  image?: string;
  categoryStr: string;
  postType: string;
  isPublished: boolean;
  slides?: Slide[];
  createdAt?: string;
}

function formatDateTime(dateStr?: string) {
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

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [saving, setSaving] = useState(false);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [lastSyncTime, setLastSyncTime] = useState("");

  // Form states
  const [headline, setHeadline] = useState('');
  const [headlineEn, setHeadlineEn] = useState('');
  const [categoryStr, setCategoryStr] = useState('tech-auto');
  const [coverImage, setCoverImage] = useState('');
  const [slides, setSlides] = useState<Slide[]>([
    { order: 1, title: '', content: '', image: '' }
  ]);

  // Debounce search
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setCurrentPage(1);
    }, 350);
  };

  const fetchStories = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setIsRefreshing(true);
    try {
      const q = new URLSearchParams();
      q.set('postType', 'visual-story');
      q.set('isPublished', 'all');
      q.set('page', String(currentPage));
      q.set('limit', String(limit));
      if (debouncedSearch.trim()) q.set('search', debouncedSearch.trim());

      const res = await fetch(`/api/v1/articles?${q.toString()}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const list: Story[] = json.data || [];
        setStories(list);
        setTotal(json.total ?? list.length);
        setTotalPages(json.totalPages ?? Math.max(1, Math.ceil((json.total ?? list.length) / limit)));
        setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      }
    } catch (e) {
      console.error('Failed to load stories:', e);
    } finally {
      if (!isSilent) setLoading(false);
      setIsRefreshing(false);
    }
  }, [currentPage, limit, debouncedSearch]);

  useEffect(() => {
    fetchStories(false);
    const interval = setInterval(() => {
      fetchStories(true); // Silent real-time background poll
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchStories]);

  const openCreateModal = () => {
    setEditingStory(null);
    setHeadline('');
    setHeadlineEn('');
    setCategoryStr('tech-auto');
    setCoverImage('');
    setSlides([
      { order: 1, title: '', content: '', image: '' },
      { order: 2, title: '', content: '', image: '' }
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (story: Story) => {
    setEditingStory(story);
    setHeadline(story.headline || '');
    setHeadlineEn(story.headlineEn || '');
    setCategoryStr(story.categoryStr || 'tech-auto');
    setCoverImage(story.image || '');
    if (story.slides && story.slides.length > 0) {
      setSlides(story.slides.map((s, idx) => ({
        ...s,
        order: idx + 1,
        title: s.title || '',
        content: s.content || '',
        image: s.image || ''
      })));
    } else {
      setSlides([{ order: 1, title: '', content: '', image: '' }]);
    }
    setIsModalOpen(true);
  };

  const addSlide = () => {
    setSlides([
      ...slides,
      { order: slides.length + 1, title: '', content: '', image: '' }
    ]);
  };

  const removeSlide = (index: number) => {
    if (slides.length <= 1) {
      alert('कम से कम एक स्लाइड होना आवश्यक है!');
      return;
    }
    const updated = slides.filter((_, i) => i !== index).map((s, idx) => ({ ...s, order: idx + 1 }));
    setSlides(updated);
  };

  const handleSlideChange = (index: number, field: keyof Slide, value: string) => {
    const newSlides = [...slides];
    (newSlides[index] as any)[field] = value;
    setSlides(newSlides);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) {
      alert('कृपया मुख्य हेडलाइन दर्ज करें!');
      return;
    }

    setSaving(true);
    try {
      const slugBase = editingStory?.slug || headline.toLowerCase().replace(/[^a-z0-9\u0900-\u097F]+/g, '-').replace(/(^-|-$)+/g, '') || `story-${Date.now()}`;
      const slugEnVal = headlineEn 
        ? headlineEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-en'
        : (editingStory?.slugEn || `${slugBase}-en`);

      const payload = {
        headline,
        headlineEn: headlineEn || headline,
        slug: slugBase,
        slugEn: slugEnVal,
        summary: slides[0]?.content || headline,
        summaryEn: slides[0]?.content || headlineEn || headline,
        image: coverImage || slides[0]?.image || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80',
        categoryStr,
        postType: 'visual-story',
        isPublished: true,
        isTrending: true,
        slides: slides.map((s, idx) => ({
          order: idx + 1,
          title: s.title || '',
          content: s.content || '',
          image: s.image || coverImage || ''
        }))
      };

      const url = editingStory 
        ? `/api/v1/articles/${editingStory.id}`
        : '/api/v1/articles';
      
      const method = editingStory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        await fetchStories(false);
      } else {
        alert('स्टोरी सेव करने में त्रुटि हुई!');
      }
    } catch (err) {
      console.error('Error saving story:', err);
      alert('सर्वर से संपर्क नहीं हो सका!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`क्या आप वाकई स्टोरी "${title}" को हटाना चाहते हैं?`)) return;

    try {
      const res = await fetch(`/api/v1/articles/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchStories(false);
      } else {
        alert('डिलीट करने में विफलता!');
      }
    } catch (e) {
      console.error('Failed to delete story:', e);
      alert('सर्वर त्रुटि!');
    }
  };

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
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#12141c] to-[#0b0c10] border border-gray-800 p-8 rounded-[2.5rem] shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-white uppercase tracking-tight italic">
              विजुअल वेब स्टोरीज़ <span className="text-purple-500">(Visual Stories)</span>
            </h1>
            <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-black px-3.5 py-1 rounded-full">
              {total} स्टोरीज़ उपलब्ध
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              लाइव (30s)
            </span>
          </div>
          <p className="text-gray-400 text-sm flex flex-wrap items-center gap-2">
            <span>गूगल वेब-स्टोरीज़ फॉर्मेट में फुल-स्क्रीन स्लाइड आधारित विजुअल स्टोरीज का संपूर्ण प्रबंधन</span>
            {lastSyncTime && <span className="text-xs text-gray-500 font-mono">({lastSyncTime})</span>}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => fetchStories(false)}
            disabled={isRefreshing}
            className="bg-[#1a1d26] hover:bg-gray-800 text-gray-200 border border-gray-700 font-bold px-4 py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
            title="रिफ्रेश करें"
          >
            <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-purple-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            रिफ्रेश
          </button>
          <button
            onClick={openCreateModal}
            className="bg-purple-600 hover:bg-purple-500 text-white font-black text-sm px-6 py-3 rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <span>✨</span>
            <span>+ नई विजुअल स्टोरी बनाएं</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="bg-[#12141c] border border-gray-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <input
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl px-10 py-2.5 text-xs text-white outline-none focus:border-purple-500 transition-all"
            placeholder="खोजें: विजुअल स्टोरी हेडलाइन या टॉपिक..."
          />
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs bg-gray-800 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0b0c10] border border-gray-800 rounded-xl px-3 py-1.5">
            <span className="text-[11px] font-bold text-gray-500 uppercase">प्रति पेज:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
            >
              <option value={9} className="bg-[#12141c]">9</option>
              <option value={12} className="bg-[#12141c]">12</option>
              <option value={24} className="bg-[#12141c]">24</option>
              <option value={48} className="bg-[#12141c]">48</option>
            </select>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            दिखा रहे हैं {startRecord} - {endRecord} (कुल {total})
          </span>
        </div>
      </div>

      {/* Stories Listing */}
      {loading ? (
        <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-24 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">विजुअल स्टोरीज लोड हो रही हैं...</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-16 text-center flex flex-col items-center gap-4">
          <span className="text-5xl">📱</span>
          <h3 className="text-xl font-bold text-white">कोई विजुअल स्टोरी नहीं मिली</h3>
          <p className="text-gray-400 text-xs max-w-md">
            {searchQuery ? "आपकी खोज के अनुसार कोई विजुअल स्टोरी नहीं मिली।" : "डेटाबेस में विजुअल स्टोरी लोड हो रही है या अभी तैयार हो रही है।"}
          </p>
          {searchQuery ? (
            <button onClick={() => handleSearchChange("")} className="text-purple-400 text-xs font-bold hover:underline cursor-pointer">
              सर्च हटाएं
            </button>
          ) : (
            <button
              onClick={openCreateModal}
              className="bg-purple-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-purple-500 transition-colors cursor-pointer"
            >
              + पहली स्टोरी बनाएं
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map(story => {
            const slideCount = story.slides?.length || 0;
            const dt = formatDateTime(story.createdAt);
            return (
              <div
                key={story.id}
                className="bg-[#12141c] border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-purple-500/50 transition-all duration-300"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative h-48 w-full bg-[#0b0c10] overflow-hidden">
                    <img
                      src={story.image || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80'}
                      alt={story.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-black/80 backdrop-blur-md text-white text-[11px] font-black px-2.5 py-1 rounded-md border border-white/20">
                        {slideCount} स्लाइड्स
                      </span>
                      <span className="bg-purple-600 text-white text-[11px] font-bold px-2 py-1 rounded-md uppercase">
                        {story.categoryStr}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-white font-bold text-base leading-snug line-clamp-2 mb-2 group-hover:text-purple-400 transition-colors">
                      {story.headline}
                    </h3>
                    {story.headlineEn && (
                      <p className="text-gray-400 text-xs line-clamp-1 italic mb-2">
                        EN: {story.headlineEn}
                      </p>
                    )}
                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3">
                      {story.summary}
                    </p>

                    {/* Exact Date & Time */}
                    <div className="pt-2 border-t border-gray-800/60 flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                      <svg className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span className="text-gray-300 font-medium">{dt.full}</span>
                      {dt.relative && (
                        <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20 ml-auto font-sans">
                          {dt.relative}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-[#0e1017] border-t border-gray-800/80 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(story)}
                      className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white font-bold px-3 py-1.5 rounded-lg border border-blue-500/30 transition-colors cursor-pointer"
                    >
                      संपादित करें ✏️
                    </button>
                    <Link
                      href={`/web-stories/${story.slug}`}
                      target="_blank"
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      देखें ↗
                    </Link>
                  </div>

                  <button
                    onClick={() => handleDelete(story.id, story.headline)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/40 p-1.5 rounded-lg transition-colors cursor-pointer"
                    title="डिलीट करें"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="p-5 rounded-2xl border border-gray-800 bg-[#12141c] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-400 font-medium">
            दिखा रहे हैं <span className="text-white font-bold">{startRecord}</span> - <span className="text-white font-bold">{endRecord}</span> (कुल {total})
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || loading}
              className="px-4 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-xs font-bold text-gray-300 hover:text-white hover:border-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              पिछला
            </button>

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
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                        : 'bg-[#0b0c10] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || loading}
              className="px-4 py-2 rounded-xl bg-[#0b0c10] border border-gray-800 text-xs font-bold text-gray-300 hover:text-white hover:border-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              अगला
            </button>
          </div>
        </div>
      )}

      {/* Slide Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#12141c] border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 flex flex-col gap-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-800">
              <div>
                <h2 className="text-2xl font-black text-white">
                  {editingStory ? 'विजुअल स्टोरी संपादित करें (Edit Story)' : 'नई विजुअल स्टोरी बनाएं (Create Story)'}
                </h2>
                <p className="text-xs text-gray-400">
                  सभी स्लाइड्स का टेक्स्ट, चित्र और क्रम यहाँ से व्यवस्थित करें
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-white text-2xl font-bold p-1 leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-6">
              {/* Main Story Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0b0c10] p-4 rounded-xl border border-gray-800">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                    मुख्य हेडलाइन (हिंदी) *
                  </label>
                  <input
                    type="text"
                    required
                    value={headline}
                    onChange={e => setHeadline(e.target.value)}
                    placeholder="उदा. 2026 के टॉप 5 स्मार्टफोन..."
                    className="w-full bg-[#12141c] border border-gray-800 rounded-xl p-3 text-white text-sm focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                    Headline (English)
                  </label>
                  <input
                    type="text"
                    value={headlineEn}
                    onChange={e => setHeadlineEn(e.target.value)}
                    placeholder="e.g. Top 5 Best Smartphones in 2026..."
                    className="w-full bg-[#12141c] border border-gray-800 rounded-xl p-3 text-white text-sm focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                    श्रेणी (Category)
                  </label>
                  <select
                    value={categoryStr}
                    onChange={e => setCategoryStr(e.target.value)}
                    className="w-full bg-[#12141c] border border-gray-800 rounded-xl p-3 text-white text-sm focus:border-purple-500 outline-none"
                  >
                    <option value="tech-auto">टेक & ऑटो (Tech & Auto)</option>
                    <option value="special">स्पेशल (Special)</option>
                    <option value="lifestyle">लाइफस्टाइल (Lifestyle)</option>
                    <option value="entertainment">मनोरंजन (Entertainment)</option>
                    <option value="sports">खेल (Sports)</option>
                    <option value="national">देश (National)</option>
                    <option value="states">राज्य (States)</option>
                    <option value="business">व्यापार (Business)</option>
                    <option value="education">एजुकेशन (Education)</option>
                    <option value="religion">धर्म (Religion)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                    कवर इमेज URL (Cover Image)
                  </label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={e => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#12141c] border border-gray-800 rounded-xl p-3 text-white text-sm focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Slides Section */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🎞️</span>
                    <span>स्टोरी की स्लाइड्स ({slides.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addSlide}
                    className="text-xs bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
                  >
                    + नई स्लाइड जोड़ें
                  </button>
                </div>

                <div className="space-y-4">
                  {slides.map((slide, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0b0c10] border border-gray-800 rounded-xl p-4 relative group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-purple-600 text-white text-xs font-black px-2.5 py-0.5 rounded-md">
                          स्लाइड #{idx + 1}
                        </span>
                        {slides.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSlide(idx)}
                            className="text-xs text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            स्लाइड हटाएं ✕
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase">
                            स्लाइड टाइटल / हेडलाइन
                          </label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={e => handleSlideChange(idx, 'title', e.target.value)}
                            placeholder="उदा. 1. सुपरफास्ट 5G प्रोसेसर"
                            className="w-full bg-[#12141c] border border-gray-800 rounded-lg p-2.5 text-white text-xs focus:border-purple-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase">
                            स्लाइड इमेज URL
                          </label>
                          <input
                            type="url"
                            value={slide.image}
                            onChange={e => handleSlideChange(idx, 'image', e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-[#12141c] border border-gray-800 rounded-lg p-2.5 text-white text-xs focus:border-purple-500 outline-none"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase">
                            संक्षिप्त विवरण (Short Content / Caption)
                          </label>
                          <textarea
                            rows={2}
                            value={slide.content}
                            onChange={e => handleSlideChange(idx, 'content', e.target.value)}
                            placeholder="स्लाइड का छोटा विवरण या खास बात..."
                            className="w-full bg-[#12141c] border border-gray-800 rounded-lg p-2.5 text-white text-xs focus:border-purple-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-gray-800 flex justify-end items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white text-sm font-bold transition-colors cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-black text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'सेव हो रहा है...' : 'स्टोरी सेव करें ✓'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
