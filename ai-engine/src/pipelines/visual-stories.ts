import { getSupabase } from '../db/supabase.js';
import { gemini } from '../services/gemini.service.js';
import { imageService } from '../services/image.service.js';

export async function runVisualStoriesPipeline() {
  console.log('\n📱 [Visual Stories Pipeline] Starting Daily 10 Visual Stories Generation...');
  const supabase = getSupabase();

  // Pick top trending or evergreen engaging visual topics
  const topics = [
    { title: 'World Top 7 Hidden Travel Wonders You Must Visit', category: 'lifestyle' },
    { title: 'Revolutionary Tech Innovations Shaping 2026', category: 'technology' },
    { title: 'Top 5 Superfoods Backed by Modern Medical Science', category: 'lifestyle' },
    { title: 'Global Space Missions: Humankinds Next Great Leap', category: 'technology' },
    { title: 'Historic Archaeological Discoveries That Rewrote History', category: 'world' },
    { title: 'The Rise of Electric Aviation and Zero-Emission Flights', category: 'technology' },
    { title: 'Smart Financial Habits of Self-Made Millionaires', category: 'business' },
    { title: 'The Most Iconic Sporting Comebacks of All Time', category: 'sports' },
    { title: 'Bizarre Natural Phenomena Witnessed on Earth', category: 'world' },
    { title: 'Ancient Architectural Marvels That Defy Modern Logic', category: 'world' },
  ];

  let published = 0;

  for (const t of topics) {
    console.log(`\n✨ Generating Visual Story: "${t.title}"`);

    const prompt = `
Create an engaging, 5-slide 9:16 vertical visual web story for mobile readers.
Topic: "${t.title}"

Format Guidelines:
1. Exactly 5 bite-sized, visually stunning slides.
2. Each slide must have a punchy title (under 8 words) and an engaging 1-2 sentence description.
3. Language: Engaging, modern English.
4. Output STRICT JSON:
{
  "headline": "Ultra-compelling story title (under 10 words)",
  "summary": "1-sentence hook summary",
  "category": "${t.category}",
  "slides": [
    { "order": 1, "title": "Slide 1 Title", "content": "Slide 1 description." },
    { "order": 2, "title": "Slide 2 Title", "content": "Slide 2 description." },
    { "order": 3, "title": "Slide 3 Title", "content": "Slide 3 description." },
    { "order": 4, "title": "Slide 4 Title", "content": "Slide 4 description." },
    { "order": 5, "title": "Slide 5 Title", "content": "Slide 5 description." }
  ]
}
`;

    try {
      const story = await gemini.generateJson<{
        headline: string;
        summary: string;
        category: string;
        slides: Array<{ order: number; title: string; content: string }>;
      }>(prompt);

      // Resolve clean, high-res vertical/landscape editorial photo
      const coverImage = await imageService.resolveEditorialPhoto({
        headline: story.headline,
        category: story.category || t.category,
        keywords: t.title,
      });

      const uniqueSuffix = Date.now().toString(36);
      const slug = story.headline
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 80) + `-${uniqueSuffix}`;

      // Insert Post record
      const { data: post, error: postErr } = await supabase
        .from('Post')
        .insert({
          headline: story.headline,
          headlineEn: story.headline,
          slug,
          slugEn: slug,
          summary: story.summary,
          summaryEn: story.summary,
          image: coverImage,
          categoryStr: story.category || t.category,
          postType: 'visual_story',
          isEnglishOnly: true,
          isPublished: true,
        })
        .select('id')
        .single();

      if (postErr || !post) {
        console.error(`❌ Post insert failed: ${postErr?.message}`);
        continue;
      }

      // Insert Slides
      const slideInserts = story.slides.map(s => ({
        postId: post.id,
        order: s.order,
        title: s.title,
        content: s.content,
        image: coverImage,
      }));

      await supabase.from('StorySlide').insert(slideInserts);

      published++;
      console.log(`✅ [Visual Story Created]: "${story.headline}" (${story.slides.length} slides)`);
    } catch (err: any) {
      console.error(`❌ Visual story error: ${err.message}`);
    }
  }

  console.log(`\n🎉 [Visual Stories Pipeline Complete] Created ${published} visual stories.\n`);
  return { success: true, count: published };
}
