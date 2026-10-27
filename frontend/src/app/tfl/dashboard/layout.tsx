"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { clearAllWebsiteCacheAction } from '@/lib/actions';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [cacheMessage, setCacheMessage] = useState<string | null>(null);

  const handleClearCache = async () => {
    setIsClearingCache(true);
    setCacheMessage(null);
    try {
      const res = await clearAllWebsiteCacheAction();
      if (res?.success) {
        setCacheMessage('कैश क्लियर हो गया!');
        setTimeout(() => setCacheMessage(null), 4000);
      } else {
        setCacheMessage('त्रुटि आई');
        setTimeout(() => setCacheMessage(null), 4000);
      }
    } catch {
      setCacheMessage('त्रुटि आई');
      setTimeout(() => setCacheMessage(null), 4000);
    } finally {
      setIsClearingCache(false);
    }
  };

  // Strict Authentication Guard & Theme Isolation
  useEffect(() => {
    // Admin Dashboard must ALWAYS run in pure dark mode
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('tfl_admin_token') : null;
    const hasClientAuth = typeof document !== 'undefined' && (document.cookie.includes('tfl_admin_session') || document.cookie.includes('tfl_admin_client_auth'));

    if (token || hasClientAuth) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      // Unauthorized: bounce to Home page immediately
      router.replace('/');
    }

    return () => {
      // When leaving admin dashboard, restore public theme
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('tfl-theme');
        document.documentElement.setAttribute('data-theme', saved === 'dark' ? 'dark' : 'light');
      }
    };
  }, [pathname, router]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tfl_admin_token');
      localStorage.removeItem('tfl_admin_user');
      localStorage.removeItem('tfl_admin_login_time');
      document.cookie = 'tfl_admin_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
      document.cookie = 'tfl_admin_client_auth=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    }
    router.replace('/');
  };

  // If still checking or unauthorized, render absolute black blank screen (never flash admin UI)
  if (isAuthenticated !== true) {
    return (
      <div className="min-h-screen bg-[#050608] flex items-center justify-center text-gray-500 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
          <span>Authenticating...</span>
        </div>
      </div>
    );
  }

  const menuGroups = [
    {
      groupTitle: "एनालिटिक्स एवं ओवरव्यू",
      items: [
        { name: "डैशबोर्ड (Overview)", href: "/tfl/dashboard", icon: "📊" },
        { name: "⚡ गूगल इंस्टेंट इंडेक्सिंग (Indexing)", href: "/tfl/dashboard/indexing", icon: "⚡" },
        { name: "ट्रैफिक इंटेलिजेंस व एनालिसिस", href: "/tfl/dashboard/traffic", icon: "🚦" },
        { name: "सोर्स एवं पोर्टल एनालिटिक्स", href: "/tfl/dashboard/sources", icon: "📈" },
        { name: "इंग्लिश पोर्टल सेटिंग्स (Bilingual / EN)", href: "/tfl/dashboard/bilingual", icon: "🌐" },
      ],
    },

    {
      groupTitle: "कंटेंट एवं लेआउट",
      items: [
        { name: "होमपेज मैनेजमेंट", href: "/tfl/dashboard/homepage", icon: "🏠" },
        { name: "कैटेगरी मैनेजमेंट", href: "/tfl/dashboard/categories", icon: "🗂️" },
        { name: "सभी पोस्ट्स (Posts)", href: "/tfl/dashboard/posts", icon: "📝" },
        { name: "मीडिया लाइब्रेरी (Media Library)", href: "/tfl/dashboard/media", icon: "🖼️" },
        { name: "विजुअल वेब स्टोरीज़", href: "/tfl/dashboard/stories", icon: "📱" },
        { name: "फोटो स्टोरीज़ (Photo Stories)", href: "/tfl/dashboard/galleries", icon: "📸" },
        { name: "🗳️ इलेक्शन रिजल्ट (Election Results)", href: "/tfl/dashboard/election", icon: "🗳️" },
      ],
    },
    {
      groupTitle: "ऑटोमेशन एवं AI",
      items: [
        { name: "आरएसएस (RSS Feeds)", href: "/tfl/dashboard/rss", icon: "📡" },
        { name: "एआई एपीआई कीज (Gemini)", href: "/tfl/dashboard/ai-keys", icon: "🤖" },
        { name: "ऑटोमेशन लॉग्स", href: "/tfl/dashboard/logs", icon: "⚙️" },
      ],
    },
    {
      groupTitle: "मोनेटाइजेशन एवं सेटिंग्स",
      items: [
        { name: "ऐड्स व एडसेंस (Ads & AdSense)", href: "/tfl/dashboard/ads", icon: "💰" },
        { name: "एसईओ सेटिंग्स (SEO)", href: "/tfl/dashboard/seo", icon: "🔍" },
        { name: "सपोर्ट व UPI (Support Us)", href: "/tfl/dashboard/support", icon: "❤️" },
        { name: "संपर्क संदेश (Inquiries)", href: "/tfl/dashboard/messages", icon: "📬" },
      ],
    },
  ];

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </head>

      <div className="min-h-screen bg-[#050608] text-white flex select-none tfl-admin-dashboard-isolated" data-tfl-admin="true">
        
        {/* Sidebar */}
        <aside className={`bg-[#0b0c10] border-r border-gray-800 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
            <div className={`flex items-center gap-3 overflow-hidden ${!isSidebarOpen && 'hidden'}`}>
              <div className="relative w-28 h-9">
                <Image src="/tfl-logo.png" alt="TFL" fill className="object-contain" priority />
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 scrollbar-hide space-y-4">
            {menuGroups.map((group, gIdx) => (
              <div key={gIdx} className="px-2">
                {isSidebarOpen && (
                  <div className="px-3 pb-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {group.groupTitle}
                  </div>
                )}
                <nav className="flex flex-col gap-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
                          isActive ? 'bg-red-600 text-white font-bold shadow-md shadow-red-900/30' : 'text-gray-400 hover:bg-[#12141c] hover:text-white'
                        }`}
                        title={item.name}
                      >
                        <span className="text-lg">{item.icon}</span>
                        {isSidebarOpen && <span className="text-xs font-semibold">{item.name}</span>}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* User & Logout */}
          <div className="p-4 border-t border-gray-800 space-y-2">
            {isSidebarOpen && (
              <div className="px-3 py-1.5 text-[11px] text-gray-500 font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>User: 9723338321</span>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-red-600/20 hover:border-red-500/30 border border-transparent transition-all rounded-lg text-left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              {isSidebarOpen && <span className="text-xs font-bold text-red-400">लॉग आउट (Logout)</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Header */}
          <header className="h-16 bg-[#0b0c10] border-b border-gray-800 flex items-center justify-between px-8 flex-shrink-0">
            <div className="flex items-center gap-6">
              <h2 className="text-lg font-bold text-gray-200">The Freelance - Control Center</h2>
              <Link 
                href="/" 
                target="_blank" 
                className="flex items-center gap-2 bg-blue-600/10 text-blue-400 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all"
              >
                <span>🌐</span>
                <span>वेबसाइट लाइव देखें</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              {/* Clear Cache Working Button */}
              <button
                onClick={handleClearCache}
                disabled={isClearingCache}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  cacheMessage
                    ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40'
                    : isClearingCache
                    ? 'bg-amber-600/20 text-amber-400 border-amber-500/40 cursor-wait'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500 hover:text-black shadow-sm'
                }`}
                title="पूरी वेबसाइट का कैश तुरंत साफ करें और नया डेटा लोड करें"
              >
                {isClearingCache ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></span>
                    <span>कैश साफ हो रहा है...</span>
                  </>
                ) : cacheMessage ? (
                  <>
                    <span>✅</span>
                    <span>{cacheMessage}</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>क्लियर कैश (Clear Cache)</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                AUTO CRON RUNNING
              </div>
              <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center text-xs font-bold font-mono">
                A
              </div>
            </div>
          </header>

          {/* Dynamic Page Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {children}
          </div>
        </main>

      </div>
    </>
  );
}
