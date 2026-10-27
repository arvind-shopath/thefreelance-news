import { getSupabase } from '../db/supabase.js';

const STOP_WORDS = new Set([
  'और', 'के', 'का', 'की', 'को', 'में', 'पर', 'से', 'ने', 'है', 'हैं', 'था', 'थी', 'थे',
  'लिए', 'साथ', 'बाद', 'हुए', 'हुआ', 'हुई', 'होने', 'किया', 'किए', 'गया', 'गई', 'गए',
  'यह', 'वह', 'इस', 'उस', 'भी', 'तो', 'तक', 'एक', 'दो', 'नया', 'नए', 'नई', 'बड़ा', 'बड़ी',
  'the', 'and', 'for', 'with', 'from', 'after', 'over', 'into', 'under', 'about', 'news', 'update'
]);

export class DedupService {
  /**
   * Check if candidate title is duplicate of any story published in the last 72 hours
   */
  async isDuplicateStory(candidateTitle: string, existingPosts?: any[]): Promise<boolean> {
    const tLower = candidateTitle.toLowerCase().trim();
    if (!tLower) return true;

    // Fetch past 72h posts if not passed in
    let posts = existingPosts;
    if (!posts) {
      const supabase = getSupabase();
      const since72h = new Date(Date.now() - 72 * 3600 * 1000).toISOString();
      const { data } = await supabase
        .from('Post')
        .select('headline, headlineEn, trendsKeyword')
        .gte('createdAt', since72h);
      posts = data || [];
    }

    // Extract significant candidate tokens (words >= 3 chars, not in STOP_WORDS)
    const tWords = tLower
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 3 && !STOP_WORDS.has(w));

    for (const p of posts) {
      const hLower = (p.headline || '').toLowerCase();
      const hEnLower = (p.headlineEn || '').toLowerCase();
      const kwLower = (p.trendsKeyword || '').toLowerCase().trim();

      // Direct exact match
      if (kwLower === tLower) return true;
      if (hLower === tLower || hEnLower === tLower) return true;

      // Substring match for substantial phrases
      if (tLower.length >= 8 && (hLower.includes(tLower) || hEnLower.includes(tLower))) return true;
      if (hLower.length >= 8 && (tLower.includes(hLower) || (kwLower && tLower.includes(kwLower)))) return true;

      // Token and entity overlap check
      if (tWords.length > 0) {
        const hWords = new Set(
          `${hLower} ${hEnLower} ${kwLower}`
            .replace(/[^\p{L}\p{N}\s]/gu, ' ')
            .split(/\s+/)
            .filter(w => w.length >= 3 && !STOP_WORDS.has(w))
        );

        let matchingCount = 0;
        for (const tw of tWords) {
          if (hWords.has(tw)) matchingCount++;
        }

        // If 2 or more significant tokens match OR >= 45% match
        if (
          (tWords.length >= 2 && matchingCount >= 2) ||
          (tWords.length >= 3 && matchingCount / tWords.length >= 0.45) ||
          (tWords.length === 1 && matchingCount === 1 && tWords[0].length >= 5)
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

export const dedupService = new DedupService();
