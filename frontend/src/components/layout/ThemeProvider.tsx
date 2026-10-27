"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Admin Dashboard (/tfl/*) is strictly dark mode only
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/tfl")) {
      document.documentElement.setAttribute("data-theme", "dark");
      setThemeState("dark");
      setMounted(true);
      return;
    }

    // Initial sync from DOM attribute (set by inline pre-hydration script)
    const currentAttr = document.documentElement.getAttribute("data-theme") as Theme;
    if (currentAttr === "light" || currentAttr === "dark") {
      setThemeState(currentAttr);
    } else {
      const stored = localStorage.getItem("tfl-theme") as Theme;
      if (stored === "dark") {
        setThemeState("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        // Public Default is LIGHT MODE!
        setThemeState("light");
        document.documentElement.setAttribute("data-theme", "light");
      }
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("tfl-theme", newTheme);
      // Never set light theme on admin dashboard
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/tfl")) {
        document.documentElement.setAttribute("data-theme", newTheme);
      }
    } catch {}
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
