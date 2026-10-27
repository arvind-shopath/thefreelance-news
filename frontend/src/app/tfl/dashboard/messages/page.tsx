"use client";

import React, { useState, useEffect } from "react";

interface ContactMsg {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  subject: string;
  message: string;
  isRead: boolean;
  status: string;
  createdAt: string;
}

const DEPT_MAP: Record<string, { label: string; color: string; bg: string; border: string }> = {
  editorial: {
    label: "संपादकीय / न्यूज़ टिप",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
  advertising: {
    label: "विज्ञापन एवं साझेदारी",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
  },
  grievance: {
    label: "शिकायत निवारण",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  technical: {
    label: "तकनीकी समस्या",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
  },
  other: {
    label: "सामान्य पूछताछ",
    color: "text-gray-300",
    bg: "bg-gray-700/20",
    border: "border-gray-600/30",
  },
};

export default function DashboardMessagesPage() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMsg, setSelectedMsg] = useState<ContactMsg | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("tfl_admin_token") || "tfl_master_internal_admin_token_2026_xyz9723338321"
          : "tfl_master_internal_admin_token_2026_xyz9723338321";

      const res = await fetch("/api/v1/contact", {
        headers: { "x-admin-token": token },
      });
      if (res.ok) {
        const json = await res.json();
        setMessages(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load contact messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (msg: ContactMsg) => {
    setActionLoadingId(msg.id);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("tfl_admin_token") || "tfl_master_internal_admin_token_2026_xyz9723338321"
          : "tfl_master_internal_admin_token_2026_xyz9723338321";

      const endpoint = msg.isRead ? `/api/v1/contact/${msg.id}/unread` : `/api/v1/contact/${msg.id}/read`;
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "x-admin-token": token },
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: !msg.isRead, status: msg.isRead ? "unread" : "read" } : m))
        );
        if (selectedMsg?.id === msg.id) {
          setSelectedMsg((prev) => (prev ? { ...prev, isRead: !msg.isRead } : null));
        }
        showToast(msg.isRead ? "संदेश अपठित मार्क किया गया" : "संदेश पढ़ा हुआ मार्क किया गया");
      }
    } catch {
      showToast("स्थिति अपडेट करने में समस्या आई");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("क्या आप वाकई इस संदेश को हटाना चाहते हैं?")) return;
    setActionLoadingId(id);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("tfl_admin_token") || "tfl_master_internal_admin_token_2026_xyz9723338321"
          : "tfl_master_internal_admin_token_2026_xyz9723338321";

      const res = await fetch(`/api/v1/contact/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": token },
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMsg?.id === id) setSelectedMsg(null);
        showToast("संदेश सफलतापूर्वक हटा दिया गया");
      }
    } catch {
      showToast("संदेश हटाने में समस्या आई");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered List
  const filteredMessages = messages.filter((m) => {
    if (statusFilter === "unread" && m.isRead) return false;
    if (statusFilter === "read" && !m.isRead) return false;
    if (deptFilter !== "all" && m.department !== deptFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const combined = `${m.name} ${m.email} ${m.phone || ""} ${m.subject} ${m.message}`.toLowerCase();
      if (!combined.includes(q)) return false;
    }
    return true;
  });

  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => !m.isRead).length;
  const editorialCount = messages.filter((m) => m.department === "editorial").length;
  const adsCount = messages.filter((m) => m.department === "advertising").length;
  const grievanceCount = messages.filter((m) => m.department === "grievance").length;

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleString("hi-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return isoStr;
    }
  };

  const cleanPhoneForWhatsApp = (raw?: string) => {
    if (!raw) return "";
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 10) return `91${digits}`;
    return digits;
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm animate-fade-in flex items-center gap-2">
          <span>✓</span> {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#12141c] border border-gray-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/30 text-red-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            Inbound Communications & Leads
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <span>📬</span> संपर्क संदेश व पूछताछ (Contact Messages)
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            वेबसाइट के <code className="text-red-400">/contact</code> पेज से पाठकों, पत्रकारों और विज्ञापनदाताओं द्वारा भेजे गए सभी संदेश यहाँ तुरंत दिखते हैं।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMessages}
            disabled={loading}
            className="flex items-center gap-2 bg-[#181b26] hover:bg-[#202433] text-gray-200 border border-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span> रीफ्रेश करें
          </button>
          <a
            href="/contact"
            target="_blank"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-red-600/30 transition-all"
          >
            <span>👁️</span> लाइव फॉर्म देखें
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-[#12141c] border border-gray-800 p-5 rounded-2xl flex flex-col">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">कुल संदेश</span>
          <span className="text-2xl font-black text-white mt-1">{totalCount}</span>
        </div>

        <div className="bg-[#12141c] border border-red-900/40 p-5 rounded-2xl flex flex-col relative overflow-hidden">
          <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            अपठित (नए)
          </span>
          <span className="text-2xl font-black text-red-500 mt-1">{unreadCount}</span>
        </div>

        <div className="bg-[#12141c] border border-gray-800 p-5 rounded-2xl flex flex-col">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">संपादकीय / न्यूज़ टिप</span>
          <span className="text-2xl font-black text-red-400 mt-1">{editorialCount}</span>
        </div>

        <div className="bg-[#12141c] border border-gray-800 p-5 rounded-2xl flex flex-col">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">विज्ञापन पूछताछ</span>
          <span className="text-2xl font-black text-blue-400 mt-1">{adsCount}</span>
        </div>

        <div className="bg-[#12141c] border border-gray-800 p-5 rounded-2xl flex flex-col">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">शिकायतें</span>
          <span className="text-2xl font-black text-amber-400 mt-1">{grievanceCount}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#12141c] border border-gray-800 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              statusFilter === "all" ? "bg-red-600 text-white shadow-md shadow-red-900/40" : "bg-[#181b26] text-gray-400 hover:text-white"
            }`}
          >
            सभी ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter("unread")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              statusFilter === "unread" ? "bg-red-600 text-white shadow-md shadow-red-900/40" : "bg-[#181b26] text-gray-400 hover:text-white"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            अपठित ({unreadCount})
          </button>
          <button
            onClick={() => setStatusFilter("read")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              statusFilter === "read" ? "bg-red-600 text-white shadow-md shadow-red-900/40" : "bg-[#181b26] text-gray-400 hover:text-white"
            }`}
          >
            पढ़े गए ({totalCount - unreadCount})
          </button>
        </div>

        {/* Department Filter & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-[#181b26] border border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-200 outline-none focus:border-red-500"
          >
            <option value="all">सभी विभाग</option>
            <option value="editorial">संपादकीय / न्यूज़ टिप</option>
            <option value="advertising">विज्ञापन एवं साझेदारी</option>
            <option value="grievance">शिकायत निवारण</option>
            <option value="technical">तकनीकी समस्या</option>
            <option value="other">अन्य</option>
          </select>

          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="नाम, ईमेल, विषय खोजें..."
              className="w-full bg-[#181b26] border border-gray-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-red-500"
            />
            <span className="absolute left-2.5 top-2.5 text-xs text-gray-500">🔍</span>
          </div>
        </div>
      </div>

      {/* Messages List & Detail Modal */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 bg-[#12141c] border border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold">संदेश लोड हो रहे हैं...</span>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="p-16 text-center bg-[#12141c] border border-gray-800 rounded-3xl flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-800/60 text-gray-500 flex items-center justify-center text-3xl">
            📭
          </div>
          <h3 className="text-lg font-bold text-white">कोई संदेश नहीं मिला</h3>
          <p className="text-xs text-gray-400 max-w-sm">
            {searchQuery || deptFilter !== "all" || statusFilter !== "all"
              ? "दिए गए फ़िल्टर के अनुसार कोई संदेश नहीं मिला। कृपया फ़िल्टर बदलें।"
              : "वेबसाइट के Contact Us पेज से अभी कोई नया संदेश नहीं आया है। जब भी कोई पाठक फॉर्म भरेगा, वह यहाँ तुरंत दिखाई देगा।"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredMessages.map((msg) => {
            const dept = DEPT_MAP[msg.department] || DEPT_MAP.other;
            const isActionLoading = actionLoadingId === msg.id;

            return (
              <div
                key={msg.id}
                className={`bg-[#12141c] border transition-all rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-4 ${
                  !msg.isRead
                    ? "border-red-600/40 bg-gradient-to-r from-red-950/20 via-[#12141c] to-[#12141c]"
                    : "border-gray-800/80 hover:border-gray-700"
                }`}
              >
                {/* Top Row: Sender Info & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        !msg.isRead ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300"
                      }`}
                    >
                      {msg.name.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{msg.name}</h3>
                        {!msg.isRead && (
                          <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                            नया संदेश
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mt-0.5">
                        <a href={`mailto:${msg.email}`} className="text-blue-400 hover:underline">
                          ✉️ {msg.email}
                        </a>
                        {msg.phone && (
                          <a href={`tel:${msg.phone}`} className="text-emerald-400 hover:underline">
                            📞 {msg.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${dept.bg} ${dept.color} ${dept.border}`}
                    >
                      {dept.label}
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Subject & Message Content */}
                <div className="bg-[#0b0c10] border border-gray-800/80 rounded-xl p-4">
                  <div className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    विषय: <span className="text-white font-normal normal-case text-sm font-semibold">{msg.subject}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 whitespace-pre-line leading-relaxed mt-2 font-normal">
                    {msg.message}
                  </p>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-800/60">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRead(msg)}
                      disabled={isActionLoading}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#181b26] hover:bg-[#202433] text-gray-300 border border-gray-700 transition-colors"
                    >
                      {msg.isRead ? "✉️ अपठित मार्क करें" : "✓ पढ़ा हुआ मार्क करें"}
                    </button>

                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={isActionLoading}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition-colors"
                    >
                      🗑️ हटाएं
                    </button>
                  </div>

                  {/* Direct Contact Actions */}
                  <div className="flex items-center gap-2">
                    {msg.phone && (
                      <a
                        href={`https://wa.me/${cleanPhoneForWhatsApp(msg.phone)}?text=${encodeURIComponent(
                          `नमस्ते ${msg.name}, The Freelance टीम की ओर से आपके संदेश "${msg.subject}" के संदर्भ में संपर्क किया जा रहा है:`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-950/50"
                      >
                        <span>💬</span> WhatsApp पर चैट करें
                      </a>
                    )}

                    <a
                      href={`mailto:${msg.email}?subject=${encodeURIComponent(
                        `Re: ${msg.subject} - The Freelance Newsroom`
                      )}&body=${encodeURIComponent(
                        `नमस्ते ${msg.name},\n\nहमें The Freelance पर आपका संदेश प्राप्त हुआ था:\n"${msg.message}"\n\n---\nहमारे संपादकीय डेस्क की ओर से जवाब:\n\n\nसस्नेह,\nThe Freelance Editorial Team\nhttps://thefreelance.in`
                      )}`}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 transition-colors shadow-md shadow-red-950/50"
                    >
                      <span>✉️</span> ईमेल से जवाब दें
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
