const { PrismaClient } = require('/var/www/thefreelance.in/backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('--- Fixing Shoes Category & Lady Justice Fallback Images ---');

  // 1. Move branded shoes post to business
  const shoesPosts = await prisma.post.findMany({
    where: {
      OR: [
        { headline: { contains: 'ब्रांडेड शूज' } },
        { headline: { contains: 'असेक्सिस' } },
        { headline: { contains: 'शूज का सोल' } }
      ]
    }
  });

  for (const sp of shoesPosts) {
    await prisma.post.update({
      where: { id: sp.id },
      data: {
        categoryStr: 'business',
        image: '/uploads/tfl-biz-stock-market-sensex.jpg'
      }
    });
    console.log(`Updated shoes post "${sp.headline.slice(0, 40)}" -> categoryStr: business, image: stock-market`);
  }

  // 2. Fix all Namibia vs USA posts
  const namibiaPosts = await prisma.post.findMany({
    where: {
      OR: [
        { headline: { contains: 'नामीबिया' } },
        { headline: { contains: 'अमेरिका और नामीबिया' } }
      ]
    }
  });

  for (const np of namibiaPosts) {
    await prisma.post.update({
      where: { id: np.id },
      data: {
        categoryStr: 'sports',
        image: '/uploads/tfl-sports-cricket.jpg'
      }
    });
    console.log(`Updated namibia post "${np.headline.slice(0, 40)}" -> image: cricket stadium`);
  }

  // 3. Fix all posts that have tfl-crime-police-investigation.jpg or tfl-national-court-justice.jpg (when not court news)
  const wrongImagesPosts = await prisma.post.findMany({
    where: {
      OR: [
        { image: { contains: 'tfl-crime-police-investigation.jpg' } },
        { image: { contains: 'tfl-national-court-justice.jpg' } }
      ]
    },
    select: { id: true, headline: true, categoryStr: true, image: true }
  });

  console.log(`Found ${wrongImagesPosts.length} posts with court-justice/police-investigation image.`);

  for (const post of wrongImagesPosts) {
    const text = (post.headline || '').toLowerCase();
    const isRealCourt = /सुप्रीम कोर्ट|हाईकोर्ट|उच्च न्यायालय|सर्वोच्च न्यायालय|अदालत|कोर्ट|न्यायालय|जज/.test(text);

    let newImg = '/uploads/tfl-national-parliament.jpg';
    if (isRealCourt) {
      newImg = '/uploads/tfl-national-supreme-court.jpg';
    } else if (/क्रिकेट|cricket|sports|मंधाना|नामीबिया|विराट|रोहित|dhoni|ipl|wpl|football|मैच|खेल/.test(text) || post.categoryStr === 'sports') {
      newImg = '/uploads/tfl-sports-cricket.jpg';
    } else if (/विद्युत|जामवाल|अमन गांधी|बिग बॉस|बॉलीवुड|सिनेमा|फिल्म|एक्टर|अभिनेत्री|trailer|movie/.test(text) || post.categoryStr === 'entertainment') {
      newImg = '/uploads/tfl-media-1790741542833-e5acbfb1794b73e2.jpg';
    } else if (/हत्या|मर्डर|पुलिस|एनकाउंटर|गिरफ्तार|वारदात|गोलीबारी|अपराध|लाश/.test(text) || post.categoryStr === 'crime') {
      newImg = '/uploads/tfl-crime-police-car-siren.jpg';
    } else if (/शेयर|बाजार|सेंसेक्स|निफ्टी|आरबीआई|सोना|चांदी|कारोबार|कंपनी/.test(text) || post.categoryStr === 'business') {
      newImg = '/uploads/tfl-biz-stock-market-sensex.jpg';
    } else if (/मंदिर|पूजा|व्रत|त्योहार|ज्योतिष|राशिफल/.test(text) || post.categoryStr === 'religion') {
      newImg = '/uploads/tfl-lifestyle-yoga-health.jpg';
    }

    await prisma.post.update({
      where: { id: post.id },
      data: { image: newImg }
    });
  }

  console.log(`Updated all ${wrongImagesPosts.length} posts with proper category images.`);
  console.log('--- Done ---');
}

run()
  .catch(err => console.error(err))
  .finally(() => prisma.$disconnect());
