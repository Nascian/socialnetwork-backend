import { Router } from 'express';

import { prisma } from '../lib/prisma';
import { authenticateJWT, type AuthRequest } from '../middleware/auth';

const router = Router();

// GET /posts?page=1&pageSize=10 -> paginated, newest first
router.get('/posts', authenticateJWT, async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const pageRaw = String(req.query.page ?? '1');
  const sizeRaw = String(req.query.pageSize ?? '10');
  const page = Math.max(1, Number.isNaN(Number(pageRaw)) ? 1 : Number(pageRaw));
  const pageSizeRaw = Number.isNaN(Number(sizeRaw)) ? 10 : Number(sizeRaw);
  const pageSize = Math.min(50, Math.max(1, pageSizeRaw));

  try {
    const [total, items] = await Promise.all([
      prisma.post.count(),
      prisma.post.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, alias: true } },
          _count: { select: { likes: true } },
          likes: { where: { userId }, select: { id: true }, take: 1 },
        },
      }),
    ]);

    const itemsDto = items.map((p) => ({
      id: p.id,
      message: p.message,
      userId: p.userId,
      createdAt: p.createdAt,
      user: { id: p.user.id, firstName: p.user.firstName, lastName: p.user.lastName, alias: p.user.alias },
      likeCount: p._count.likes,
      likedByMe: p.likes.length > 0,
    }));

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    res.json({ items: itemsDto, total, page, pageSize, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error listing posts', err);
    res.status(500).json({ message: 'Failed to list posts' });
  }
});

export default router;
