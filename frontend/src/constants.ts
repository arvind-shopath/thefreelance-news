export const categoryEnMap: Record<string, string> = {
  national: "National",
  states: "States",
  crime: "Crime",
  entertainment: "Entertainment",
  sports: "Sports",
  lifestyle: "Lifestyle",
  religion: "Religion",
  "tech-auto": "Tech & Auto",
  business: "Business",
  education: "Education",
  rashifal: "Horoscope",
  special: "Special",
  world: "World",
  international: "International",
};

export const categoryFallbackImages: Record<string, string> = {
  national: "/uploads/tfl-national-parliament.jpg",
  states: "/uploads/tfl-national-parliament.jpg",
  crime: "/uploads/tfl-crime-police-car-siren.jpg",
  entertainment: "/uploads/tfl-media-1790741542833-e5acbfb1794b73e2.jpg",
  sports: "/uploads/tfl-sports-football-stadium.jpg",
  lifestyle: "/uploads/tfl-lifestyle-yoga-health.jpg",
  religion: "/uploads/tfl-lifestyle-yoga-health.jpg",
  "tech-auto": "/uploads/tfl-tech-ai-chip.jpg",
  business: "/uploads/tfl-biz-gold-jewellery.jpg",
  education: "/uploads/tfl-national-court-justice.jpg",
  rashifal: "/uploads/tfl-lifestyle-yoga-health.jpg",
  special: "/uploads/tfl-world-military-patrol.jpg",
  world: "/uploads/tfl-city-white-house-usa.jpg",
  international: "/uploads/tfl-city-white-house-usa.jpg",
};

export function getPostImage(post: any): string {
  if (post?.image && typeof post.image === 'string' && post.image.trim().length > 5) {
    const img = post.image.trim();
    const lower = img.toLowerCase();
    // Ban matrix hacker image, US voting sticker, Japanese barricade tape, generic yoga silhouette, Radha Krishna stock, Google News icon, forest sunset
    if (
      !img.includes('1526374965328') && 
      !img.includes('1540910419892') &&
      !img.includes('1506126613408') &&
      !img.includes('1544367567-0f2fcb009e0b') &&
      !img.includes('1500382017468') &&
      !img.includes('1532375810709') &&
      !img.includes('20790052') &&
      !img.includes('0cdb0e9f7ab3') &&
      !img.includes('googleusercontent') &&
      !lower.includes('barricade_tape_in_japan') &&
      !lower.includes('japan_april')
    ) {
      return img;
    }
  }

  // Smart contextual fallback based on headline
  const headline = (post?.headline || post?.title || '').toLowerCase();
  if (/मोदी|modi|प्रधानमंत्री|pm /.test(headline)) return '/uploads/tfl-action-modi-rally.jpg';
  if (/राहुल|गांधी|rahul|congress|कांग्रेस/.test(headline)) return '/uploads/tfl-action-rahul-rally.jpg';
  if (/सुप्रीम कोर्ट|अदालत|court|justice|न्यायालय/.test(headline)) return '/uploads/tfl-national-supreme-court.jpg';
  if (/चुनाव|वोट|मतदान|election|eci|ec /.test(headline)) return '/uploads/tfl-national-election-voting.jpg';
  if (/अखिलेश|सपा|samajwadi/.test(headline)) return '/uploads/tfl-verified-akhilesh-yadav.jpg';
  if (/सिंधु|sindhu|बैडमिंटन/.test(headline)) return '/uploads/tfl-sports-pv-sindhu.jpg';
  if (/शेयर|बाजार|सेंसेक्स|निफ्टी|स्टॉक|market|sensex|rbi/.test(headline)) return '/uploads/tfl-biz-stock-market-sensex.jpg';

  const cat = post?.categoryStr || post?.category || 'national';
  return categoryFallbackImages[cat] || categoryFallbackImages['national'] || "/logo.png";
}

