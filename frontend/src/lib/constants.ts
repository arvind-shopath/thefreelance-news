export const categoryEnMap: Record<string, string> = {
  national: "India",
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
  international: "World",
};

export const categoryFallbackPool: Record<string, string[]> = {
  national: [
    "/uploads/tfl-national-parliament.jpg",
    "/uploads/tfl-national-election-voting.jpg",
    "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&q=80",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80",
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80",
  ],
  states: [
    "/uploads/tfl-national-parliament.jpg",
    "/uploads/tfl-national-election-voting.jpg",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
    "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&q=80",
    "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1200&q=80",
  ],
  crime: [
    "/uploads/tfl-crime-police-car-siren.jpg",
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80",
    "https://images.unsplash.com/photo-1453738773917-9c3eff1db985?w=1200&q=80",
    "https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?w=1200&q=80",
    "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=1200&q=80",
  ],
  entertainment: [
    "/uploads/tfl-media-1790741542833-e5acbfb1794b73e2.jpg",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80",
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80",
    "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=1200&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80",
  ],
  sports: [
    "/uploads/tfl-sports-cricket.jpg",
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80",
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
    "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1200&q=80",
  ],
  lifestyle: [
    "/uploads/tfl-lifestyle-yoga-health.jpg",
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=80",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=80",
  ],
  religion: [
    "/uploads/tfl-city-ayodhya-ram-mandir.jpg",
    "/uploads/tfl-city-varanasi-kashi-ghats.jpg",
    "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=80",
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80",
  ],
  "tech-auto": [
    "/uploads/tfl-tech-ai-chip.jpg",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80",
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80",
  ],
  business: [
    "/uploads/tfl-biz-stock-market-sensex.jpg",
    "/uploads/tfl-biz-gold-jewellery.jpg",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
  ],
  education: [
    "/uploads/tfl-national-parliament.jpg",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=80",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80",
  ],
  rashifal: [
    "/uploads/tfl-city-varanasi-kashi-ghats.jpg",
    "/uploads/tfl-lifestyle-yoga-health.jpg",
  ],
  special: [
    "/uploads/tfl-world-military-patrol.jpg",
    "/uploads/tfl-national-parliament.jpg",
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=80",
  ],
  world: [
    "/uploads/tfl-city-white-house-usa.jpg",
    "/uploads/tfl-world-military-patrol.jpg",
    "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
  ],
  international: [
    "/uploads/tfl-city-white-house-usa.jpg",
    "/uploads/tfl-world-military-patrol.jpg",
    "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
  ],
  politics: [
    "/uploads/tfl-national-election-voting.jpg",
    "/uploads/tfl-national-parliament.jpg",
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=80",
    "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=1200&q=80",
  ]
};

export const categoryFallbackImages: Record<string, string> = {
  national: "/uploads/tfl-national-parliament.jpg",
  states: "/uploads/tfl-national-parliament.jpg",
  crime: "/uploads/tfl-crime-police-car-siren.jpg",
  entertainment: "/uploads/tfl-media-1790741542833-e5acbfb1794b73e2.jpg",
  sports: "/uploads/tfl-sports-cricket.jpg",
  lifestyle: "/uploads/tfl-lifestyle-yoga-health.jpg",
  religion: "/uploads/tfl-city-varanasi-kashi-ghats.jpg",
  "tech-auto": "/uploads/tfl-tech-ai-chip.jpg",
  business: "/uploads/tfl-biz-stock-market-sensex.jpg",
  education: "/uploads/tfl-national-parliament.jpg",
  rashifal: "/uploads/tfl-lifestyle-yoga-health.jpg",
  special: "/uploads/tfl-world-military-patrol.jpg",
  world: "/uploads/tfl-city-white-house-usa.jpg",
  international: "/uploads/tfl-city-white-house-usa.jpg",
  politics: "/uploads/tfl-national-election-voting.jpg",
};

export function getPostImage(post: any): string {
  const headline = (post?.headline || post?.title || '').toLowerCase();
  const slug = (post?.slug || headline).toLowerCase();

  // 1. FIRST PRIORITY: Always return the post's own stored image if valid
  if (post?.image && typeof post.image === 'string' && post.image.trim().length > 5) {
    const img = post.image.trim();
    const lower = img.toLowerCase();
    const isCourtNews = /सुप्रीम कोर्ट|हाईकोर्ट|उच्च न्यायालय|सर्वोच्च न्यायालय|अदालत|कोर्ट|न्यायाधीश|न्यायालय/.test(headline);

    // Ban matrix hacker image, US voting sticker, Japanese barricade tape, generic yoga silhouette, Radha Krishna stock, Google News icon, forest sunset, BJP lotus logo outline, broken placeholder hashes, and Lady Justice on non-court news
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
      !lower.includes('japan_april') &&
      !(!isCourtNews && (lower.includes('tfl-national-court-justice') || lower.includes('tfl-crime-police-investigation')))
    ) {
      return img;
    }
  }

  // 2. Strict Person-Level Matching (NEVER match broad political party names to individual faces!)
  if (/अमन गांधी|aman gandhi/.test(headline)) return '/uploads/tfl-media-1790741542833-e5acbfb1794b73e2.jpg';
  if (/विद्युत जामवाल|vidyut jammwal/.test(headline)) return '/uploads/tfl-media-1790741542833-e5acbfb1794b73e2.jpg';
  if (/नाना पाटेकर|nana patekar/.test(headline)) return '/uploads/tfl-nana-patekar.jpg';
  if (/रामायण|ramayana|रणबीर कपूर|नमित मल्होत्रा/.test(headline)) return '/uploads/tfl-media-1790741542833-e5acbfb1794b73e2.jpg';
  
  // Judiciary / Courts
  if (/सीजेआई|cji|सूर्य कांत|मुख्य न्यायाधीश|सुप्रीम कोर्ट|हाईकोर्ट|उच्च न्यायालय|सर्वोच्च न्यायालय/.test(headline)) {
    return '/uploads/tfl-national-supreme-court.jpg';
  }

  // Strict Individual Political Figures ONLY (Do not assign leader faces on generic party mentions or municipal elections!)
  if (/(राहुल गांधी|rahul gandhi)/i.test(headline)) return '/uploads/tfl-action-rahul-rally.jpg';
  if (/(अखिलेश यादव|akhilesh yadav)/i.test(headline)) return '/uploads/tfl-verified-akhilesh-yadav.jpg';
  if (/(अरविंद केजरीवाल|arvind kejriwal)/i.test(headline)) return '/uploads/tfl-verified-arvind-kejriwal.jpg';
  if (/(ममता बनर्जी|mamata banerjee)/i.test(headline)) return '/uploads/tfl-verified-mamata-banerjee.jpg';
  if (/(योगी आदित्यनाथ|yogi adityanath)/i.test(headline)) return '/uploads/tfl-action-yogi-rally.jpg';
  if (/(अमित शाह|amit shah)/i.test(headline)) return '/uploads/tfl-action-amit-shah-rally.jpg';
  if (/(नरेंद्र मोदी|पीएम मोदी|narendra modi|pm modi)/i.test(headline) && !/विपक्ष|आरोप|हमला|निशाना|विरोध|संसद|राहुल|कांग्रेस/.test(headline)) {
    return '/uploads/tfl-action-modi-rally.jpg';
  }

  // General Election / Parliament / Protests (Show assemblies or voting, NEVER individual faces)
  if (/चुनाव आयोग|ईसीआई|वोट|मतदान|मतदाता|election|उपचुनाव|नगर पालिका/.test(headline)) {
    return '/uploads/tfl-national-election-voting.jpg';
  }
  if (/विपक्ष|इंडिया गठबंधन|विरोध प्रदर्शन|धरना|संसद सत्र|संसद|लोकसभा|राज्यसभा/.test(headline)) {
    return '/uploads/tfl-national-parliament.jpg';
  }

  // Financial Markets & Gold
  if (/शेयर|बाजार|सेंसेक्स|निफ्टी|स्टॉक|sensex|nifty|share market|rbi|रेपो/.test(headline)) {
    return '/uploads/tfl-biz-stock-market-sensex.jpg';
  }
  if (/सोना|चांदी|गोल्ड|gold price|silver price|सराफा/.test(headline)) {
    return '/uploads/tfl-biz-gold-jewellery.jpg';
  }

  // Sports
  if (/(पीवी सिंधु|पी\.? ?वी\.? ?सिंधु|pv sindhu)/i.test(headline)) return '/uploads/tfl-sports-pv-sindhu.jpg';
  if (/क्रिकेट|cricket|t20|odi|ipl|मंधाना|mandhana|विराट|रोहित|धोनी|wpl|पिच|विकेट|रन/.test(headline)) {
    return '/uploads/tfl-sports-cricket.jpg';
  }
  if (/फुटबॉल|football|fifa|मेस्सी|रोनाल्डो/.test(headline)) {
    return '/uploads/tfl-sports-football-stadium.jpg';
  }

  // 3. Fallback Pool with Hash Dispersion: Different posts in the same category NEVER get the same image!
  const cat = post?.categoryStr || post?.category || 'national';
  const pool = categoryFallbackPool[cat] || categoryFallbackPool['national'];
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % pool.length;
  return pool[idx];
}
