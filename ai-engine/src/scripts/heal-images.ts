import { getSupabase } from '../db/supabase.js';
import { imageService } from '../services/image.service.js';

async function healImages() {
  console.log('--- 🩹 Starting Database Image Healing Pipeline ---');
  const supabase = getSupabase();

  // 1. Fetch all posts
  const { data: posts, error } = await supabase
    .from('Post')
    .select('id, headline, headlineEn, categoryStr, image, createdAt')
    .order('createdAt', { ascending: false });

  if (error || !posts) {
    console.error('Failed to fetch posts from Supabase:', error);
    process.exit(1);
  }

  console.log(`Total posts in Supabase: ${posts.length}`);

  // Count image frequencies
  const imageCounts: Record<string, number> = {};
  posts.forEach(p => {
    if (p.image) {
      imageCounts[p.image] = (imageCounts[p.image] || 0) + 1;
    }
  });

  console.log('\nTop Image Frequencies:');
  Object.entries(imageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([img, count]) => {
      console.log(`  [${count} posts]: ${img}`);
    });

  const assignedSet = new Set<string>();
  // Keep unique good images
  posts.forEach(p => {
    if (p.image && imageCounts[p.image] === 1 && imageService.isStrictlyLogoFreeNewsImage(p.image)) {
      assignedSet.add(p.image.trim().toLowerCase());
    }
  });

  const postsToHeal = posts.filter(p => {
    if (!p.image) return true;
    if (imageCounts[p.image] > 1) return true;
    if (!imageService.isStrictlyLogoFreeNewsImage(p.image)) return true;
    return false;
  });

  console.log(`\nPosts requiring healing: ${postsToHeal.length}`);

  let healedCount = 0;
  for (let i = 0; i < postsToHeal.length; i++) {
    const post = postsToHeal[i];
    const headline = post.headline || post.headlineEn || 'News Update';
    const category = post.categoryStr || 'national';

    console.log(`\n[${i + 1}/${postsToHeal.length}] Healing Post ID: ${post.id}`);
    console.log(`  Headline: "${headline.slice(0, 80)}..."`);
    console.log(`  Current Image: ${post.image?.slice(0, 70)}...`);

    try {
      // 1. Try Entity Portraits
      let newImage: string | null = null;
      const hLower = headline.toLowerCase();

      // 2. Try Wikipedia
      newImage = await imageService.searchWikimediaImage(headline, assignedSet);

      // 3. Try Bing Clean News Image
      if (!newImage) {
        newImage = await imageService.searchBingCleanImage(headline, assignedSet);
      }

      // 4. Try English headline if available
      if (!newImage && post.headlineEn) {
        newImage = await imageService.searchBingCleanImage(post.headlineEn, assignedSet);
      }

      // 5. Category Diversified Fallback
      if (!newImage) {
        newImage = imageService.getDiversifiedFallback(category, headline, assignedSet);
      }

      if (newImage) {
        assignedSet.add(newImage.trim().toLowerCase());
        const { error: updateErr } = await supabase
          .from('Post')
          .update({ image: newImage })
          .eq('id', post.id);

        if (updateErr) {
          console.error(`  ❌ Failed to update post ${post.id}:`, updateErr.message);
        } else {
          console.log(`  ✅ Healed with new photo: ${newImage}`);
          healedCount++;
        }
      }
    } catch (err: any) {
      console.error(`  ❌ Error processing post ${post.id}:`, err?.message || err);
    }

    // Small delay to prevent rate limits
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n========================================`);
  console.log(`🎉 Healing completed! Successfully healed ${healedCount}/${postsToHeal.length} posts.`);
  console.log(`========================================`);
}

healImages()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error in healImages:', err);
    process.exit(1);
  });
