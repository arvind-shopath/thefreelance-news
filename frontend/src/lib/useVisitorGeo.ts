"use client";
import { useEffect, useState } from "react";

let cachedGeo: { isIndia: boolean; country: string } | null = null;
let geoPromise: Promise<{ isIndia: boolean; country: string }> | null = null;

export async function detectVisitorGeo(): Promise<{ isIndia: boolean; country: string }> {
  if (cachedGeo) return cachedGeo;
  if (geoPromise) return geoPromise;

  geoPromise = (async () => {
    // 0. If currently browsing English portal (/en), unconditionally route to International
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/en")) {
      const enResult = { isIndia: false, country: "SG" };
      cachedGeo = enResult;
      return enResult;
    }

    // 1. Check local session storage cache first
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("tfl_visitor_geo");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed.isIndia === "boolean") {
            cachedGeo = parsed;
            return parsed;
          }
        }
      } catch (e) {}
    }

    // 2. Fetch from our server endpoint with no-store
    try {
      const res = await fetch("/api/v1/analytics/geo", {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        const result = {
          isIndia: Boolean(data.isIndia),
          country: data.country || "IN",
        };
        cachedGeo = result;
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("tfl_visitor_geo", JSON.stringify(result));
          } catch (e) {}
        }
        return result;
      }
    } catch (err) {}

    // 3. Fallback client-side lookup via api.country.is
    try {
      const res2 = await fetch("https://api.country.is", {
        headers: { Accept: "application/json" },
      });
      if (res2.ok) {
        const data2 = await res2.json();
        const countryCode = (data2.country || "").toUpperCase();
        const result = {
          isIndia: countryCode === "IN",
          country: countryCode || "IN",
        };
        cachedGeo = result;
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("tfl_visitor_geo", JSON.stringify(result));
          } catch (e) {}
        }
        return result;
      }
    } catch (e) {}

    // Fallback: If on English portal (/en), default to International (isIndia: false)
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/en")) {
      const enResult = { isIndia: false, country: "US" };
      cachedGeo = enResult;
      return enResult;
    }

    // Default: Assume India (Primary audience of Hindi portal)
    const defaultResult = { isIndia: true, country: "IN" };
    cachedGeo = defaultResult;
    return defaultResult;
  })();

  return geoPromise;
}

export function useVisitorGeo() {
  const [geo, setGeo] = useState<{ isIndia: boolean; country: string } | null>(cachedGeo);

  useEffect(() => {
    let isMounted = true;
    detectVisitorGeo().then((res) => {
      if (isMounted) {
        setGeo(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return geo;
}
