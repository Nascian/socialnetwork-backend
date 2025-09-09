import { Router } from 'express';

import { prisma } from '../lib/prisma';
import { authenticateJWT, type AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/me', authenticateJWT, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, firstName: true, lastName: true, birthDate: true, alias: true, email: true, username: true },
  });
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
});

// Stats for current user: total posts, likes given, likes received
router.get('/me/stats', authenticateJWT, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  try {
    const [posts, likesGiven, likesReceived] = await Promise.all([
      prisma.post.count({ where: { userId } }),
      prisma.like.count({ where: { userId } }),
      prisma.like.count({ where: { post: { userId } } }),
    ]);
    return res.json({ posts, likesGiven, likesReceived });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error getting profile stats', err);
    return res.status(500).json({ message: 'Failed to load stats' });
  }
});

export default router;
