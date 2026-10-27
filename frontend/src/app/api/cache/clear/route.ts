import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // 1. Purge all path-based cache
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/en');
    revalidatePath('/[category]', 'page');
    revalidatePath('/[category]/[slug]', 'page');

    // 2. Invalidate news tags safely
    try {
      (revalidateTag as any)('news-cache');
      (revalidateTag as any)('posts');
      (revalidateTag as any)('homepage');
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Website cache cleared successfully. All pages refreshed with latest live content.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[ClearCache] Error clearing cache:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
