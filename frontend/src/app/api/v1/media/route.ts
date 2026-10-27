import { NextRequest, NextResponse } from "next/server";
import { getPublicSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) {
      return NextResponse.json({ data: [], total: 0 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const { data: files, error } = await supabase.storage
      .from("media")
      .list("", {
        limit,
        offset,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error || !files) {
      return NextResponse.json({ data: [], total: 0 });
    }

    const mediaItems = files
      .filter(f => f.name !== ".emptyFolderPlaceholder")
      .map(file => {
        const { data } = supabase.storage.from("media").getPublicUrl(file.name);
        return {
          id: file.id || file.name,
          title: file.name,
          filename: file.name,
          url: data.publicUrl,
          fileSize: file.metadata?.size || 0,
          mimeType: file.metadata?.mimetype || "image/jpeg",
          createdAt: file.created_at,
          category: "general",
          source: "upload",
        };
      });

    return NextResponse.json({
      data: mediaItems,
      total: mediaItems.length,
    });
  } catch (err: any) {
    return NextResponse.json({ data: [], total: 0 });
  }
}
