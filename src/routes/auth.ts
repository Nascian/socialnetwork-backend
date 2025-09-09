import crypto from 'crypto';

import { Router } from 'express';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';

import { prisma } from '../lib/prisma';

const router = Router();

function hashPassword(pw: string) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

function signToken(payload: object) {
  const secret: Secret = (process.env.JWT_SECRET || 'dev_secret') as Secret;
  const envVal = process.env.JWT_EXPIRES_IN;
  const expiresIn = envVal && !Number.isNaN(Number(envVal)) ? Number(envVal) : 3600; // seconds
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
}

router.post('/login', async (req, res) => {
  const { username, email, password } = req.body || {};
  if ((!username && !email) || !password) {
    return res.status(400).json({ message: 'username/email and password are required' });
  }

  type Where = { username?: string } | { email?: string };
  const or: Where[] = [];
  if (username) or.push({ username });
  if (email) or.push({ email });

  const user = await prisma.user.findFirst({ where: { OR: or } });

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = user.passwordHash === hashPassword(password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken({ sub: user.id });
  return res.json({ token });
});

export default router;
