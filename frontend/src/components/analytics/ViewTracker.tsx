"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
  articleId: string;
  lang?: 'hi' | 'en';
}

export default function ViewTracker({ articleId, lang = 'hi' }: ViewTrackerProps) {
  const isTracked = useRef(false);

  useEffect(() => {
    if (isTracked.current || !articleId) return;
    isTracked.current = true;

    try {
      fetch(`/api/v1/articles/${articleId}/view?lang=${lang}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang }),
      }).catch(() => {});
    } catch {}
  }, [articleId, lang]);

  return null;
}
