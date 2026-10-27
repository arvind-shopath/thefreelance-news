const { PrismaClient } = require('/var/www/thefreelance.in/backend/node_modules/@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.post.count({ where: { image: { contains: 'tfl-crime-police-investigation.jpg' } } });
  console.log('Count of posts with tfl-crime-police-investigation.jpg:', count);

  const posts = await prisma.post.findMany({
    where: { image: { contains: 'tfl-crime-police-investigation.jpg' } },
    select: { id: true, headline: true, categoryStr: true },
    take: 10
  });
  console.log(posts);
}
main().finally(() => prisma.$disconnect());
