import prisma from '../src/models/prisma.js';

async function main() {
  console.log('ℹ️  Seed skipped — all data (foods, articles) is managed directly in the database.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
