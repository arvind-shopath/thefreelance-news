import { NextRequest, NextResponse } from "next/server";
import { getPublicSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize and create unique filename
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${Date.now()}-${cleanName}`;

    // Upload to Supabase 'media' bucket
    const { data, error } = await supabase.storage
      .from("media")
      .upload(fileName, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error("[Media Upload Error]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("media")
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      filename: fileName,
      fileSize: file.size,
      mimeType: file.type,
    });
  } catch (err: any) {
    console.error("[Media Upload Fatal Error]", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
