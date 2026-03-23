const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function seed() {
  const prisma = new PrismaClient();
  
  const users = [
    { username: 'ek', email: 'ek@accesspc.local', password: 'ek101011' },
  ];

  try {
    for (const userData of users) {
      const password = await bcrypt.hash(userData.password, 12);
      await prisma.user.upsert({
        where: { username: userData.username },
        update: { password },
        create: {
          username: userData.username,
          email: userData.email,
          password,
        },
      });
      console.log(`User '${userData.username}' created/updated`);
    }
    console.log('Seed complete!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
