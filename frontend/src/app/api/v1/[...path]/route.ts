import { NextRequest, NextResponse } from "next/server";
import { tryFetchFromSupabase } from "@/lib/actions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const endpoint = `/${path.join("/")}${req.nextUrl.search}`;

  try {
    const data = await tryFetchFromSupabase(endpoint);
    if (data !== null) {
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { message: "Not found", endpoint },
      { status: 404 }
    );
  } catch (err: any) {
    console.error(`[API v1 Route Handler Error] ${endpoint}:`, err);
    return NextResponse.json(
      { message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
