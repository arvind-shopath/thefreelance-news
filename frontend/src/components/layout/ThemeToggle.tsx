"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <div
      className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-50 select-none flex flex-col items-center group"
      title={isDark ? "लाइट मोड में बदलें (Day Mode)" : "डार्क मोड में बदलें (Night Mode)"}
    >
      {/* Tooltip on hover (Desktop) */}
      <span className="hidden md:group-hover:block absolute right-full mr-3.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gray-900/95 text-white text-[11px] font-bold rounded-lg whitespace-nowrap shadow-xl border border-gray-700 pointer-events-none transition-all duration-200">
        {isDark ? "लाइट मोड (दिन)" : "डार्क मोड (रात)"}
      </span>

      {/* Vertical Pill Capsule Track */}
      <div
        role="button"
        tabIndex={0}
        onClick={toggleTheme}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleTheme();
          }
        }}
        aria-label="थीम बदलें (डार्क/लाइट मोड)"
        className={`relative w-[40px] h-[84px] rounded-full p-1 cursor-pointer transition-all duration-500 shadow-2xl flex flex-col justify-between items-center ${
          isDark
            ? "bg-gradient-to-b from-[#141b2d] via-[#101424] to-[#0c0e18] border-2 border-indigo-500/40 shadow-indigo-950/60"
            : "bg-gradient-to-b from-[#93c5fd] via-[#bfdbfe] to-[#fef08a] border-2 border-amber-400/70 shadow-amber-500/30"
        }`}
      >
        {/* Top Slot: Moon Icon (Dark Mode Target) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setTheme("dark");
          }}
          className={`w-[32px] h-[32px] flex items-center justify-center rounded-full z-10 transition-opacity duration-300 ${
            isDark ? "opacity-100" : "opacity-45 hover:opacity-80"
          }`}
          aria-label="डार्क मोड"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              isDark ? "text-cyan-200 scale-110 drop-shadow-[0_0_6px_rgba(103,232,249,0.8)]" : "text-gray-600 scale-95"
            }`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-5.4-5.4c0-1.81.89-3.42 2.26-4.4A9.15 9.15 0 0012 3z" />
          </svg>
        </div>

        {/* Bottom Slot: Sun Icon (Light Mode Target) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setTheme("light");
          }}
          className={`w-[32px] h-[32px] flex items-center justify-center rounded-full z-10 transition-opacity duration-300 ${
            !isDark ? "opacity-100" : "opacity-45 hover:opacity-80"
          }`}
          aria-label="लाइट मोड"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              !isDark ? "text-amber-500 scale-110 drop-shadow-[0_0_6px_rgba(245,158,11,0.9)]" : "text-gray-400 scale-95"
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        </div>

        {/* Single Sliding Thumb Knob (Frames active mode) */}
        <div
          className={`absolute left-[3px] w-[32px] h-[32px] rounded-full transition-transform duration-300 ease-out shadow-lg pointer-events-none flex items-center justify-center ${
            isDark
              ? "translate-y-[1px] bg-gradient-to-tr from-slate-900 to-indigo-950 border border-cyan-400/50 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
              : "translate-y-[45px] bg-gradient-to-tr from-amber-300 to-yellow-400 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
          }`}
        >
          {isDark ? (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300/80 animate-pulse" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-700/80" />
          )}
        </div>
      </div>
    </div>
  );
}
