"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import SearchModal from "@/components/search/SearchModal";

export default function Header() {
  const pathname = usePathname();
  const isEn = pathname === '/en' || (pathname ? pathname.startsWith('/en/') : false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global hotkey: Ctrl+K or '/' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "/" || (e.ctrlKey && e.key === "k")) && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = isEn
    ? [
        { href: "/en/world", label: "World" },
        { href: "/en/national", label: "India" },
        { href: "/en/crime", label: "Crime" },
        { href: "/en/entertainment", label: "Entertainment" },
        { href: "/en/sports", label: "Sports" },
        { href: "/en/lifestyle", label: "Lifestyle" },
        { href: "/en/business", label: "Business" },
        { href: "/en/tech-auto", label: "Tech & Auto" },
        { href: "/en/religion", label: "Religion" },
      ]
    : [
        { href: "/national", label: "देश" },
        { href: "/international", label: "दुनिया" },
        { href: "/crime", label: "क्राइम" },
        { href: "/states", label: "राज्य" },
        { href: "/entertainment", label: "मनोरंजन" },
        { href: "/sports", label: "खेल" },
        { href: "/lifestyle", label: "लाइफस्टाइल" },
        { href: "/business", label: "व्यापार" },
        { href: "/jobs", label: "जॉब्स" },
        { href: "/tech-auto", label: "टेक & ऑटो" },
        { href: "/religion", label: "धर्म" },
      ];

  const getTargetHiUrl = () => {
    if (!pathname) return "/";
    if (pathname === "/en" || pathname === "/en/") return "/";
    if (pathname.startsWith("/en/")) return pathname.replace(/^\/en/, "");
    return pathname;
  };

  const getTargetEnUrl = () => {
    if (!pathname) return "/en";
    if (pathname === "/") return "/en";
    if (pathname === "/en" || pathname.startsWith("/en/")) return pathname;
    return `/en${pathname}`;
  };

  return (
    <header className="header-preserve w-full bg-gradient-to-r from-[#002f87] via-[#004ec4] to-[#0080ff] text-white flex flex-col sticky top-0 z-50 shadow-2xl">
      {/* Main Menu Bar */}
      <div className="w-full border-b border-white/15 h-16 flex items-center px-4 lg:px-8 relative backdrop-blur-sm">
        <div className="flex items-center gap-4 shrink-0">
          {/* Logo Area */}
          <Link href={isEn ? "/en" : "/"} className="flex items-center group py-1">
            <Image 
              src="/tfl-logo.png" 
              alt="TheFreeLance" 
              width={140}
              height={40}
              className="h-10 w-auto object-contain hover:scale-105 transition-transform" 
              priority 
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2.5 xl:gap-3.5 2xl:gap-5 ml-3 xl:ml-6 2xl:ml-8 text-[12px] xl:text-[13px] 2xl:text-[14px] font-black uppercase tracking-tight whitespace-nowrap overflow-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`group/nav relative py-1.5 px-0.5 xl:px-1 text-white font-black transition-all duration-200 hover:-translate-y-0.5 hover:text-red-300 hover:drop-shadow-[0_2px_8px_rgba(239,68,68,0.7)] ${
                  isActive 
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-red-500 after:rounded-full after:shadow-[0_0_10px_rgba(239,68,68,0.9)]" 
                    : "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 hover:after:w-full after:h-[2.5px] after:bg-red-500 after:rounded-full after:transition-all after:duration-250 after:shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                }`}
              >
                <span className="inline-block transition-transform duration-200 group-hover/nav:scale-105">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Support Us, Language Switcher, Search */}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 shrink-0 z-10">
          {/* Language Switcher Pill */}
          <div className="flex items-center bg-[#071326] border border-blue-800/80 rounded-full p-0.5 shadow-inner shrink-0">
            <Link
              href={getTargetHiUrl()}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-black transition-all ${
                !isEn
                  ? "bg-red-600 text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              हिन्दी
            </Link>
            <Link
              href={getTargetEnUrl()}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-black transition-all ${
                isEn
                  ? "bg-red-600 text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              EN
            </Link>
          </div>

          {/* Support Us Button */}
          <Link 
            href={isEn ? "/en/support" : "/support"} 
            className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-200 hover:text-white text-xs sm:text-sm font-bold transition-all shadow-sm group whitespace-nowrap shrink-0"
          >
            <span className="text-red-400 group-hover:scale-110 transition-transform">❤️</span>
            <span>{isEn ? "Support Us" : "सहयोग करें"}</span>
          </Link>

          {/* Search Button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-inner shrink-0 cursor-pointer"
            title={isEn ? "Search (Ctrl+K)" : "खोजें (Ctrl+K)"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>
      </div>

      {/* Modern Search Modal Overlay */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </header>
  );
}
