import { getSupabase } from '../db/supabase.js';

async function main() {
  const sb = getSupabase();
  const { data: posts, error } = await sb.from('Post').select('id, headline, image');
  if (error || !posts) {
    console.error('Error fetching posts:', error);
    process.exit(1);
  }

  const counts: Record<string, number> = {};
  posts.forEach(p => {
    if (p.image) {
      counts[p.image] = (counts[p.image] || 0) + 1;
    }
  });

  const duplicates = Object.entries(counts).filter(([_, count]) => count > 1);

  console.log(`\n=== Verification Results ===`);
  console.log(`Total posts: ${posts.length}`);
  console.log(`Unique images: ${Object.keys(counts).length}`);
  console.log(`Duplicates: ${duplicates.length}`);

  if (duplicates.length === 0) {
    console.log(`🎉 100% of posts have distinct, non-repeating images! Zero duplicates found.`);
  } else {
    console.log(`Duplicates found:`, duplicates);
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
