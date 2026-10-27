import { NextResponse } from "next/server";
import { getDb, getDbEn } from "@/lib/actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim().toLowerCase() || "";
    const category = searchParams.get("category")?.trim().toLowerCase() || "";
    const lang = searchParams.get("lang")?.trim().toLowerCase() || "hi";
    const isEn = lang === "en";

    if (!q && !category) {
      return NextResponse.json({ results: [], total: 0 });
    }

    const db = isEn ? await getDbEn() : await getDb("hi");
    const posts = db.posts || [];

    const matches = posts.filter((post: any) => {
      // Category filter if specified
      if (category && category !== "all") {
        const cat = (post.categoryStr || "").toLowerCase();
        if (cat !== category && !(category === "world" && cat === "international")) {
          return false;
        }
      }

      if (!q) return true;

      // Multi-field search
      const headline = (post.headline || "").toLowerCase();
      const headlineEn = (post.headlineEn || "").toLowerCase();
      const summary = (post.summary || "").toLowerCase();
      const summaryEn = (post.summaryEn || "").toLowerCase();
      const tags = (post.tags || "").toLowerCase();
      const categoryStr = (post.categoryStr || "").toLowerCase();
      const content = (post.content || "").toLowerCase();
      const contentEn = (post.contentEn || "").toLowerCase();

      return (
        headline.includes(q) ||
        headlineEn.includes(q) ||
        summary.includes(q) ||
        summaryEn.includes(q) ||
        tags.includes(q) ||
        categoryStr.includes(q) ||
        content.includes(q) ||
        contentEn.includes(q)
      );
    });

    // Sort by relevance (headline matches first, then date)
    const sorted = matches.sort((a: any, b: any) => {
      const aHead = ((isEn ? a.headlineEn : a.headline) || a.headline || "").toLowerCase();
      const bHead = ((isEn ? b.headlineEn : b.headline) || b.headline || "").toLowerCase();
      const aInHeadline = aHead.includes(q) ? 1 : 0;
      const bInHeadline = bHead.includes(q) ? 1 : 0;
      if (aInHeadline !== bInHeadline) {
        return bInHeadline - aInHeadline;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const results = sorted.slice(0, 20).map((p: any) => ({
      id: p.id,
      headline: isEn ? (p.headlineEn || p.headline) : p.headline,
      headlineEn: p.headlineEn || p.headline,
      slug: isEn ? (p.slugEn || p.slug) : p.slug,
      slugEn: p.slugEn || p.slug,
      summary: isEn ? (p.summaryEn || p.summary) : p.summary,
      categoryStr: isEn ? (p.categoryStr === "international" ? "world" : (p.categoryStr || "world")) : (p.categoryStr || "national"),
      image: p.image,
      createdAt: p.createdAt,
      sourceName: p.sourceName,
    }));

    return NextResponse.json({ results, total: sorted.length });
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json({ results: [], total: 0, error: error.message }, { status: 500 });
  }
}
