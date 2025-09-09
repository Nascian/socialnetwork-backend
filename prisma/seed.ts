import crypto from 'crypto';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function hashPassword(pw: string) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

async function main() {
  const users = [
    {
      email: 'demo1@example.com',
      username: 'demo1',
      passwordHash: hashPassword('password'),
      firstName: 'Demo',
      lastName: 'One',
      birthDate: new Date('1990-01-01'),
      alias: 'demo.one',
      post: { message: 'Hola, soy Demo One!' },
    },
    {
      email: 'demo2@example.com',
      username: 'demo2',
      passwordHash: hashPassword('password'),
      firstName: 'Demo',
      lastName: 'Two',
      birthDate: new Date('1992-02-02'),
      alias: 'demo.two',
      post: { message: 'Primer post de Demo Two' },
    },
  ];

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) continue;
    const created = await prisma.user.create({
      data: {
        email: u.email,
        username: u.username,
        passwordHash: u.passwordHash,
        firstName: u.firstName,
        lastName: u.lastName,
        birthDate: u.birthDate,
        alias: u.alias,
        posts: { create: { message: u.post.message } },
      },
    });
    // Update likeCount to 0 explicitly (not necessary but illustrative)
    await prisma.post.updateMany({ where: { userId: created.id }, data: { likeCount: 0 } });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
