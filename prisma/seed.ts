import crypto from 'crypto';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function hashPassword(pw: string) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

async function main() {
  // Predefined users with one initial post each
  const users = [
    {
      email: 'demo1@example.com',
      username: 'demo1',
      passwordHash: hashPassword('password'),
      firstName: 'Demo',
      lastName: 'One',
      birthDate: new Date('1990-01-01'),
      alias: 'demo.one',
      posts: [{ message: 'Hola, soy Demo One!' }],
    },
    {
      email: 'demo2@example.com',
      username: 'demo2',
      passwordHash: hashPassword('password'),
      firstName: 'Demo',
      lastName: 'Two',
      birthDate: new Date('1992-02-02'),
      alias: 'demo.two',
      posts: [{ message: 'Primer post de Demo Two' }],
    },
  ];

  // Create users if missing and ensure their initial posts exist
  for (const u of users) {
    let user = await prisma.user.findUnique({ where: { email: u.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: u.email,
          username: u.username,
          passwordHash: u.passwordHash,
          firstName: u.firstName,
          lastName: u.lastName,
          birthDate: u.birthDate,
          alias: u.alias,
        },
      });
    }

    for (const p of u.posts) {
      const exists = await prisma.post.findFirst({ where: { userId: user.id, message: p.message } });
      if (!exists) {
        await prisma.post.create({ data: { userId: user.id, message: p.message, likeCount: 0 } });
      }
    }
  }

  // Seed some likes between users (idempotent)
  const byUsername = async (username: string) =>
    prisma.user.findUnique({ where: { username } }).then((u) => (u ? u.id : null));

  const likesPlan: Array<{ by: string; postOf: string; message: string }> = [
    { by: 'demo1', postOf: 'demo2', message: 'Primer post de Demo Two' },
    { by: 'demo2', postOf: 'demo1', message: 'Hola, soy Demo One!' },
  ];

  for (const like of likesPlan) {
    const [byId, postOwnerId] = await Promise.all([byUsername(like.by), byUsername(like.postOf)]);
    if (!byId || !postOwnerId) continue;
    const post = await prisma.post.findFirst({ where: { userId: postOwnerId, message: like.message } });
    if (!post) continue;
    const already = await prisma.like.findUnique({ where: { userId_postId: { userId: byId, postId: post.id } } });
    if (!already) {
      await prisma.$transaction([
        prisma.like.create({ data: { userId: byId, postId: post.id } }),
        prisma.post.update({ where: { id: post.id }, data: { likeCount: { increment: 1 } } }),
      ]);
    }
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
