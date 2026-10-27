"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface MediaItem {
  id: string;
  title: string;
  filename: string;
  url: string;
  filePath?: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  category: string;
  tags?: string;
  source: string;
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("national");
  const [uploadTags, setUploadTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Import URL Form State
  const [importUrl, setImportUrl] = useState("");
  const [importTitle, setImportTitle] = useState("");
  const [importCategory, setImportCategory] = useState("national");
  const [importTags, setImportTags] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      q.set("page", page.toString());
      q.set("limit", "24");
      if (search.trim()) q.set("search", search.trim());
      if (categoryFilter !== "all") q.set("category", categoryFilter);
      if (sourceFilter !== "all") q.set("source", sourceFilter);

      const res = await fetch(`/api/v1/media?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.data || []);
        setTotalCount(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error("Failed to load media items:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [page, categoryFilter, sourceFilter]);

  // Handle Search submit / debounce
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMedia();
  };

  const copyToClipboard = (url: string, id: string) => {
    const fullUrl = url.startsWith("http") ? url : `https://thefreelance.in${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError("कृपया एक इमेज फाइल चुनें");
      return;
    }

    setIsSubmitting(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      if (uploadTitle) formData.append("title", uploadTitle);
      if (uploadCategory) formData.append("category", uploadCategory);
      if (uploadTags) formData.append("tags", uploadTags);

      const res = await fetch("/api/v1/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("तस्वीर अपलोड करने में विफल");
      }

      setIsUploadOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setUploadTags("");
      fetchMedia();
    } catch (err: any) {
      setUploadError(err.message || "अपलोड विफल रहा");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl || !importUrl.startsWith("http")) {
      setImportError("मान्य इमेज URL प्रविष्ट करें (http/https)");
      return;
    }

    setIsSubmitting(true);
    setImportError(null);

    try {
      const res = await fetch("/api/v1/media/import-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: importUrl,
          title: importTitle,
          category: importCategory,
          tags: importTags,
        }),
      });

      if (!res.ok) {
        throw new Error("इमेज डाउनलोड करने में विफल");
      }

      setIsImportOpen(false);
      setImportUrl("");
      setImportTitle("");
      setImportTags("");
      fetchMedia();
    } catch (err: any) {
      setImportError(err.message || "इम्पोर्ट विफल रहा");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("क्या आप वाकई इस तस्वीर को हमेशा के लिए डिलीट करना चाहते हैं?")) return;

    try {
      const res = await fetch(`/api/v1/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.id !== id));
        setTotalCount((prev) => Math.max(0, prev - 1));
        if (selectedItem?.id === id) setSelectedItem(null);
      }
    } catch (e) {
      alert("डिलीट करने में विफल");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / 1024).toFixed(0) + " KB";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>🖼️</span> मीडिया लाइब्रेरी (Media Library)
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
              {totalCount} तस्वीरें सुरक्षित
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            वेबसाइट के अपने सर्वर पर सुरक्षित स्थानीय (Local) तस्वीरें। 100% सिक्योर, हाई-स्पीड और कभी न टूटने वाली इमेज।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-red-900/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            नई तस्वीर अपलोड करें
          </button>

          <button
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#1b1e28] hover:bg-[#252a38] text-gray-200 border border-gray-700 rounded-lg text-xs font-bold transition-all"
          >
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            URL से आयात करें
          </button>

          <button
            onClick={fetchMedia}
            title="रिफ्रेश करें"
            className="p-2 bg-[#12141c] hover:bg-[#1a1d27] border border-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f1118] border border-gray-800/80 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="नाम, टैग्स या कीवर्ड से खोजें..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#07080c] border border-gray-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
          />
          <svg className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </form>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#07080c] border border-gray-700/80 text-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-500"
          >
            <option value="all">सभी श्रेणियां (All Categories)</option>
            <option value="politics">राजनीति व रैलियां (Politics / Rallies)</option>
            <option value="national">राष्ट्रीय व संसद (National / Parliament)</option>
            <option value="crime">क्राइम व पुलिस (Crime & Police)</option>
            <option value="world">अंतरराष्ट्रीय व बुर्ज खलीफा (World / Cities)</option>
            <option value="tech">टेक व मोबाइल (Tech & Mobile)</option>
            <option value="business">व्यापार, शेयर बाजार व एलपीजी (Business / LPG)</option>
            <option value="lifestyle">लाइफस्टाइल व सेहत (Lifestyle & Health)</option>
            <option value="education">शिक्षा व सरकारी नौकरी (Education & Jobs)</option>
            <option value="sports">खेल (Sports)</option>
            <option value="entertainment">मनोरंजन (Entertainment)</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#07080c] border border-gray-700/80 text-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-500"
          >
            <option value="all">सभी स्रोत (All Sources)</option>
            <option value="verified">प्रमाणित लाइब्रेरी (Verified 16:9)</option>
            <option value="upload">अपलोड की गई (Uploads)</option>
            <option value="crawler">ऑटो इनजेस्ट (Crawler)</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-gray-500 gap-3">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono">तस्वीरें लोड हो रही हैं...</span>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="bg-[#0f1118] border border-dashed border-gray-800 rounded-2xl py-20 text-center space-y-3">
          <div className="text-4xl">📸</div>
          <h3 className="text-base font-bold text-gray-200">कोई तस्वीर नहीं मिली</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            आपके चुने गए फ़िल्टर या खोज के अनुसार कोई तस्वीर नहीं है। नई तस्वीर अपलोड करें या URL से आयात करें।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {mediaList.map((item) => {
            const isCopied = copiedId === item.id;
            const isDiscoverReady = (item.width && item.width >= 1200) || item.source === "verified" || item.category === "politics";
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative bg-[#0b0c10] border border-gray-800 hover:border-red-500/80 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:shadow-black/60 flex flex-col"
              >
                {/* 16:9 Thumbnail for Google Discover Preview */}
                <div className="relative aspect-[16/9] w-full bg-gray-900 overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute top-1.5 right-1.5 flex flex-col items-end gap-1">
                    {isDiscoverReady && (
                      <span className="bg-amber-400 text-black text-[8px] font-black px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                        ⚡ 16:9 DISCOVER
                      </span>
                    )}
                    {item.source === "verified" && (
                      <span className="bg-emerald-500/90 text-black text-[8px] font-black px-1.5 py-0.5 rounded shadow">
                        ✓ VERIFIED
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1.5">
                  <p className="text-[11px] font-bold text-gray-200 line-clamp-1 group-hover:text-red-400 transition-colors" title={item.title}>
                    {item.title}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-gray-500">
                    <span className="capitalize">{item.category}</span>
                    <span>{item.width ? `${item.width}×${item.height || 675}` : formatFileSize(item.fileSize)}</span>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-1.5 border-t border-gray-800/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(item.url, item.id);
                      }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                        isCopied ? "bg-emerald-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {isCopied ? "कॉपी हो गया!" : "🔗 कॉपी"}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="text-gray-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-colors"
                      title="डिलीट करें"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-lg bg-[#12141c] border border-gray-800 text-xs text-gray-300 disabled:opacity-40"
          >
            ← पिछला
          </button>
          <span className="text-xs text-gray-500 font-mono">
            पेज {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded-lg bg-[#12141c] border border-gray-800 text-xs text-gray-300 disabled:opacity-40"
          >
            अगला →
          </button>
        </div>
      )}

      {/* Detail / Full View Modal (WordPress style) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1118] border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
            {/* Image Preview Box */}
            <div className="relative flex-1 bg-black/60 min-h-[300px] md:min-h-[460px] flex items-center justify-center p-4">
              <div className="relative w-full h-full min-h-[280px]">
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="w-full md:w-80 bg-[#0b0c10] border-t md:border-t-0 md:border-l border-gray-800 p-5 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">तस्वीर विवरण</h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-gray-400 text-[10px] uppercase font-bold block mb-1">शीर्षक (Title)</label>
                    <p className="text-white font-medium bg-[#141620] p-2 rounded border border-gray-800">
                      {selectedItem.title}
                    </p>
                  </div>

                  <div>
                    <label className="text-gray-400 text-[10px] uppercase font-bold block mb-1">स्थानीय URL (Local URL)</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        readOnly
                        value={`https://thefreelance.in${selectedItem.url}`}
                        className="w-full bg-[#141620] border border-gray-800 rounded p-1.5 text-[11px] text-gray-300 font-mono select-all"
                      />
                      <button
                        onClick={() => copyToClipboard(selectedItem.url, selectedItem.id)}
                        className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold shrink-0"
                      >
                        {copiedId === selectedItem.id ? "✓" : "कॉपी"}
                      </button>
                    </div>
                  </div>

                  {selectedItem.tags && (
                    <div>
                      <label className="text-gray-400 text-[10px] uppercase font-bold block mb-1">खोज टैग्स (Tags)</label>
                      <div className="flex flex-wrap gap-1">
                        {selectedItem.tags.split(",").map((t, idx) => (
                          <span key={idx} className="bg-gray-800 text-gray-300 text-[10px] px-2 py-0.5 rounded">
                            #{t.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-800 space-y-1 text-gray-400 text-[11px]">
                    <p>श्रेणी: <span className="text-gray-200 capitalize font-medium">{selectedItem.category}</span></p>
                    <p>रिज़ॉल्यूशन: <span className="text-amber-400 font-bold font-mono">{selectedItem.width || 1200} × {selectedItem.height || 675} px</span> <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded font-bold ml-1">⚡ Google Discover Ready (16:9)</span></p>
                    <p>साइज़: <span className="text-gray-200 font-medium">{formatFileSize(selectedItem.fileSize)}</span></p>
                    <p>प्रारूप: <span className="text-gray-200 font-mono">{selectedItem.mimeType}</span></p>
                    <p>स्रोत: <span className="text-gray-200 capitalize font-medium">{selectedItem.source}</span></p>
                    <p>अपलोड तारीख: <span className="text-gray-200">{new Date(selectedItem.createdAt).toLocaleDateString("hi-IN")}</span></p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <button
                  onClick={() => handleDelete(selectedItem.id)}
                  className="w-full py-2 bg-red-600/10 hover:bg-red-600 border border-red-500/30 hover:border-red-600 text-red-400 hover:text-white rounded-lg text-xs font-bold transition-all"
                >
                  डिलीट करें (Delete Permanently)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Image Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1118] border border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📤</span> नई तस्वीर अपलोड करें
              </h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {uploadError && (
                <div className="p-3 bg-red-600/20 border border-red-500/40 rounded-lg text-red-300 text-xs">
                  {uploadError}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">इमेज फाइल चुनें</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setUploadFile(f);
                      if (!uploadTitle) setUploadTitle(f.name.replace(/\.[^/.]+$/, ""));
                    }
                  }}
                  className="w-full bg-[#07080c] border border-gray-700 rounded-lg p-2 text-xs text-gray-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">तस्वीर का शीर्षक (Title)</label>
                <input
                  type="text"
                  placeholder="उदा. राहुल गांधी रैली भाषण"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-[#07080c] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">कैटेगरी</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full bg-[#07080c] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="national">राष्ट्रीय (National)</option>
                    <option value="politics">राजनीति (Politics)</option>
                    <option value="education">शिक्षा व नौकरी</option>
                    <option value="business">व्यापार व एलपीजी</option>
                    <option value="sports">खेल (Sports)</option>
                    <option value="entertainment">मनोरंजन</option>
                    <option value="states">राज्य</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">टैग्स (Tags - अल्पविराम से अलग)</label>
                  <input
                    type="text"
                    placeholder="उदा. modi, bjp, delhi"
                    value={uploadTags}
                    onChange={(e) => setUploadTags(e.target.value)}
                    className="w-full bg-[#07080c] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !uploadFile}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "अपलोड हो रहा है..." : "अपलोड सुरक्षित करें"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import from URL Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1118] border border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🔗</span> इंटरनेट यूआरएल (URL) से डाउनलोड करें
              </h3>
              <button onClick={() => setIsImportOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              {importError && (
                <div className="p-3 bg-red-600/20 border border-red-500/40 rounded-lg text-red-300 text-xs">
                  {importError}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">इमेज का वेब लिंक (Image URL)</label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  className="w-full bg-[#07080c] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  required
                />
                <p className="text-[10px] text-gray-500 mt-1">सिस्टम इस इमेज को सर्वर पर डाउनलोड करके आपके निजी /uploads/ में सुरक्षित कर लेगा।</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">तस्वीर का शीर्षक (Title)</label>
                <input
                  type="text"
                  placeholder="उदा. सुप्रीम कोर्ट भवन दिल्ली"
                  value={importTitle}
                  onChange={(e) => setImportTitle(e.target.value)}
                  className="w-full bg-[#07080c] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">कैटेगरी</label>
                  <select
                    value={importCategory}
                    onChange={(e) => setImportCategory(e.target.value)}
                    className="w-full bg-[#07080c] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="national">राष्ट्रीय (National)</option>
                    <option value="politics">राजनीति (Politics)</option>
                    <option value="education">शिक्षा व नौकरी</option>
                    <option value="business">व्यापार व एलपीजी</option>
                    <option value="sports">खेल (Sports)</option>
                    <option value="entertainment">मनोरंजन</option>
                    <option value="states">राज्य</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">खोज टैग्स (Tags)</label>
                  <input
                    type="text"
                    placeholder="उदा. supreme court, law"
                    value={importTags}
                    onChange={(e) => setImportTags(e.target.value)}
                    className="w-full bg-[#07080c] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImportOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !importUrl}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "डाउनलोड हो रहा है..." : "सर्वर पर सुरक्षित करें"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
