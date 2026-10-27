"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // If on visual-stories full screen, hide bottom nav
  if (pathname?.startsWith("/web-stories/")) {
    return null;
  }

  const isEn = pathname === '/en' || (pathname ? pathname.startsWith('/en') : false);

  const items = isEn ? [
    { href: "/en", label: "Home", icon: "🏠" },
    { href: "/en/world", label: "World", icon: "🌐" },
    { href: "/en/national", label: "India", icon: "🇮🇳" },
    { href: "/en/crime", label: "Crime", icon: "🚨" },
    { href: "/en/entertainment", label: "Entertainment", icon: "🎬" },
    { href: "/en/sports", label: "Sports", icon: "🏏" },
    { href: "/en/lifestyle", label: "Lifestyle", icon: "✨" },
    { href: "/en/business", label: "Business", icon: "📈" },
    { href: "/en/tech-auto", label: "Tech & Auto", icon: "📱" },
    { href: "/en/religion", label: "Religion", icon: "🕉️" },
  ] : [
    { href: "/", label: "होम", icon: "🏠" },
    { href: "/international", label: "दुनिया", icon: "🌐" },
    { href: "/national", label: "इंडिया", icon: "🇮🇳" },
    { href: "/crime", label: "क्राइम", icon: "🚨" },
    { href: "/entertainment", label: "मनोरंजन", icon: "🎬" },
    { href: "/sports", label: "खेल", icon: "🏏" },
    { href: "/lifestyle", label: "लाइफस्टाइल", icon: "✨" },
    { href: "/business", label: "व्यापार", icon: "📈" },
    { href: "/tech-auto", label: "टेक & ऑटो", icon: "📱" },
    { href: "/religion", label: "धर्म", icon: "🕉️" },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 bg-[#050608]/95 backdrop-blur-md border-t border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.6)] xl:hidden select-none transition-colors duration-200"
    >
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 px-2">
        {items.map((item) => {
          const isActive = item.href === "/" 
            ? pathname === "/" 
            : pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "nav-pill-active bg-red-600 text-white shadow-md shadow-red-900/40"
                  : "nav-pill-inactive bg-gray-900/80 text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-800"
              }`}
            >
              <span className="text-xs">{item.icon}</span>
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}