import { getSupabase } from '../db/supabase.js';

async function checkViral() {
  const sb = getSupabase();
  const { data: posts, error } = await sb
    .from('Post')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error || !posts) {
    console.error('Error fetching posts:', error);
    process.exit(1);
  }

  console.log(`\n=== Total Posts in Supabase: ${posts.length} ===`);

  // Look for viral / video / x.com / twitter posts
  const viralPosts = posts.filter((p: any) => {
    const h = (p.headline || '').toLowerCase();
    const c = (p.categoryStr || '').toLowerCase();
    const su = (p.sourceUrl || '').toLowerCase();
    const vu = (p.videoUrl || '').toLowerCase();

    return (
      h.includes('वीडियो') ||
      h.includes('video') ||
      h.includes('वायरल') ||
      h.includes('viral') ||
      c.includes('viral') ||
      c.includes('video') ||
      su.includes('x.com') ||
      su.includes('twitter.com') ||
      vu.length > 0
    );
  });

  console.log(`Viral / Video related posts found: ${viralPosts.length}`);

  viralPosts.forEach((p: any, idx: number) => {
    console.log(`\n[${idx + 1}] ID: ${p.id}`);
    console.log(`Headline: "${p.headline}"`);
    console.log(`Category: ${p.categoryStr}`);
    console.log(`SourceUrl: ${p.sourceUrl}`);
    console.log(`VideoUrl: ${p.videoUrl}`);
    console.log(`Image: ${p.image}`);
    console.log(`IsEnglishOnly: ${p.isEnglishOnly}`);
    console.log(`Created: ${p.createdAt}`);
  });

  // Also check all distinct categories
  const categories: Record<string, number> = {};
  posts.forEach((p: any) => {
    categories[p.categoryStr] = (categories[p.categoryStr] || 0) + 1;
  });

  console.log('\n--- Categories Breakdown ---');
  console.log(categories);

  // Check sample post keys
  if (posts.length > 0) {
    console.log('\nColumns in Post table:', Object.keys(posts[0]));
  }
}

checkViral().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
