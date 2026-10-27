const { PrismaClient } = require('/var/www/thefreelance.in/backend/node_modules/@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const p = await prisma.post.findFirst({
    where: { categoryStr: 'sports', isPublished: true },
    select: { slug: true, categoryStr: true, headline: true }
  });
  console.log(p);
}
main().finally(() => prisma.$disconnect());
