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

export default router;
