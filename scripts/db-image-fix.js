const { PrismaClient } = require('/var/www/thefreelance.in/backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('--- Checking & Fixing DB Posts ---');

  // 1. Fix all posts with 0cdb0e9f7ab3
  const bjpLogoPosts = await prisma.post.findMany({
    where: {
      image: { contains: '0cdb0e9f7ab3' }
    },
    select: { id: true, headline: true, categoryStr: true }
  });

  console.log(`Found ${bjpLogoPosts.length} posts with BJP lotus logo 0cdb0e9f7ab3.`);

  for (const post of bjpLogoPosts) {
    const text = (post.headline || '').toLowerCase();
    let newImg = '/uploads/tfl-national-parliament.jpg';

    if (/विद्युत|जामवाल|अमन गांधी|बिग बॉस|बॉलीवुड|सिनेमा|फिल्म|एक्टर|अभिनेत्री|गाने|मूवी|trailer|song|movie|actor|actress/.test(text) || post.categoryStr === 'entertainment') {
      newImg = '/uploads/tfl-media-1790741542833-e5acbfb1794b73e2.jpg';
    } else if (/क्रिकेट|cricket|sports|मंधाना|नामीबिया|विराट|रोहित|dhoni|ipl|wpl|football|मैच|खेल/.test(text) || post.categoryStr === 'sports') {
      newImg = '/uploads/tfl-sports-cricket.jpg';
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
    console.log(`Updated post "${post.headline.slice(0, 40)}" -> ${newImg}`);
  }

  // 2. Also check sports posts that have football stadium or lady justice
  const wrongSportsPosts = await prisma.post.findMany({
    where: {
      categoryStr: 'sports',
      OR: [
        { image: { contains: 'tfl-sports-football-stadium.jpg' } },
        { image: { contains: 'tfl-national-court-justice.jpg' } }
      ]
    },
    select: { id: true, headline: true, image: true }
  });

  console.log(`Found ${wrongSportsPosts.length} sports posts with wrong stadium/court images.`);
  for (const sp of wrongSportsPosts) {
    await prisma.post.update({
      where: { id: sp.id },
      data: { image: '/uploads/tfl-sports-cricket.jpg' }
    });
    console.log(`Updated sports post "${sp.headline.slice(0, 40)}" -> cricket stadium`);
  }

  // 3. Find and unpublish/deduplicate duplicate Vidyut Jammwal & Ramayana stories
  const jammwalPosts = await prisma.post.findMany({
    where: {
      headline: { contains: 'विद्युत जामवाल' }
    },
    orderBy: { createdAt: 'desc' }
  });

  if (jammwalPosts.length > 1) {
    console.log(`Found ${jammwalPosts.length} Vidyut Jammwal posts. Keeping newest, unpublishing duplicates.`);
    for (let i = 1; i < jammwalPosts.length; i++) {
      await prisma.post.update({
        where: { id: jammwalPosts[i].id },
        data: { isPublished: false }
      });
      console.log(`Unpublished duplicate Vidyut Jammwal post: ${jammwalPosts[i].id}`);
    }
  }

  const ramayanaPosts = await prisma.post.findMany({
    where: {
      OR: [
        { headline: { contains: 'नमित मल्होत्रा' } },
        { headline: { contains: 'रामायण' } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  if (ramayanaPosts.length > 1) {
    console.log(`Found ${ramayanaPosts.length} Ramayana posts. Keeping newest, unpublishing duplicates.`);
    for (let i = 1; i < ramayanaPosts.length; i++) {
      await prisma.post.update({
        where: { id: ramayanaPosts[i].id },
        data: { isPublished: false }
      });
      console.log(`Unpublished duplicate Ramayana post: ${ramayanaPosts[i].id}`);
    }
  }

  console.log('--- Cleanup Finished Successfully ---');
}

run()
  .catch(err => console.error('Error:', err))
  .finally(() => prisma.$disconnect());
